use std::{
    cell::Cell,
    future::poll_fn,
    io,
    pin::Pin,
    rc::Rc,
    task::{Context, Poll},
};
use tokio::io::{AsyncRead, AsyncReadExt, ReadBuf};

struct FramedInput {
    bytes: &'static [u8],
    prefix_consumed: Rc<Cell<bool>>,
    remainder_available: Rc<Cell<bool>>,
}

impl FramedInput {
    fn new() -> Self {
        Self {
            bytes: b"ABCD",
            prefix_consumed: Rc::new(Cell::new(false)),
            remainder_available: Rc::new(Cell::new(false)),
        }
    }
}

impl AsyncRead for FramedInput {
    fn poll_read(
        mut self: Pin<&mut Self>,
        _: &mut Context<'_>,
        buffer: &mut ReadBuf<'_>,
    ) -> Poll<io::Result<()>> {
        if self.prefix_consumed.get() && !self.remainder_available.get() {
            // The competing branch opens the gate before polling this reader again.
            return Poll::Pending;
        }
        let count = if self.prefix_consumed.get() {
            self.bytes.len().min(buffer.remaining())
        } else {
            1.min(buffer.remaining())
        };
        buffer.put_slice(&self.bytes[..count]);
        self.bytes = &self.bytes[count..];
        self.prefix_consumed.set(true);
        Poll::Ready(Ok(()))
    }
}

async fn interrupt_after_prefix(prefix_consumed: Rc<Cell<bool>>) {
    poll_fn(|_| {
        assert!(
            prefix_consumed.get(),
            "biased select must poll the read first"
        );
        Poll::Ready(())
    })
    .await;
}

async fn restarted_frame() -> [u8; 2] {
    let mut input = FramedInput::new();
    let interrupted = input.prefix_consumed.clone();
    let mut frame = [0; 2];
    tokio::select! {
        biased;
        result = input.read_exact(&mut frame) => panic!("unexpected completed read: {result:?}"),
        () = interrupt_after_prefix(interrupted) => {},
    }
    assert_eq!(
        frame,
        [b'A', 0],
        "one byte was consumed before cancellation"
    );
    input.remainder_available.set(true);
    input.read_exact(&mut frame).await.unwrap();
    frame
}

#[tokio::test]
async fn restarting_read_exact_corrupts_frame_boundary() {
    assert_eq!(restarted_frame().await, *b"BC");
}

#[tokio::test]
#[ignore = "intentional failing regression; execute explicitly to observe framing loss"]
async fn broken_restart_preserves_frame() {
    assert_eq!(restarted_frame().await, *b"AB");
}

#[tokio::test]
async fn retaining_the_same_future_preserves_both_frames() {
    let mut input = FramedInput::new();
    let interrupted = input.prefix_consumed.clone();
    let remainder_available = input.remainder_available.clone();
    let mut frame = [0; 2];
    {
        let read = input.read_exact(&mut frame);
        tokio::pin!(read);
        tokio::select! {
            biased;
            result = &mut read => panic!("unexpected completed read: {result:?}"),
            () = interrupt_after_prefix(interrupted) => {},
        }
        remainder_available.set(true);
        read.await.unwrap();
    }
    assert_eq!(frame, *b"AB");
    input.read_exact(&mut frame).await.unwrap();
    assert_eq!(frame, *b"CD");
}

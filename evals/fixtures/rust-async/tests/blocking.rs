use std::{
    sync::{
        Arc,
        atomic::{AtomicBool, Ordering},
        mpsc,
    },
    time::Duration,
};
use tokio::{sync::oneshot, time::timeout};

#[tokio::test]
async fn started_blocking_work_survives_waiter_timeout_and_abort() {
    let (started_sender, started_receiver) = oneshot::channel();
    let (release_sender, release_receiver) = mpsc::channel();
    let finished = Arc::new(AtomicBool::new(false));
    let worker_finished = finished.clone();
    let mut worker = tokio::task::spawn_blocking(move || {
        started_sender.send(()).unwrap();
        // Bounded cleanup even if the test fails before releasing the worker.
        let released = release_receiver.recv_timeout(Duration::from_secs(5));
        worker_finished.store(true, Ordering::SeqCst);
        released
    });

    timeout(Duration::from_secs(2), started_receiver)
        .await
        .expect("blocking task did not start")
        .unwrap();
    assert!(
        timeout(Duration::from_millis(10), &mut worker)
            .await
            .is_err()
    );
    assert!(!finished.load(Ordering::SeqCst));
    worker.abort();
    assert!(!finished.load(Ordering::SeqCst));

    release_sender.send(()).unwrap();
    timeout(Duration::from_secs(2), &mut worker)
        .await
        .expect("released blocking task did not finish")
        .expect("a started blocking task remains joinable after abort")
        .expect("worker was explicitly released");
    assert!(finished.load(Ordering::SeqCst));
}

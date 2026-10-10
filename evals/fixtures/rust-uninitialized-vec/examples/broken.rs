#[cfg(miri)]
fn main() {
    let mut bytes = Vec::<u8>::with_capacity(4);
    // Deliberately unsound: allocation capacity does not initialize these elements.
    unsafe { bytes.set_len(4) };
    let total: u8 = bytes.iter().copied().sum();
    assert_eq!(total, 100);
}

#[cfg(not(miri))]
fn main() {
    panic!(
        "Deliberately invalid example: execute only with cargo +nightly miri run --example broken"
    );
}

fn main() {
    let mut bytes = Vec::<u8>::with_capacity(4);
    for (slot, value) in bytes.spare_capacity_mut().iter_mut().zip([10, 20, 30, 40]) {
        slot.write(value);
    }
    // SAFETY: all four slots were initialized above, within the capacity of this exclusively owned Vec.
    // u8 has no destructor; the initialized prefix remains owned by bytes when its length becomes four.
    unsafe { bytes.set_len(4) };
    assert_eq!(bytes, [10, 20, 30, 40]);
    assert_eq!(bytes.iter().copied().sum::<u8>(), 100);
    println!("initialized_prefix=4 sum=100");
}

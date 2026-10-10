#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Inventory {
    pub revision: u64,
    pub available: u32,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ReserveError {
    ZeroUnits,
    InsufficientStock,
    RevisionOverflow,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Effect {
    NotifyReserved { units: u32 },
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[must_use]
pub struct Reservation {
    pub expected_revision: u64,
    pub next: Inventory,
    pub effect: Effect,
}

pub fn reserve(current: &Inventory, units: u32) -> Result<Reservation, ReserveError> {
    if units == 0 {
        return Err(ReserveError::ZeroUnits);
    }
    let available = current
        .available
        .checked_sub(units)
        .ok_or(ReserveError::InsufficientStock)?;
    let revision = current
        .revision
        .checked_add(1)
        .ok_or(ReserveError::RevisionOverflow)?;
    Ok(Reservation {
        expected_revision: current.revision,
        next: Inventory {
            revision,
            available,
        },
        effect: Effect::NotifyReserved { units },
    })
}

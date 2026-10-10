use proofwork_rust_contract::{reserve, Effect, Inventory, Reservation, ReserveError};

#[test]
fn ordinary_reservation_proposes_next_value_and_effect() {
    let current = Inventory {
        revision: 7,
        available: 10,
    };
    assert_eq!(
        reserve(&current, 3),
        Ok(Reservation {
            expected_revision: 7,
            next: Inventory {
                revision: 8,
                available: 7
            },
            effect: Effect::NotifyReserved { units: 3 },
        })
    );
}

#[test]
fn exact_stock_can_be_reserved() {
    let current = Inventory {
        revision: 0,
        available: 3,
    };
    assert_eq!(
        reserve(&current, 3)
            .expect("valid reservation")
            .next
            .available,
        0
    );
}

#[test]
fn zero_units_are_rejected() {
    assert_eq!(
        reserve(
            &Inventory {
                revision: 0,
                available: 10
            },
            0
        ),
        Err(ReserveError::ZeroUnits)
    );
}

#[test]
fn insufficient_stock_is_rejected() {
    assert_eq!(
        reserve(
            &Inventory {
                revision: 0,
                available: 2
            },
            3
        ),
        Err(ReserveError::InsufficientStock)
    );
}

#[test]
fn revision_overflow_is_rejected() {
    assert_eq!(
        reserve(
            &Inventory {
                revision: u64::MAX,
                available: 2
            },
            1
        ),
        Err(ReserveError::RevisionOverflow)
    );
}

#[test]
fn documented_error_precedence_is_preserved() {
    let current = Inventory {
        revision: u64::MAX,
        available: 0,
    };
    assert_eq!(reserve(&current, 0), Err(ReserveError::ZeroUnits));
    assert_eq!(reserve(&current, 1), Err(ReserveError::InsufficientStock));
}

#[test]
fn input_is_preserved_and_replay_is_deterministic() {
    let current = Inventory {
        revision: 5,
        available: 8,
    };
    let before = current;
    let first = reserve(&current, 2);
    assert_eq!(first, reserve(&current, 2));
    assert_eq!(current, before);
    assert_eq!(
        first.expect("valid reservation").next,
        Inventory {
            revision: 6,
            available: 6
        }
    );
}

fn commit_owned(
    current: &mut Inventory,
    proposal: Reservation,
    effects: &mut Vec<Effect>,
) -> Result<(), ()> {
    if current.revision != proposal.expected_revision {
        return Err(());
    }
    *current = proposal.next;
    effects.push(proposal.effect);
    Ok(())
}

#[test]
fn rejected_local_version_does_not_issue_effects() {
    let mut current = Inventory {
        revision: 0,
        available: 5,
    };
    let first = reserve(&current, 3).expect("valid proposal");
    let competing = reserve(&current, 3).expect("valid competing proposal");
    let mut effects = Vec::new();
    assert_eq!(commit_owned(&mut current, first, &mut effects), Ok(()));
    assert_eq!(commit_owned(&mut current, competing, &mut effects), Err(()));
    assert_eq!(
        current,
        Inventory {
            revision: 1,
            available: 2
        }
    );
    assert_eq!(effects, vec![Effect::NotifyReserved { units: 3 }]);
}

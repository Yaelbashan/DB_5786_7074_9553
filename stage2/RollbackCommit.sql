-- ROLLBACK AND COMMIT DEMONSTRATION

-- 1. ROLLBACK EXAMPLE - Updates a guest loyalty status and then cancels the change.

BEGIN; -- BEGIN starts a transaction.

SELECT
    guest_id,
    membership_number,
    status,
    points_balance,
    tier_id
FROM Guest_Loyalty
WHERE guest_id = 1;
UPDATE Guest_Loyalty
SET status = 'Suspended'
WHERE guest_id = 1;

SELECT
    guest_id,
    membership_number,
    status,
    points_balance,
    tier_id
FROM Guest_Loyalty
WHERE guest_id = 1;

ROLLBACK; -- ROLLBACK cancels all changes made since BEGIN.

SELECT
    guest_id,
    membership_number,
    status,
    points_balance,
    tier_id
FROM Guest_Loyalty
WHERE guest_id = 1;



-- 2. COMMIT EXAMPLE - Updates a guest loyalty status and saves the change.

BEGIN;

SELECT
    guest_id,
    membership_number,
    status,
    points_balance,
    tier_id
FROM Guest_Loyalty
WHERE guest_id = 2;
UPDATE Guest_Loyalty
SET status = 'Inactive'
WHERE guest_id = 2;

SELECT
    guest_id,
    membership_number,
    status,
    points_balance,
    tier_id
FROM Guest_Loyalty
WHERE guest_id = 2;

COMMIT; -- COMMIT saves all changes made since BEGIN permanently.

SELECT
    guest_id,
    membership_number,
    status,
    points_balance,
    tier_id
FROM Guest_Loyalty
WHERE guest_id = 2;
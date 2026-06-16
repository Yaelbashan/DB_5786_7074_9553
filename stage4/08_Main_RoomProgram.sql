-- Stage D - Main Room/Payment Program
-- Calls one function and one procedure.

-- 1. Use the refcursor function to display guests from a loyalty tier.
BEGIN;

SELECT guests.fn_get_guests_by_tier_cursor('Gold', 'gold_guest_cursor');

FETCH ALL FROM gold_guest_cursor;

COMMIT;

-- 2. Show payment status distribution before the procedure.
SELECT
    payment_status,
    COUNT(*) AS payments_count
FROM guests.payment
GROUP BY payment_status
ORDER BY payment_status;

-- 3. Run the procedure that updates payment statuses by expected stay price.
CALL guests.pr_update_payment_statuses_by_price();

-- 4. Show payment status distribution after the procedure.
SELECT
    payment_status,
    COUNT(*) AS payments_count
FROM guests.payment
GROUP BY payment_status
ORDER BY payment_status;

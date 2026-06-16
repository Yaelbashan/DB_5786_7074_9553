-- Stage D - Main Guest Program
-- Calls one function and one procedure.

-- 1. Display a stay and calculate its expected total price.
SELECT
    sr.stay_id,
    sr.check_in_date,
    sr.check_out_date,
    sr.rateid,
    guests.fn_calculate_stay_total(sr.stay_id) AS calculated_total_price
FROM guests.stay_record sr
WHERE sr.rateid IS NOT NULL
ORDER BY sr.stay_id
LIMIT 1;

-- 2. Show loyalty tiers before the procedure.
SELECT
    gl.guest_id,
    gl.points_balance,
    gl.tier_id,
    lt.tier_name
FROM guests.guest_loyalty gl
JOIN guests.loyalty_tier lt
    ON gl.tier_id = lt.tier_id
ORDER BY gl.guest_id
LIMIT 10;

-- 3. Run the procedure that updates loyalty tiers according to points.
CALL guests.pr_update_loyalty_tiers();

-- 4. Show loyalty tiers after the procedure.
SELECT
    gl.guest_id,
    gl.points_balance,
    gl.tier_id,
    lt.tier_name
FROM guests.guest_loyalty gl
JOIN guests.loyalty_tier lt
    ON gl.tier_id = lt.tier_id
ORDER BY gl.guest_id
LIMIT 10;

--SELECT QUERIES :

-- 1. Finds guests with many cancelled stays,
--    including their guest type and loyalty details.
SELECT
    g.guest_id,
    CASE -- CASE works like an IF condition
        WHEN pg.guest_id IS NOT NULL THEN pg.first_name || ' ' || pg.last_name
        ELSE cg.company_name
    END AS guest_name,
    CASE
        WHEN pg.guest_id IS NOT NULL THEN 'Private'
        ELSE 'Corporate'
    END AS guest_type,
    COUNT(sr.stay_id) AS cancelled_stays,
    gl.status AS loyalty_status,
    lt.tier_name AS loyalty_tier
FROM Guest g 
JOIN Stay_Record sr ON g.guest_id = sr.guest_id 
JOIN Guest_Loyalty gl ON g.guest_id = gl.guest_id
JOIN Loyalty_Tier lt ON gl.tier_id = lt.tier_id
LEFT JOIN Private_Guest pg ON g.guest_id = pg.guest_id 
LEFT JOIN Corporate_Guest cg ON g.guest_id = cg.guest_id 
WHERE sr.stay_status = 'Cancelled'
GROUP BY
    g.guest_id,
    pg.guest_id,
    pg.first_name,
    pg.last_name,
    cg.company_name,
    gl.status,
    lt.tier_name
HAVING COUNT(sr.stay_id) >= 2
ORDER BY cancelled_stays DESC;




-- 2. Finds guests who completed a stay but did not leave feedback.
SELECT
    g.guest_id,
    CASE
        WHEN pg.guest_id IS NOT NULL THEN pg.first_name || ' ' || pg.last_name
        ELSE cg.company_name
    END AS guest_name,
    sr.stay_id,
    sr.check_out_date,
    lt.tier_name
FROM Guest g
JOIN Stay_Record sr ON g.guest_id = sr.guest_id
JOIN Guest_Loyalty gl ON g.guest_id = gl.guest_id
JOIN Loyalty_Tier lt ON gl.tier_id = lt.tier_id
LEFT JOIN Private_Guest pg ON g.guest_id = pg.guest_id
LEFT JOIN Corporate_Guest cg ON g.guest_id = cg.guest_id
WHERE sr.stay_status = 'CheckedOut'
  AND NOT EXISTS (
      SELECT *
      FROM Guest_Feedback gf
      WHERE gf.stay_id = sr.stay_id
  )
ORDER BY sr.check_out_date DESC;




-- 3. Shows the average number of stays per month for each year.
SELECT
    monthly_data.stay_year,
    AVG(monthly_data.stays_count) AS average_stays_per_month
FROM (
    SELECT
        EXTRACT(YEAR FROM sr.check_in_date) AS stay_year, -- EXTRACT gets a specific part.
        EXTRACT(MONTH FROM sr.check_in_date) AS stay_month,
        COUNT(sr.stay_id) AS stays_count
    FROM Stay_Record sr
    GROUP BY
        EXTRACT(YEAR FROM sr.check_in_date),
        EXTRACT(MONTH FROM sr.check_in_date)
) AS monthly_data
GROUP BY monthly_data.stay_year
ORDER BY monthly_data.stay_year;




-- 4. Shows the busiest calendar dates by average number of active stays across all years.
SELECT
    daily_data.month,
    daily_data.day,
    AVG(daily_data.active_stays_count) AS average_active_stays
FROM (
    SELECT
        EXTRACT(YEAR FROM active_day) AS year,
        EXTRACT(MONTH FROM active_day) AS month,
        EXTRACT(DAY FROM active_day) AS day,
        COUNT(*) AS active_stays_count
    FROM (
        SELECT
            generate_series( -- generate_series creates a list of values in a given range.
                check_in_date, --start date
                check_out_date - INTERVAL '1 day', -- end date,   INTERVAL represents a time duration.
                INTERVAL '1 day' -- Moves through the range in steps of one day
            )::date AS active_day -- Converts the generated value to DATE format
        FROM Stay_Record
        WHERE stay_status <> 'Cancelled'
    ) AS stay_days
    GROUP BY
        EXTRACT(YEAR FROM active_day),
        EXTRACT(MONTH FROM active_day),
        EXTRACT(DAY FROM active_day)
) AS daily_data
GROUP BY
    daily_data.month,
    daily_data.day
ORDER BY average_active_stays DESC;




-- SELECT queries implemented in two different ways

-- 5A. Shows the total amount paid by each guest in each month during 2026.
SELECT
    EXTRACT(MONTH FROM p.payment_date) AS payment_month,
    CASE
        WHEN pg.guest_id IS NOT NULL THEN pg.first_name || ' ' || pg.last_name
        ELSE cg.company_name
    END AS guest_display_name,
    CASE
        WHEN pg.guest_id IS NOT NULL THEN 'Private'
        ELSE 'Corporate'
    END AS guest_type,
    SUM(p.amount) AS total_paid
FROM Payment p
JOIN Stay_Record sr ON p.stay_id = sr.stay_id
JOIN Guest g ON sr.guest_id = g.guest_id
LEFT JOIN Private_Guest pg ON g.guest_id = pg.guest_id
LEFT JOIN Corporate_Guest cg ON g.guest_id = cg.guest_id
WHERE EXTRACT(YEAR FROM p.payment_date) = 2026
GROUP BY
    payment_month,
    guest_display_name,
    guest_type
ORDER BY payment_month;


-- 5B. Shows the same result as Query 1A, but first filters payments from 2026 in a subquery.
SELECT
    EXTRACT(MONTH FROM mp.payment_date) AS payment_month, 
    CASE -- CASE works like an IF condition.
        WHEN pg.guest_id IS NOT NULL THEN pg.first_name || ' ' || pg.last_name
        ELSE cg.company_name
    END AS guest_display_name,
    CASE
        WHEN pg.guest_id IS NOT NULL THEN 'Private'
        ELSE 'Corporate'
    END AS guest_type,
    SUM(mp.amount) AS total_paid 
FROM (
    SELECT
        payment_id,
        stay_id,
        amount,
        payment_date
    FROM Payment
    WHERE EXTRACT(YEAR FROM payment_date) = 2026
) AS mp
JOIN Stay_Record sr ON mp.stay_id = sr.stay_id
JOIN Guest g ON sr.guest_id = g.guest_id
LEFT JOIN Private_Guest pg ON g.guest_id = pg.guest_id
LEFT JOIN Corporate_Guest cg ON g.guest_id = cg.guest_id
GROUP BY
    payment_month,
    guest_display_name,
    guest_type
ORDER BY payment_month;



-- 6A. Finds guests with more than 3 stays and an average feedback rating lower than 3.
SELECT 
    g.guest_id,
    CASE 
        WHEN pg.guest_id IS NOT NULL THEN pg.first_name || ' ' || pg.last_name
        ELSE cg.company_name
    END AS guest_name,
    COUNT(sr.stay_id) AS stay_count, 
    AVG(f.rating) AS avg_rating 
FROM Guest g
JOIN Stay_Record sr ON g.guest_id = sr.guest_id
JOIN Guest_Feedback f ON sr.stay_id = f.stay_id
LEFT JOIN Private_Guest pg ON g.guest_id = pg.guest_id
LEFT JOIN Corporate_Guest cg ON g.guest_id = cg.guest_id
GROUP BY
    g.guest_id,
    pg.guest_id,
    pg.first_name,
    pg.last_name,
    cg.company_name
HAVING COUNT(sr.stay_id) > 3 
   AND AVG(f.rating) < 3
ORDER BY avg_rating;


-- 6B. Finds the same guests using a subquery that calculates stay count and average rating first.
SELECT
    guest_stats.guest_id,
    guest_stats.guest_name,
    guest_stats.stay_count,
    guest_stats.avg_rating
FROM (
    SELECT 
        g.guest_id,
        CASE
            WHEN pg.guest_id IS NOT NULL THEN pg.first_name || ' ' || pg.last_name
            ELSE cg.company_name
        END AS guest_name,
        COUNT(sr.stay_id) AS stay_count,
        AVG(f.rating) AS avg_rating 
    FROM Guest g
    JOIN Stay_Record sr ON g.guest_id = sr.guest_id
    JOIN Guest_Feedback f ON sr.stay_id = f.stay_id
    LEFT JOIN Private_Guest pg ON g.guest_id = pg.guest_id
    LEFT JOIN Corporate_Guest cg ON g.guest_id = cg.guest_id
    GROUP BY
        g.guest_id,
        pg.guest_id,
        pg.first_name,
        pg.last_name,
        cg.company_name
) AS guest_stats 
WHERE guest_stats.stay_count > 3
  AND guest_stats.avg_rating < 3
ORDER BY guest_stats.avg_rating;



-- 7A. Shows the top 3 guests with the highest loyalty points in each loyalty tier.
SELECT 
    lt.tier_name,
    CASE 
        WHEN pg.guest_id IS NOT NULL THEN pg.first_name || ' ' || pg.last_name
        ELSE cg.company_name
    END AS guest_name,
    gl.points_balance
FROM Loyalty_Tier lt
JOIN Guest_Loyalty gl ON lt.tier_id = gl.tier_id
JOIN Guest g ON gl.guest_id = g.guest_id
LEFT JOIN Private_Guest pg ON g.guest_id = pg.guest_id
LEFT JOIN Corporate_Guest cg ON g.guest_id = cg.guest_id
WHERE (
    SELECT COUNT(*) 
    FROM Guest_Loyalty gl2
    WHERE gl2.tier_id = gl.tier_id
      AND gl2.points_balance > gl.points_balance
) < 3
ORDER BY lt.tier_name, gl.points_balance DESC;


-- 7B. Shows the top 3 guests with the highest loyalty points in each loyalty tier.
SELECT 
    lt.tier_name,
    CASE 
        WHEN pg.guest_id IS NOT NULL THEN pg.first_name || ' ' || pg.last_name
        ELSE cg.company_name
    END AS guest_name,
    gl.points_balance
FROM Loyalty_Tier lt
JOIN Guest_Loyalty gl ON lt.tier_id = gl.tier_id
JOIN Guest g ON gl.guest_id = g.guest_id
LEFT JOIN Private_Guest pg ON g.guest_id = pg.guest_id
LEFT JOIN Corporate_Guest cg ON g.guest_id = cg.guest_id
WHERE (
    SELECT COUNT(*) 
    FROM Guest_Loyalty gl2
    WHERE gl2.tier_id = gl.tier_id
      AND gl2.points_balance > gl.points_balance
) < 3
ORDER BY lt.tier_name, gl.points_balance DESC;



-- 8A. Shows guests who checked out during a specific date range.
SELECT 
    g.guest_id,
    CASE 
        WHEN pg.guest_id IS NOT NULL THEN pg.first_name || ' ' || pg.last_name
        ELSE cg.company_name
    END AS guest_name,
    sr.stay_id,
    EXTRACT(DAY FROM sr.check_out_date) AS checkout_day, 
    EXTRACT(MONTH FROM sr.check_out_date) AS checkout_month,
    EXTRACT(YEAR FROM sr.check_out_date) AS checkout_year
FROM Guest g
JOIN Stay_Record sr ON g.guest_id = sr.guest_id
LEFT JOIN Private_Guest pg ON g.guest_id = pg.guest_id
LEFT JOIN Corporate_Guest cg ON g.guest_id = cg.guest_id
WHERE sr.check_out_date BETWEEN '2024-10-01' AND '2024-12-31' -- BETWEEN checks if a value is inside a given range.
ORDER BY sr.check_out_date;


-- 8B. Shows the same guests using separate date comparison conditions.
SELECT
    g.guest_id,
    CASE
        WHEN pg.guest_id IS NOT NULL THEN pg.first_name || ' ' || pg.last_name
        ELSE cg.company_name
    END AS guest_name,
    sr.stay_id,
    sr.check_out_date
FROM Guest g
JOIN Stay_Record sr ON g.guest_id = sr.guest_id
LEFT JOIN Private_Guest pg ON g.guest_id = pg.guest_id
LEFT JOIN Corporate_Guest cg ON g.guest_id = cg.guest_id
WHERE sr.check_out_date >= '2024-10-01'
  AND sr.check_out_date <= '2024-12-31'
ORDER BY sr.check_out_date;





--UPDATE QUARIES :

-- 1. Updates each guest's loyalty tier according to the points_required values defined in the Loyalty_Tier table.
UPDATE Guest_Loyalty gl
SET tier_id = lt.tier_id
FROM Loyalty_Tier lt
WHERE gl.points_balance >= lt.points_required
  AND lt.points_required = (
      SELECT MAX(lt2.points_required)
      FROM Loyalty_Tier lt2
      WHERE gl.points_balance >= lt2.points_required
  );



-- 2. Updates stays that already ended to CheckedOut.
UPDATE Stay_Record
SET stay_status = 'CheckedOut'
WHERE check_out_date < CURRENT_DATE
  AND stay_status IN ('Booked', 'CheckedIn');



-- 3. Adds loyalty points based on completed payments.
-- Check with Eliezer about the number (100)
UPDATE Guest_Loyalty gl
SET points_balance = points_balance + 100
WHERE guest_id IN (
    SELECT sr.guest_id
    FROM Stay_Record sr
    JOIN Payment p ON sr.stay_id = p.stay_id
    WHERE p.payment_status = 'Completed'
    GROUP BY sr.guest_id
    HAVING SUM(p.amount) >= 1000
); 





-- DELETE QUARIES :

-- Deletes failed payments from stays that ended before 2025.
DELETE FROM Payment p
WHERE p.payment_status = 'Failed'
  AND p.stay_id IN (
      SELECT sr.stay_id
      FROM Stay_Record sr
      WHERE sr.check_out_date < '2025-01-01'
  );



 -- Deletes cancelled future stays that do not have a completed payment.
DELETE FROM Stay_Record sr
WHERE sr.stay_status = 'Cancelled'
  AND sr.check_in_date > CURRENT_DATE
  AND NOT EXISTS (
      SELECT *
      FROM Payment p
      WHERE p.stay_id = sr.stay_id
        AND p.payment_status = 'Completed'
  );



  -- Deletes old low feedback records from guests who later gave better feedback.
DELETE FROM Guest_Feedback gf
WHERE gf.rating <= 2
  AND EXISTS (
      SELECT *
      FROM Stay_Record sr_old,
           Stay_Record sr_new,
           Guest_Feedback gf_new
      WHERE sr_old.stay_id = gf.stay_id
        AND sr_old.guest_id = sr_new.guest_id
        AND sr_new.stay_id = gf_new.stay_id
        AND sr_new.check_out_date > sr_old.check_out_date
        AND gf_new.rating >= 4
  );
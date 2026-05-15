-- INDEXES:
-- Indexes are used to improve query performance.


-- 1. Index on Stay_Record.guest_id
-- improves queries that join guests with their stays.

-- Before creating the index:
EXPLAIN ANALYZE -- EXPLAIN ANALYZE shows the query execution plan and runtime.
SELECT *
FROM Stay_Record
WHERE guest_id = 100;

CREATE INDEX idx_stay_record_guest_id
ON Stay_Record(guest_id);

-- After creating the index:
EXPLAIN ANALYZE
SELECT *
FROM Stay_Record
WHERE guest_id = 100;



-- 2. Index on Payment.stay_id
-- improves queries that join payments with stay records.

-- Before creating the index:
EXPLAIN ANALYZE 
SELECT *
FROM Payment
WHERE stay_id = 500;

CREATE INDEX idx_payment_stay_id
ON Payment(stay_id);

-- After creating the index:
EXPLAIN ANALYZE
SELECT *
FROM Payment
WHERE stay_id = 500;



-- 3. Index on Stay_Record.check_in_date
-- improves date-based queries.

-- Before creating the index:
EXPLAIN ANALYZE
SELECT *
FROM Stay_Record
WHERE check_in_date >= '2026-01-01';

CREATE INDEX idx_stay_record_check_in_date
ON Stay_Record(check_in_date);

-- After creating the index:
EXPLAIN ANALYZE
SELECT *
FROM Stay_Record
WHERE check_in_date >= '2026-01-01';
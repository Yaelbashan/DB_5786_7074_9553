-- Stage D - Function 2
-- Returns a refcursor with guests from a given loyalty tier and their stay/payment summary.

CREATE OR REPLACE FUNCTION guests.fn_get_guests_by_tier_cursor(
    p_tier_name TEXT,
    p_cursor_name TEXT DEFAULT 'guest_tier_cursor'
)
RETURNS REFCURSOR
LANGUAGE plpgsql
AS $$
DECLARE
    v_cursor REFCURSOR := p_cursor_name;
    v_tier_exists BOOLEAN;
BEGIN
    -- Check if the loyalty tier exists
    SELECT EXISTS (
        SELECT 1
        FROM guests.loyalty_tier lt
        WHERE lt.tier_name = p_tier_name
    )
    INTO v_tier_exists;

    IF NOT v_tier_exists THEN
        RAISE EXCEPTION 'Loyalty tier "%" does not exist', p_tier_name;
    END IF;

    OPEN v_cursor FOR
        SELECT
            g.guest_id,

            COALESCE(
                pg.first_name || ' ' || pg.last_name,
                cg.company_name
            ) AS guest_name,

            CASE
                WHEN pg.guest_id IS NOT NULL THEN 'Private Guest'
                WHEN cg.guest_id IS NOT NULL THEN 'Corporate Guest'
                ELSE 'Unknown'
            END AS guest_type,

            lt.tier_name,
            gl.points_balance,
            COUNT(DISTINCT sr.stay_id) AS total_stays,
            COALESCE(SUM(p.amount), 0) AS total_payments

        FROM guests.guest g

        JOIN guests.guest_loyalty gl
            ON g.guest_id = gl.guest_id

        JOIN guests.loyalty_tier lt
            ON gl.tier_id = lt.tier_id

        LEFT JOIN guests.private_guest pg
            ON g.guest_id = pg.guest_id

        LEFT JOIN guests.corporate_guest cg
            ON g.guest_id = cg.guest_id

        LEFT JOIN guests.stay_record sr
            ON g.guest_id = sr.guest_id

        LEFT JOIN guests.payment p
            ON sr.stay_id = p.stay_id

        WHERE lt.tier_name = p_tier_name

        GROUP BY
            g.guest_id,
            pg.guest_id,
            pg.first_name,
            pg.last_name,
            cg.guest_id,
            cg.company_name,
            lt.tier_name,
            gl.points_balance

        ORDER BY gl.points_balance DESC;

    RETURN v_cursor;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error in fn_get_guests_by_tier_cursor: %', SQLERRM;
END;
$$;
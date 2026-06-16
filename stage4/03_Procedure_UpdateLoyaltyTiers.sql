-- Stage D - Procedure 1
-- Updates each guest loyalty tier according to the guest's current points balance.

CREATE OR REPLACE PROCEDURE guests.pr_update_loyalty_tiers()
LANGUAGE plpgsql
AS $$
DECLARE 
    loyalty_cursor CURSOR FOR
        SELECT guest_id, points_balance, tier_id
        FROM guests.guest_loyalty
        ORDER BY guest_id;

    v_loyalty RECORD;
    v_new_tier_id INTEGER;
    v_updated_count INTEGER := 0;
BEGIN
    OPEN loyalty_cursor;

    LOOP
        FETCH loyalty_cursor INTO v_loyalty;
        EXIT WHEN NOT FOUND;

        SELECT lt.tier_id
        INTO v_new_tier_id
        FROM guests.loyalty_tier lt
        WHERE v_loyalty.points_balance >= lt.points_required
        ORDER BY lt.points_required DESC
        LIMIT 1;

        IF v_new_tier_id IS NULL THEN
            RAISE NOTICE 'No matching tier found for guest_id % with % points.',
                v_loyalty.guest_id,
                v_loyalty.points_balance;
        ELSIF v_new_tier_id <> v_loyalty.tier_id THEN
            UPDATE guests.guest_loyalty
            SET tier_id = v_new_tier_id
            WHERE guest_id = v_loyalty.guest_id;

            v_updated_count := v_updated_count + 1;
        END IF;
    END LOOP;

    CLOSE loyalty_cursor;

    RAISE NOTICE 'Loyalty tier update completed. Updated rows: %', v_updated_count;

EXCEPTION
    WHEN OTHERS THEN
        IF loyalty_cursor%ISOPEN THEN
            CLOSE loyalty_cursor;
        END IF;
        RAISE EXCEPTION 'Error in pr_update_loyalty_tiers: %', SQLERRM;
END;
$$;

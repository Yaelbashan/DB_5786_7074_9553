-- Stage D - Trigger 1
-- Adds loyalty points to the related guest when a payment status changes to Completed.

CREATE OR REPLACE FUNCTION guests.trg_fn_payment_completed_add_points()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_guest_id INTEGER;
    v_tier_id INTEGER;
    v_tier_discount NUMERIC(5,2);
    v_points_to_add INTEGER;
    v_new_points INTEGER;
    v_new_tier_id INTEGER;
BEGIN
    IF OLD.payment_status IS DISTINCT FROM NEW.payment_status
       AND NEW.payment_status = 'Completed'
       AND OLD.payment_status <> 'Completed' THEN

        SELECT sr.guest_id
        INTO v_guest_id
        FROM guests.stay_record sr
        WHERE sr.stay_id = NEW.stay_id;

        IF v_guest_id IS NULL THEN
            RAISE NOTICE 'No guest was found for stay_id %.', NEW.stay_id;
            RETURN NEW;
        END IF;

        SELECT gl.tier_id, COALESCE(lt.discount_percentage, 0)
        INTO v_tier_id, v_tier_discount
        FROM guests.guest_loyalty gl
        JOIN guests.loyalty_tier lt
            ON gl.tier_id = lt.tier_id
        WHERE gl.guest_id = v_guest_id;

        IF NOT FOUND THEN
            RAISE NOTICE 'Guest % does not have a loyalty record.', v_guest_id;
            RETURN NEW;
        END IF;

        -- Basic logic:
        -- 1 point for every 10 currency units,
        -- plus a bonus according to the loyalty tier discount percentage.
        v_points_to_add := FLOOR((NEW.amount / 10) * (1 + v_tier_discount / 100));

        IF v_points_to_add < 1 THEN
            v_points_to_add := 1;
        END IF;

        UPDATE guests.guest_loyalty
        SET points_balance = points_balance + v_points_to_add
        WHERE guest_id = v_guest_id
        RETURNING points_balance INTO v_new_points;

        -- After adding points, update the tier if the guest reached a higher tier.
        SELECT lt.tier_id
        INTO v_new_tier_id
        FROM guests.loyalty_tier lt
        WHERE v_new_points >= lt.points_required
        ORDER BY lt.points_required DESC
        LIMIT 1;

        IF v_new_tier_id IS NOT NULL THEN
            UPDATE guests.guest_loyalty
            SET tier_id = v_new_tier_id
            WHERE guest_id = v_guest_id;
        END IF;

        RAISE NOTICE 'Added % loyalty points to guest_id %.', v_points_to_add, v_guest_id;
    END IF;

    RETURN NEW;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error in trg_fn_payment_completed_add_points: %', SQLERRM;
END;
$$;

DROP TRIGGER IF EXISTS trg_payment_completed_add_points ON guests.payment;

CREATE TRIGGER trg_payment_completed_add_points
AFTER UPDATE OF payment_status ON guests.payment
FOR EACH ROW
EXECUTE FUNCTION guests.trg_fn_payment_completed_add_points();

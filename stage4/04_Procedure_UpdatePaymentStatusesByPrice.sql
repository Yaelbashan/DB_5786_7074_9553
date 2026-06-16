-- Stage D - Procedure 2
-- Updates payment status according to the expected stay price calculated from PriceRate.

CREATE OR REPLACE PROCEDURE guests.pr_update_payment_statuses_by_price()
LANGUAGE plpgsql
AS $$
DECLARE
    payment_cursor CURSOR FOR
        SELECT
            p.payment_id,
            p.amount,
            p.payment_status,
            sr.stay_id,
            sr.check_in_date,
            sr.check_out_date,
            pr.finalprice
        FROM guests.payment p
        JOIN guests.stay_record sr
            ON p.stay_id = sr.stay_id
        JOIN rooms.pricerate pr
            ON sr.rateid = pr.rateid
        ORDER BY p.payment_id;

    v_payment RECORD;
    v_nights INTEGER;
    v_expected_amount NUMERIC(12,2);
    v_new_status TEXT;
    v_updated_count INTEGER := 0;
BEGIN
    OPEN payment_cursor;

    LOOP
        FETCH payment_cursor INTO v_payment;
        EXIT WHEN NOT FOUND;

        IF v_payment.check_out_date <= v_payment.check_in_date THEN
            RAISE NOTICE 'Skipping payment_id %, invalid dates for stay_id %.',
                v_payment.payment_id,
                v_payment.stay_id;
            CONTINUE;
        END IF;

        v_nights := v_payment.check_out_date - v_payment.check_in_date;
        v_expected_amount := ROUND(v_nights * v_payment.finalprice, 2);

        IF v_payment.amount <= 0 THEN
            v_new_status := 'Failed';
        ELSIF v_payment.amount >= v_expected_amount THEN
            v_new_status := 'Completed';
        ELSE
            v_new_status := 'Pending';
        END IF;

        IF v_new_status IS DISTINCT FROM v_payment.payment_status THEN
            UPDATE guests.payment
            SET payment_status = v_new_status
            WHERE payment_id = v_payment.payment_id;

            v_updated_count := v_updated_count + 1;
        END IF;
    END LOOP;

    CLOSE payment_cursor;

    RAISE NOTICE 'Payment status update completed. Updated rows: %', v_updated_count;

EXCEPTION
    WHEN OTHERS THEN
        IF payment_cursor%ISOPEN THEN
            CLOSE payment_cursor;
        END IF;
        RAISE EXCEPTION 'Error in pr_update_payment_statuses_by_price: %', SQLERRM;
END;
$$;

-- Stage D - Function 1
-- Calculates the expected total price of a stay according to the integrated PriceRate table.

CREATE OR REPLACE FUNCTION guests.fn_calculate_stay_total(p_stay_id INTEGER)
RETURNS NUMERIC(12,2)
LANGUAGE plpgsql
AS $$
DECLARE
    v_stay RECORD;
    v_nights INTEGER;
    v_total NUMERIC(12,2);
BEGIN
    SELECT
        sr.stay_id,
        sr.check_in_date,
        sr.check_out_date,
        sr.rateid,
        pr.finalprice
    INTO v_stay
    FROM guests.stay_record sr
    JOIN rooms.pricerate pr
        ON sr.rateid = pr.rateid
    WHERE sr.stay_id = p_stay_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Stay record with id % was not found, or it has no valid price rate.', p_stay_id;
    END IF;

    IF v_stay.check_out_date <= v_stay.check_in_date THEN
        RAISE EXCEPTION 'Invalid stay dates for stay_id %. Check-out date must be after check-in date.', p_stay_id;
    END IF;

    v_nights := v_stay.check_out_date - v_stay.check_in_date;
    v_total := v_nights * v_stay.finalprice;

    RETURN ROUND(v_total, 2);

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error in fn_calculate_stay_total for stay_id %: %', p_stay_id, SQLERRM;
END;
$$;

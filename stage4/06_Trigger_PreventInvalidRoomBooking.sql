-- Stage D - Trigger 2
-- Prevents inserting/updating a stay if the room is already booked or under maintenance during the requested dates.

CREATE OR REPLACE FUNCTION guests.trg_fn_prevent_invalid_room_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_conflicting_stay_id INTEGER;
    v_conflicting_maintenance_id INTEGER;
BEGIN
    IF NEW.roomid IS NULL THEN
        RETURN NEW;
    END IF;

    IF NEW.check_out_date <= NEW.check_in_date THEN
        RAISE EXCEPTION 'Invalid stay dates. Check-out date must be after check-in date.';
    END IF;

    -- Check if the same room is already booked for overlapping dates.
    SELECT sr.stay_id
    INTO v_conflicting_stay_id
    FROM guests.stay_record sr
    WHERE sr.roomid = NEW.roomid
      AND sr.stay_status <> 'Cancelled'
      AND sr.stay_id <> COALESCE(NEW.stay_id, -1)
      AND NEW.check_in_date < sr.check_out_date
      AND NEW.check_out_date > sr.check_in_date
    LIMIT 1;

    IF v_conflicting_stay_id IS NOT NULL THEN
        RAISE EXCEPTION 'Room % is already booked for the requested dates. Conflicting stay_id: %',
            NEW.roomid,
            v_conflicting_stay_id;
    END IF;

    -- Check if the room is under maintenance for overlapping dates.
    SELECT rm.maintenanceid
    INTO v_conflicting_maintenance_id
    FROM rooms.roommaintenance rm
    WHERE rm.roomid = NEW.roomid
      AND LOWER(COALESCE(rm.maintenancestatus, '')) NOT IN ('completed', 'finished', 'done', 'closed')
      AND NEW.check_in_date < COALESCE(rm.enddate, NEW.check_out_date)
      AND NEW.check_out_date > rm.startdate
    LIMIT 1;

    IF v_conflicting_maintenance_id IS NOT NULL THEN
        RAISE EXCEPTION 'Room % is under maintenance during the requested dates. Maintenance id: %',
            NEW.roomid,
            v_conflicting_maintenance_id;
    END IF;

    RETURN NEW;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error in trg_fn_prevent_invalid_room_booking: %', SQLERRM;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_invalid_room_booking ON guests.stay_record;

CREATE TRIGGER trg_prevent_invalid_room_booking
BEFORE INSERT OR UPDATE OF roomid, check_in_date, check_out_date ON guests.stay_record
FOR EACH ROW
EXECUTE FUNCTION guests.trg_fn_prevent_invalid_room_booking();


-- 1. Add integration columns to existing tables

-- Each stay should be connected to the room where the guest stayed.
ALTER TABLE guests.stay_record
ADD COLUMN IF NOT EXISTS roomid INTEGER;

-- Each stay should be connected to the price rate used for that stay.
ALTER TABLE guests.stay_record
ADD COLUMN IF NOT EXISTS rateid INTEGER;

-- Each special offer may be connected to a loyalty tier.
ALTER TABLE rooms.specialoffer
ADD COLUMN IF NOT EXISTS tier_id INTEGER;


-- 2. Fill Stay_Record.roomid with existing rooms

-- This update assigns rooms to stays in a distributed way.

WITH stays AS (
    SELECT
        stay_id,
        ROW_NUMBER() OVER (ORDER BY stay_id) AS stay_row
    FROM guests.stay_record
),
rooms_list AS (
    SELECT
        roomid,
        ROW_NUMBER() OVER (ORDER BY roomid) AS room_row
    FROM rooms.room
),
rooms_count AS (
    SELECT COUNT(*) AS total_rooms
    FROM rooms.room
)
UPDATE guests.stay_record sr
SET roomid = rl.roomid
FROM stays s
JOIN rooms_count rc ON TRUE
JOIN rooms_list rl
    ON rl.room_row = ((s.stay_row - 1) % rc.total_rooms) + 1
WHERE sr.stay_id = s.stay_id;


-- 3. Fill Stay_Record.rateid according to the assigned room type
-- Each stay receives a price rate that matches the room type of the room assigned to the stay.

WITH stay_room_type AS (
    SELECT
        sr.stay_id,
        r.roomtypeid,
        ROW_NUMBER() OVER (
            PARTITION BY r.roomtypeid
            ORDER BY sr.stay_id
        ) AS stay_row
    FROM guests.stay_record sr
    JOIN rooms.room r
        ON sr.roomid = r.roomid
),
rates AS (
    SELECT
        pr.rateid,
        pr.roomtypeid,
        ROW_NUMBER() OVER (
            PARTITION BY pr.roomtypeid
            ORDER BY pr.rateid
        ) AS rate_row,
        COUNT(*) OVER (
            PARTITION BY pr.roomtypeid
        ) AS total_rates
    FROM rooms.pricerate pr
)
UPDATE guests.stay_record sr
SET rateid = rates.rateid
FROM stay_room_type srt
JOIN rates
    ON rates.roomtypeid = srt.roomtypeid
   AND rates.rate_row = ((srt.stay_row - 1) % rates.total_rates) + 1
WHERE sr.stay_id = srt.stay_id;


-- 4. Fill SpecialOffer.tier_id according to loyalty tier discounts

-- A special offer is assigned to a loyalty tier whose regular discount is lower than the special offer discount.

UPDATE rooms.specialoffer so
SET tier_id = (
    SELECT lt.tier_id
    FROM guests.loyalty_tier lt
    WHERE lt.discount_percentage < so.discountpercentage
    ORDER BY random()
    LIMIT 1
)
WHERE so.tier_id IS NULL;


-- If some offers were not assigned because their discount was too low, assign them to the lowest loyalty tier.

UPDATE rooms.specialoffer so
SET tier_id = (
    SELECT lt.tier_id
    FROM guests.loyalty_tier lt
    ORDER BY lt.discount_percentage ASC
    LIMIT 1
)
WHERE so.tier_id IS NULL;


-- 5. Add foreign key constraints
-- Stay_Record.roomid -> Room.roomid

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_schema = 'guests'
          AND table_name = 'stay_record'
          AND constraint_name = 'fk_stay_room'
    ) THEN
        ALTER TABLE guests.stay_record
        ADD CONSTRAINT fk_stay_room
        FOREIGN KEY (roomid)
        REFERENCES rooms.room(roomid);
    END IF;
END $$;


-- Stay_Record.rateid -> PriceRate.rateid

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_schema = 'guests'
          AND table_name = 'stay_record'
          AND constraint_name = 'fk_stay_rate'
    ) THEN
        ALTER TABLE guests.stay_record
        ADD CONSTRAINT fk_stay_rate
        FOREIGN KEY (rateid)
        REFERENCES rooms.pricerate(rateid);
    END IF;
END $$;


-- SpecialOffer.tier_id -> Loyalty_Tier.tier_id

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_schema = 'rooms'
          AND table_name = 'specialoffer'
          AND constraint_name = 'fk_specialoffer_loyalty_tier'
    ) THEN
        ALTER TABLE rooms.specialoffer
        ADD CONSTRAINT fk_specialoffer_loyalty_tier
        FOREIGN KEY (tier_id)
        REFERENCES guests.loyalty_tier(tier_id);
    END IF;
END $$;


-- 6. Validation queries

-- Check that stay records are connected to rooms and price rates.

SELECT
    COUNT(*) AS total_stays,
    COUNT(roomid) AS stays_with_room,
    COUNT(rateid) AS stays_with_rate,
    COUNT(DISTINCT roomid) AS different_rooms,
    COUNT(DISTINCT rateid) AS different_rates
FROM guests.stay_record;


-- Check that the room and price rate connections are valid.

SELECT
    COUNT(*) AS valid_integrated_stays
FROM guests.stay_record sr
JOIN rooms.room r
    ON sr.roomid = r.roomid
JOIN rooms.pricerate pr
    ON sr.rateid = pr.rateid;


-- Check diversity of integrated room and price data.

SELECT
    COUNT(DISTINCT r.roomnumber) AS different_room_numbers,
    COUNT(DISTINCT rt.typename) AS different_room_types,
    COUNT(DISTINCT s.seasonname) AS different_seasons,
    COUNT(DISTINCT so.offername) AS different_offers,
    COUNT(DISTINCT pr.finalprice) AS different_final_prices
FROM guests.stay_record sr
JOIN rooms.room r
    ON sr.roomid = r.roomid
JOIN rooms.roomtype rt
    ON r.roomtypeid = rt.roomtypeid
JOIN rooms.pricerate pr
    ON sr.rateid = pr.rateid
JOIN rooms.season s
    ON pr.seasonid = s.seasonid
JOIN rooms.specialoffer so
    ON pr.offerid = so.offerid;


-- Check that special offers were connected to loyalty tiers.

SELECT
    so.offerid,
    so.offername,
    so.discountpercentage AS offer_discount,
    so.tier_id,
    lt.tier_name,
    lt.discount_percentage AS tier_discount
FROM rooms.specialoffer so
JOIN guests.loyalty_tier lt
    ON so.tier_id = lt.tier_id
ORDER BY so.offerid
LIMIT 30;

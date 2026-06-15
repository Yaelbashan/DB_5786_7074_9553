
-- View 1: Guest Department Point of View

-- This view shows integrated stay information from the guest side.
-- It combines guests, loyalty tiers, stays, rooms, room types, price rates, seasons, special offers, and payments.

CREATE OR REPLACE VIEW guests.v_guest_integrated_stay AS
SELECT
    sr.stay_id,
    sr.guest_id,

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
    lt.discount_percentage AS loyalty_discount,

    sr.check_in_date,
    sr.check_out_date,
    sr.stay_status,

    r.roomid,
    r.roomnumber,
    r.floor,
    rt.typename AS room_type,
    rt.baseprice,

    s.seasonname,
    so.offername,
    so.discountpercentage AS offer_discount,
    pr.finalprice,

    p.payment_id,
    p.amount AS payment_amount,
    p.payment_status

FROM guests.stay_record sr
JOIN guests.guest g
    ON sr.guest_id = g.guest_id

LEFT JOIN guests.private_guest pg
    ON g.guest_id = pg.guest_id

LEFT JOIN guests.corporate_guest cg
    ON g.guest_id = cg.guest_id

LEFT JOIN guests.guest_loyalty gl
    ON g.guest_id = gl.guest_id

LEFT JOIN guests.loyalty_tier lt
    ON gl.tier_id = lt.tier_id

LEFT JOIN rooms.room r
    ON sr.roomid = r.roomid

LEFT JOIN rooms.roomtype rt
    ON r.roomtypeid = rt.roomtypeid

LEFT JOIN rooms.pricerate pr
    ON sr.rateid = pr.rateid

LEFT JOIN rooms.season s
    ON pr.seasonid = s.seasonid

LEFT JOIN rooms.specialoffer so
    ON pr.offerid = so.offerid

LEFT JOIN guests.payment p
    ON sr.stay_id = p.stay_id;


-- Query 1 on Guest View: Integrated Stay Details
-- Shows the most important integrated stay fields.

SELECT
    stay_id,
    guest_name,
    guest_type,
    tier_name,
    check_in_date,
    check_out_date,
    roomnumber,
    room_type,
    seasonname,
    offername,
    finalprice,
    payment_amount,
    payment_status
FROM guests.v_guest_integrated_stay
ORDER BY payment_amount
LIMIT 15;


-- Query 2 on Guest View: Average Payment by Loyalty Tier
-- Calculates the number of stays, average final price, and average payment amount for each loyalty tier.

SELECT
    tier_name,
    COUNT(*) AS stays_count,
    ROUND(AVG(finalprice), 2) AS avg_final_price,
    ROUND(AVG(payment_amount), 2) AS avg_payment
FROM guests.v_guest_integrated_stay
WHERE tier_name IS NOT NULL
GROUP BY tier_name
ORDER BY avg_payment DESC;


-- View 2: Room Department Point of View
-- This view works as a room management dashboard.
-- It combines rooms, room types, room statuses, stays, payments, price rates, seasons, special offers, guests, loyalty tiers, and maintenance information.

CREATE OR REPLACE VIEW rooms.v_room_management_dashboard AS
SELECT
    r.roomid,
    r.roomnumber,
    r.floor,
    r.maxoccupancy,

    rt.typename AS room_type,
    rt.bedtype,
    rt.baseprice,

    rs.statusname AS room_status,

    COUNT(DISTINCT sr.stay_id) AS total_stays,
    ROUND(SUM(p.amount), 2) AS total_income,
    ROUND(AVG(p.amount), 2) AS average_payment,
    ROUND(AVG(pr.finalprice), 2) AS average_final_price,

    MAX(sr.check_out_date) AS last_checkout_date,

    COUNT(DISTINCT rm.maintenanceid) AS maintenance_count,
    ROUND(SUM(DISTINCT rm.repaircost), 2) AS total_repair_cost,

    COALESCE(
        MAX(pg.first_name || ' ' || pg.last_name),
        MAX(cg.company_name)
    ) AS sample_guest_name,

    MAX(lt.tier_name) AS sample_loyalty_tier,
    MAX(s.seasonname) AS sample_season,
    MAX(so.offername) AS sample_special_offer

FROM rooms.room r

JOIN rooms.roomtype rt
    ON r.roomtypeid = rt.roomtypeid

JOIN rooms.roomstatus rs
    ON r.statusid = rs.statusid

LEFT JOIN guests.stay_record sr
    ON r.roomid = sr.roomid

LEFT JOIN guests.guest g
    ON sr.guest_id = g.guest_id

LEFT JOIN guests.private_guest pg
    ON g.guest_id = pg.guest_id

LEFT JOIN guests.corporate_guest cg
    ON g.guest_id = cg.guest_id

LEFT JOIN guests.guest_loyalty gl
    ON g.guest_id = gl.guest_id

LEFT JOIN guests.loyalty_tier lt
    ON gl.tier_id = lt.tier_id

LEFT JOIN guests.payment p
    ON sr.stay_id = p.stay_id

LEFT JOIN rooms.pricerate pr
    ON sr.rateid = pr.rateid

LEFT JOIN rooms.season s
    ON pr.seasonid = s.seasonid

LEFT JOIN rooms.specialoffer so
    ON pr.offerid = so.offerid

LEFT JOIN rooms.roommaintenance rm
    ON r.roomid = rm.roomid

GROUP BY
    r.roomid,
    r.roomnumber,
    r.floor,
    r.maxoccupancy,
    rt.typename,
    rt.bedtype,
    rt.baseprice,
    rs.statusname;


-- Query 1 on Room View: Most Profitable Rooms
-- Shows the rooms with the highest total income.

SELECT
    roomnumber,
    floor,
    room_type,
    room_status,
    total_stays,
    total_income,
    average_payment,
    maintenance_count
FROM rooms.v_room_management_dashboard
ORDER BY total_income DESC NULLS LAST
LIMIT 10;


-- Query 2 on Room View: Income by Room Type
-- Summarizes room usage and income by room type.
-- This helps hotel management understand which room types generate the highest income.

SELECT
    room_type,
    COUNT(*) AS rooms_count,
    SUM(total_stays) AS total_stays,
    ROUND(SUM(total_income), 2) AS total_income,
    ROUND(AVG(average_payment), 2) AS avg_payment_per_room
FROM rooms.v_room_management_dashboard
GROUP BY room_type
ORDER BY total_income DESC NULLS LAST
LIMIT 10;

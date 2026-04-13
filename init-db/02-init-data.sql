-- =========================
-- INSERTS: HOTEL DATABASE (PostgreSQL Optimized)
-- =========================
-- 1. LOYALTY_TIER
INSERT INTO
    LOYALTY_TIER (
        tier_id,
        tier_name,
        points_required,
        discount_percentage,
        benefits_description
    ) OVERRIDING SYSTEM VALUE
VALUES
    (
        1,
        'Silver',
        0,
        5.00,
        'Basic benefits and entry-level discount'
    ),
    (
        2,
        'Gold',
        1000,
        10.00,
        'Priority service and medium discount'
    ),
    (
        3,
        'Platinum',
        5000,
        15.00,
        'Premium benefits and highest discount'
    );

-- 2. GUEST
INSERT INTO
    GUEST (guest_id, phone, email, created_at) OVERRIDING SYSTEM VALUE
VALUES
    (
        1,
        '050-3101001',
        'noa.levi01@gmail.com',
        '2025-11-02 09:10:00'
    ),
    (
        2,
        '052-3101002',
        'david.cohen02@gmail.com',
        '2025-11-03 10:05:00'
    ),
    (
        3,
        '054-3101003',
        'yael.mizrahi03@gmail.com',
        '2025-11-04 11:20:00'
    ),
    (
        4,
        '055-3101004',
        'omer.peretz04@gmail.com',
        '2025-11-05 12:15:00'
    ),
    (
        5,
        '053-3101005',
        'tamar.biton05@gmail.com',
        '2025-11-06 08:50:00'
    ),
    (
        6,
        '050-3101006',
        'yossi.azoulay06@gmail.com',
        '2025-11-06 14:30:00'
    ),
    (
        7,
        '052-3101007',
        'shira.malka07@gmail.com',
        '2025-11-07 09:45:00'
    ),
    (
        8,
        '054-3101008',
        'eitan.bendavid08@gmail.com',
        '2025-11-07 16:10:00'
    ),
    (
        9,
        '055-3101009',
        'maya.sharabi09@gmail.com',
        '2025-11-08 10:00:00'
    ),
    (
        10,
        '053-3101010',
        'ron.avraham10@gmail.com',
        '2025-11-08 13:40:00'
    ),
    (
        11,
        '050-3101011',
        'lihi.sasson11@gmail.com',
        '2025-11-09 09:25:00'
    ),
    (
        12,
        '052-3101012',
        'gil.haddad12@gmail.com',
        '2025-11-09 15:00:00'
    ),
    (
        13,
        '054-3101013',
        'adi.ohana13@gmail.com',
        '2025-11-10 10:35:00'
    ),
    (
        14,
        '055-3101014',
        'nadav.berkovitz14@gmail.com',
        '2025-11-10 11:50:00'
    ),
    (
        15,
        '053-3101015',
        'roni.amar15@gmail.com',
        '2025-11-11 08:40:00'
    ),
    (
        16,
        '050-3101016',
        'itay.katz16@gmail.com',
        '2025-11-11 13:15:00'
    ),
    (
        17,
        '052-3101017',
        'neta.golan17@gmail.com',
        '2025-11-12 09:05:00'
    ),
    (
        18,
        '054-3101018',
        'ariel.dahan18@gmail.com',
        '2025-11-12 17:10:00'
    ),
    (
        19,
        '055-3101019',
        'sivan.dayan19@gmail.com',
        '2025-11-13 12:20:00'
    ),
    (
        20,
        '053-3101020',
        'bar.abutbul20@gmail.com',
        '2025-11-13 14:55:00'
    ),
    (
        21,
        '050-3101021',
        'hila.sabag21@gmail.com',
        '2025-11-14 09:35:00'
    ),
    (
        22,
        '052-3101022',
        'ofir.nissim22@gmail.com',
        '2025-11-14 16:25:00'
    ),
    (
        23,
        '054-3101023',
        'dana.vaknin23@gmail.com',
        '2025-11-15 10:10:00'
    ),
    (
        24,
        '055-3101024',
        'alon.moshe24@gmail.com',
        '2025-11-15 13:30:00'
    ),
    (
        25,
        '053-3101025',
        'rotem.yosef25@gmail.com',
        '2025-11-16 08:20:00'
    ),
    (
        26,
        '050-3101026',
        'ido.harari26@gmail.com',
        '2025-11-16 15:40:00'
    ),
    (
        27,
        '052-3101027',
        'michal.buzaglo27@gmail.com',
        '2025-11-17 09:00:00'
    ),
    (
        28,
        '054-3101028',
        'tom.maman28@gmail.com',
        '2025-11-17 11:45:00'
    ),
    (
        29,
        '055-3101029',
        'sapir.edri29@gmail.com',
        '2025-11-18 10:50:00'
    ),
    (
        30,
        '053-3101030',
        'yuval.nagar30@gmail.com',
        '2025-11-18 14:00:00'
    ),
    (
        31,
        '050-3101031',
        'eden.marciano31@gmail.com',
        '2025-11-19 08:55:00'
    ),
    (
        32,
        '052-3101032',
        'lior.zrihen32@gmail.com',
        '2025-11-19 16:30:00'
    ),
    (
        33,
        '054-3101033',
        'amit.benhamo33@gmail.com',
        '2025-11-20 09:15:00'
    ),
    (
        34,
        '055-3101034',
        'or.elbaz34@gmail.com',
        '2025-11-20 12:10:00'
    ),
    (
        35,
        '053-3101035',
        'keren.moyal35@gmail.com',
        '2025-11-21 10:05:00'
    ),
    (
        36,
        '050-3101036',
        'shay.bitan36@gmail.com',
        '2025-11-21 13:55:00'
    ),
    (
        37,
        '052-3101037',
        'gal.suissa37@gmail.com',
        '2025-11-22 09:45:00'
    ),
    (
        38,
        '054-3101038',
        'matan.elkayam38@gmail.com',
        '2025-11-22 15:20:00'
    ),
    (
        39,
        '055-3101039',
        'avital.amsalem39@gmail.com',
        '2025-11-23 11:35:00'
    ),
    (
        40,
        '053-3101040',
        'asaf.nahum40@gmail.com',
        '2025-11-23 16:00:00'
    ),
    (
        41,
        '050-3101041',
        'yarden.shalom41@gmail.com',
        '2025-11-24 09:40:00'
    ),
    (
        42,
        '052-3101042',
        'roee.bitan42@gmail.com',
        '2025-11-24 12:35:00'
    ),
    (
        43,
        '054-3101043',
        'hadar.lavi43@gmail.com',
        '2025-11-25 10:25:00'
    ),
    (
        44,
        '055-3101044',
        'tal.levi44@gmail.com',
        '2025-11-25 14:10:00'
    ),
    (
        45,
        '053-3101045',
        'ella.benaim45@gmail.com',
        '2025-11-26 08:45:00'
    ),
    (
        46,
        '050-3101046',
        'nir.abecassis46@gmail.com',
        '2025-11-26 15:05:00'
    ),
    (
        47,
        '052-3101047',
        'mor.saadon47@gmail.com',
        '2025-11-27 09:30:00'
    ),
    (
        48,
        '054-3101048',
        'dean.levy48@gmail.com',
        '2025-11-27 17:00:00'
    ),
    (
        49,
        '055-3101049',
        'stav.bohadana49@gmail.com',
        '2025-11-28 11:15:00'
    ),
    (
        50,
        '053-3101050',
        'daniel.moyal50@gmail.com',
        '2025-11-28 13:20:00'
    ),
    (
        51,
        '050-3101051',
        'yuval.cohen51@gmail.com',
        '2025-11-29 09:05:00'
    ),
    (
        52,
        '052-3101052',
        'ori.twito52@gmail.com',
        '2025-11-29 12:50:00'
    ),
    (
        53,
        '054-3101053',
        'ruth.pinto53@gmail.com',
        '2025-11-30 10:30:00'
    ),
    (
        54,
        '055-3101054',
        'shahar.abuhatzira54@gmail.com',
        '2025-11-30 16:40:00'
    ),
    (
        55,
        '053-3101055',
        'lia.maman55@gmail.com',
        '2025-12-01 09:10:00'
    ),
    (
        56,
        '03-7012056',
        'travel@technova.co.il',
        '2025-12-01 11:00:00'
    ),
    (
        57,
        '03-7012057',
        'reservations@bluewave.co.il',
        '2025-12-01 11:15:00'
    ),
    (
        58,
        '03-7012058',
        'admin@greenfield-logistics.co.il',
        '2025-12-02 10:40:00'
    ),
    (
        59,
        '03-7012059',
        'office@urbanstay.co.il',
        '2025-12-02 13:00:00'
    ),
    (
        60,
        '03-7012060',
        'support@orion-consulting.co.il',
        '2025-12-03 09:00:00'
    ),
    (
        61,
        '03-7012061',
        'guestdesk@medcare-partners.co.il',
        '2025-12-03 14:10:00'
    ),
    (
        62,
        '03-7012062',
        'bookings@sunrise-travel.co.il',
        '2025-12-04 08:55:00'
    ),
    (
        63,
        '03-7012063',
        'ops@delta-trade.co.il',
        '2025-12-04 15:30:00'
    ),
    (
        64,
        '03-7012064',
        'events@skyline-events.co.il',
        '2025-12-05 10:20:00'
    ),
    (
        65,
        '03-7012065',
        'stay@nexus-retail.co.il',
        '2025-12-05 16:05:00'
    ),
    (
        66,
        '03-7012066',
        'travel@prime-industrial.co.il',
        '2025-12-06 09:25:00'
    ),
    (
        67,
        '03-7012067',
        'service@coral-finance.co.il',
        '2025-12-06 12:45:00'
    ),
    (
        68,
        '03-7012068',
        'booking@vision-properties.co.il',
        '2025-12-07 10:05:00'
    ),
    (
        69,
        '03-7012069',
        'office@northport-imports.co.il',
        '2025-12-07 14:25:00'
    ),
    (
        70,
        '03-7012070',
        'guest@atlas-digital.co.il',
        '2025-12-08 09:50:00'
    );

-- 3. PRIVATE_GUEST
INSERT INTO
    PRIVATE_GUEST (
        guest_id,
        first_name,
        last_name,
        id_or_passport_number,
        gender
    )
VALUES
    (1, 'Noa', 'Levi', '321450001', 'Female'),
    (2, 'David', 'Cohen', '321450002', 'Male'),
    (3, 'Yael', 'Mizrahi', '321450003', 'Female'),
    (4, 'Omer', 'Peretz', '321450004', 'Male'),
    (5, 'Tamar', 'Biton', '321450005', 'Female'),
    (6, 'Yossi', 'Azoulay', '321450006', 'Male'),
    (7, 'Shira', 'Malka', '321450007', 'Female'),
    (8, 'Eitan', 'BenDavid', '321450008', 'Male'),
    (9, 'Maya', 'Sharabi', '321450009', 'Female'),
    (10, 'Ron', 'Avraham', '321450010', 'Male'),
    (11, 'Lihi', 'Sasson', '321450011', 'Female'),
    (12, 'Gil', 'Haddad', '321450012', 'Male'),
    (13, 'Adi', 'Ohana', '321450013', 'Female'),
    (14, 'Nadav', 'Berkovitz', '321450014', 'Male'),
    (15, 'Roni', 'Amar', '321450015', 'Female'),
    (16, 'Itay', 'Katz', '321450016', 'Male'),
    (17, 'Neta', 'Golan', '321450017', 'Female'),
    (18, 'Ariel', 'Dahan', '321450018', 'Male'),
    (19, 'Sivan', 'Dayan', '321450019', 'Female'),
    (20, 'Bar', 'Abutbul', '321450020', 'Male'),
    (21, 'Hila', 'Sabag', '321450021', 'Female'),
    (22, 'Ofir', 'Nissim', '321450022', 'Male'),
    (23, 'Dana', 'Vaknin', '321450023', 'Female'),
    (24, 'Alon', 'Moshe', '321450024', 'Male'),
    (25, 'Rotem', 'Yosef', '321450025', 'Female'),
    (26, 'Ido', 'Harari', '321450026', 'Male'),
    (27, 'Michal', 'Buzaglo', '321450027', 'Female'),
    (28, 'Tom', 'Maman', '321450028', 'Male'),
    (29, 'Sapir', 'Edri', '321450029', 'Female'),
    (30, 'Yuval', 'Nagar', '321450030', 'Male'),
    (31, 'Eden', 'Marciano', '321450031', 'Female'),
    (32, 'Lior', 'Zrihen', '321450032', 'Male'),
    (33, 'Amit', 'BenHamo', '321450033', 'Female'),
    (34, 'Or', 'Elbaz', '321450034', 'Male'),
    (35, 'Keren', 'Moyal', '321450035', 'Female'),
    (36, 'Shay', 'Bitan', '321450036', 'Male'),
    (37, 'Gal', 'Suissa', '321450037', 'Female'),
    (38, 'Matan', 'Elkayam', '321450038', 'Male'),
    (39, 'Avital', 'Amsalem', '321450039', 'Female'),
    (40, 'Asaf', 'Nahum', '321450040', 'Male'),
    (41, 'Yarden', 'Shalom', '321450041', 'Female'),
    (42, 'Roee', 'Bitan', '321450042', 'Male'),
    (43, 'Hadar', 'Lavi', '321450043', 'Female'),
    (44, 'Tal', 'Levi', '321450044', 'Male'),
    (45, 'Ella', 'Benaim', '321450045', 'Female'),
    (46, 'Nir', 'Abecassis', '321450046', 'Male'),
    (47, 'Mor', 'Saadon', '321450047', 'Female'),
    (48, 'Dean', 'Levy', '321450048', 'Male'),
    (49, 'Stav', 'Bohadana', '321450049', 'Female'),
    (50, 'Daniel', 'Moyal', '321450050', 'Male'),
    (51, 'Yuval', 'Cohen', '321450051', 'Female'),
    (52, 'Ori', 'Twito', '321450052', 'Male'),
    (53, 'Ruth', 'Pinto', '321450053', 'Female'),
    (54, 'Shahar', 'Abuhatzira', '321450054', 'Male'),
    (55, 'Lia', 'Maman', '321450055', 'Female');

-- 4. CORPORATE_GUEST
INSERT INTO
    CORPORATE_GUEST (
        guest_id,
        company_name,
        company_registration_number,
        contact_person_name
    )
VALUES
    (56, 'TechNova Ltd', '516000156', 'Maya Rosen'),
    (57, 'BlueWave Systems', '516000157', 'Eitan Mor'),
    (
        58,
        'GreenField Logistics',
        '516000158',
        'Noam Bar'
    ),
    (
        59,
        'UrbanStay Solutions',
        '516000159',
        'Shani Dor'
    ),
    (60, 'Orion Consulting', '516000160', 'Lior Tal'),
    (61, 'MedCare Partners', '516000161', 'Amit Naveh'),
    (
        62,
        'Sunrise Travel Group',
        '516000162',
        'Roni Peleg'
    ),
    (
        63,
        'Delta Trade House',
        '516000163',
        'Adi Shalev'
    ),
    (64, 'Skyline Events', '516000164', 'Yoni Amit'),
    (65, 'Nexus Retail', '516000165', 'Keren Sela'),
    (
        66,
        'Prime Industrial',
        '516000166',
        'Gilad Harel'
    ),
    (67, 'Coral Finance', '516000167', 'Neta Arbel'),
    (68, 'Vision Properties', '516000168', 'Shir Paz'),
    (69, 'NorthPort Imports', '516000169', 'Dvir Arad'),
    (70, 'Atlas Digital', '516000170', 'Moran Erez');

-- 5. GUEST_LOYALTY
INSERT INTO
    GUEST_LOYALTY (
        guest_id,
        membership_number,
        points_balance,
        status,
        tier_id
    )
VALUES
    (1, 'SLV-1001', 220, 'Active', 1),
    (2, 'SLV-1002', 340, 'Active', 1),
    (3, 'SLV-1003', 480, 'Active', 1),
    (4, 'SLV-1004', 620, 'Active', 1),
    (5, 'SLV-1005', 760, 'Active', 1),
    (6, 'SLV-1006', 850, 'Active', 1),
    (7, 'SLV-1007', 910, 'Active', 1),
    (8, 'SLV-1008', 980, 'Active', 1),
    (16, 'GLD-2001', 1450, 'Active', 2),
    (17, 'GLD-2002', 1670, 'Active', 2),
    (18, 'GLD-2003', 1890, 'Active', 2),
    (19, 'GLD-2004', 2140, 'Active', 2),
    (20, 'GLD-2005', 2380, 'Active', 2),
    (21, 'GLD-2006', 2510, 'Active', 2),
    (22, 'GLD-2007', 2760, 'Active', 2),
    (23, 'GLD-2008', 2990, 'Active', 2),
    (24, 'GLD-2009', 3250, 'Active', 2),
    (25, 'GLD-2010', 3480, 'Active', 2),
    (26, 'PLT-3001', 5300, 'Active', 3),
    (27, 'PLT-3002', 5820, 'Active', 3),
    (28, 'PLT-3003', 6350, 'Active', 3),
    (29, 'PLT-3004', 6880, 'Active', 3),
    (30, 'PLT-3005', 7410, 'Active', 3),
    (56, 'GLD-2011', 1730, 'Active', 2),
    (57, 'GLD-2012', 1940, 'Active', 2),
    (58, 'GLD-2013', 2160, 'Active', 2),
    (59, 'GLD-2014', 2390, 'Active', 2),
    (60, 'GLD-2015', 2610, 'Active', 2),
    (66, 'PLT-3006', 5600, 'Active', 3),
    (67, 'PLT-3007', 6120, 'Active', 3),
    (68, 'PLT-3008', 6640, 'Active', 3),
    (69, 'PLT-3009', 7180, 'Active', 3),
    (70, 'PLT-3010', 7720, 'Active', 3);

-- 6. STAY_RECORD
INSERT INTO
    STAY_RECORD (
        stay_id,
        check_in_date,
        check_out_date,
        stay_status,
        guest_id
    ) OVERRIDING SYSTEM VALUE
VALUES
    (1, '2025-12-10', '2025-12-13', 'CheckedOut', 1),
    (2, '2026-01-15', '2026-01-18', 'CheckedOut', 1),
    (3, '2026-03-02', '2026-03-06', 'CheckedOut', 1),
    (4, '2026-01-20', '2026-01-23', 'CheckedOut', 2),
    (5, '2026-02-18', '2026-02-21', 'CheckedOut', 2),
    (6, '2026-01-11', '2026-01-14', 'CheckedOut', 3),
    (7, '2026-02-05', '2026-02-08', 'CheckedOut', 4),
    (8, '2026-02-24', '2026-02-27', 'CheckedOut', 5),
    (9, '2026-03-12', '2026-03-15', 'CheckedOut', 6),
    (10, '2026-01-28', '2026-02-01', 'CheckedOut', 7),
    (11, '2026-02-14', '2026-02-17', 'CheckedOut', 8),
    (12, '2026-03-07', '2026-03-10', 'CheckedOut', 9),
    (13, '2026-01-09', '2026-01-12', 'CheckedOut', 10),
    (14, '2026-02-01', '2026-02-05', 'CheckedOut', 11),
    (15, '2026-02-22', '2026-02-26', 'CheckedOut', 12),
    (16, '2026-03-18', '2026-03-21', 'CheckedOut', 13),
    (17, '2026-01-17', '2026-01-20', 'CheckedOut', 14),
    (18, '2026-02-11', '2026-02-14', 'CheckedOut', 15),
    (19, '2026-03-01', '2026-03-05', 'CheckedOut', 16),
    (20, '2026-03-10', '2026-03-14', 'CheckedOut', 17),
    (21, '2026-03-22', '2026-03-26', 'CheckedOut', 18),
    (22, '2026-04-03', '2026-04-06', 'CheckedOut', 19),
    (23, '2026-04-11', '2026-04-15', 'CheckedOut', 20),
    (24, '2026-04-18', '2026-04-21', 'CheckedOut', 21),
    (25, '2026-04-25', '2026-04-28', 'CheckedOut', 22),
    (26, '2026-05-02', '2026-05-05', 'CheckedOut', 23),
    (27, '2026-05-09', '2026-05-13', 'CheckedOut', 24),
    (28, '2026-05-16', '2026-05-20', 'CheckedOut', 25),
    (29, '2026-05-23', '2026-05-27', 'CheckedOut', 26),
    (30, '2026-05-30', '2026-06-03', 'CheckedOut', 27),
    (31, '2026-06-06', '2026-06-09', 'CheckedOut', 28),
    (32, '2026-06-12', '2026-06-16', 'CheckedOut', 29),
    (33, '2026-06-19', '2026-06-23', 'CheckedOut', 30),
    (34, '2026-06-26', '2026-06-29', 'CheckedOut', 31),
    (35, '2026-07-02', '2026-07-06', 'CheckedOut', 32),
    (36, '2026-07-09', '2026-07-12', 'CheckedOut', 33),
    (37, '2026-07-16', '2026-07-20', 'CheckedOut', 34),
    (38, '2026-07-23', '2026-07-27', 'CheckedOut', 35),
    (39, '2026-08-01', '2026-08-04', 'CheckedOut', 36),
    (40, '2026-08-05', '2026-08-08', 'CheckedOut', 37),
    (41, '2026-08-10', '2026-08-13', 'CheckedOut', 38),
    (42, '2026-08-15', '2026-08-19', 'CheckedOut', 39),
    (43, '2026-08-20', '2026-08-23', 'CheckedOut', 40),
    (44, '2026-08-25', '2026-08-29', 'CheckedOut', 41),
    (45, '2026-09-01', '2026-09-04', 'CheckedOut', 42),
    (46, '2026-09-06', '2026-09-10', 'Cancelled', 43),
    (47, '2026-09-12', '2026-09-15', 'Cancelled', 44),
    (48, '2026-09-18', '2026-09-21', 'Cancelled', 45),
    (49, '2026-09-23', '2026-09-27', 'Booked', 46),
    (50, '2026-09-29', '2026-10-02', 'Booked', 47),
    (51, '2026-10-05', '2026-10-08', 'Booked', 48),
    (52, '2026-10-10', '2026-10-14', 'Booked', 49),
    (53, '2026-10-16', '2026-10-19', 'Booked', 50),
    (54, '2026-10-22', '2026-10-26', 'Booked', 51),
    (55, '2026-10-29', '2026-11-01', 'Booked', 52),
    (56, '2026-11-04', '2026-11-07', 'Booked', 53),
    (57, '2026-11-10', '2026-11-13', 'Booked', 54),
    (58, '2026-11-16', '2026-11-20', 'Booked', 55),
    (59, '2026-03-05', '2026-03-09', 'CheckedOut', 56),
    (60, '2026-04-07', '2026-04-10', 'CheckedOut', 56),
    (61, '2026-05-12', '2026-05-15', 'CheckedOut', 57),
    (62, '2026-06-14', '2026-06-18', 'CheckedOut', 57),
    (63, '2026-07-03', '2026-07-06', 'CheckedOut', 58),
    (64, '2026-07-17', '2026-07-21', 'CheckedOut', 59),
    (65, '2026-08-02', '2026-08-06', 'CheckedOut', 60),
    (66, '2026-08-12', '2026-08-15', 'CheckedOut', 61),
    (67, '2026-08-22', '2026-08-26', 'CheckedOut', 62),
    (68, '2026-09-02', '2026-09-05', 'CheckedOut', 63),
    (69, '2026-09-11', '2026-09-14', 'CheckedOut', 64),
    (70, '2026-09-20', '2026-09-24', 'CheckedOut', 65),
    (71, '2026-10-01', '2026-10-05', 'CheckedIn', 66),
    (72, '2026-10-09', '2026-10-12', 'CheckedIn', 67),
    (73, '2026-10-16', '2026-10-20', 'CheckedIn', 68),
    (74, '2026-10-24', '2026-10-27', 'CheckedIn', 69),
    (75, '2026-11-01', '2026-11-05', 'CheckedIn', 70);

-- 7. PAYMENT
INSERT INTO
    PAYMENT (
        payment_id,
        payment_date,
        amount,
        payment_method,
        payment_status,
        stay_id
    ) OVERRIDING SYSTEM VALUE
VALUES
    (
        1,
        '2025-12-10 09:30:00',
        420.00,
        'Credit Card',
        'Completed',
        1
    ),
    (
        2,
        '2025-12-13 11:45:00',
        210.00,
        'Cash',
        'Completed',
        1
    ),
    (
        3,
        '2026-01-15 10:00:00',
        390.00,
        'Credit Card',
        'Completed',
        2
    ),
    (
        4,
        '2026-01-18 12:10:00',
        180.00,
        'Credit Card',
        'Completed',
        2
    ),
    (
        5,
        '2026-03-02 09:20:00',
        520.00,
        'Credit Card',
        'Completed',
        3
    ),
    (
        6,
        '2026-01-20 11:00:00',
        440.00,
        'Credit Card',
        'Completed',
        4
    ),
    (
        7,
        '2026-02-18 09:40:00',
        460.00,
        'Bank Transfer',
        'Completed',
        5
    ),
    (
        8,
        '2026-01-11 10:10:00',
        380.00,
        'Credit Card',
        'Completed',
        6
    ),
    (
        9,
        '2026-02-05 09:15:00',
        410.00,
        'Cash',
        'Completed',
        7
    ),
    (
        10,
        '2026-02-24 08:50:00',
        395.00,
        'Credit Card',
        'Completed',
        8
    ),
    (
        11,
        '2026-03-12 10:30:00',
        430.00,
        'Credit Card',
        'Completed',
        9
    ),
    (
        12,
        '2026-01-28 11:25:00',
        560.00,
        'Credit Card',
        'Completed',
        10
    ),
    (
        13,
        '2026-02-14 09:45:00',
        405.00,
        'Cash',
        'Completed',
        11
    ),
    (
        14,
        '2026-03-07 10:00:00',
        390.00,
        'Credit Card',
        'Completed',
        12
    ),
    (
        15,
        '2026-01-09 09:10:00',
        375.00,
        'Credit Card',
        'Completed',
        13
    ),
    (
        16,
        '2026-02-01 09:35:00',
        510.00,
        'Credit Card',
        'Completed',
        14
    ),
    (
        17,
        '2026-02-22 10:50:00',
        530.00,
        'Bank Transfer',
        'Completed',
        15
    ),
    (
        18,
        '2026-03-18 09:00:00',
        425.00,
        'Cash',
        'Completed',
        16
    ),
    (
        19,
        '2026-01-17 10:20:00',
        385.00,
        'Credit Card',
        'Completed',
        17
    ),
    (
        20,
        '2026-02-11 10:00:00',
        395.00,
        'Credit Card',
        'Completed',
        18
    ),
    (
        21,
        '2026-03-01 09:10:00',
        540.00,
        'Credit Card',
        'Completed',
        19
    ),
    (
        22,
        '2026-03-10 09:15:00',
        555.00,
        'Cash',
        'Completed',
        20
    ),
    (
        23,
        '2026-03-22 09:20:00',
        570.00,
        'Credit Card',
        'Completed',
        21
    ),
    (
        24,
        '2026-04-03 10:25:00',
        415.00,
        'Credit Card',
        'Completed',
        22
    ),
    (
        25,
        '2026-04-11 10:40:00',
        520.00,
        'Bank Transfer',
        'Completed',
        23
    ),
    (
        26,
        '2026-04-18 09:35:00',
        410.00,
        'Credit Card',
        'Completed',
        24
    ),
    (
        27,
        '2026-04-25 09:50:00',
        425.00,
        'Cash',
        'Completed',
        25
    ),
    (
        28,
        '2026-05-02 10:05:00',
        540.00,
        'Credit Card',
        'Completed',
        26
    ),
    (
        29,
        '2026-05-09 10:15:00',
        565.00,
        'Credit Card',
        'Completed',
        27
    ),
    (
        30,
        '2026-05-16 10:30:00',
        580.00,
        'Bank Transfer',
        'Completed',
        28
    ),
    (
        31,
        '2026-05-23 10:45:00',
        595.00,
        'Credit Card',
        'Completed',
        29
    ),
    (
        32,
        '2026-05-30 09:55:00',
        610.00,
        'Cash',
        'Completed',
        30
    ),
    (
        33,
        '2026-06-06 09:20:00',
        430.00,
        'Credit Card',
        'Completed',
        31
    ),
    (
        34,
        '2026-06-12 09:30:00',
        545.00,
        'Credit Card',
        'Completed',
        32
    ),
    (
        35,
        '2026-06-19 09:50:00',
        560.00,
        'Credit Card',
        'Completed',
        33
    ),
    (
        36,
        '2026-06-26 10:10:00',
        435.00,
        'Cash',
        'Completed',
        34
    ),
    (
        37,
        '2026-07-02 10:25:00',
        550.00,
        'Credit Card',
        'Completed',
        35
    ),
    (
        38,
        '2026-07-09 10:40:00',
        445.00,
        'Credit Card',
        'Completed',
        36
    ),
    (
        39,
        '2026-07-16 10:50:00',
        570.00,
        'Credit Card',
        'Completed',
        37
    ),
    (
        40,
        '2026-07-23 11:05:00',
        585.00,
        'Bank Transfer',
        'Completed',
        38
    ),
    (
        41,
        '2026-08-01 09:10:00',
        450.00,
        'Credit Card',
        'Completed',
        39
    ),
    (
        42,
        '2026-08-05 09:20:00',
        455.00,
        'Cash',
        'Completed',
        40
    ),
    (
        43,
        '2026-08-10 09:30:00',
        460.00,
        'Credit Card',
        'Completed',
        41
    ),
    (
        44,
        '2026-08-15 09:45:00',
        575.00,
        'Credit Card',
        'Completed',
        42
    ),
    (
        45,
        '2026-08-20 10:00:00',
        470.00,
        'Credit Card',
        'Completed',
        43
    ),
    (
        46,
        '2026-08-25 10:10:00',
        590.00,
        'Bank Transfer',
        'Completed',
        44
    ),
    (
        47,
        '2026-09-01 10:20:00',
        475.00,
        'Credit Card',
        'Completed',
        45
    ),
    (
        48,
        '2026-09-06 08:15:00',
        160.00,
        'Credit Card',
        'Refunded',
        46
    ),
    (
        49,
        '2026-09-12 08:30:00',
        180.00,
        'Credit Card',
        'Refunded',
        47
    ),
    (
        50,
        '2026-09-18 08:45:00',
        170.00,
        'Credit Card',
        'Refunded',
        48
    ),
    (
        51,
        '2026-09-23 09:00:00',
        220.00,
        'Credit Card',
        'Pending',
        49
    ),
    (
        52,
        '2026-09-29 09:10:00',
        230.00,
        'Credit Card',
        'Pending',
        50
    ),
    (
        53,
        '2026-10-05 09:20:00',
        240.00,
        'Credit Card',
        'Pending',
        51
    ),
    (
        54,
        '2026-10-10 09:30:00',
        250.00,
        'Credit Card',
        'Pending',
        52
    ),
    (
        55,
        '2026-10-16 09:40:00',
        260.00,
        'Credit Card',
        'Pending',
        53
    ),
    (
        56,
        '2026-10-22 09:50:00',
        270.00,
        'Credit Card',
        'Pending',
        54
    ),
    (
        57,
        '2026-10-29 10:00:00',
        280.00,
        'Credit Card',
        'Pending',
        55
    ),
    (
        58,
        '2026-11-04 10:10:00',
        290.00,
        'Credit Card',
        'Pending',
        56
    ),
    (
        59,
        '2026-11-10 10:20:00',
        300.00,
        'Credit Card',
        'Pending',
        57
    ),
    (
        60,
        '2026-11-16 10:30:00',
        310.00,
        'Credit Card',
        'Pending',
        58
    ),
    (
        61,
        '2026-03-05 09:15:00',
        620.00,
        'Bank Transfer',
        'Completed',
        59
    ),
    (
        62,
        '2026-04-07 09:20:00',
        480.00,
        'Credit Card',
        'Completed',
        60
    ),
    (
        63,
        '2026-05-12 09:25:00',
        510.00,
        'Bank Transfer',
        'Completed',
        61
    ),
    (
        64,
        '2026-06-14 09:30:00',
        640.00,
        'Credit Card',
        'Completed',
        62
    ),
    (
        65,
        '2026-07-03 09:35:00',
        470.00,
        'Credit Card',
        'Completed',
        63
    ),
    (
        66,
        '2026-07-17 09:40:00',
        590.00,
        'Bank Transfer',
        'Completed',
        64
    ),
    (
        67,
        '2026-08-02 09:45:00',
        610.00,
        'Credit Card',
        'Completed',
        65
    ),
    (
        68,
        '2026-08-12 09:50:00',
        495.00,
        'Credit Card',
        'Completed',
        66
    ),
    (
        69,
        '2026-08-22 09:55:00',
        630.00,
        'Bank Transfer',
        'Completed',
        67
    ),
    (
        70,
        '2026-09-02 10:00:00',
        485.00,
        'Credit Card',
        'Completed',
        68
    ),
    (
        71,
        '2026-09-11 10:05:00',
        500.00,
        'Credit Card',
        'Completed',
        69
    ),
    (
        72,
        '2026-09-20 10:10:00',
        650.00,
        'Bank Transfer',
        'Completed',
        70
    ),
    (
        73,
        '2026-10-01 08:50:00',
        320.00,
        'Credit Card',
        'Completed',
        71
    ),
    (
        74,
        '2026-10-09 08:55:00',
        340.00,
        'Credit Card',
        'Completed',
        72
    ),
    (
        75,
        '2026-10-16 09:00:00',
        360.00,
        'Bank Transfer',
        'Completed',
        73
    ),
    (
        76,
        '2026-10-24 09:05:00',
        330.00,
        'Credit Card',
        'Completed',
        74
    ),
    (
        77,
        '2026-11-01 09:10:00',
        370.00,
        'Credit Card',
        'Completed',
        75
    );

-- 8. GUEST_FEEDBACK
INSERT INTO
    GUEST_FEEDBACK (stay_id, rating, comments, feedback_date)
VALUES
    (
        1,
        5,
        'Excellent stay, very clean room and kind staff.',
        '2025-12-13'
    ),
    (
        2,
        4,
        'Good service and quick check-in.',
        '2026-01-18'
    ),
    (
        4,
        4,
        'Pleasant stay and tasty breakfast.',
        '2026-01-23'
    ),
    (
        7,
        5,
        'Everything was organized and comfortable.',
        '2026-02-08'
    ),
    (
        10,
        4,
        'Nice hotel and convenient location.',
        '2026-02-01'
    ),
    (
        14,
        4,
        'Clean room and professional team.',
        '2026-02-05'
    ),
    (
        19,
        5,
        'Very smooth experience from arrival to checkout.',
        '2026-03-05'
    ),
    (
        23,
        4,
        'Business stay was efficient and quiet.',
        '2026-04-15'
    ),
    (
        29,
        5,
        'Excellent overall hospitality.',
        '2026-05-27'
    ),
    (33, 4, 'Good value for money.', '2026-06-23'),
    (
        38,
        4,
        'Would definitely come back again.',
        '2026-07-27'
    ),
    (
        42,
        4,
        'Friendly staff and easy checkout.',
        '2026-08-19'
    ),
    (
        59,
        5,
        'Corporate booking handled very well.',
        '2026-03-09'
    ),
    (62, 4, 'Team stay went smoothly.', '2026-06-18'),
    (
        70,
        4,
        'Professional and efficient service.',
        '2026-09-24'
    );

-- 9. RE-SYNC SEQUENCES (Crucial for PostgreSQL)
-- This ensures that the next record you add without an ID starts after the highest ID used above.
SELECT
    setval (
        pg_get_serial_sequence ('LOYALTY_TIER', 'tier_id'),
        COALESCE(MAX(tier_id), 1)
    )
FROM
    LOYALTY_TIER;

SELECT
    setval (
        pg_get_serial_sequence ('GUEST', 'guest_id'),
        COALESCE(MAX(guest_id), 1)
    )
FROM
    GUEST;

SELECT
    setval (
        pg_get_serial_sequence ('STAY_RECORD', 'stay_id'),
        COALESCE(MAX(stay_id), 1)
    )
FROM
    STAY_RECORD;

SELECT
    setval (
        pg_get_serial_sequence ('PAYMENT', 'payment_id'),
        COALESCE(MAX(payment_id), 1)
    )
FROM
    PAYMENT;
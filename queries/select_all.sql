-- 1. טבלת רמות נאמנות
SELECT
    '--- LOYALTY_TIER ---' AS table_name;

SELECT
    *
FROM
    LOYALTY_TIER;

-- 2. טבלת אורחים (כללית)
SELECT
    '--- GUEST ---' AS table_name;

SELECT
    *
FROM
    GUEST;

-- 3. טבלת אורחים פרטיים
SELECT
    '--- PRIVATE_GUEST ---' AS table_name;

SELECT
    *
FROM
    PRIVATE_GUEST;

-- 4. טבלת אורחים עסקיים
SELECT
    '--- CORPORATE_GUEST ---' AS table_name;

SELECT
    *
FROM
    CORPORATE_GUEST;

-- 5. טבלת מועדון לקוחות (נאמנות)
SELECT
    '--- GUEST_LOYALTY ---' AS table_name;

SELECT
    *
FROM
    GUEST_LOYALTY;

-- 6. טבלת תיעוד שהיות (הזמנות)
SELECT
    '--- STAY_RECORD ---' AS table_name;

SELECT
    *
FROM
    STAY_RECORD;

-- 7. טבלת תשלומים
SELECT
    '--- PAYMENT ---' AS table_name;

SELECT
    *
FROM
    PAYMENT;

-- 8. טבלת משוב אורחים
SELECT
    '--- GUEST_FEEDBACK ---' AS table_name;

SELECT
    *
FROM
    GUEST_FEEDBACK;
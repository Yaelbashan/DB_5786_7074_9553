-- CONSTRAINTS:
-- 1. Ensures that membership numbers start with MBR followed by a dash.
ALTER TABLE Guest_Loyalty -- ALTER TABLE changes the structure of an existing table.
ADD CONSTRAINT chk_membership_number_format CHECK (membership_number LIKE 'MBR-%');

-- 2. Ensures that guest email addresses contain the @ character.
ALTER TABLE Guest ADD CONSTRAINT chk_guest_email_format CHECK (email LIKE '%@%');

-- 3. Ensures that the checkout date is after the check-in date.
ALTER TABLE Stay_Record ADD CONSTRAINT chk_checkout_after_checkin CHECK (check_out_date > check_in_date);
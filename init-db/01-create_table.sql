  -- 1. Table: LOYALTY_TIER
-- Defines membership levels and their associated benefits
CREATE TABLE LOYALTY_TIER (
  tier_id INT AUTO_INCREMENT PRIMARY KEY,
  tier_name VARCHAR(50) NOT NULL,
  points_required INT NOT NULL DEFAULT 0,
  discount_percentage DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  benefits_description TEXT,
  CONSTRAINT chk_points_positive CHECK (points_required >= 0),
  CONSTRAINT chk_discount_range CHECK (discount_percentage BETWEEN 0 AND 100)
);

-- 2. Table: GUEST (Parent Table)
-- Generic guest information for both private and corporate clients
CREATE TABLE GUEST (
  guest_id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: PRIVATE_GUEST (Subtype of GUEST)
-- Specific details for individual human guests
CREATE TABLE PRIVATE_GUEST (
  guest_id INT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  id_or_passport_number VARCHAR(20) NOT NULL UNIQUE,
  gender VARCHAR(15),
  CONSTRAINT fk_private_guest_id FOREIGN KEY (guest_id)
    REFERENCES GUEST(guest_id) ON DELETE CASCADE,
  CONSTRAINT chk_gender_type CHECK (gender IN ('Male', 'Female', 'Other'))
);

-- 4. Table: CORPORATE_GUEST (Subtype of GUEST)
-- Specific details for business entity guests
CREATE TABLE CORPORATE_GUEST (
  guest_id INT PRIMARY KEY,
  company_name VARCHAR(100) NOT NULL,
  company_registration_number VARCHAR(50) NOT NULL UNIQUE,
  contact_person_name VARCHAR(100),
  CONSTRAINT fk_corporate_guest_id FOREIGN KEY (guest_id)
    REFERENCES GUEST(guest_id) ON DELETE CASCADE
);

-- 5. Table: GUEST_LOYALTY
-- Links guests to a loyalty tier and tracks their points balance
CREATE TABLE GUEST_LOYALTY (
  guest_id INT PRIMARY KEY,
  membership_number VARCHAR(50) UNIQUE NOT NULL,
  points_balance INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'Active',
  tier_id INT NOT NULL,
  CONSTRAINT fk_loyalty_guest FOREIGN KEY (guest_id)
    REFERENCES GUEST(guest_id) ON DELETE CASCADE,
  CONSTRAINT fk_loyalty_tier FOREIGN KEY (tier_id)
    REFERENCES LOYALTY_TIER(tier_id),
  CONSTRAINT chk_points_balance CHECK (points_balance >= 0),
  CONSTRAINT chk_loyalty_status CHECK (status IN ('Active', 'Inactive', 'Suspended'))
);

-- 6. Table: STAY_RECORD
-- History of room bookings and actual stays
CREATE TABLE STAY_RECORD (
  stay_id INT AUTO_INCREMENT PRIMARY KEY,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  stay_status VARCHAR(20) DEFAULT 'Booked',
  guest_id INT NOT NULL,
  CONSTRAINT fk_stay_guest FOREIGN KEY (guest_id)
    REFERENCES GUEST(guest_id) ON DELETE CASCADE,
  CONSTRAINT chk_date_order CHECK (check_out_date >= check_in_date),
  CONSTRAINT chk_stay_status CHECK (stay_status IN ('Booked', 'CheckedIn', 'CheckedOut', 'Cancelled'))
);

-- 7. Table: PAYMENT
-- Financial transactions associated with a specific stay
CREATE TABLE PAYMENT (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'Credit Card',
  payment_status VARCHAR(20) DEFAULT 'Pending',
  stay_id INT NOT NULL,
  CONSTRAINT fk_payment_stay FOREIGN KEY (stay_id)
    REFERENCES STAY_RECORD(stay_id) ON DELETE CASCADE,
  CONSTRAINT chk_amount_positive CHECK (amount >= 0),
  CONSTRAINT chk_payment_status CHECK (payment_status IN ('Pending', 'Completed', 'Failed', 'Refunded'))
);

-- 8. Table: GUEST_FEEDBACK
-- Post-stay reviews and ratings provided by guests
CREATE TABLE GUEST_FEEDBACK (
  stay_id INT PRIMARY KEY, -- 1:1 relationship with STAY_RECORD
  rating INT NOT NULL,
  comments TEXT,
  feedback_date DATE NOT NULL,
  CONSTRAINT fk_feedback_stay FOREIGN KEY (stay_id)
    REFERENCES STAY_RECORD(stay_id) ON DELETE CASCADE,
  CONSTRAINT chk_rating_range CHECK (rating BETWEEN 1 AND 5)
);
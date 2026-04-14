import random
from datetime import date, timedelta
from faker import Faker

fake = Faker()
random.seed(42)
Faker.seed(42)

OUTPUT_FILE = "insertTables.sql"

NUM_GUESTS = 20
PRIVATE_RATIO = 0.7
MAX_STAYS_PER_GUEST = 3

LOYALTY_TIERS = [
    (1, "Silver", 0, 5.00, "Basic benefits and entry-level discount"),
    (2, "Gold", 1000, 10.00, "Priority service and medium discount"),
    (3, "Platinum", 5000, 15.00, "Premium benefits and maximum discount"),
]

GENDERS = ["Male", "Female", "Other"]
STAY_STATUSES = ["CheckedOut", "CheckedIn", "Cancelled", "Booked"]
LOYALTY_STATUSES = ["Active", "Inactive", "Suspended"]

def sql_escape(value: str) -> str:
    if value is None:
        return "NULL"
    return value.replace("'", "''")

def sql_value(value):
    if value is None:
        return "NULL"
    if isinstance(value, str):
        return f"'{sql_escape(value)}'"
    if isinstance(value, date):
        return f"'{value.isoformat()}'"
    return str(value)

def write_insert(file_obj, table_name: str, columns: list[str], rows: list[tuple]):
    if not rows:
        return

    file_obj.write(f"-- Insert data into {table_name}\n")
    file_obj.write(f"INSERT INTO {table_name} (\n    " + ", ".join(columns) + "\n)\n")
    file_obj.write("OVERRIDING SYSTEM VALUE\nVALUES\n")

    value_lines = []
    for row in rows:
        formatted_values = ", ".join(sql_value(v) for v in row)
        value_lines.append(f"({formatted_values})")
    
    file_obj.write(",\n".join(value_lines))
    file_obj.write(";\n\n")

def generate_loyalty_tiers():
    return LOYALTY_TIERS

def generate_guests(num_guests: int):
    guests = []
    private_guests = []
    corporate_guests = []

    for guest_id in range(1, num_guests + 1):
        guest_type = "private" if random.random() < PRIVATE_RATIO else "corporate"
        phone = fake.phone_number()[:20]
        email = fake.unique.email()[:100]
        created_at = fake.date_between(start_date="-2y", end_date="today")

        guests.append((guest_id, phone, email, created_at))

        if guest_type == "private":
            first_name = fake.first_name()
            last_name = fake.last_name()
            id_number = "".join(random.choices("0123456789", k=9))
            gender = random.choice(GENDERS)
            private_guests.append((guest_id, first_name, last_name, id_number, gender))
        else:
            company_name = fake.company()[:100]
            company_reg = "".join(random.choices("0123456789", k=9))
            contact_person = fake.name()[:100]
            corporate_guests.append((guest_id, company_name, company_reg, contact_person))

    return guests, private_guests, corporate_guests

def generate_stays(guest_ids: list[int]):
    stays = []
    stay_id = 1
    for guest_id in guest_ids:
        num_stays = random.randint(1, MAX_STAYS_PER_GUEST)
        for _ in range(num_stays):
            check_in = fake.date_between(start_date="-1y", end_date="today")
            status = random.choices(STAY_STATUSES, weights=[0.6, 0.2, 0.1, 0.1], k=1)[0]
            
            if status in ["Cancelled", "Booked"]:
                check_out = check_in + timedelta(days=random.randint(1, 5))
            else:
                nights = random.randint(1, 7)
                check_out = check_in + timedelta(days=nights)

            stays.append((stay_id, check_in, check_out, status, guest_id))
            stay_id += 1
    return stays

def generate_feedback(stays: list[tuple]):
    feedback = []
    for stay in stays:
        stay_id, check_in, check_out, status, guest_id = stay
        if status == "CheckedOut" and random.random() < 0.65:
            rating = random.randint(3, 5)
            comments = random.choice([
                "Very satisfied with the service",
                "Room was clean and comfortable",
                "Great stay, would return again",
                "Breakfast was good, staff was helpful",
                "Overall positive experience",
            ])
            feedback_date = check_out if check_out else date.today()
            feedback.append((stay_id, rating, comments, feedback_date))
    return feedback

def generate_guest_loyalty(guest_ids: list[int]):
    guest_loyalty = []
    used_membership_numbers = set()
    for guest_id in guest_ids:
        if random.random() < 0.6:
            tier_id = random.choice([1, 2, 3])
            points_balance = {1: random.randint(0, 999), 2: random.randint(1000, 4999), 3: random.randint(5000, 12000)}[tier_id]
            membership_number = "".join(random.choices("0123456789", k=8))
            while membership_number in used_membership_numbers:
                membership_number = "".join(random.choices("0123456789", k=8))
            used_membership_numbers.add(membership_number)
            status = random.choices(LOYALTY_STATUSES, weights=[0.8, 0.1, 0.1], k=1)[0]
            guest_loyalty.append((guest_id, membership_number, points_balance, status, tier_id))
    return guest_loyalty

def main():
    tiers = generate_loyalty_tiers()
    guests, private_guests, corporate_guests = generate_guests(NUM_GUESTS)
    guest_ids = [g[0] for g in guests]
    stays = generate_stays(guest_ids)
    feedback = generate_feedback(stays)
    loyalty = generate_guest_loyalty(guest_ids)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("-- Auto-generated insert data for Hotel Guest Management module\n\n")

        write_insert(f, "LOYALTY_TIER", ["tier_id", "tier_name", "points_required", "discount_percentage", "benefits_description"], tiers)
        write_insert(f, "GUEST", ["guest_id", "phone", "email", "created_at"], guests)
        write_insert(f, "PRIVATE_GUEST", ["guest_id", "first_name", "last_name", "id_or_passport_number", "gender"], private_guests)
        write_insert(f, "CORPORATE_GUEST", ["guest_id", "company_name", "company_registration_number", "contact_person_name"], corporate_guests)
        write_insert(f, "GUEST_LOYALTY", ["guest_id", "membership_number", "points_balance", "status", "tier_id"], loyalty)
        write_insert(f, "STAY_RECORD", ["stay_id", "check_in_date", "check_out_date", "stay_status", "guest_id"], stays)
        write_insert(f, "GUEST_FEEDBACK", ["stay_id", "rating", "comments", "feedback_date"], feedback)

    print(f"Done. Created {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
import csv
import random
from datetime import date, datetime, timedelta
from pathlib import Path

# -----------------------------
# Config
# -----------------------------
BASE_DIR = Path(file).resolve().parent.parent
MOCKAROO_DIR = BASE_DIR / "mockarooFiles"
OUTPUT_FILE = BASE_DIR / "Programing" / "generated_stays_payments_feedback.sql"

GUESTS_FILE = MOCKAROO_DIR / "GUEST_MOCK_DATA.csv"

TARGET_STAYS = 200000
TARGET_PAYMENTS = 200000
TARGET_FEEDBACK = 200000

random.seed(42)

STAY_STATUSES = ["Booked", "CheckedIn", "CheckedOut", "Cancelled"]
PAYMENT_METHODS = ["Credit Card", "Cash", "Bank Transfer"]
PAYMENT_STATUSES = ["Pending", "Completed", "Failed", "Refunded"]

FEEDBACK_COMMENTS = [
    "Excellent stay, very clean room and kind staff.",
    "Good service and quick check-in.",
    "Pleasant stay and tasty breakfast.",
    "Everything was organized and comfortable.",
    "Nice hotel and convenient location.",
    "Clean room and professional team.",
    "Very smooth experience from arrival to checkout.",
    "Business stay was efficient and quiet.",
    "Excellent overall hospitality.",
    "Good value for money.",
    "Would definitely come back again.",
    "Friendly staff and easy checkout.",
    "Corporate booking handled very well.",
    "Team stay went smoothly.",
    "Professional and efficient service."
]

# -----------------------------
# Helpers
# -----------------------------
def sql_escape(value: str) -> str:
    return value.replace("'", "''")


def sql_str(value):
    if value is None:
        return "NULL"
    return f"'{sql_escape(str(value))}'"


def read_csv(path: Path):
    with open(path, newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def write_insert_block(file_obj, table_name: str, columns: list[str], rows: list[tuple], overriding=False):
    if not rows:
        return

    file_obj.write(f"-- Insert into {table_name}\n")
    file_obj.write(f"INSERT INTO {table_name} ({', '.join(columns)}) ")

    if overriding:
        file_obj.write("OVERRIDING SYSTEM VALUE ")

    file_obj.write("\nVALUES\n")

    values_sql = []
    for row in rows:
        values_sql.append("(" + ", ".join(row) + ")")

    file_obj.write(",\n".join(values_sql))
    file_obj.write(";\n\n")


# -----------------------------
# Load base guest IDs
# -----------------------------
def load_guest_ids():
    guests = read_csv(GUESTS_FILE)
    guest_ids = [int(row["guest_id"]) for row in guests]
    return guest_ids


# -----------------------------
# Generate STAY_RECORD
# -----------------------------
def generate_stays(guest_ids: list[int], target_count: int):
    stays = []
    stay_id = 1

    start_date = date(2024, 1, 1)
    end_date = date(2026, 12, 31)
    total_days = (end_date - start_date).days

    while len(stays) < target_count:
        guest_id = random.choice(guest_ids)

        check_in = start_date + timedelta(days=random.randint(0, total_days))
        nights = random.randint(1, 7)
        check_out = check_in + timedelta(days=nights)

        status = random.choices(
            STAY_STATUSES,
            weights=[20, 10, 60, 10],  # Booked, CheckedIn, CheckedOut, Cancelled
            k=1
        )[0]

        stays.append((
            str(stay_id),
            sql_str(check_in.isoformat()),
            sql_str(check_out.isoformat()),
            sql_str(status),
            str(guest_id),
        ))

        stay_id += 1

    return stays


# -----------------------------
# Generate PAYMENT
# -----------------------------
def generate_payments(stays: list[tuple], target_count: int):
    payments = []
    payment_id = 1

    selected_stays = stays[:target_count]

    for stay in selected_stays:
        stay_id = int(stay[0])
        check_in_date = stay[1].strip("'")
        stay_status = stay[3].strip("'")

        payment_date = datetime.strptime(check_in_date, "%Y-%m-%d") + timedelta(
            hours=random.randint(8, 18),
            minutes=random.randint(0, 59)
        )

        method = random.choice(PAYMENT_METHODS)
        if stay_status == "Cancelled":
            pay_status = "Refunded"
            amount = round(random.uniform(50.00, 400.00), 2)
        elif stay_status == "Booked":
            pay_status = "Pending"
            amount = round(random.uniform(150.00, 600.00), 2)
        elif stay_status == "CheckedIn":
            pay_status = "Pending"
            amount = round(random.uniform(300.00, 1500.00), 2)
        else:
            pay_status = "Completed"
            amount = round(random.uniform(300.00, 2500.00), 2)

        payments.append((
            str(payment_id),
            sql_str(payment_date.strftime("%Y-%m-%d %H:%M:%S")),
            str(amount),
            sql_str(method),
            sql_str(pay_status),
            str(stay_id),
        ))

        payment_id += 1

    return payments


# -----------------------------
# Generate GUEST_FEEDBACK
# -----------------------------
def generate_feedback(stays: list[tuple], target_count: int):
    """
    In your schema:
    GUEST_FEEDBACK(stay_id PRIMARY KEY, ...)
    So only one feedback per stay is allowed.
    To reach 200000 feedback rows, we generate feedback for 200000 different stays.
    """
    feedback = []

    eligible_stays = [
        stay for stay in stays
        if stay[3].strip("'") in ["CheckedOut", "CheckedIn", "Booked", "Cancelled"]
    ]

    selected_stays = eligible_stays[:target_count]

    for stay in selected_stays:
        stay_id = int(stay[0])
        check_out_date = datetime.strptime(stay[2].strip("'"), "%Y-%m-%d").date()

        if stay[3].strip("'") == "Cancelled":
            rating = random.randint(1, 3)
        elif stay[3].strip("'") == "Booked":
            rating = random.randint(3, 4)
        else:
            rating = random.randint(3, 5)

        comments = random.choice(FEEDBACK_COMMENTS)
        feedback_date = check_out_date

        feedback.append((
            str(stay_id),
            str(rating),
            sql_str(comments),
            sql_str(feedback_date.isoformat()),
        ))

    return feedback


# -----------------------------
# Main
# -----------------------------
def main():
    guest_ids = load_guest_ids()

    stays = generate_stays(guest_ids, TARGET_STAYS)
    payments = generate_payments(stays, TARGET_PAYMENTS)
    feedback = generate_feedback(stays, TARGET_FEEDBACK)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("-- ======================================\n")
        f.write("-- AUTO GENERATED DATA BASED ON MOCKAROO\n")
        f.write("-- Tables: STAY_RECORD, PAYMENT, GUEST_FEEDBACK\n")
        f.write("-- ======================================\n\n")

        write_insert_block(
            f,
            "STAY_RECORD",
            ["stay_id", "check_in_date", "check_out_date", "stay_status", "guest_id"],
            stays,
            overriding=True
        )

        write_insert_block(
            f,
            "PAYMENT",
            ["payment_id", "payment_date", "amount", "payment_method", "payment_status", "stay_id"],
            payments,
            overriding=True
        )

        write_insert_block(
            f,
            "GUEST_FEEDBACK",
            ["stay_id", "rating", "comments", "feedback_date"],
            feedback,
            overriding=False
        )

    print("Done.")
    print(f"Created file: {OUTPUT_FILE}")
    print(f"STAY_RECORD rows: {len(stays)}")
    print(f"PAYMENT rows: {len(payments)}")
    print(f"GUEST_FEEDBACK rows: {len(feedback)}")


if name == "main":
    main()
import csv
import random
import os
from datetime import date, datetime, timedelta
from pathlib import Path

# -----------------------------
# Config
# -----------------------------
# מגדיר את נתיב הבסיס כתיקייה שבה נמצא הסקריפט (scripts) ואז עולה רמה אחת למעלה
BASE_DIR = Path(__file__).resolve().parent.parent
MOCKAROO_DIR = BASE_DIR / "mockarooFiles"
OUTPUT_DIR = BASE_DIR / "Programing"

# יצירת תיקיית היעד אם היא לא קיימת
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_FILE = OUTPUT_DIR / "generated_stays_feedback.sql"

GUESTS_FILE = MOCKAROO_DIR / "GUEST_MOCK_DATA.csv"

# הגדרה ל-20,000 רשומות כפי שביקשתן
TARGET_STAYS = 20000
TARGET_FEEDBACK = 20000

random.seed(42)

STAY_STATUSES = ["Booked", "CheckedIn", "CheckedOut", "Cancelled"]

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
    if not path.exists():
        print(f"Error: File {path} not found.")
        return []
    with open(path, newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))

def write_insert_block(file_obj, table_name: str, columns: list[str], rows: list[tuple], overriding=False):
    if not rows:
        return

    file_obj.write(f"-- Insert into {table_name}\n")
    # שימוש ב-OVERRIDING SYSTEM VALUE עבור עמודות IDENTITY ב-PostgreSQL
    if overriding:
        file_obj.write(f"INSERT INTO {table_name} ({', '.join(columns)}) OVERRIDING SYSTEM VALUE VALUES\n")
    else:
        file_obj.write(f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES\n")

    values_sql = []
    for row in rows:
        values_sql.append("(" + ", ".join(row) + ")")

    # כתיבה בבלוקים כדי לא להעמיס על ה-SQL (כל 1000 שורות פסיק ונקודה-פסיק)
    for i in range(0, len(values_sql), 1000):
        chunk = values_sql[i:i+1000]
        if i > 0:
             if overriding:
                file_obj.write(f"INSERT INTO {table_name} ({', '.join(columns)}) OVERRIDING SYSTEM VALUE VALUES\n")
             else:
                file_obj.write(f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES\n")
        file_obj.write(",\n".join(chunk))
        file_obj.write(";\n\n")

# -----------------------------
# logic
# -----------------------------
def load_guest_ids():
    guests = read_csv(GUESTS_FILE)
    if not guests:
        return []
    return [int(row["guest_id"]) for row in guests]

def generate_stays(guest_ids: list[int], target_count: int):
    stays = []
    start_date = date(2024, 1, 1)
    end_date = date(2026, 12, 31)
    total_days = (end_date - start_date).days

    for stay_id in range(1, target_count + 1):
        guest_id = random.choice(guest_ids)
        check_in = start_date + timedelta(days=random.randint(0, total_days))
        nights = random.randint(1, 14)
        check_out = check_in + timedelta(days=nights)
        
        status = random.choices(
            STAY_STATUSES,
            weights=[20, 10, 60, 10], 
            k=1
        )[0]

        stays.append((
            str(stay_id),
            sql_str(check_in.isoformat()),
            sql_str(check_out.isoformat()),
            sql_str(status),
            str(guest_id),
        ))
    return stays

def generate_feedback(stays: list[tuple], target_count: int):
    feedback = []
    # לוקחים את ה-stays ומייצרים עבורם פידבק (1 ל-1 לפי ה-PK)
    selected_stays = stays[:target_count]

    for stay in selected_stays:
        stay_id = stay[0]
        check_out_date = stay[2] # כבר כולל גרשיים מה-sql_str
        status = stay[3].strip("'")

        if status == "Cancelled":
            rating = random.randint(1, 2)
        elif status == "CheckedOut":
            rating = random.randint(4, 5)
        else:
            rating = random.randint(3, 5)

        comment = random.choice(FEEDBACK_COMMENTS)
        
        feedback.append((
            str(stay_id),
            str(rating),
            sql_str(comment),
            check_out_date, # תאריך הפידבק הוא תאריך הצ'ק אאוט
        ))
    return feedback

def main():
    guest_ids = load_guest_ids()
    if not guest_ids:
        print("No guests found. Check your CSV path.")
        return

    print(f"Generating {TARGET_STAYS} stays and feedback...")
    stays = generate_stays(guest_ids, TARGET_STAYS)
    feedback = generate_feedback(stays, TARGET_FEEDBACK)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("-- AUTO GENERATED DATA\n\n")

        write_insert_block(
            f, "STAY_RECORD", 
            ["stay_id", "check_in_date", "check_out_date", "stay_status", "guest_id"], 
            stays, overriding=True
        )

        write_insert_block(
            f, "GUEST_FEEDBACK", 
            ["stay_id", "rating", "comments", "feedback_date"], 
            feedback, overriding=False
        )

    print(f"Success! File created at: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
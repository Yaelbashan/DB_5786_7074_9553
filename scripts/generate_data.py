import csv
import random
from datetime import date, timedelta
from pathlib import Path

# -----------------------------
# Configuration
# -----------------------------
# Setting up the base directory and relevant subfolders
BASE_DIR = Path(__file__).resolve().parent.parent
MOCKAROO_DIR = BASE_DIR / "mockarooFiles"
OUTPUT_DIR = BASE_DIR / "Programming"

# Ensure the output directory exists
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

GUESTS_FILE = MOCKAROO_DIR / "GUEST_MOCK_DATA.csv"

# Generation targets
TARGET_STAYS = 20000
TARGET_FEEDBACK = 20000

# ID starting points (as requested: stays > 75)
STAY_START_ID = 76

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

def sql_escape(value: str) -> str:
    """Escapes single quotes for SQL safety."""
    return value.replace("'", "''")

def sql_str(value):
    """Formats values as SQL strings or NULL."""
    if value is None: return "NULL"
    return f"'{sql_escape(str(value))}'"

def write_insert_block(file_path, table_name, columns, rows, overriding=False):
    """Writes data to a SQL file in chunks of 1000 rows for optimized insertion."""
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(f"-- Auto-generated data for {table_name}\n\n")
        for i in range(0, len(rows), 1000):
            chunk = rows[i:i+1000]
            col_str = ", ".join(columns)
            # OVERRIDING SYSTEM VALUE is required for identity columns in PostgreSQL when providing manual IDs
            over_str = "OVERRIDING SYSTEM VALUE " if overriding else ""
            
            f.write(f"INSERT INTO {table_name} ({col_str}) {over_str}VALUES\n")
            
            values_list = []
            for r in chunk:
                values_list.append("(" + ", ".join(r) + ")")
            
            f.write(",\n".join(values_list) + ";\n\n")

def main():
    # Load existing guest IDs from the Mockaroo CSV file
    if not GUESTS_FILE.exists():
        print(f"Error: {GUESTS_FILE} not found. Please check your file structure.")
        return
    
    with open(GUESTS_FILE, newline='', encoding='utf-8-sig') as f:
        guest_ids = [int(row['guest_id']) for row in csv.DictReader(f)]

    # 1. Generate STAY_RECORD data
    stays = []
    start_date = date(2024, 1, 1)
    
    print(f"Generating {TARGET_STAYS} stay records...")
    for i in range(TARGET_STAYS):
        stay_id = STAY_START_ID + i
        g_id = random.choice(guest_ids)
        
        # Randomize stay dates within a 3-year window
        check_in = start_date + timedelta(days=random.randint(0, 1000))
        check_out = check_in + timedelta(days=random.randint(1, 14))
        
        # Weighted statuses: more 'CheckedOut' for realistic feedback data
        status = random.choices(STAY_STATUSES, weights=[20, 10, 60, 10])[0]
        
        stays.append((
            str(stay_id), 
            sql_str(check_in), 
            sql_str(check_out), 
            sql_str(status), 
            str(g_id)
        ))

    # 2. Generate GUEST_FEEDBACK data (Based on the newly generated stays)
    feedback = []
    print(f"Generating {TARGET_FEEDBACK} feedback records...")
    for s in stays:
        s_id = s[0] # stay_id is the first element in the tuple
        
        # Assign higher ratings to successful check-outs
        if s[3] == "'CheckedOut'":
            rating = random.randint(4, 5)
        else:
            rating = random.randint(1, 4)
            
        feedback.append((
            str(s_id), 
            str(rating), 
            sql_str(random.choice(FEEDBACK_COMMENTS)), 
            s[2] # Use check_out_date as feedback_date
        ))

    # Write output to two separate SQL files
    write_insert_block(
        OUTPUT_DIR / "insert_stays.sql", 
        "STAY_RECORD", 
        ["stay_id", "check_in_date", "check_out_date", "stay_status", "guest_id"], 
        stays, 
        overriding=True
    )
    
    write_insert_block(
        OUTPUT_DIR / "insert_feedback.sql", 
        "GUEST_FEEDBACK", 
        ["stay_id", "rating", "comments", "feedback_date"], 
        feedback, 
        overriding=False
    )

    print(f"\nSuccess! Files created in: {OUTPUT_DIR}")
    print(f"1. insert_stays.sql (Starting ID: {STAY_START_ID})")
    print(f"2. insert_feedback.sql (Linked to Stay IDs)")

if __name__ == '__main__':
    main()
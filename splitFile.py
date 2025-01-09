import pandas as pd

# File path to the CSV
file_path = "Hospital.csv"  # Path to your CSV file

# Try reading the CSV with 'ISO-8859-1' encoding
try:
    df = pd.read_csv(file_path, encoding='ISO-8859-1')  # Specify the encoding to handle special characters
except UnicodeDecodeError:
    print("Error reading the file with 'ISO-8859-1' encoding. Try another encoding.")
    exit(1)

# Ensure the 'Specializations' column is present
if 'Specializations' not in df.columns:
    print("Column 'Specializations' not found in the CSV.")
else:
    # Extract the 'Specializations' column
    specializations_column = df['Specializations']

    # Find unique entries
    unique_entries = set()

    for cell in specializations_column.dropna():  # Drop NaN values
        # Split by comma, strip whitespace, and add to the set
        unique_entries.update([entry.strip() for entry in cell.split(",")])

    # Convert the set to a sorted list (optional)
    unique_entries = sorted(unique_entries)

    # Write the unique entries to a .txt file with comma-separated values
    with open("unique_specializations.txt", "w", encoding='utf-8') as file:
        file.write(", ".join(unique_entries))  # Join list items with a comma and space

    print("Unique Specializations have been saved to 'unique_specializations.txt'.")

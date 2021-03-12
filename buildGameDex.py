import csv
import json

# This code is copied 99% verbatim from https://www.geeksforgeeks.org/convert-csv-to-json-using-python/ in an article by user: khushali_verma

# Function to convert a CSV to JSON
# Takes the file paths as arguments

# just change the file name for a different input/output


def make_json(csvFilePath="./src/assets/pokemon.csv", jsonFilePath="./src/assets/XDex.json"):

    # create a dictionary
    data = {}

    # Open a csv reader called DictReader
    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)

        # Convert each row into a dictionary
        # and add it to data
        for rows in csvReader:

            # Assuming a column named 'No' to
            # be the primary key
            # Change the key to identifier for a namedex or id for an iddex
            key = rows['id']
            data[key] = rows['identifier']

    # Open a json writer, and use the json.dumps()
    # function to dump data
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))

# Driver Code


# Call the make_json function
make_json()

# a simple program to calculate how many are tables needed based on guest count
# the program will ask for total guest count, show how many tables are needed (min and max), 
# show leftover seats if not divisible, and output options are clearly grouped
# the program will also show a mixture of round and rectangle tables
import math

# Define table types
round_tables = [
    {"name": '30" Round', "seatsMin": 2, "seatsMax": 3},
    {"name": '48" Round', "seatsMin": 6, "seatsMax": 8},
    {"name": '60" Round', "seatsMin": 8, "seatsMax": 10},
    {"name": '72" Round', "seatsMin": 10, "seatsMax": 12},
]

rectangle_tables = [
    {"name": "6' Rectangle", "seatsMin": 6, "seatsMax": 6},
    {"name": "8' Rectangle", "seatsMin": 8, "seatsMax": 10},
]

# Pure min/max table suggestion for each type
def calculate_table_options(guest_count):
    results = []

    for shape, tables in [("round", round_tables), ("rectangle", rectangle_tables)]:
        for table in tables:
            min_tables = math.ceil(guest_count / table["seatsMax"])
            max_tables = math.ceil(guest_count / table["seatsMin"])

            results.append({
                "shape": shape,
                "type": table["name"],
                "min_tables": min_tables,
                "max_tables": max_tables,
                "seats_min": table["seatsMin"],
                "seats_max": table["seatsMax"]
            })

    return results

# 🔄 Round + Rectangle combinations that meet the guest count
def mixed_table_combinations(guest_count):
    combinations = []

    for rtype in round_tables:
        for rectype in rectangle_tables:
            max_r = guest_count // rtype["seatsMin"] + 1
            max_rect = guest_count // rectype["seatsMin"] + 1

            for r_count in range(0, max_r + 1):
                for rect_count in range(0, max_rect + 1):
                    min_capacity = (r_count * rtype["seatsMin"]) + (rect_count * rectype["seatsMin"])
                    max_capacity = (r_count * rtype["seatsMax"]) + (rect_count * rectype["seatsMax"])

                    if min_capacity <= guest_count <= max_capacity:
                        combinations.append({
                            "round": {"type": rtype["name"], "count": r_count},
                            "rectangle": {"type": rectype["name"], "count": rect_count},
                            "total_tables": r_count + rect_count,
                            "min_seats": min_capacity,
                            "max_seats": max_capacity,
                            "surplus_min": min_capacity - guest_count,
                            "surplus_max": max_capacity - guest_count
                        })

    combinations.sort(key=lambda x: x["total_tables"])
    return combinations[:20]

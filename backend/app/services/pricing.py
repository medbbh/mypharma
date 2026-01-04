MARGIN_RULES = [
    {"min": 0, "max": 100, "percent": 0},
    {"min": 100, "max": 300, "percent": 0.15},
    {"min": 300, "max": None, "percent": 0.10},
]

def get_margin(prix_achat):
    for rule in MARGIN_RULES:
        if rule["max"] is None or rule["min"] <= prix_achat < rule["max"]:
            return rule["percent"]
    return 0

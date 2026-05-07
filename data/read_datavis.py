import json

with open("datavis.json","r") as fp:
    data=json.load(fp)
    print(data[0]['full_text'])

for item in data:
    item.pop("full_text", None)  # None prevents KeyError if key doesn't exist

# Optional: save the modified data back
with open("datavis.json", "w") as fp:
    json.dump(data, fp)    

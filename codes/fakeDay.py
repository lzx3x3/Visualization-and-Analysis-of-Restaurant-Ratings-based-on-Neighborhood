import csv
from datetime import datetime

csvFile = open("review_100.csv", "r")
reader = csv.reader(csvFile)

result = {}
for item in reader:
    rows = [row for row in reader]
result = {}
# result
# row[i][1] --> id for restaurant
# row[i][9]  --> review date
# print(len(rows))
print(rows[1][6].split(" ")[0])
for i in range(0, len(rows)):
    # row[i]
    result[rows[i][1]] = {}

for key in result:
    result[key] = {}
    result[key]["dateData"] = []
    result[key]["dateNum"] = []
    result[key]["fakeDate"] = []
    result[key]["friends"] = []
    result[key]["reviews"] = []
    result[key]["photos"] = []
    result[key]["area_AL"] = []
    result[key]["elite"] = []
    result[key]["rating"] = []
    for i in range(0, len(rows)):
        if rows[i][1] == key:
            # y = datetime.strptime(text, '%Y-%m-%d')
            # friends = rows[1][5].split(" ")[0]
            # result[key]["friends"].append(friends)
            # reviews = rows[1][6].split(" ")[0]

            date = datetime.strptime(rows[i][8], '%m/%d/%Y')

            result[key]["dateData"].append(date)
        result[key]["dateData"].sort()

# num the date
for key in result:
    # result[key]["dateData"]
    position = 0
    for i in range(1, len(result[key]["dateData"])):
        if result[key]["dateData"][i-1] != result[key]["dateData"][i]:
            count = i - position
            position = i
            result[key]["dateNum"].append(count)
        if i == len(result[key]["dateData"])-1:
            result[key]["dateNum"].append(i-position+1)

# detect fake day
for key in result:
    sum = 0
    for i in range(0, len(result[key]["dateNum"])):
        if(result[key]["dateNum"][i] >= sum/7):
            result[key]["fakeDate"].append(result[key]["dateData"][sum].strftime('%m/%d/%Y'))
            sum = sum + result[key]["dateNum"][i]

# write fakedate.csv
datarows = []
# print(result)
for key in result:
    for date in result[key]["fakeDate"]:
        array = [key, date]
        datarows.append(array)

# row[i][1] --> id for restaurant
# row[i][9]  --> review date

print(datarows)
with open("fakedate.csv","w", newline="") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerows(datarows)

import json
import logging
import re
from collections import defaultdict
from os import listdir

spritePath = input(
    "Absolute path of your CustomBattlers folder (ex.  D:\Downloads\infinitefusion_4.9.1_full\Graphics\CustomBattlers)")


def goodName(s: str):
    good = re.compile("\d{1,3}.\d{1,3}.png")
    return re.match(good, s)


goodFiles = [f for f in listdir(spritePath) if goodName(f)]

jsonWriter = open('src/assets/FusionListing.json', "w+")
fusionDex = defaultdict(lambda: defaultdict(list))
badReading = False
line_num = 0
curHead = ""
curBody = ""

for file in goodFiles:
    line = file.split('.')
    try:
        if(not line[1].isdecimal()):
            print()
            print("Skipping bad format: %s " % (file))
            continue
    except:
        print("Invalid line: %s " % (file))
        continue
    try:
        curHead = line[0]
        curBody = line[1]
    except Exception as e:
        logger = logging.getLogger()
        logger.warning("Couldn't parse line %d:\n\t\"%s\"", line_num, file)
        badReading = True
        continue
    fusionDex[curHead]["headFusions"].append(curBody)
    fusionDex[curBody]["bodyFusions"].append(curHead)
json.dump(fusionDex, jsonWriter, indent=4)
jsonWriter.close()
badReadString = ("Some listings were unable to be written,\n"
                 "see the above output for more information\n"
                 "\t(This is not necessarily an issue)")
if(badReading):
    print(badReadString)

# while(True):
#     # output schema:
#     # {
#     # "1": {
#     # "headFusions": [
#     #     "1",
#     #     "10",
#     #     "100",
#     #     "101",
#     #     "11", ...
#     #     ],
#     # "bodyFusions": [
#     #     "1",
#     #     "10",
#     #     "100",
#     #     "101", ...
#     #     ]
#     # },
#     # ...
#     # }
#     if(curLine == ''):
#         break
#     line_num = line_num + 1
#     curLine = reader.readline()
#     # have to strip to eat newline chars
#     line = (curLine.strip()).split('.')
#     try:
#         if(not line[1].isdecimal()):
#             print()
#             print("Skipping bad format: %s " % (curLine))
#             continue
#     except:
#         print("Invalid line: %s " % (curLine))
#         continue
#     try:
#         curHead = line[0]
#         curBody = line[1]
#     except Exception as e:
#         logger = logging.getLogger()
#         logger.warning("Couldn't parse line %d:\n\t\"%s\"", line_num, curLine)
#         badReading = True
#         continue
#     fusionDex[curHead]["headFusions"].append(curBody)
#     fusionDex[curBody]["bodyFusions"].append(curHead)
# json.dump(fusionDex, jsonWriter, indent=4)
# reader.close()
# jsonWriter.close()

# # fusionDexJSON = json.dumps(fusionDex)

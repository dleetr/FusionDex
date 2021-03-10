import json
from collections import defaultdict

reader = open('listing.txt', "r+")
jsonWriter = open('listing.json', "w+")
fusionDex = defaultdict(lambda: defaultdict(list))
try:
    pokeHead = 0
    pokeBody = 1
#    fusionDexDict[line[0]] = fusionStack
    while(True):
        # TODO: transform the dict into a dict of lists whose
        # 1st element is the head fusions &
        # 2nd element the body fusions
        #   ex. "1":[[1,3,10],[1,2,9]]
        # Each evolution chain represented as an object whose id is their pokeID
        #   Represent each evolution as part of an array whose prop name is "fusions"
        curLine = reader.readline()
        # have to strip to eat newline chars
        line = (curLine.strip()).split('.')
        if(curLine == ''):
            break
        curHead = line[0]
        curBody = line[1]
        fusionDex[curHead]["headFusions"].append(curBody)
        fusionDex[curBody]["bodyFusions"].append(curHead)
finally:
    # fusionDexJSON = json.dumps(fusionDex)
    json.dump(fusionDex, jsonWriter, indent=4)
    reader.close()
    jsonWriter.close()

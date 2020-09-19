import json
import argparse
import sys

parser = argparse.ArgumentParser()
parser.add_argument('-n','--neighborhood',help="input neighborhood json file path")
parser.add_argument('-r','--restaurants',help='input restaurants json file path')
parser.add_argument('-no','--neighborhoodOutput',help="output neighborhood json file path")
parser.add_argument('-ro','--restaurantsOutput',help='output restaurants json file path')

args = parser.parse_args()

with open(args.restaurants,'r') as f:
    restaurant_data = json.loads(f.read())
    # read restaurants' data
    restaurants_coords = {}
    for key in restaurant_data.keys():
        lat = restaurant_data[key]["coordinates"]["latitude"]
        lng = restaurant_data[key]["coordinates"]["longitude"]
        if lat is not None and lng is not None:
            if key not in restaurants_coords.keys():
                restaurants_coords[key]={}
                restaurants_coords[key]["lat"] = lat
                restaurants_coords[key]["lng"] = lng

print(len(restaurants_coords.keys()))

with open(args.neighborhood, 'r') as c:
    cities_data = json.loads(c.read())
    coordsData_lat = []
    coordsData_lng = []
    for j in range(len(cities_data["features"])):
        coords_lat = []
        coords_lng = []
        if cities_data["features"][j]["geometry"]["type"] == "Polygon":
            for i in range(len(cities_data["features"][j]["geometry"]["coordinates"][0])):
                lat = cities_data["features"][j]["geometry"]["coordinates"][0][i][1]
                lng = cities_data["features"][j]["geometry"]["coordinates"][0][i][0]
                coords_lat.append(lat)
                coords_lng.append(lng)
        elif cities_data["features"][j]["geometry"]["type"] == "MultiPolygon":
            multipoly = len(cities_data["features"][j]["geometry"]["coordinates"])
            for m in range(multipoly):
                for i in range(len(cities_data["features"][j]["geometry"]["coordinates"][m])):
                    lat = cities_data["features"][j]["geometry"]["coordinates"][m][i][1]
                    lng = cities_data["features"][j]["geometry"]["coordinates"][m][i][0]
                    coords_lat.append(lat)
                    coords_lng.append(lng)
        coordsData_lat.append(coords_lat)
        coordsData_lng.append(coords_lng)


def pnpoly(pointx,pointy,vertx,verty):
  intersection=0
  n = len(vertx) # the number of vertex
  for i in range(n):
    j = i - 1
    if isinstance(verty[i], float) and isinstance(pointx, float):
      if ( (verty[i] <= pointy) and (verty[j] > pointy) ) or ( (verty[i] > pointy) and (verty[j] <= pointy)):
        a = (pointy-verty[j])/(verty[i]-verty[j])
        if (pointx < vertx[j] + a * (vertx[i]-vertx[j]) ):# point.x < intersection.x
          intersection += 1
    else:
        print(type(pointx))
        print(pointx)
        print(type(pointy))
        print(pointy)
        print(type(verty[i]))
        print(verty[i])
        print(vertx[i])
        sys.exit("not float!")

  if (intersection % 2 == 0):
    return 0 # out
  else:
    return 1 # in
   
# output restaurant dictionary
# because only a subset will be output
# we need a new dictionary to store it
restaurant_neighborhood = {}
count = 0
for key in restaurants_coords.keys():
    # print(key)
    pointx = restaurants_coords[key]["lat"]
    pointy = restaurants_coords[key]["lng"]
    neighborhood_collect = []
    for i in range(len(coordsData_lat)):
        vertx = coordsData_lat[i]
        verty = coordsData_lng[i]
        result = pnpoly(pointx,pointy,vertx,verty)
        if result == 1:
            nbh_name = cities_data["features"][i]["properties"]["NEIGHBORHO"]
            neighborhood_collect.append([nbh_name,i])
    if len(neighborhood_collect) == 1:
        restaurant_neighborhood[key] = restaurant_data[key]
        restaurant_neighborhood[key]["classified_neighborhood"] = neighborhood_collect[0][0]
        # count how many restaurants we get totally after filtering by PNPoly
        count += 1

        # edit original neighborhood data
        index = neighborhood_collect[0][1]
        if "restaurant_count" not in cities_data["features"][index]["properties"].keys():
            cities_data["features"][index]["properties"]["restaurant_count"] = 1
            cities_data["features"][index]["properties"]["total_rating"] = restaurant_neighborhood[key]["average_rating"]
            cities_data["features"][index]["properties"]["restaurant_categories"] = {}
            category = restaurant_neighborhood[key]["type"]
            cities_data["features"][index]["properties"]["restaurant_categories"][category] = 1
        else:
            cities_data["features"][index]["properties"]["restaurant_count"] += 1
            cities_data["features"][index]["properties"]["total_rating"] += restaurant_neighborhood[key]["average_rating"]
            category = restaurant_neighborhood[key]["type"]
            if category not in cities_data["features"][index]["properties"]["restaurant_categories"].keys():
                cities_data["features"][index]["properties"]["restaurant_categories"][category] = 1
            else:
                cities_data["features"][index]["properties"]["restaurant_categories"][category] += 1

    elif len(neighborhood_collect) > 1:
        print(key)
        print("Error: multiple neighborhoods")
    # elif len(neighborhood_collect) == 0:
    #      print(str(key)+" out")


print(count)

# output restaurant data with new neighborhood label
with open(args.restaurantsOutput, 'w') as json_file:
   json.dump(restaurant_neighborhood, json_file, indent=4)


for index in range(len(cities_data["features"])):
    if "restaurant_count" in cities_data["features"][index]["properties"].keys():
        # the restaurant number in the index-th neighborhood
        total_count = cities_data["features"][index]["properties"]["restaurant_count"]
        # the total "average_rating" of all restaurants in the index-th neighborhood
        total_rating = cities_data["features"][index]["properties"]["total_rating"]
        # the average rating of all restaurants
        average_rating = round(total_rating/total_count, 2)
        cities_data["features"][index]["properties"]["restaurant_average_rating"] = average_rating
        # get the top restaurant catogory
        restaurant_top_category = []
        category_dict = cities_data["features"][index]["properties"]["restaurant_categories"]
        top_value = sorted(category_dict.items(), key=lambda x:x[1], reverse=True)[0][1]
        # maybe multiple categories get the same count
        for cat, value in category_dict.items():
            if value == top_value:
                restaurant_top_category.append(cat)
        cities_data["features"][index]["properties"]["restaurant_top_category"] = restaurant_top_category

# output new neighborhood data with new attributes
with open(args.neighborhoodOutput, 'w') as json_file:
   json.dump(cities_data, json_file, indent=4)



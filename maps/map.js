var map;
var neighbor = cities;


// var label = document.querySelector('#label');
function animate(obj, target, callback) {
  clearInterval(obj.timer);
  obj.timer = setInterval(function () {
    var step = (target - obj.offsetWidth) / 3
    step = step > 0 ? Math.ceil(step) : Math.floor(step);
    if (obj.offsetWidth == target) {
      clearInterval(obj.timer);
      callback();
    }
    obj.style.width = obj.offsetWidth + step + "px";
  }, 15)
}

function initMap() {
  var label = document.querySelector('#label');
  map = new google.maps.Map(document.getElementById('map'), {
    // 33.753746, -84.386330
    center: { lat: 33.753746, lng: -84.386330 },
    // maptype
    mapTypeId: 'roadmap',
    //initial size of the map
    zoom: 11
  });

  // set neighbor
  for (var j = 0; j < neighbor["features"].length; j++) {
    var coords = []

    for (var i = 0; i < neighbor["features"][j]["geometry"]["coordinates"][0].length; i++) {
      var coord = {};
      coord["lat"] = neighbor["features"][j]["geometry"]["coordinates"][0][i][1];
      coord["lng"] = neighbor["features"][j]["geometry"]["coordinates"][0][i][0];
      coords.push(coord);
    }

    // Construct the polygon.
    var neighborPolys = new Array();
    neighborPolys[j] = new google.maps.Polygon({
      paths: coords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#0080FF',
      fillOpacity: 0,
      status: 0,
      name: neighbor["features"][j]["properties"]["NEIGHBORHO"],
      count: neighbor["features"][j]["properties"]["restaurant_count"],
      rating: neighbor["features"][j]["properties"]["restaurant_average_rating"],
      top: neighbor["features"][j]["properties"]["restaurant_top_category"]
    });

    neighborPolys[j].setMap(map);
    neighborPolys[j].addListener('click', function (event) {
      if (this.status == 0) {  
        this.setOptions({ fillOpacity: 0.3 });
        this.setOptions({ status: 1 });
        var neighborName = this["name"];
        var count = this["count"];
        if(count == undefined){
          count = "Null";
        }
        var rating = this["rating"];
        if(rating == undefined){
          rating = "Null";
        }
        var top = "";
        if (this["top"] == undefined) {
          top = "Null";
        } else {
          for (var i = 0; i < this["top"].length; i++) {
            top = top + " " + this["top"][i];
          }
        }
        var setText = function () {
          var title = "<div class=\"title\">" + neighborName + "</div>";
          var restaurantNum = "<div> <strong> Restaurant Numbers: </strong>" + count + "</div>";
          var averageRatings = "<div> <strong> Averaged Ratings: </strong>" + rating + "</div>";
          var topText = "<div> <strong> Top Categories: </strong>" + top + "</div>";
          var Info = "<div class=\"info\">" + restaurantNum + averageRatings + topText + "</div>";
          label.innerHTML = title + Info;
        }
        animate(label, 250, setText)
      } else {
        this.setOptions({ fillOpacity: 0 });
        this.setOptions({ status: 0 });
        label.innerHTML = "";
        animate(label, 0, function () { })
      }
    })
  }
  var markers = [];
  drawMarkers(restaurants);

  //subplot
  ratingSlider.on('onchange', function (val) {
    selectRating = val;
    var filterDataR = filterData();
    updateBar(filterDataR);
    var dataset = filterRestaurantData();
    clearMarkers();
    drawMarkers(dataset);
    rects.on("click", function (d, i) {
      if (d.flag == 0) {
        selectType.push(d.type);
        d3.select(this).style("fill", "red");
        d.flag = 1;
        var filterDataR = filterData();
        var dataset = filterRestaurantData();
        clearMarkers();
        drawMarkers(dataset);
      } else {
        d3.select(this).style("fill", "blue");
        var index = selectType.indexOf(d.type);
        selectType.splice(index, 1);
        d.flag = 0;
        var filterDataR = filterData();
        var dataset = filterRestaurantData();
        clearMarkers();
        drawMarkers(dataset);
      }
    })
      .transition()
  })

  buttons.on("click", function (d, i) {
    if (d.buttonFlag == 0) {
      d3.select(this).style("fill", "yellow");
      d.buttonFlag = 1;
      var filterDataR = filterData();
      // console.log(filterDataR);
      updateBar(filterDataR);
      var dataset = filterRestaurantData();
      clearMarkers();
      drawMarkers(dataset);
      rects.on("click", function (d, i) {
        if (d.flag == 0) {
          selectType.push(d.type);
          d3.select(this).style("fill", "red");
          d.flag = 1;
          var filterDataR = filterData();
          var dataset = filterRestaurantData();
          clearMarkers();
          drawMarkers(dataset);
        } else {
          d3.select(this).style("fill", "blue");
          var index = selectType.indexOf(d.type);
          selectType.splice(index, 1);
          d.flag = 0;
          var filterDataR = filterData();
          var dataset = filterRestaurantData();
          clearMarkers();
          drawMarkers(dataset);
        }
      })
        .transition()

    } else {
      d3.select(this).style("fill", "white");
      d.buttonFlag = 0;
      var filterDataR = filterData();
      // console.log(filterDataR);
      updateBar(filterDataR);
      var dataset = filterRestaurantData();
      clearMarkers();
      drawMarkers(dataset);
      rects.on("click", function (d, i) {
        if (d.flag == 0) {
          selectType.push(d.type);
          d3.select(this).style("fill", "red");
          d.flag = 1;
          var filterDataR = filterData();
          var dataset = filterRestaurantData();
          clearMarkers();
          drawMarkers(dataset);
        } else {
          d3.select(this).style("fill", "blue");
          var index = selectType.indexOf(d.type);
          selectType.splice(index, 1);
          d.flag = 0;
          var filterDataR = filterData();
          var dataset = filterRestaurantData();
          clearMarkers();
          drawMarkers(dataset);
        }
      })
        .transition()
    }
  })


  rects.on("click", function (d, i) {
    if (d.flag == 0) {
      selectType.push(d.type);
      d3.select(this).style("fill", "red");
      d.flag = 1;
      var filterDataR = filterData();
      var dataset = filterRestaurantData();
      clearMarkers();
      drawMarkers(dataset);
    } else {
      d3.select(this).style("fill", "blue");
      var index = selectType.indexOf(d.type);
      selectType.splice(index, 1);
      d.flag = 0;
      var filterDataR = filterData();
      var dataset = filterRestaurantData();
      clearMarkers();
      drawMarkers(dataset);
    }
  })
    .transition()



  // first clear all markers, then draw the marker based on selectData
  // set markers: marker color is related to price, size is related to ratings:
  function drawMarkers(selectData) {
    var markersNumber = 0;
    // add markers
    for (var key in selectData) {
      var lat = selectData[key]["coordinates"]["latitude"];
      var lng = selectData[key]["coordinates"]["longitude"];
      markerPosition = {};
      markerPosition["lat"] = lat;
      markerPosition["lng"] = lng;
      // {lat: -25.363882, lng: 131.044922}
      // average_rating "price"
      var price;
      if (selectData[key]["price"] == "null"){
        price = 1;
      }else{
        price = selectData[key]["price"].length + 1;
      }
      var rating = selectData[key]["average_rating"];
      if (price == 0) {
        price = 1;
      }
      var color;
      if (rating <= 5 && rating > 4) {
        color = "#8B0000";
      } else if (rating <= 4 && rating > 3) {
        color = "#B22222";
      } else if (rating <= 3 && rating > 2) {
        color = "#DC143C";
      } else {
        color = "#FA8072";
      }
      markers[markersNumber] = new google.maps.Marker({
        position: markerPosition,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: price,
          strokeColor: color,
        },
        star: selectData[key]["average_rating"],
        restaurantPrice: selectData[key]["price"],
        restaurantName: selectData[key]["name"],
        restaurantNeighbor: selectData[key]["neighborhood"],
        type: selectData[key]["type"],
        reviews: selectData[key]["review_count"],
        map: map
      });
      // add listener
      markersNumber++;
    }
    for (var i = 0; i < markersNumber; i++) {
      markers[i].addListener('mouseover', function (event) {
        this.setAnimation(google.maps.Animation.BOUNCE);
        var star = this["star"];
        var restaurantPrice = this["restaurantPrice"];
        var restaurantName = this["restaurantName"];
        var restaurantNeighbor = this["restaurantNeighbor"];
        var reviews = this["reviews"];
        var type = this["type"];
        var setText = function () {
          var title = "<div class=\"title\">" + restaurantName + "</div>";
          var neighborText = "<div>" + "<strong>Neighborhood: </strong>" + restaurantNeighbor + "</div>";
          var typeText = "<div>" + "<strong>Type: </strong>" + type + "</div>";
          var priceText = "<div>" + "<strong>Price: </strong>" + restaurantPrice + "</div>";
          var reviewText = "<div>" + "<strong>Reviews: </strong>" + reviews + "</div>";
          var ratingText = "<div id=\"rating\"> <strong>Rating: </strong>" + star;
          for (var starNum = 0; starNum < Math.floor(star); starNum++) {
            ratingText = ratingText + "<img src=\"./images/star.svg\">";
          }
          var residual = star - Math.floor(star);
          if (residual < 0.5) {
            ratingText = ratingText  + "</div>";
          } else {
            ratingText = ratingText + "<img src=\"./images/star.svg\" id=\"star\">" + "</div>";
          }
          // var ratingText = "<div id=\"rating\"> <img src=\"./images/star.svg\" id=\"star\"></div>";
          var Info = "<div class=\"info\">" + neighborText + typeText + reviewText + priceText + ratingText + "</div>";
          label.innerHTML = title + Info;
        }
        animate(label, 250, setText)
      });
      markers[i].addListener('mouseout', function (event) {
        this.setAnimation(null);
        label.innerHTML = "";
        animate(label, 0, function () { })
      });
    }
  }

  function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }
}



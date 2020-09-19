// restaurants
var restaurants = restaurantsData;
var categories = ["foodmarket", "bakery", "african", "asian", "breakfast", "meat",
    "cafe", "mideastern", "buffet", "bar", "fastfood", "festival", "mediterranean",
    "salad", "others", "european", "american", "mexican", "caribbean", "specificDiet"];

var rating = [0, 1, 2, 3, 4, 5];
var price = [{ "x": 20, "y": 25, "price": "$", "buttonFlag": 1 },
{ "x": 20, "y": 95, "price": "$$", "buttonFlag": 1 },
{ "x": 20, "y": 165, "price": "$$$", "buttonFlag": 1 },
{ "x": 20, "y": 235, "price": "null", "buttonFlag": 1 }];
var selectRating = [0, 5];
var selectPrice;
var barRawData = [];
var selectType = [];
var rects;

for (var key in restaurants) {
    var element = {};
    element["id"] = key;
    element["price"] = restaurants[key]["price"];
    element["type"] = restaurants[key]["type"];
    element["rating"] = restaurants[key]["average_rating"];
    barRawData.push(element);
}

// bar plot for svg
var w = 1000;
var h = 300;
var wBar = 800;
var hBar = 300;
var padding = 80;
var svg = d3.select("#subplot")
    .append("svg")
    .attr("width", w)
    .attr("height", h);


var ratingSlider = d3.sliderLeft()
    .min(d3.min(rating))
    .max(d3.max(rating))
    .width(100)
    .height(200)
    .ticks(5)
    .step(1)
    .tickFormat(d3.format(''))
    .default([0, 5])
    .fill('#2196f3')
    // .on('onchange', function (val) {
    //     selectRating = val;
    //     var filterDataR = filterData();
    //     updateBar(filterDataR);
    // })

var gRating = d3.select('#subplot')
    .append('svg')
    .attr('width', 200)
    .attr('height', 300)
    .append('g')
    .attr('transform', 'translate(80, 55)');


gRating.call(ratingSlider);

var buttons = svg.selectAll('circle')
    .data(price)
    .enter()
    .append('circle')
    .attr("cx", function (d) { return d.x })
    .attr("cy", function (d) { return d.y })
    .attr("r", 20)
    .attr("fill", "yellow")
    .attr("stroke", "#daa520")
    .attr("stroke-width", 4)
    .attr('transform', 'translate(900, 25)')
    // .on("click", function (d, i) {
    //     if (d.buttonFlag == 0) {
    //         d3.select(this).style("fill", "yellow");
    //         d.buttonFlag = 1;
    //         var filterDataR = filterData();
    //         // console.log(filterDataR);
    //         updateBar(filterDataR);
    //         console.log(filterRestaurantData());
            
    //     } else {
    //         d3.select(this).style("fill", "white");
    //         d.buttonFlag = 0;
    //         var filterDataR = filterData();
    //         // console.log(filterDataR);
    //         updateBar(filterDataR);
    //         console.log(filterRestaurantData());
    //     }
    // })

var text = svg.selectAll("text")
    .data(price)
    .enter()
    .append("text")
    .text(function (d) { return d.price })
    .attr("x", function (d) { return d.x })
    .attr("y", function (d) { return d.y })
    .attr("text-anchor", "middle")
    .attr('transform', 'translate(900, 33)')
    .attr("font-weight", "bold")
    .style("font-size", "20px")
    .attr("fill", "black")

function filterData() {
    selectPrice = [];
    for (var i = 0; i < 4; i++) {
        if (price[i]["buttonFlag"] == 1) {
            selectPrice.push(price[i]["price"])
        }
    }
    // filter data
    var filterData = []
    for (var i = 0; i < barRawData.length; i++) {
        if (barRawData[i]["rating"] <= selectRating[1] && barRawData[i]["rating"] >= selectRating[0] && selectPrice.indexOf(barRawData[i]["price"]) > -1) {
            filterData.push(barRawData[i]);
        }
    }
    return filterData;
}

plotBar(barRawData);
// plot bar chart
function plotBar(data) {
    // produce the data we need 
    var resultData = [];
    for (var i = 0; i < categories.length; i++) {
        var element = {};
        element["type"] = categories[i];
        element["count"] = 0;
        element["flag"] = 0;
        for (var j = 0; j < data.length; j++) {
            if (data[j]["type"] == element["type"]) {
                element["count"] += 1;
            }
        }
        resultData.push(element);
    }

    var xScale = d3.scaleBand()
        .domain(resultData.map(item => item.type))
        .range([padding, wBar - padding])
        .paddingInner(0.2)
        .paddingOuter(0.2);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(resultData, function (d) { return d.count; })])
        .range([hBar - padding, padding]);


    var xAxis = d3.axisBottom().scale(xScale);

    var yAxis = d3.axisLeft().scale(yScale);

    var group = svg.append("g").attr("id", "sub");

    group.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (hBar - padding) + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
    // .append("text")
    // .text("Type of Restaurants")
    // .attr('fill', 'black')
    // .attr('x', w/2)
    // .attr('y', padding/2)
    // .attr('font-size', 15);

    group.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ", 0)")
        .call(yAxis)
        .append("text")
        .attr('transform', 'rotate(-90)')
        .attr('x', -210)
        .attr('y', -50)
        .attr('font-size', 15);

    rects = group.selectAll("rect")
        .data(resultData)
        .enter().append("rect")
        .attr("width", xScale.bandwidth())
        .attr("x", function (d) { return xScale(d["type"]); })
        .attr("height", 0)
        .attr("class", "bar")
        .attr("y", hBar - padding)
        .style("fill", function(d){
            if (selectType == 0){
                return "blue";
            }
            if (selectType != 0 ){
                if(selectType.indexOf(d.type) > -1){
                  return "red";
                }else{
                    return "blue";
                }
              }
        })
        .attr("y", function (d) { return yScale(d["count"]); })
        .attr("height", function (d) {
            return hBar - padding - yScale(d["count"]);
        })
}

function updateBar(data) {
    svg.select('#sub').remove();
    plotBar(data);
}

function filterRestaurantData() {
    // selectPrice, selectRating, selectType
    var result = {};
    for (var key in restaurants) {
        var price = restaurants[key]["price"];
        var rating = restaurants[key]["average_rating"];
        var type = restaurants[key]["type"];
        // console.log(selectType);
        var typeJudge = 0;
        var priceJudge = 0;
        for (var i=0; i<selectType.length;i++){
            if(selectType[i] == type){
                typeJudge = 1;
            }
        }
        if(selectPrice.indexOf(price)>-1){
            priceJudge = 1;
        }
        if(selectType.length == 0 || selectType.length == 20){
            if(priceJudge && rating >= selectRating[0] && rating <= selectRating[1]){
                result[key] = restaurants[key];
            }
        }else{
            if(typeJudge && priceJudge && rating >= selectRating[0] && rating <= selectRating[1]){
                result[key] = restaurants[key];
                // console.log(result);
            }
        }
    }
    return result;
}
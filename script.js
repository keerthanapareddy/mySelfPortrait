// const fs = require("fs");
// const d3 = require("d3");


//fs.writeFileSync will make a different JSON file after you have sorted it
//fs = file system
//fs.readFile reads the json file in that file path


var n = 0;
var divisor = 10000000;
var distanceUnit = {units: 'kilometers'};
let sourceOrDestination = [];

function isSourceOrDestination(curTimestamp, prevTimestamp){
    return Math.abs(curTimestamp - prevTimestamp) < 15000 ;
}

function isResponsible(location){
  var hyderabadHome = turf.point([17.5000, 78.3856]);
  var hyderabadWork = turf.point([17.4253153, 78.44239189999996]);
  var newyorkHome = turf.point([40.727233, -74.034524]);
  var cincyHome1 = turf.point([39.134548, -84.510592]);
  var cincyHome2 = turf.point([43.881638, -85.797401]);

  var distanceCincyHome1 = turf.distance(cincyHome1, turf.point(location), distanceUnit);
  var distanceCincyHome2 = turf.distance(cincyHome2, turf.point(location), distanceUnit);
  var distancenewyorkHome = turf.distance(newyorkHome, turf.point(location), distanceUnit);
  var distanceHydHome = turf.distance(hyderabadHome, turf.point(location), distanceUnit);
   // console.log(distanceCincyHome1);

   //mess around with these thresholds and see
  if(distanceCincyHome1 < 3 || distanceCincyHome2 < 6|| distancenewyorkHome < 3 || distanceHydHome < 3 ){ //if distance b/w my home coordinates and the array coordinates is less then 2km,
     return "responsible";
  }else{
     return "irresponsible";
  }
}

//check async
 $.getJSON('/locationHistory.json', function(data) {
  console.log(data.locations.length);

    //d3.extent accepts an array of values and returns the boundary(min and max) as an array.
    var bounds = d3.extent(data.locations, function (d){
      return d.timestampMs;
    });

    let timeThreshold = 15;

    let dataLength = data.locations.length;

    for (var i = 1; i < dataLength; i++) {
        var date = new Date(+data.locations[i].timestampMs);
        var curTimestamp = data.locations[i].timestampMs;
        var prevTimestamp = data.locations[i-1].timestampMs;

        let isSource = isSourceOrDestination(curTimestamp, prevTimestamp);
        if(isSource){
          let location = {};
          location.date = new Date(+data.locations[i].timestampMs);
          location.day = date.getDay();
          location.coordinatesArr = [];
          location.coordinatesArr[0] = data.locations[i].latitudeE7/divisor;
          location.coordinatesArr[1] = data.locations[i].longitudeE7/divisor;
          location.type = isResponsible(location.coordinatesArr);
          sourceOrDestination.push(location);
        }
    }

    console.log(sourceOrDestination);

    //Select SVG element
    var svg = d3.select('svg'),

        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

    var xScale = d3.scaleBand().range([0, width]);
        yScale = d3.scaleBand().range([height,0]).padding(1);


    var g = svg.append("g")
              .attr("transform", "translate(" + 100 + "," + 100 + ")");

    xScale.domain(sourceOrDestination.map(function(d) { return d.date.getMonth()+1+'-'+ d.date.getFullYear(); }));
    // xScale.domain([0, 10]);

    g.append("g")
      .attr("class","axis")
      .style("font", "14px times")
      .style("font-family","Quicksand")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    g.selectAll("circles")
    	.data(sourceOrDestination)
      .enter().append("circle")
      .filter(function(d) { return d.type == "irresponsible"; })
      .attr("r", 10)
      .attr("cx", function(d){return xScale(d.date.getMonth()+1+'-'+ d.date.getFullYear())+33;})
      // .attr("cx", (i) => {(width*i)/8})  //i goes through the entire data set of 770 elements
      .attr("cy", (d,i) => (Math.random()*height)-30)
      .attr("fill",function(d){
        if(d.day == "1" || d.day == "2" || d.day == "3" || d.day == "4" || d.day == "5"){
          return "#90D1B7" //green
        }else if(d.day == "0" || d.day == "6"){
          return "#E8A8C6" //pink
        }
      })
      .attr("fill-opacity", 0.7)
      .attr("font-family","openSans")
      .attr("font-size","50px");



    //date along x axis
    //time along y aixs
    //radius of the circle can be curTimestamp - prevTimestamp/something drawable


});

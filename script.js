// const fs = require("fs");
// const d3 = require("d3");


//fs.writeFileSync will make a different JSON file after you have sorted it
//fs = file system
//fs.readFile reads the json file in that file path


var n = 0;

$.getJSON('/locationHistory.json', function(data) {
  console.log(data.locations.length);

    //d3.extent accepts an array of values and returns the boundary(min and max) as an array.
    var bounds = d3.extent(data.locations, function (d){
      return d.timestampMs;
    });

    // console.log(new Date(+bounds[0]), new Date(+bounds[1]));
    var date = JSON.stringify(new Date(+bounds[0]));

    var datesWRepitition = []; //array of all the dates

    for (var i = 0; i < data.locations.length - 1; i++) {
      var readableDateTime = JSON.stringify(new Date(+data.locations[i].timestampMs));
      var readableDate = readableDateTime.slice(1,11); //gives only the first 11 characters of the stringify
                                                    //in this case it gives me just the date.
      var readableTime = readableDateTime.slice(12,20); //for future: slice it after the letter T, not characters
      datesWRepitition.push(readableDate); //array of all the stringified dates with repetition
    }

    // console.log(datesWRepitition);

//baracks code
    var uniqueDatesCount = {};
    //extract unique dates with no repition from the array of datesWRepitition
    for(var i = 0; i < datesWRepitition.length ; i++){
      uniqueDatesCount[datesWRepitition[i]] = uniqueDatesCount[datesWRepitition[i]] || 0;
      uniqueDatesCount[datesWRepitition[i]]++;
    }

    var newLocationHistory = {  //new empty object with an array of days
      days: []
    };

    Object.keys(uniqueDatesCount).map(d => {
    newLocationHistory.days.push({
      date: d   //pushing key and value pairs of dates that is mapped with uniqueDatesCount
    })
  })

  let counts = { //new empty object with an array of just counts:the no. of times google logged my location data
    count :[]
  }

  Object.values(uniqueDatesCount).map(c => {
    counts.count.push({ //pushing key and value pairs  of count
      count: c
    })
  })


for(i=0;i<newLocationHistory.days.length; i++){
  newLocationHistory.days[i].count = counts.count[i].count

  //newLocationHistory.days[i].count creates a new key "count"
  //and to each i we are assigning i of the count array
}

  console.log(newLocationHistory.days);
  var data = newLocationHistory;


  var maxCount = d3.max(data.days,function(d){return d.count;});
  var minCount = d3.min(data.days,function(d){return d.count;});


/*
  var time = d3.scaleLinear()
              .domain([2, 693])
              .range([0, 20]);

  var svg = d3.select("svg"),
      margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

  var x = d3.scaleLinear()
            .range([0, width - (margin.left + margin.right)]);

  var y = d3.scaleLinear()
          .range([height - (margin.top * 2), 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, "");

  var line = d3.line()
              .x(function(d) { return x(d.date); })
              .y(function(d) { return y(d.count); });
/*
  d3.data(data,functions(error,data){
    if (error) throw error;

      data.forEach(function(d) {
        d.date = +d.date;
        d.count = +d.count;
      });

  x.domain(d3.extent(data, function(d) { return d.date; }));


/*
  var svgContainer = d3.select("#inner").append("svg")
                      .attr("width", 1200)
                      .attr("height",300)

  var circles = svgContainer.selectAll('circle')
                            .data(data.days)
                            .enter()
                            .append("circle");

  var circleAttributes = circles
                        .attr("r",10)
                        .attr("cx",function (d) { return d.days.count; })
                        .attr("cy", 500);

                        // .style("fill", #000000);
*/

  // d3.select('#inner')
  //   .selectAll('circle')
  //   .data(data.days)
  //   .enter()
  //   .append('circle')
  //   .attr('r', 5)
  //   .attr('cx', function(d) {
  //     return time(d);
  //     })
  //   // .attr('cx',5)
  //   .attr('cy', 10);



});




//are they sorted in any order?
//sort as an integer and not a string

//find the location that has occured max number of times.
//this location is your home(A) or office(B)

//if you have travelled to a location other than A and B, draw a line

//also find how many locations for each day..

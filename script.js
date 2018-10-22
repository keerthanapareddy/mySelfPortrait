// const fs = require("fs");
// const d3 = require("d3");


//fs.writeFileSync will make a different JSON file after you have sorted it
//fs = file system
//fs.readFile reads the json file in that file path


var n = 0;
var divisor = 10000000;
var distanceUnit = {units: 'kilometers'};

$.getJSON('/locationHistory.json', function(data) {
  console.log(data.locations.length);

    //d3.extent accepts an array of values and returns the boundary(min and max) as an array.
    var bounds = d3.extent(data.locations, function (d){
      return d.timestampMs;
    });

    // console.log(new Date(+bounds[0]), new Date(+bounds[1]));
    var date = JSON.stringify(new Date(+bounds[0]));

    var datesWRepitition = []; //array of all the dates

    var coordinates = [];


    for (var i = 0; i < data.locations.length; i++) {
        var readableDateTime = JSON.stringify(new Date(+data.locations[i].timestampMs));
        var readableDate = readableDateTime.slice(1,11); //gives only the first 11 characters of the stringify
                                                      //in this case it gives me just the date.
        var readableTime = readableDateTime.slice(12,20); //for future: slice it after the letter T, not characters
        datesWRepitition.push(readableDate); //array of all the stringified dates with repetition

        var coordinatesArr = [];
        var latitudeConverted = data.locations[i].latitudeE7/divisor;
        var longitudeConverted = data.locations[i].longitudeE7/divisor;
        // console.log(latitudeConverted, longitudeConverted);
        coordinatesArr[0] = latitudeConverted;
        coordinatesArr[1] = longitudeConverted;
        coordinates.push(coordinatesArr);
    }

      var mapsHistory ={
        history:[]
      };

    datesWRepitition.map(d => {
      mapsHistory.history.push({
        date : d
      })
    })


    for(i = 0;i < mapsHistory.history.length; i++){
      mapsHistory.history[i].coordinates = coordinates[i];
    }

    console.log(mapsHistory.history);

    var hyderabadHome = turf.point([17.5000, 78.3856]);
    var cincyHome1 = turf.point([39.134548, -84.510592]);
    var cincyHome2 = turf.point([43.881638, -85.797401]);

    for(i = 0;i < mapsHistory.history.length; i++){
      var datesSliced = mapsHistory.history[i].date.slice(0,7);
      if( datesSliced == '2018-08' || datesSliced == '2018-07'){
        var count = 0;
        var distanceCincyHome1 = turf.distance(cincyHome2, turf.point(mapsHistory.history[i].coordinates), distanceUnit);
        // console.log(distanceCincyHome1);
        if(distanceCincyHome1 < 2){ //if distance b/w my home coordinates and the array coordinates is less then 2km,
          mapsHistory.history.splice(i,1); // remove those from the array
        }
      }
    }

      console.log(mapsHistory.history);


    //if the key exists add 1 to the value otherwise create the key and set it to 0
    var uniqueDatesCount = {};
    //extract unique dates with no repitition from the array of datesWRepitition
    for(var i = 0; i < datesWRepitition.length ; i++){
      if (uniqueDatesCount.hasOwnProperty([datesWRepitition[i]])){
        // console.log(uniqueDatesCount[datesWRepitition[i]])
        uniqueDatesCount[datesWRepitition[i]]++
      }else{
        uniqueDatesCount[datesWRepitition[i]] = 0;
      }
    }



//creating new object to push clean data
    var newLocationHistory = {  //new empty object with an array of days
      locationData: []
    };

    Object.keys(uniqueDatesCount).map(d => {
    newLocationHistory.locationData.push({
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

for(i=0;i<newLocationHistory.locationData.length; i++){
  newLocationHistory.locationData[i].count = counts.count[i].count;
  //newLocationHistory.days[i].count creates a new key "count"
  //and to each i we are assigning i of the count array
}


  console.log(newLocationHistory);


  // var divisor = 10000000; lat and log divide by divisor/
  // make lat and long into a pair. array inside an array. coordinates
  //Date.prototype.getDay() to get the day
  //eliminate same location: turf.distance if less than threshold, consider same locationHistory
  //for every same location, count and draw one circle
  //date object js find 0-6 weekdays, use this for color.






});

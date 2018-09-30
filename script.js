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
    // var date = JSON.stringify(new Date(+bounds[0]));
    // console.log("stringified date");
    // console.log(date.slice(0,11));

      //////GROUP SAME DATES
      var results = [];

      for (var i = 0; i < data.locations.length - 1; i++) {
          var dateStringified = JSON.stringify(new Date(+data.locations[i].timestampMs));
          var dateOnly = dateStringified.slice(0,11); //gives only the first 11 characters of the stringify
                                                    //in this case it gives me just the date.

          // console.log(dateOnly);
      }



// console.log(results);

/*
    for(let i = 0; i < data.locations.length; i++){
      //have i
      //compare it to i+n
      //start with n = 0;
      //n++
      var dateI = JSON.stringify(new Date(+data.locations[i].timestampMs));
      var dateIN = JSON.stringify(new Date(+data.locations[i + n].timestampMs));
      console.log(dateIN);

      if(dateI == dateIN){
        console.log("Same Dates");
        console.log(dateI);

        // console.log(+data.locations[i].timestampMs);

      }
      n++;
      console.log(n);

    }

*/




    //keep a track of same locations in that day. for eg: if multiple timestamps have the same location coordinates, consider it as one location



    var time = d3.scaleTime().domain();
});




//are they sorted in any order?
//sort as an integer and not a string

//find the location that has occured max number of times.
//this location is your home(A) or office(B)

//if you have travelled to a location other than A and B, draw a line

//also find how many locations for each day..

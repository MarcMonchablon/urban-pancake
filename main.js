// === Config
var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];


// === Main stuff

function main() {
  console.log('Main stuff !');

  d3.csv("commits.csv", function parseDatum(d) {
    var datum = { month: d.month };
    DAYS.forEach(day => datum[day] = parseInt(d[day]));
    return datum;
  }).then(function(data) {
    console.log('data: ', data);
  });
};


// === Init

main();

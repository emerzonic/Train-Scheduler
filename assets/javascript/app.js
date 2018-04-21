
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBtaaLITySicGxoa6MnDWPfu_QQHknDO1U",
    authDomain: "train-scheduler-5a98c.firebaseapp.com",
    databaseURL: "https://train-scheduler-5a98c.firebaseio.com",
    projectId: "train-scheduler-5a98c",
    storageBucket: "",
    messagingSenderId: "888490728078"
  };

  firebase.initializeApp(config);

var database = firebase.database();
var myref = database.ref('trans');

//global veriables to hold input data
var trainName;
var destination;
var frequency;
var time;
var nextArrival;
var minutesAway;

//to retrieve data from the data base, the change value, the getData function retrieve
//and display data in the table. If error the error function displays error
 myref.on("value", getData, error); 


// Whenever a user submits new train info
$("#submit").on("click", function(event) {
    event.preventDefault();
    //retrieve the value from the input fields
    trainName = $("#input_trainName").val().trim();
    destination = $("#input_destination").val().trim();
    time = $("#input_time").val().trim();
    frequency = $("#input_freq").val().trim();

    //create an object to hold the data
    var data =  {
        TrainName: trainName,
        Destination: destination,
        Frequency:frequency,
        NextArrival:time,
  };
    //push the data into the database
    myref.push(data);
  });
  
//this function retrieve and display the data from the database
function getData(data){
    //empty the table each time there is an update
    $('tbody').empty();
    var trans = data.val();
    var keys = Object.keys(trans);
    // keys.forEach(function() {  });
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        //create a table row and save it in a list variable
        var list = '<tr>' +
                    '<td id="table_trainName">'+ trans[k].TrainName +'</td>' +
                        '<td id="table_destination">'+ trans[k].Destination  +'</td>' + 
                        '<td id="table_freq">'+ trans[k].Frequency  +'</td>' +
                        '<td id="table_time">'+ trans[k].NextArrival  +'</td>' +
                        //  '<td id="table_minutesAway">'+ trains[key].TrainName  +'</td>' +
                    '</tr>';
        //prepend the list to the table today
        $('tbody').prepend(list);     
    }  
}

//handle any error
function error(errorObject){
    console.log("The read failed: " + errorObject.code); 
}
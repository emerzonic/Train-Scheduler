// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBtaaLITySicGxoa6MnDWPfu_QQHknDO1U",
    authDomain: "train-scheduler-5a98c.firebaseapp.com",
    databaseURL: "https://train-scheduler-5a98c.firebaseio.com",
    projectId: "train-scheduler-5a98c",
    storageBucket: "train-scheduler-5a98c.appspot.com",
    messagingSenderId: "888490728078"
  };

  firebase.initializeApp(config);

var database = firebase.database();
var trainsDatabase = database.ref('trains');

//global veriables to hold input data
var trainName;
var destination;
var frequency;
var firstTime;

retrieveData();

//to retrieve data from the data base, the change value, the getData function retrieve
function retrieveData(){
trainsDatabase.on("value", getData, error); 
}

// click listener to add train
$('#submit').on('click', function(event) {
    event.preventDefault();
    //retrieve the value from the input fields
    trainName = $("#input_trainName").val().trim();
    destination = $("#input_destination").val().trim();
    firstTime = $("#input_time").val().trim();
    frequency = $("#input_freq").val().trim();

    $( '.alert' ).addClass('alert-success').text( 'Train was successfully added!' ).show().fadeOut( 7000, function(){
        $('.alert').removeClass('alert-success').text('');
    });
    //create an object to hold the data
    var data =  {
        TrainName: trainName,
        Destination: destination,
        Frequency:frequency,
        firstTime:firstTime,
    };
    //push the data into the database
    trainsDatabase.push(data);

    //clear input fields and focus train name input field
    $("input").val('');
    $("#input_trainName").focus();
    return false;
  });
  
//this function retrieve and display the data from the database
function getData(data){
    $('tbody').empty();
    var trains = data.val();
    var keys = Object.keys(trains);
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
    var firstTimeConverted = moment(trains[k].firstTime, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    $('#time').text('Current Time ' + currentTime.format('LT'));
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % trains[k].Frequency;
    minutesAway = trains[k].Frequency - tRemainder;
    nextArrival = moment().add(minutesAway, "minutes");
    var tableRow = `<tr data-key="${k}"> 
                        <td>${trains[k].TrainName}</td>
                        <td>${trains[k].Destination}</td>
                        <td>${trains[k].Frequency}</td>
                        <td>${nextArrival.format("LT")}</td>
                        <td>${minutesAway}</td>
                        </tr>`;
        $('tbody').prepend(tableRow);     
    }  
}

//handle any error
function error(errorObject){
    console.log("The read failed: " + errorObject.code); 
}

//toggle text content on add train form   
$('#toggle').click(function () {
    var btn = $(this);
    if ($(btn).text() == "Add Train") {
        $(btn).text("Close Form");
    } else {
        $(btn).text("Add Train");
    }
});

setInterval(retrieveData,60000);

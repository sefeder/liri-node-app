//all global variables are defined and all node require functions are run here
require("dotenv").config();
var keys = require('./keys.js');
var request = require('request');
var fs = require('fs');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter')
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var tweetList = '';
var input1 = process.argv[2];
var input2 = process.argv[3];
//this function creates the response seen in the console and in log.txt for spotify requests
function spotifyResults() {
    console.log("\nHere is your song information!\n--------------------------------\n\nArtist(s): "+Data.tracks.items[0].artists[0].name+"\nSong: "+Data.tracks.items[0].name+"\nPreview Link: "+ Data.tracks.items[0].preview_url+"\nAlbum: " + Data.tracks.items[0].album.name);
    fs.appendFile("log.txt", "\nYou Searched: "+input1+" "+input2+"\n\nHere is your song information!\n--------------------------------\n\nArtist(s): "+Data.tracks.items[0].artists[0].name+"\nSong: "+Data.tracks.items[0].name+"\nPreview Link: "+ Data.tracks.items[0].preview_url+"\nAlbum: " + Data.tracks.items[0].album.name+"\n------------------------------------------------------------------------------", function(err) {

        if(err) {
            console.log(err)
        } else {

        console.log("Data successfully added to log!");
        }
    })
}
//this function creates the response seen in the console and in log.txt for movie requests
function movieResults() {
    console.log("\nHere is your movie information!\n--------------------------------\n\nTitle: \"" + bodyObject.Title + "\"\nReleased: " + bodyObject.Year+ "\nIMDB Rating: " + bodyObject.Ratings[0].Value+ "\nRotten Tomatoes Rating: " + bodyObject.Ratings[1].Value + "\nCountry or countries produced in: " + bodyObject.Country + "\nLanguage(s) of the movie: " + bodyObject.Language + "\nPlot: " + bodyObject.Plot + "\nActors: " + bodyObject.Actors);
    fs.appendFile("log.txt", "\nYou Searched: "+input1+" "+input2+"\n\nHere is your movie information!\n--------------------------------\n\nTitle: \"" + bodyObject.Title + "\"\nReleased: " + bodyObject.Year+ "\nIMDB Rating: " + bodyObject.Ratings[0].Value+ "\nRotten Tomatoes Rating: " + bodyObject.Ratings[1].Value + "\nCountry or countries produced in: " + bodyObject.Country + "\nLanguage(s) of the movie: " + bodyObject.Language + "\nPlot: " + bodyObject.Plot + "\nActors: " + bodyObject.Actors+"\n------------------------------------------------------------------------------", function(err) {

        if(err) {
            console.log(err)
        } else {

        console.log("Data successfully added to log!");
        }
    })
}
//this function creates the response seen in the console and in log.txt for twitter requests
function twitterDisplay() {
    var params = {screen_name: 'sethbackend'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i=0; i<20; i++) {
                tweetList += "\n"+(i+1)+") Tweet: "+tweets[i].text+"\nDate Created: "+tweets[i].created_at+"\n";
            }
            console.log("\nHere are your 20 most recent Tweets!\n------------------------------------\n"+tweetList);
            fs.appendFile("log.txt", "\nYou Searched: "+input1+" "+input2+"\n\nHere are your 20 most recent Tweets!\n------------------------------------\n"+tweetList+"\n------------------------------------------------------------------------------", function(err) {

                if(err) {
                    console.log(err)
                } else {
        
                console.log("Data successfully added to log!");
                }
            })
        }
    });
}
//this function makes a songless spotify request
function spotifyEmptyDisplay(){
    spotify.search({ type: 'track', query: "The Sign Ace of Base" }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        Data=data;
        spotifyResults();
    });
}
//this function makes a regular spotify request
function spotifyDisplay(){
    spotify.search({ type: 'track', query: ""+input2+"" }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        Data=data;
        spotifyResults();
      });
}
//this function makes a movie-titleless movie request
function movieEmptyDisplay(){
    var queryUrl = "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy";
    // console.log(queryUrl);
    request(queryUrl, function (error, response, body){
        if (!error && response.statusCode === 200) {
            bodyObject=JSON.parse(body)
           movieResults();
        }
    })
}
//this function makes a regular movie request
function movieDisplay(){
    var queryUrl = "http://www.omdbapi.com/?t=" + input2 + "&y=&plot=short&apikey=trilogy";
    // console.log(queryUrl);
        request(queryUrl, function (error, response, body){
            if (!error && response.statusCode === 200) {
                bodyObject=JSON.parse(body)
               movieResults();
            }
        })
}

//below is the logic that makes liri return the correct thing depending on which command the user enters

//logic for my-tweets command
if (input1 === 'my-tweets') {
   twitterDisplay();
  
//logic for spotify-this-song command   
} else if (input1 === 'spotify-this-song') {
    if (input2 === undefined){
        spotifyEmptyDisplay();
    } else {
        spotifyDisplay();
    }
//logic for movie-this command
} else if (input1 === 'movie-this') {
    if (input2 === undefined) {
        movieEmptyDisplay();
    } else {
        var movieWordsArr = process.argv
        var movieTitle = '';
        for (var i = 3; i < movieWordsArr.length; i++) {
            movieTitle += "" + movieWordsArr[i] + "+"; 
        }
        input2=movieTitle
        movieDisplay();
    }    
//logic for do-what-it-says command
} else if (input1 === 'do-what-it-says') {
    fs.readFile('random.txt', 'utf8', function(err, data){
        if (err) {
            console.log(err);
        } else {
        // console.log(data);
        var argvArr = data.split(",")
        input1 = argvArr[0]
        input2 = argvArr[1] 
        }
        if (input1 === 'my-tweets') {
            console.log("\nrandom.text told me to search your tweets")
            twitterDisplay();
        } else if (input1 === 'spotify-this-song') {
            console.log("\nrandom.text told me to search spotify");
            if (input2 === ''){
                spotifyEmptyDisplay();
            } else {
                spotifyDisplay();
            }
        } else if (input1 === 'movie-this'){
            console.log("\nrandom.text told me to search IMDB");
            if (input2 === '') {
                movieEmptyDisplay();
            } else {
                movieDisplay();         
            }   
        }
    })
}    

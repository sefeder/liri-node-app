require("dotenv").config();
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var Twitter = require('twitter')
var client = new Twitter(keys.twitter);
var request = require('request');
var fs = require('fs');

var input1 = process.argv[2];
var input2 = process.argv[3];

if (input1 === 'my-tweets') {
    var params = {screen_name: 'sethbackend'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
      for (var i=0; i<tweets.length; i++) {
          var tweetList = "\nTweet: "+tweets[i].text+"\nDate Created: "+tweets[i].created_at+"";
      }
    console.log(tweetList);
  }
});
    

} else if (input1 === 'spotify-this-song') {
    if (input2 === undefined){
        spotify.search({ type: 'track', query: "The Sign Ace of Base" }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
            console.log("Artist(s): "+data.tracks.items[0].artists[0].name+",\nSong: "+data.tracks.items[0].name+",\nPreview Link: "+ data.tracks.items[0].href+",\nAlbum: " + data.tracks.items[0].album.name); 
        });
    } else {
    spotify.search({ type: 'track', query: ""+input2+"" }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        console.log("Artist(s): "+data.tracks.items[0].artists[0].name+",\nSong: "+data.tracks.items[0].name+",\nPreview Link: "+ data.tracks.items[0].href+",\nAlbum: " + data.tracks.items[0].album.name); 
      });
    }

} else if (input1 === 'movie-this') {

} else if (input1 === 'do-what-it-says') {
    fs.readFile('random.txt', 'utf8', function(err, data){
        if (err) {
            console.log(err);
        }
        var argvArr = data.split(",")
        input1 = argvArr[0]
        input2 = argvArr[1] 
        // console.log(input1, input2)

        if (input1 === 'my-tweets') {
        
        } else if (input1 === 'spotify-this-song') {
            spotify.search({ type: 'track', query: ""+input2+"" }, function(err, data) {
                if (err) {
                  return console.log('Error occurred: ' + err);
                }
                console.log("Artist(s): "+data.tracks.items[0].artists[0].name+",\nSong: "+data.tracks.items[0].name+",\nPreview Link: "+ data.tracks.items[0].href+",\nAlbum: " + data.tracks.items[0].album.name); 
              });
        } else if (input1 === 'movie-this') {
        
        }
        

    })
}
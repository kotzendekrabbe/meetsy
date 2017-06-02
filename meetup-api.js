var clear       = require('clear');
var fetch = require('node-fetch');
var files = require('./lib/files');
var responseJSON;

var calDate;
var meetupEvents = {meetupEvent: []};
var dataBody;
var resJson;

var url = "https://api.meetup.com/self/calendar?key=1a2c3f15f671076496f104845543012&page=30"

// reject für catch - error fall
module.exports = new Promise(function(resolve, reject){
	fetch(url)
		.then(function(res) {
			return res.json();
		}).then(function(json) {
			for(var key in json) {

				var options = { day: 'numeric', month: 'short'};

				var date = new Date(json[key].time);
				calDate = date.toISOString();
				

				var dateEnd = new Date(json[key].time);
				dateEnd.setHours(dateEnd.getHours() + 3);
				calDateEnd = dateEnd.toISOString();


			
				var venue;

				if(json[key].venue) {
					venue = json[key].venue['name'] +
						', ' + json[key].venue['address_1'] +
						', ' + json[key].venue['city'];
				}
				else {
					venue = 'Needs a location';
				}

				meetupEvents.meetupEvent.push({ 
					"start"  : {'dateTime' : calDate},
					'end': { 'dateTime': calDateEnd },
					"summary" : json[key].name,
					"location": venue,
					"description":  json[key].link
				});
			} 

			resolve(meetupEvents);
		}).catch(function(err){
			console.log(err) ;
		});
});


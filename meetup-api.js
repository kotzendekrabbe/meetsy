var clear       = require('clear');
var request = require('request');
var files = require('./lib/files');
var responseJSON;

var calDate;
var meetupEvents = {meetupEvent: []};


function DateToFormattedString(d) { 
		d.toUTCString();       
                                 
        var yyyy = d.getFullYear().toString();                                    
		var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based         
		var dd  = d.getDate().toString();             
		var hours = d.getHours().toString();
		var minutes = d.getMinutes().toString();
		var seconds = d.getSeconds().toString();
									
		var date = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]) + 'T' + hours + ':' + (minutes[1]?minutes:"0"+minutes[0]) + ':' + (seconds[1]?seconds:"0"+seconds[0]);
		return date;

   };  


request('https://api.meetup.com/self/calendar?key=1a2c3f15f671076496f104845543012&page=30', function (error, response, body) {
	if (!error && response.statusCode == 200) {
		responseJSON = JSON.parse(response.body);

		for(var key in responseJSON) {

			var options = { day: 'numeric', month: 'short'};

			var date = new Date(responseJSON[key].time);
			calDate = date.toISOString();
			

			var dateEnd = new Date(responseJSON[key].time);
			dateEnd.setHours(dateEnd.getHours() + 3);
			calDateEnd = dateEnd.toISOString();

		
			var venue;

			if(responseJSON[key].venue) {
				venue = responseJSON[key].venue['name'] +
					', ' + responseJSON[key].venue['address_1'] +
					', ' + responseJSON[key].venue['city'];
			}
			else {
				venue = 'Needs a location';
			}

			meetupEvents.meetupEvent.push({ 
				"dateStart"  : date,
				"dateEnd"  : dateEnd,
				"title" : responseJSON[key].name,
				"location": venue,
				"link":  responseJSON[key].link
			});


/*
			console.log( date.toLocaleDateString('de-DE', options) + ': ' + responseJSON[key].group['name']);
			console.log('Time: ' + formattedTime);
			console.log('Topic: ' + responseJSON[key].name);
			console.log('Venue: ' + venue);
			console.log('date: ' + calDate);
			console.log(responseJSON[key].link);
			console.log('\n \n');*/
		}
	}
});

module.exports.meetupEvents = meetupEvents;


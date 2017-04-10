var clear       = require('clear');
var request = require('request');
var files = require('./lib/files');
var responseJSON;

clear();

request('https://api.meetup.com/self/calendar?key=1a2c3f15f671076496f104845543012&page=30', function (error, response, body) {
	if (!error && response.statusCode == 200) {
		responseJSON = JSON.parse(response.body);

		for(var key in responseJSON) {

			var options = { day: 'numeric', month: 'short'};
			var date = new Date(responseJSON[key].time);

			console.log( date.toLocaleDateString('de-DE', options) + ': ' + responseJSON[key].group['name']);

			var date = new Date(responseJSON[key].time);
			date.toUTCString();
			var hours = date.getHours();
			var minutes = "0" + date.getMinutes();
			var formattedTime = hours + ':' + minutes.substr(-2);


			console.log('Time: ' + formattedTime);
			console.log('Topic: ' + responseJSON[key].name);


			if(responseJSON[key].venue) {
				console.log('Venue: ' + responseJSON[key].venue['name'] +
					', ' +
					responseJSON[key].venue['address_1'] +
					', ' + responseJSON[key].venue['city']
					);
			}
			else {
				console.log('Needs a location');
			}

			console.log(responseJSON[key].link);
			console.log('\n \n');
		}

	}
});


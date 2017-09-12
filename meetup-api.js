var fetch = require('node-fetch');

module.exports = {
	fetchMeetups: function(meetupApiKey){
		var meetupEvents = [];
		return fetch('https://api.meetup.com/self/calendar?key='+ meetupApiKey +'&page=1')
			.then(function(res) {
				return res.json();
			})
			.then(function(json) {
				for(var key in json) {
					var venue = 'Needs a location';
					var date = new Date(json[key].time);
					var dateEnd = new Date(json[key].time);
					dateEnd.setHours(dateEnd.getHours() + 3);


					if(json[key].venue) {
						venue = json[key].venue['name'] +
						', ' + json[key].venue['address_1'] +
						', ' + json[key].venue['city'];
					}

					meetupEvents.push({
						"start"  : {'dateTime' : date.toISOString()},
						'end': { 'dateTime': dateEnd.toISOString()},
						"summary" : json[key].name,
						"location": venue,
						"description":  json[key].link
					});
				}

				return meetupEvents;
			})
			.catch(function(err){
				console.log('error: ', err);
			})
	}
};

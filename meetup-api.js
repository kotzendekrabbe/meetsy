var fetch = require('node-fetch');

module.exports = {
	fetchMeetups: function(meetupApiKey){
		var meetupEvents = [];
		return fetch('https://api.meetup.com/self/calendar?key='+ meetupApiKey +'&page=30')
			.then(function(res) {
				return res.json();
			})
			.then(function(json) {
				for(var key in json) {

					var date = new Date(json[key].time);
					var calDate = date.toISOString();

					var dateEnd = new Date(json[key].time);
					dateEnd.setHours(dateEnd.getHours() + 3);

					var calDateEnd = dateEnd.toISOString();

					var venue = 'Needs a location';

					if(json[key].venue) {
						venue = json[key].venue['name'] +
							', ' + json[key].venue['address_1'] +
							', ' + json[key].venue['city'];
					}

					meetupEvents.push({
						"start"  : {'dateTime' : calDate},
						'end': { 'dateTime': calDateEnd },
						"summary" : json[key].name,
						"location": venue,
						"description":  json[key].link
					});
				}

				return meetupEvents;
			});
	}
};

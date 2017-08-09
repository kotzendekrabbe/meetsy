var meow = require('meow');
var fetchMeetupEventData = require('./meetup-api');
var googleCalAuth = require('./google-calendar-auth');

var calID;
var googleConnect;
var meetupApiKey;

var cli = meow(`
    Usage
    $ node meetup-calendar-sync.js
 
    Options
	--meetupApiKey meetup Api url of your account
    --calID google calendar ID (sinnerschrader.com_un89alcfa2f0orh9bmnhpdosic@group.calendar.google.com)
 
    Examples
    $ foo unicorns --rainbow
    unicorns
`);


function fetchMeetupEvent(meetupApiKey){
	return fetchMeetupEventData.fetchMeetups(meetupApiKey)
		.then(function(meetupEvents){
			return meetupEvents;
		});
}

function compareEvents(meetupEvent, calEvents) {
	// Check which event already exist and which one not.

	var eventMissing = meetupEvent.filter(i => !calEvents.find(e => i.description === e.description));

	return eventMissing;
}


function main(opts) {
	calID = opts.calID;
	meetupApiKey = opts.meetupApiKey;
	googleConnect = googleCalAuth.connect(calID);

	return googleConnect;
}

main(cli.flags)
	.then(function(googleConnect){
		return fetchMeetupEvent(meetupApiKey).then(function(meetup){
			return compareEvents(meetup, googleConnect);
		});
	}).then(function(existNot){
		existNot.forEach(event => googleCalAuth.insertEvent(event));
	})
	.catch(function(err){
		console.log(err);
	});

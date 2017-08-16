#!/usr/bin/env node

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
	var eventsExistNot = meetupEvent.filter(i => !calEvents.find(e => i.description === e.description));
	return eventsExistNot;
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
			if(googleConnect.length > 0){
				return compareEvents(meetup, googleConnect);
			}
			else {
				meetup.forEach(event => googleCalAuth.insertEvent(event));
				return 0;
			}
		});
	}).then(function(existNot){
		if(existNot.length === 0){
			console.log('Everything is up to date');
		}
		else {
			existNot.forEach(event => googleCalAuth.insertEvent(event));
		}
	})
	.catch(function(err){
		console.log('Ups - something went wrong ', err);
	});

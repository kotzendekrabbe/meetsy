const meetupEvents = require('./meetup-api');


var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
	process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('googleApi_clientSecret.json', function processClientSecrets(err, content) {
	if (err) {
		console.log('Error loading google client secret file: ' + err);
		return;
	}
	// Authorize a client with the loaded credentials, then call the
	// Google Calendar API.
	//authorize(JSON.parse(content), listEvents);
	authorize(JSON.parse(content), creatEvent);


});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
	var clientSecret = credentials.installed.client_secret;
	var clientId = credentials.installed.client_id;
	var redirectUrl = credentials.installed.redirect_uris[0];
	var auth = new googleAuth();
	var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

	// Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, function(err, token) {
		if (err) {
			getNewToken(oauth2Client, callback);
		} else {
			oauth2Client.credentials = JSON.parse(token);
			callback(oauth2Client);
		}
	});
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
	var authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES
	});
	console.log('Authorize this app by visiting this url: ', authUrl);
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	rl.question('Enter the code from that page here: ', function(code) {
		rl.close();
		oauth2Client.getToken(code, function(err, token) {
			if (err) {
				console.log('Error while trying to retrieve access token', err);
				return;
			}
			oauth2Client.credentials = token;
			storeToken(token);
			callback(oauth2Client);
		});
	});
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
	try {
		fs.mkdirSync(TOKEN_DIR);
	} catch (err) {
		if (err.code != 'EEXIST') {
			throw err;
		}
	}
	fs.writeFile(TOKEN_PATH, JSON.stringify(token));
	console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
	var calendar = google.calendar('v3');
	calendar.events.list({
		auth: auth,
		calendarId: 'sinnerschrader.com_522i9j7lrlhpv0keltf0o2u2as@group.calendar.google.com',
		timeMin: (new Date()).toISOString(),
		maxResults: 30,
		singleEvents: true,
		orderBy: 'startTime'
	}, function(err, response) {
		if (err) {
			console.log('The API returned an error: ' + err);
			return;
		}
		var events = response.items;
		if (events.length == 0) {
			console.log('No upcoming events found.');
		} else {
			console.log('Upcoming 30 events:');
			for (var i = 0; i < events.length; i++) {
				var event = events[i];
				var start = event.start.dateTime || event.start.date;
				console.log('%s - %s', start, ': ', event.summary, '\n Venue:', event.location);
			}
		}
	});
}



// Refer to the Node.js quickstart on how to setup the environment:
// https://developers.google.com/google-apps/calendar/quickstart/node
// Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
// stored credentials.



function creatEvent(auth) {
	var dateStart = new Date('2017-05-27T07:00:00').toISOString();
	var dateEnd = new Date('2017-05-27T08:00:00').toISOString();
	


	var event = {
		'start': { 'dateTime': meetupEvents.meetupEvents.dateStart },
		'end': { 'dateTime': meetupEvents.meetupEvents.dateEnd },
		'location': meetupEvents.meetupEvents.location,
		'summary': meetupEvents.meetupEvents.title,
		'description': meetupEvents.meetupEvents.link
	};


	var calendar = google.calendar('v3');


	calendar.events.insert({
		auth: auth,
		calendarId: 'sinnerschrader.com_522i9j7lrlhpv0keltf0o2u2as@group.calendar.google.com',
		resource: event,
	}, function(err, response) {
		if (err) {
			console.log('The API returned an error: ' + err);
			return;
		}
		console.log('Event created: %s', event.htmlLink);
	});
}
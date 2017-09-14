var fetch = require('node-fetch');
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

var calendar = google.calendar('v3');
//var clientSecret = './googleApi_clientSecret.json';

var authGoogle;
var googleCalID;


fs.readFileAsync = function (filename) {
	return new Promise(function (resolve, reject) {
		try {
			fs.readFile(filename, function(err, buffer){
				if (err) reject(err); else resolve(buffer);
			});
		} catch (err) {
			reject(err);
		}
	});
};

var authorize = function(credentials){
	var clientSecret = credentials.installed.client_secret;
	var clientId = credentials.installed.client_id;
	var redirectUrl = credentials.installed.redirect_uris[0];
	var auth = new googleAuth();
	var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

	return fs.readFileAsync(TOKEN_PATH).then(function (token){
		oauth2Client.credentials = JSON.parse(token);
		return oauth2Client;
	}).catch(function () {
		return getNewToken(oauth2Client);
	});
};

var getNewToken =  function(oauth2Client){
	return new Promise(function (resolve, reject) {
		var authUrl = oauth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES
		});

		var readlineI = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});


		console.log('Authorize this app by visiting this url: ', authUrl);


		readlineI.question('Enter the code from that page here: ', function(code) {
			readlineI.close();
			oauth2Client.getToken(code, function(err, token) {
				if (err) {
					console.log('Error while trying to retrieve access token', err);
					return;
				}
				oauth2Client.credentials = token;
				storeToken(token);
				return oauth2Client;
			});
		});
	});
};

var storeToken = function(token) {
	try {
		fs.mkdirSync(TOKEN_DIR);
	} catch (err) {
		if (err.code != 'EXIST') {
			throw err;
		}
	}
	fs.writeFile(TOKEN_PATH, JSON.stringify(token));
};

var getEvents = function(auth, calID) {
	return new Promise(function(resolve,reject){
		calendar.events.list({
			auth: auth,
			calendarId: calID,
			timeMin: (new Date()).toISOString(),
			maxResults: 100,
			singleEvents: true,
			orderBy: 'startTime'
		}, function(err, response) {
			if(err) reject(err);
			else resolve(response.items);
		});
	});
};

function insertEvent(eventData, auth){
	calendar.events.insert({
		auth: auth,
		calendarId: googleCalID,
		resource: eventData
	}, function(err) {
		if (err) {
			console.log('The API returned an error: ' + err + ' ');
			return;
		}
		console.log('Event created: ' + eventData.start.dateTime + ' ' +  eventData.summary);
	});
}


module.exports = {
	connect: function(calID, clientSecret){
		return fs.readFileAsync(clientSecret).then(function (content){
			googleCalID = calID;
			return authorize(JSON.parse(content)).then(function(auth){
				authGoogle = auth;
				return getEvents(auth, calID);
			});

		}).catch(function (err) {
			console.log('Error loading client secret file: ' + err);
			return;
		});
	},
	insertEvent: function(eventData){
		return insertEvent(eventData, authGoogle);
	}
};

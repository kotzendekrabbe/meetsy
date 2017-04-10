var chalk       = require('chalk');
var clear       = require('clear');
var CLI         = require('clui');
var figlet      = require('figlet');
var inquirer    = require('inquirer');
var Preferences = require('preferences');
var Spinner     = CLI.Spinner;
var GitHubApi   = require('github');
var _           = require('lodash');
var git         = require('simple-git')();
var touch       = require('touch');
var fs          = require('fs');
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


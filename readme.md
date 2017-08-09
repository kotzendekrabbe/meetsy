
# depencies vers.

* what it is / what it does

Is a CLI tool which syncs your meetup events with your (google) calendar.
It could help you to have a better overview on upcoming events.
You can also sync it with a shared google calendar with other,
example:
you can create a google calendar for  your company to share meetup events with your collegues.

## At the moment it's only a MVP:
* get the next 30 meetup events
* get the next 30 google events
* compare if there are events which not exist at the moment
* insert them into the calendar



# How to use it

npm install

## Google calendar
### Google calendar settings
https://developers.google.com/google-apps/calendar/quickstart/nodejs

* follow the instructions from the link above on step 1 to get your client_secret.json
* save this datas at root project and rename it to "googleApi_clientSecret.json"

node meetupCalSync --calID 'yourGoogleCalenderID' --meetupApiKey 'yourMeetupApiKey'


## Google calendar
### Google calendar ID



## Planed features?
* event updates
* automatic mail


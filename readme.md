> Sync your Meetup events with Google Calendar

# meetsy #

Is a CLI tool which syncs your meetup events with your (google) calendar.
It could help you to have a better overview on upcoming events.
You can also sync it with a shared google calendar with other,
example: you can create a google calendar for your company to share Meetup events with your colleagues.


## At the moment it's only a MVP: ##
* get the next 30 meetup events
* get the next 100 google events
* compare events with each other, if there are events which are not existing insert these into the calendar

---------------


## Installation Instructions ##
```node
npm install
```

### Google calendar ###
https://developers.google.com/google-apps/calendar/quickstart/nodejs

* follow the instructions from the link above on step 1 to get your client_secret.json
* save this datas at root project and rename it to "googleApi_clientSecret.json"

---------------


## Usage Instructions ##

```node
node meetsy --calID 'yourGoogleCalenderID' --meetupApiKey 'yourMeetupApiKey'
```


### How to get your Google calendar ID/address ###
https://support.google.com/calendar/answer/37083#link


### How to get your meetup api key ###
https://secure.meetup.com/de-DE/meetup_api/key/





---------------


## Next features ##
[See Issues](https://github.com/kotzendekrabbe/meetup-tool/issues?q=is%3Aissue+is%3Aopen+label%3Afeature)



## Contribute ##
Feel free to dive in! Open an
[issue](https://github.com/kotzendekrabbe/meetup-tool/issues/new) or
submit a [Pull Request](https://github.com/kotzendekrabbe/meetup-tool/compare). ❤️

meetsy follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

---------------

Copyright 2017 by SinnerSchrader Deutschland GmbH and contributors.
Released under the MIT license.

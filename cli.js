#!/usr/bin/env node
import moment from "moment-timezone"
import fetch from "node-fetch"

var argv = process.argv.slice(2);

// Time zone guess
var timezone = moment.tz.guess();
console.log(timezone);
// Time zone if user input
if (process.argv.indexOf('-z') > -1) {
	timezone = argv[process.argv.indexOf('-z') - 1];
}
var latitude = 0;
var longitude = 0;

// Help command
if (process.argv.indexOf('-h') > -1) {
	  console.log("Usage: $0 [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE")
	  console.log("  -h\t\tShow this help message and exit.")
	  console.log("  -n, -s\tLatitude: N positive; S negative.")
	  console.log("  -e, -w\tLongitude: E positive; W negative.")
	  console.log("  -z\t\tTime zone: uses /etc/timezone by default.")
	  console.log("  -d 0-6\tDay to retrieve weather: 0 is today; defaults to 1.")
	  console.log("  -j\t\tEcho pretty JSON from open-meteo API and exit.")
	process.exit(0)
}
// Latitude command
if (process.argv.indexOf('-n') > -1) {
	latitude = argv[process.argv.indexOf('-n') - 1]
}
if (process.argv.indexOf('-s') > -1) {
	latitude = argv[process.argv.indexOf('-s') -1] * -1;
}
// Longitude command
if (process.argv.indexOf('-w') > -1) {
	longitude = argv[process.argv.indexOf('-w') - 1];
}
if (process.argv.indexOf('-e') > -1) {
	longitude = argv[process.argv.indexOf('-e') -1] * 1;
}
// Fetch URL
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude='+latitude+'&longitude='+longitude+'&daily=precipitation_hours&timezone='+timezone);

// Get json
const data = await response.json();

if (process.argv.indexOf('-j') > -1) {
	console.log(data);
	process.exit(0);
}

// Get days and parse precipitation info
var days = 1;

if (process.argv.indexOf('-d') > -1) {
	days = argv[process.argv.indexOf('-d') - 1];
}

if (days == 0) {
	  if (data.daily.precipitation_hours[days] == 0) {
		  console.log('You will not need your galoshes')
	  } else {
		  console.log('You might need your galoshes')
	  }
          console.log('today.')
	  process.exit(0);
} else if (days > 1) {
	  if (data.daily.precipitation_hours[days] == 0) {
		  console.log('You will not need your galoshes')
	  } else {
		  console.log('You might need your galoshes')
	  }
	  console.log("in " + days + " days.")
	  process.exit(0)
} else {
	if (data.daily.precipitation_hours[days] == 0) {
		console.log('You will not need your galoshes')
	} else {
		console.log('You might need your galoshes')
	}
	  console.log("tomorrow.")
	  process.exit(0)
}
// Error if day branch does not work.
process.exit(1);

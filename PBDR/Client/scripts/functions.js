//*************************************************************
//* This library contains all functions and global variables
//* that are referenced throughout the program.  Functions that
//* don't exist in Javascript or provide a unique purpose for 
//* applications are placed here.
//*************************************************************	

//Global Variables

function convertDateTime(dateTime, dateFormat) {
//*************************************************************
//* This function retrieve the current date formatted as per
//* requested.
//* Parms:
//*		date and time in yyyymmddhhmmss format
//		requested format for date
//* Value Returned: 
//*		Formatted date
//*************************************************************	

	var returnValue = ''
	dateTime = myTrim(dateTime);
	if (dateTime.length != 14) {
		returnValue = 'Unknown';
	}
	else {
		var year = dateTime.substring(0,4);
		var month = dateTime.substring(4,6);
		var day = dateTime.substring(6,8);
		var hours = dateTime.substring(8,10);
		var minutes = dateTime.substring(10,12);
		var returnDate = ''
		if (dateFormat.toLowerCase() == 'dd/mm/yyyy') {
			returnDate = day + '/' +month + '/' + year;
		}
		else if (dateFormat.toLowerCase() == 'yyyy-mm-dd') {
			returnDate = year + '-' + month + '-' + day;
		}
		else if (dateFormat.toLowerCase() == 'yyyymmdd') {	
			returnDate = year.toString() + month.toString() + day.toString();
		}
		else {
			returnDate = month + '/' + day + '/' + year;
		}
		var suffix = 'am';		
		if (hours > 11 ) {
			suffix = 'pm';
		}
		if (hours > 12 ) {
			hours = hours - 12;
		}
		returnValue = returnDate + ' @ ' + hours + ':' + minutes + ' ' + suffix;
	}
	return returnValue;
}

function getDate(format) {
//*************************************************************
//* This function retrieve the current date formatted as per
//* requested.
//* Parms:
//*		Format to build date
//* Value Returned: 
//*		Formatted date
//*************************************************************	

	var returnValue = ''
	var currentTime = new Date()
	var month = currentTime.getMonth() + 1
	var day = currentTime.getDate()
	var year = currentTime.getFullYear()
	if (month < 10) {
		month = '0' + month.toString();
	}	
	if (day < 10) {
		day = '0' + day.toString();
	}	
	if (format.toLowerCase() == 'dd/mm/yyyy') {
		returnvalue = day + '/' + month + '/' + year;
	}
	else if (format.toLowerCase() == 'yyyy-mm-dd') {
		returnValue = year + '-' + month + '-' + day;
	}
	else if (format.toLowerCase() == 'yyyymmdd') {	
		returnValue = year.toString() + month.toString() + day.toString();
	}
	else {
		returnValue = month + '/' + day + '/' + year;
	}
	return returnValue;
}

function getTime(format) {
//*************************************************************
//* This function retrieve the current time in a consistent format
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Formatted time
//*************************************************************	

	
	if (format == undefined) {
		format = '';
	}
	var returnValue = '';
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var seconds = currentTime.getSeconds();
	if (minutes < 10){
		minutes = '0' + minutes	
	}	
	if (seconds < 10){
		seconds = '0' + seconds	
	}	
	if (format.toLowerCase() == 'hhmmss') {
		if (hours < 10){
			hours = '0' + hours	
		}
		returnValue = hours.toString() + minutes.toString() + seconds.toString();
	}		
	else {
		var suffix = 'am';		
		if (hours > 11 ) {
			suffix = 'pm';
		}
		if (hours > 12 ) {
			hours = hours - 12;
		}
		returnValue = hours + ':' + minutes + ' ' + suffix;
	}

	return returnValue;
}

function myLTrim(value, charsToRemove) {
//*************************************************************
//* This function will remove all characters requested from 
//* the beginning of the string.
//* Parms:
//*		Value to process
//*   Characters to remove
//* Value Returned: 
//*		Value with characters removed
//*************************************************************	

	if (charsToRemove == "") {
		charsToRemove = " ";
	}
	charsToRemove = charsToRemove || "\\s";
	return value.replace(new RegExp("^[" + charsToRemove + "]+", "g"), "");
}
 
function myRTrim(value, charsToRemove) {
//*************************************************************
//* This function will remove all characters requested from 
//* the ending of the string.
//* Parms:
//*		Value to process
//*   Characters to remove
//* Value Returned: 
//*		Value with characters removed
//*************************************************************	

	if (charsToRemove == "") {
		charsToRemove = " ";
	}
	charsToRemove = charsToRemove || "\\s";
	return value.replace(new RegExp("[" + charsToRemove + "]+$", "g"), "");
}

function myTrim(value, charsToRemove) {
//*************************************************************
//* This function will remove all characters requested from 
//* the beginning and ending of the string.
//* Parms:
//*		Value to process
//*   Characters to remove
//* Value Returned: 
//*		Value with characters removed
//*************************************************************	

	if (charsToRemove == "") {
		charsToRemove = " ";
	}
	return myLTrim(myRTrim(value, charsToRemove), charsToRemove);
}
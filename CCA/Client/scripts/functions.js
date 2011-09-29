//*************************************************************
//* This library contains all functions and global variables
//* that are referenced throughout the program.  Functions that
//* don't exist in Javascript or provide a unique purpose for 
//* applications are placed here.
//*************************************************************	

//Global Variables

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
	if (format == 'DD/MM/YYYY') {
		returnvalue = day + '/' + month + '/' + year;
	}
	else if (format == 'YYYY-MM-DD') {
		returnValue = year + '-' + month + '-' + day;
	}
	else {
		returnValue = month + '/' + day + '/' + year;
	}
	return returnValue;
}

function getTime() {
//*************************************************************
//* This function retrieve the current time in a consisten format
//* Parms:
//*		None
//* Value Returned: 
//*		Formatted time
//*************************************************************	

	var returnValue = ''
	var suffix = '';
	var currentTime = new Date()
	var hours = currentTime.getHours()
	var minutes = currentTime.getMinutes()

	if (minutes < 10){
		minutes = '0' + minutes	
	}	
	suffix = 'am';
	if (hours > 11 ) {
		suffix = 'pm';
	}
	if (hours > 12 ) {
		hours = hours - 12;
	}
	returnValue = hours + ":" + minutes + ' ' + suffix;
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
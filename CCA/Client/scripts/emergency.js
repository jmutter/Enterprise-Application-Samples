//*************************************************************
//* This library contains all functions and global variables
//* that pertain to the emergency call and notificatoin request screens.
//*************************************************************	

//Global Variables
var gEmergencyAcceptURL = '';
var gEmergencyConfirmationURL = '';
var gEmergencyDeclineURL = '';
var gEmergencyRecords = new Array();
var gEmergencyRecordSelected;
var gEmergencyTypeDisplayed = '';
var gProcessingEmergencyRequest = false;

function acceptEmergencyCall() {
//*************************************************************
//* This function is executed when the user clicks the accept
//* menu item on the emergency call screen.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************	

	writeLog('User clicked EmergencyCall Accept');
	if (gBrowserType == gBrowserBlackBerry) {	
		writeLog('Creating calendar entry');
	
		var newAppt = new blackberry.pim.Appointment();
		newAppt.location = gEmergencyCallPhoneNumber;
		newAppt.summary = "Emergency call";
		newAppt.note = gEmergencyCallDetails;
		newAppt.freeBusy = blackberry.pim.Appointment.BUSY;
	
		//Create our hour time slot
		var start = new Date(parseInt(gEmergencyCallMilliseconds));
		var start = new Date();
		newAppt.start = start;
		var end = start.setHours(start.getHours() + 1);
		newAppt.end = end;
		//Not sure if we need an attendee - ourselve
	
		// Create Attendee
		//var attendees = [];
		//var onlyAttendee = new blackberry.pim.Attendee();
		//onlyAttendee.address = "john@foo.com";
		//onlyAttendee.type = blackberry.pim.Attendee.INVITED;
		//attendees.push(onlyAttendee);
		//newAppt.attendees = attendees;

		newAppt.save();
	}
	else {
		alert ('Calendar entry would have been created');
	}
	saveURL('',gEmergencyAcceptURL);
	displayEmergencyRequest('');  //See if there are any outstanding requests that have come in
}

function acceptEmergencyNotification() {
//*************************************************************
//* This function is executed when the user clicks the accept
//* menu item on the emergency call screen.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************	

	writeLog('User clicked EmergencyNotification Accept');
	saveURL('', gEmergencyAcceptURL);
	displayEmergencyRequest('');  //See if there are any outstanding requests that have come in
}

function addEmergencyMenu(type) {
//*************************************************************
//* This function will create the necessary menu items for the
//* emergency call screen.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************	

	writeLog('addEmergencyCallMenu Starting');
	if (gBrowserType == gBrowserBlackBerry || gBrowserType == gBrowserRippleBlackBerry) {		
		blackberry.ui.menu.clearMenuItems();  //Clear the menu items		
		var menuItem_topSeperator1 = new blackberry.ui.menu.MenuItem(true, 1);
		blackberry.ui.menu.addMenuItem(menuItem_topSeperator1);
		if (type == 'Call') {
			var menuItem_accept = new blackberry.ui.menu.MenuItem(false, 2,'Accept', acceptEmergencyCall);
			blackberry.ui.menu.addMenuItem(menuItem_accept);
			var menuItem_decline = new blackberry.ui.menu.MenuItem(false, 3,'Decline', declineEmergencyCall);
			blackberry.ui.menu.addMenuItem(menuItem_decline);
		}
		else {
			var menuItem_accept = new blackberry.ui.menu.MenuItem(false, 2,'Accept', acceptEmergencyNotification);
			blackberry.ui.menu.addMenuItem(menuItem_accept);			
		}
		writeLog('  menu built');		
	}
	else {
		writeLog('  invalid environment for menu');
	}
	writeLog('addEmergencyCallMenu Finished');
}

function declineEmergencyCall() {
//*************************************************************
//* This function is executed when the user clicks the decline
//* menu item on the emergency call screen.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************	

	writeLog('User clicked EmergencyCall Decline');	
	saveURL('', gEmergencyDeclineURL);
	displayEmergencyRequest('');  //See if there are any outstanding requests that have come in
}

function displayEmergencyRequest(msg) {
//*************************************************************
//* This function will display the appropriate information on 
//* the emergency call screen.
//* Parms:
//*		Success/Failure message of recursive calls
//* Value Returned: 
//*		Nothing
//*************************************************************	

	var errMsg = '';
	if (msg == '') {
		writeLog('dsplayEmergencyRequest Starting');
		gProcessingEmergencyRequest = true;  //Set value to prevent an incoming emergency request from starting display
		var	sql = 'SELECT emergencyid, type, machinename, receiveddatetime, milliseconds, phonenumber, details, accepturl, declineurl FROM ' + gTableNameEmergency;
		dbGetRecords(sql, 'emergency', 'displayEmergencyRequest');
	}
	else if (msg == 'DBGETRECORDSSUCCESS') {
		if (gEmergencyRecords.length == 0) {
			gProcessingEmergencyRequest = false;
			displayScreen(gScreenNamePrevious);
		}
		else {			
			var displayDateTime = '';
			var array = gEmergencyRecords[0].split(gDelim);
			gEmergencyRecordSelected = array[0];
			gEmergencyTypeDisplayed = array[1];		
			if (array[6] == '') {  //Details
			  array[6] = 'Missing Value';
			 }
			gEmergencyAcceptURL = array[7];
			gEmergencyDeclineURL = array[8];	
			if (array[1] == 'Call') {
				if (array[4] == '') {  //Milliseconds
					displayDateTime = 'NoDateTime';
			  }				
				if (array[5] == '') {  //Phone number
				  array[5] = 'Missing Value';
			  }
			  else {
					var milliseconds = new Date(parseInt(array[4]));					
					var day = milliseconds.getUTCDate();
					if (day.toString().length == 1) {
							day = '0' + day;
					} 
					var month = milliseconds.getUTCMonth();
					if (month.toString().length == 1) {
						month = '0' + month;
					} 					 
					var year = milliseconds.getUTCFullYear();
					var displayDate = '';
					if (gUserDateDisplay == 'YYYY-MM-DD') {	
						displayDate = year + '-' + month + '-' + day;
					}
					else if (gUserDateDisplay == 'DD/MM/YYYY') {
						displayDate = day + '/' + month + '/' + year;
					}
					else {
						displayDate = month + '/' + day + '/' + year;
					}
					var hours = milliseconds.getUTCHours();
					var timeIndicator = "am";
					if (hours > 11) {
						timeIndicator = "pm";
			  		if (hours > 12) {
						  hours = hours - 12;
						}
			 		}
			 		var minutes = milliseconds.getUTCMinutes();
			 		var seconds = milliseconds.getUTCSeconds();
			 		var displayTime = hours + ':' + minutes + ' ' + timeIndicator;
		   	  displayDateTime = displayDate + ' @ ' + displayTime;
			  }
				document.getElementById('emergencycallreceived').value = array[3];
				document.getElementById('emergencycalldatetime').value = displayDateTime;
				document.getElementById('emergencycallphonenumber').value = array[5];
				document.getElementById('emergencycalldetails').innerHTML = array[6];	
				document.getElementById(gScreenNameEmergencyCall).style.backgroundImage = "url(images/background-emergencycall.jpg)";
				document.getElementById(gScreenNameEmergencyCall).style.width = screen.availWidth + "px";
				document.getElementById(gScreenNameEmergencyCall).style.height = screen.availHeight + "px";
				document.getElementById(gScreenNameEmergencyCall).style.backgroundRepeat = "repeat";
				sql = 'DELETE FROM ' + gTableNameEmergency + ' WHERE emergencyid = \'' + array[0] + '\'';
				dbDeleteRecord(sql, 'displayEmergencyRequest');	
			}
			else {
				document.getElementById('emergencynotificationreceived').value = array[3];
				document.getElementById('emergencynotificationdetails').innerHTML = array[6];	
				document.getElementById(gScreenNameEmergencyNotification).style.backgroundImage = "url(images/background-emergencynotification.jpg)";
				document.getElementById(gScreenNameEmergencyNotification).style.width = screen.availWidth + "px";
				document.getElementById(gScreenNameEmergencyNotification).style.height = screen.availHeight + "px";
				document.getElementById(gScreenNameEmergencyNotification).style.backgroundRepeat = "repeat";
				sql = 'DELETE FROM ' + gTableNameEmergency + ' WHERE emergencyid = \'' + array[0] + '\'';
				dbDeleteRecord(sql, 'displayEmergencyRequest');	
			}
		}
	}	
	else if (msg == 'DBDELETERECORDSUCCESS') {
		writeLog('displayEmergencyRequest Finished');	
		if (gScreenDisplayed == gScreenNameEmergencyCall || gScreenDisplayed == gScreenNameEmergencyNotification) {
			displayMessage('Another Emergency request was received while you were reading the previous one.\n\nNew data is now displayed');
		}	
		else {
			if (gEmergencyTypeDisplayed == 'Call') {		
				displayScreen(gScreenNameEmergencyCall);
			}
			else {
				displayScreen(gScreenNameEmergencyNotification);
			}
		}
	}
	else if (msg.substring(0,18) == 'DBGETRECORDSERROR:') {
		errMsg = msg.substring(18);
	}
	else if (msg.substring(0,20) == 'DBDELETERECORDERROR:') {
		errMsg = msg.substring(20);
  }
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		writeLog('displayEmergencyRequest Finished - ERROR - ' + errMsg);			
	}
}

function processEmergencyPayload(msg, type) {
//*************************************************************
//* This function will process the JSON payload for an emergency
//* call and store the information in the table for retrieval.
//* This will allow for concurrent receipts of emergency information.
//* Parms:
//*		Success/Failure message of recursive calls
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	//Validate to ensure we don't have any undefined properties
	var errMsg = '';
	var abort = false;
	if (msg == '') {
		writeLog('processEmergencyPayload Starting');	
		var sql = 'INSERT INTO ' + gTableNameEmergency;
		sql += '(emergencyid,type,receiveddatetime,machinename,milliseconds,phonenumber,details,accepturl,declineurl)';
		sql += ' VALUES(null, \'' + type + '\'';	
		sql += ', \'' + getDate(gUserDateDisplay) + ' @ ' + getTime() + '\''; 					
		if (type == 'Call') {
			if (gJSONPayload.EmergencyCall[0].machinename == undefined) {
				gJSONPayload.EmergencyCall[0].machinename = '';
			}
			if (gJSONPayload.EmergencyCall[0].confirmationurl == undefined) {
				gJSONPayload.EmergencyCall[0].confirmationurl = '';
			}
			gEmergencyConfirmationURL = gJSONPayload.EmergencyCall[0].confirmationurl;
			if (gJSONPayload.EmergencyCall[0].milliseconds == undefined) {
				gJSONPayload.EmergencyCall[0].milliseconds = '';
			}	
			if (gJSONPayload.EmergencyCall[0].phonenumber == undefined) {
				gJSONPayload.EmergencyCall[0].phonenumber = '';
			}
			if (gJSONPayload.EmergencyCall[0].details == undefined) {
				gJSONPayload.EmergencyCall[0].details = '';
			}
			if (gJSONPayload.EmergencyCall[0].accepturl == undefined) {
				gJSONPayload.EmergencyCall[0].accepturl = '';
			}
			if (gJSONPayload.EmergencyCall[0].declineurl == undefined) {
				gJSONPayload.EmergencyCall[0].declineurl = '';
			}
			if (gJSONPayload.EmergencyCall[0].machinename == '') {
				abort = true;
				errMsg = 'Could not process EmergencyCall payload due to missing MachineName value';	
			}
			else {
				sql += ', \'' + fieldPrepare(gJSONPayload.EmergencyCall[0].machinename) + '\''; 		
				sql += ', \'' + gJSONPayload.EmergencyCall[0].milliseconds + '\'';  			
				sql += ', \'' + gJSONPayload.EmergencyCall[0].phonenumber + '\''; 
				sql += ', \'' + fieldPrepare(gJSONPayload.EmergencyCall[0].details) + '\''; 			
				sql += ', \'' + fieldPrepare(gJSONPayload.EmergencyCall[0].accepturl) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.EmergencyCall[0].declineurl) + '\'';																																								
				sql += ')';	
			}
		}
		else {
			if (gJSONPayload.EmergencyNotification[0].machinename == undefined) {
				gJSONPayload.EmergencyNotification[0].machinename = '';
			}
			if (gJSONPayload.EmergencyNotification[0].confirmationurl == undefined) {
				gJSONPayload.EmergencyNotification[0].confirmationurl = '';
			}
			gEmergencyConfirmationURL = gJSONPayload.EmergencyNotification[0].confirmationurl;
			if (gJSONPayload.EmergencyNotification[0].accepturl == undefined) {
				gJSONPayload.EmergencyNotification[0].accepturl = '';
			}
			if (gJSONPayload.EmergencyNotification[0].calldetails == '') {
				gJSONPayload.EmergencyNotification[0].calldetails = 'MissingValue';
			}
			if (gJSONPayload.EmergencyNotification[0].machinename == '') {
				abort = true;
				errMsg = 'Could not process EmergencyNotification payload due to missing MachineName value';	
			}
			else {
				sql += ', \'' + gJSONPayload.EmergencyNotification[0].machinename + '\''; 		
				sql += ', \'' + '\'';  			
				sql += ', \'' + '\'';  
				sql += ', \'' + fieldPrepare(gJSONPayload.EmergencyNotification[0].details) + '\''; 			
				sql += ', \'' + fieldPrepare(gJSONPayload.EmergencyNotification[0].accepturl) + '\'';
				sql += ', \'' + '\'';	
				sql += ')';	
			}
		}
		if (abort == false) {
			dbAddRecord(sql, 'processEmergencyPayload');
		}			
	}
	else if (msg == 'DBADDRECORDSUCCESS') {
		writeLog('processEmergencyPayload Finished');
		saveURL('', gEmergencyConfirmationURL);
		if (gProcessingEmergencyRequest == false) {
			displayEmergencyRequest('');
		}
	}
	else if (msg.substring(0,17) == 'DBADDRECORDERROR:') {
		errMsg = msg.substring(17);
	}	
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		var tempCode = gDebugMode;
		if (abort == true) {
			gDebugMode = true;
		}
		writeLog('processEmergencyPayload Finished - ERROR - ' + errMsg);	
		if (abort == true) {
			gDebugMode = tempCode;
		}		
	}
}
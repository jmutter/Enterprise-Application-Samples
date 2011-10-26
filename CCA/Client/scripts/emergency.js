//*************************************************************
//* This library contains all functions and global variables
//* that pertain to the emergency call and notificatoin request screens.
//*************************************************************	

//Global Variables
var gEmergencyCallAcceptURL = '';
var gEmergencyCallMilliseconds = '';
var gEmergencyCallDeclineURL = '';
var gEmergencyCallDetails = '';
var gEmergencyCallPhoneNumber = '';
var gEmergencyNotificationAcceptURL = '';

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
	saveURL('',gEmergencyCallAcceptURL);
	displayScreen(gScreenNamePrevious);
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
	saveURL('', gEmergencyNotificationAcceptURL);
	displayScreen(gScreenNamePrevious);	
}

function addMenuEmergencyCall() {
//*************************************************************
//* This function will create the necessary menu items for the
//* emergency call screen.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************	

	writeLog('addMenuEmergencyCall Starting');
	if (gBrowserType == gBrowserBlackBerry || gBrowserType == gBrowserRippleBlackBerry) {		
		blackberry.ui.menu.clearMenuItems();  //Clear the menu items		
		var menuItem_topSeperator1 = new blackberry.ui.menu.MenuItem(true, 1);
		blackberry.ui.menu.addMenuItem(menuItem_topSeperator1);
		var menuItem_accept = new blackberry.ui.menu.MenuItem(false, 2,"Accept", acceptEmergencyCall);
		blackberry.ui.menu.addMenuItem(menuItem_accept);
		var menuItem_decline = new blackberry.ui.menu.MenuItem(false, 3,"Decline", declineEmergencyCall);
		blackberry.ui.menu.addMenuItem(menuItem_decline);
		writeLog('  menu built');		
	}
	else {
		writeLog('  invalid environment for menu');
	}
	writeLog('addMenuEmergencyCall Finished');
}

function addMenuEmergencyNotification() {
//*************************************************************
//* This function will create the necessary menu items for the
//* emergency notification screen.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************	


	writeLog('addMenuEmergencyNotification Starting');
	if (gBrowserType == gBrowserBlackBerry || gBrowserType == gBrowserRippleBlackBerry) {	
		blackberry.ui.menu.clearMenuItems();  //Clear the menu items		
		var menuItem_topSeperator1 = new blackberry.ui.menu.MenuItem(true, 1);
		blackberry.ui.menu.addMenuItem(menuItem_topSeperator1);
		var menuItem_accept = new blackberry.ui.menu.MenuItem(false, 2,"Accept", acceptEmergencyNotification);
		blackberry.ui.menu.addMenuItem(menuItem_accept);
		writeLog('  menu built');		
	}
	else {
		writeLog('  invalid environment for menu');
	}
	writeLog('addMenuEmergencyNotification Finished');
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
	saveURL('', gEmergencyCallDeclineURL);
	displayScreen(gScreenNamePrevious);
}

function displayEmergencyCall(msg) {
//*************************************************************
//* This function will display the appropriate information on 
//* the emergency call screen.
//* Parms:
//*		Success/Failure message of recursive calls
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	writeLog('dsplayEmergencyCall Starting');
	//Validate to ensure we don't have any undefined properties
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
	//Assign to global variables
	gEmergencyCallMilliseconds = gJSONPayload.EmergencyCall[0].milliseconds;
	gEmergencyCallPhoneNumber = gJSONPayload.EmergencyCall[0].phonenumber;
	gEmergencyCallDetails = gJSONPayload.EmergencyCall[0].details;
	gEmergencyCallAcceptURL = gJSONPayload.EmergencyCall[0].accepturl;
	gEmergencyCallDeclineURL = gJSONPayload.EmergencyCall[0].declineurl;						
	//Validate to ensure there are values for all fields
	if (gEmergencyCallPhoneNumber == '') {
			gEmergencyCallPhoneNumber = 'MissingValue';
	}		
	if (gEmergencyCallDetails == '') {
			gEmergencyCallDetails = 'MissingValue';
	}				
	
	var displayDateTime = '';
	if (gEmergencyCallMilliseconds == '') {
		displayDateTime = 'MissingValue';		
	}
	else {		
		var milliseconds = new Date(parseInt(gEmergencyCallMilliseconds));
		var day = milliseconds.getUTCDate();
		var month = milliseconds.getUTCMonth(); 
		var year = milliseconds.getUTCFullYear();
		var displayDate = '';
		if (gUserDateDisplay == 'mMM/DD/YYYY') {
			displayDate = month + '/' + day + '/' + year;
		}
		else if (gUserDateDisplay == 'mDD/MM/YYYY') {
			displayDate = day + '/' + month + '/' + year;
		}
		else {
			if (day.toString().length == 1) {
				day = '0' + day;
			} 
			if (month.toString().length == 1) {
				month = '0' + month;
			} 		
			displayDate = year + '-' + month + '-' + day;
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
	
	document.getElementById('emergencycalldatetime').value = displayDateTime;
	document.getElementById('emergencycallphonenumber').value = gEmergencyCallPhoneNumber;
	document.getElementById('emergencycalldetails').value = gEmergencyCallDetails;	
	addMenuEmergencyCall();
	writeLog('displayEmergencyCall Finished');
	displayScreen(gScreenNameEmergencyCall);
}

function displayEmergencyNotification(msg) {
//*************************************************************
//* This function will display the appropriate information on 
//* the emergency notification screen.
//* Parms:
//*		Success/Failure message of recursive calls
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	writeLog('dsplayEmergencyNotification Starting');
	//Validate to ensure we don't have any undefined properties
	if (gJSONPayload.EmergencyNotification[0].details == undefined) {
			gJSONPayload.EmergencyNotification[0].details = '';
	}
	if (gJSONPayload.EmergencyNotification[0].accepturl == undefined) {
			gJSONPayload.EmergencyNotification[0].accepturl = '';
	}
	//Assign to global variables
	var details = gJSONPayload.EmergencyNotification[0].details;
	gEmergencyNotificationAcceptURL = gJSONPayload.EmergencyNotification[0].accepturl;					
	//Validate to ensure there are values for all fields	
	if (details == '') {
			details = 'MissingValue';
	}					
	
	//Apply values to fields on form
	document.getElementById('emergencynotificationdetails').value = details;	
	addMenuEmergencyNotification();
	writeLog('displayEmergencyNotification Finished');
	displayScreen(gScreenNameEmergencyNotification);
}
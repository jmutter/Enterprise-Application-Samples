//*************************************************************
//* This library contains all functions and global variables
//* that are action based for the application
//*************************************************************	
window.onload=formLoad;
	
//Global variables
var gAppGUID = '';
var gApplicationBannerIcon = 'images/mccabanner.png';;
var gApplicationIcon = 'local:///images/mcca.png';
var gApplicationIconNew = 'local:///images/mccanew.png';
var gAppName = '';
var gBrowserBlackBerry = 'BlackBerry';
var gBrowserGeneric = 'Browser';
var gBrowserRippleBlackBerry = 'RippleBlackBerry';
var gBrowserType = '';
var gDelim = '(OvO)';
var gInsertCounter = 0;
var gParentFunctionToCall = '';
var gScreenDisplayed = '';
var gScreenNameContacts = 'contacts';
var gScreenNameEmergencyCall = 'emergencycall';
var gScreenNameEmergencyNotification = 'emergencynotification';
var gScreenNameNoContacts = 'nocontacts';
var gScreenNameOptions = 'options';
var gScreenNamePrevious = '';
var gTestingMode = true;
var gTroubleShootingMode = false;
//The next variables are used to hold information relative to the user information
//table.  This allows persistent storage of data for the user
var gUserDateDisplay = 'MM/DD/YYYY'; //MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD
var gUserListingOrder = 'LastName';  //LastName, FirstName
var gUserRecordID = '1';

function browserDetection() {
//*************************************************************
//* This function will retrieve browser information
//* Parms:
//*		none
//* Value Returned: 
//*		none
//*************************************************************

	//Initialize our user agent string to lower case.
	var userAgentInfo = navigator.userAgent.toLowerCase();

	//Detect if the current browser is a BlackBerry of some sort.
	gDisplayMode = gBrowserGeneric;
	if (userAgentInfo.search("blackberry") > -1) {
		if (window.tinyHippos) {
			gBrowserType = gBrowserRippleBlackBerry;
		}
		else {
		  gBrowserType = gBrowserBlackBerry;
		}	
	}
}

function checkForOutstandingURLs(msg) {
//*************************************************************
//* This function will check for an outstanding URL and if found
//* call the postURL function to attempt to complete the 
//* notification of an accept or decline from the user.
//* Parms:
//*		Success/Error messages to analyze from called functions
//* Value Returned: 
//*		none
//*************************************************************		
	
	var errMsg = '';
	if (msg == '') {
		var	sql = 'SELECT outstandingurl FROM ' + gTableNameUser + ' WHERE recordid = \'' + gUserRecordID + '\'';
		fn_DBGetRecord(sql, 'checkForOutstandingURLs');
	}
	else if (msg.substring(0,17) == 'DBGETRECORDERROR:') {
		errMsg = msg.substring(17);
	}
	else if (msg == 'DBGETRECORDSUCCESS') {
		if (gDBRecordRetrieved != '') {
			gUserOutstandingURL = gDBRecordRetrieved;
		  postURL('');
		}
	}
	else { 
		errMsg = 'checkForOutstandingURLs received invalid msg: ' + msg;
	}
	if (errMsg != '') {
		alert ('Error procesing checkForOutstandingURLs:\n' + errMsg);
	}	
}

function displayScreen(screenName) {
//*************************************************************
//* This function will display the appropriate screen by 
//* referencing the div that is associated with it
//* Parms:
//*		Name of screen to show
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
  writeLog('Displaying ' + screenName + ' screen'); 
  gScreenNamePrevious = gScreenDisplayed;
  document.getElementById(gScreenNameNoContacts).style.visibility = 'hidden';
  document.getElementById(gScreenNameContacts).style.visibility = 'hidden';
  document.getElementById(gScreenNameOptions).style.visibility = 'hidden';
  document.getElementById(gScreenNameEmergencyCall).style.visibility = 'hidden';
  document.getElementById(gScreenNameEmergencyNotification).style.visibility = 'hidden';
	if (screenName == gScreenNameNoContacts) {
	  //$.mobile.changePage($('#nocontacts'), {transition : 'slideup'});
  	addMenu_Contacts();
  	document.getElementById(gScreenNameNoContacts).style.visibility = 'visible';
	}
	else if (screenName == gScreenNameContacts) {
	  //$.mobile.changePage($('#contacts'), {transition : 'slideup'});
  	addMenu_Contacts();
  	document.getElementById(gScreenNameContacts).style.visibility = 'visible';
	}
	else if (screenName == gScreenNameOptions) {
	  //$.mobile.changePage($('#options'), {transition : 'none'});	
  	addMenu_Options(); 
  	document.getElementById(gScreenNameOptions).style.visibility = 'visible';	 
	}
	else if (screenName == gScreenNameEmergencyCall) {
	  //$.mobile.changePage($('#emergencycall'), {transition : 'none'});	 	
  	addMenu_EmergencyCall();
  	document.getElementById(gScreenNameEmergencyCall).style.visibility = 'visible';
  	if (blackberry.app.isForeground == false) {
			blackberry.app.requestForeground(); 
		}  	
	}	
	else if (screenName == gScreenNameEmergencyNotification) {
	  //$.mobile.changePage($('#emergencynotification'), {transition : 'none'});	 	
  	addMenu_EmergencyNotification();
  	document.getElementById(gScreenNameEmergencyNotification).style.visibility = 'visible';
  	if (blackberry.app.isForeground == false) {
			blackberry.app.requestForeground(); 
		} 
	}	
	gScreenDisplayed = screenName;
}

function formLoad() {
//*************************************************************
//* This function is executed when the HTML page is first loaded.
//* It is referenced on the 1st line of this Javascript library
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************	

	//Detect browser type
	browserDetection();
	
	displayScreen('');  //Ensure all screens are hidden until we figure out what to display
	
	if (gBrowserType == gBrowserBlackBerry) {	
		//Instantiate variables
		gAppGUID = 'com.demo.' + blackberry.app.name.replace(' ','');
		gAppName = blackberry.app.name;
	}
	gHTTPObject = getHTTPObject();	
	
  //gDebugMode = true;
	writeLog('Application starting');

  if (gTestingMode == true) {
  	//alert ('You are running in TEST mode.\nCertain pieces of code work differently based on this mode.\nEnsure you set the value appropriately prior to deployment');
    //var answer = confirm ('Do you wish to have log messages displayed in alerts for trouble shooting?');
		//if (answer == true) {
    //	answer = confirm ('Are you sure?');
		//	if (answer == true) {
		//		gTroubleShootingMode = true;
		//	}	
		//}
  }
	
  //Register required BlackBerry events
  registerBBEvents();
	
	if (gHTTPObject == false) {		
		alert('Unable to start application:\nUnable to create HTTP object');	
	}
	else {
		getStarted('');		
	}
	
}

function getStarted(msg) {
//*************************************************************
//* This function will call the necessary functions to get this
//* application running.  All called functions will call this 
//* function back with completion status to facilitate analysis
//* of asynchronous calls without have spaghetti code.
//* Parms:
//*		Success/Error messages to analyze from called functions
//* Value Returned: 
//*		none
//*************************************************************	

	var errMsg = '';
	var sql = '';
	if (msg == '') {	
		writeLog('getStarted Starting');
		writeLog('  Opening database');		
		fn_DBOpenDatabase('', 'getStarted');  //Call function to open database and create tables
	}
	else if (msg.substring(0,18) == 'DATABASEOPENERROR:') {
		errMsg = msg.substring(18);
	}
	else if (msg == 'DATABASEOKAY') {
		sql = 'SELECT listingorder, datedisplay FROM ' + gTableNameUser + ' WHERE recordid = \'' + gUserRecordID + '\'';
		fn_DBGetRecord(sql, 'getStarted');
	}
	else if (msg.substring(0,17) == 'DBGETRECORDERROR:') {
		errMsg = msg.substring(17);
	}
	else if (msg == 'DBGETRECORDSUCCESS') {
		if (gDBRecordRetrieved == '') {		
		  sql = 'INSERT INTO ' + gTableNameUser;
		  sql += '(recordid,listingorder,datedisplay)';
		  sql += ' VALUES(\'' + gUserRecordID + '\',\'' + gUserListingOrder + '\',\'' + gUserDateDisplay + '\')';
		  fn_DBAddRecord(sql, 'getStarted');		
		}
		else {
			getStarted('DBADDRECORDSUCCESS');
		}
	}
	else if (msg.substring(0,17) == 'DBADDRECORDERROR:') {
		errMsg = msg.substring(17);
	}
	else if (msg == 'DBADDRECORDSUCCESS') {
		writeLog('  Parsing user information');
		if (gDBRecordRetrieved != '' ) {
		  var array = gDBRecordRetrieved.split(gDelim);
		  gUserListingOrder = array[0];
		  gUserDateDisplay = array[1];
		}	
		writeLog('getStarted Finished');
		displayContactGroups('');
	}
	else {
		errMsg ('Invalid parm for getStarted: ' + msg); 	
	} 
	if (errMsg != '') {
		writeLog('getStarted Finished - ERROR: ' + errMsg);	
		alert (errMsg);	
		//var html = 'Unable to start application:\n' + errMsg;
		//$('#error').html(html);
		//displayScreen(gScreenNameError);
	}
} 

function handleBackKey() {
//*************************************************************
//* This function is executed when the user presses the Back
//* key on the device.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************	
	writeLog('handleBackKey Starting');
	if (gScreenDisplayed == gScreenNameEmergencyCall || gScreenDisplayed == gScreenNameEmergencyNotification) {
		//Intercept and block request from user to leave this screen without responding
		alert ('You must choose to accept or decline this request.\nDo not close this application until you have done so.');
	}
	else {
		if (gScreenDisplayed == gScreenNameOptions) {
			alert ('change detected: ' + gOptionsChangeDetected);
			displayScreen(gScreenNamePrevious);
		}
		else {
			gScreenDisplayed = '';
			writeLog('Application going to background');
			blackberry.app.requestBackground();
		}		
	}	
	writeLog('handleBackKey Finished');
}

function handleCoverageChange() {
//*************************************************************
//* This function is executed when the device changes coverage
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************	
			
	writeLog('handleCoverage Starting');
	if ( blackberry.system.hasDataCoverage() == true) {
		checkForOutstandingUTL();
	}
	writeLog('handleCoverage Finished');
}

function handleExit() {
//*************************************************************
//* This function is executed when the user is attempting to 
//* leave the application.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************		
	
	writeLog('handleBackground Starting');
	if (gScreenDisplayed == gScreenNameEmergency || gScreenDisplayed == gScreenNameEmergencyNotification) {
		//Intercept and block request from user to leave this screen without responding
		alert ('You must choose to accept or decline this request.\nDo not close this application until you have done so.');
	}
	else {
		if (gTestingMode == true || gDebugMode == true) {
			writeLog('Application stopping');
			blackberry.app.exit();	
		}
		else {
			writeLog('Application going to background');
	  	blackberry.app.requestBackground();		
		}
	}	  
	writeLog('handleBackground Finished');
}

function handleForeground() {
//*************************************************************
//* This function is executed when the application comes back
//* to focus.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************		
	
	writeLog('handleForeground Starting');
	setApplicationIcon('old');
	blackberry.app.removeBannerIndicator();  //remove 
	notificationReset();  //Clear any outstanding notifications
	checkForOutstandingURLs('');  //Look for any outstanding URL and attempt posting
	writeLog('handleForeground Finished');
}

function notificationFire(){
//*************************************************************
//* This function will trigger the notification profile built 
//* from registering.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
  writeLog('notificationFire Starting');	
	if (gBrowserType == gBrowserBlackBerry) {	
		webworks.notification.fire (gAppGUID);
	}
  writeLog('notificationFire Finished');	
}

function notificationRegister(){
//*************************************************************
//* This function will register the notification extension
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************	
  
  writeLog('notificationRegister Starting');	
	if (gBrowserType == gBrowserBlackBerry) {	
	  webworks.notification.register (gAppGUID, gAppName);
	}
  writeLog('notificationRegister Finished');
}

function notificationReset() {
//*************************************************************
//* This function will reset/clear the notification awareness
//* that was triggered by the profile when fired.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************	

  writeLog('notificationReset Starting');	
	if (gBrowserType == gBrowserBlackBerry) {	
		webworks.notification.cancel (gAppGUID);
	}
  writeLog('notificationReset Finished');	
}

function notifyUser() {
//*************************************************************
//* This function will perform the required steps to notify
//* the user of an event.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************		
 
  writeLog('notifyUser Starting');
	notificationFire();
	setApplicationIcon('new');
	blackberry.app.showBannerIndicator(gApplicationBannerIcon);
  writeLog('notifyUser Finished');
}

function registerBBEvents() {
//*************************************************************
//* This function will register the required BlackBerry API events
//* to allow this application to work properly.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************		
  
  writeLog('registerBBEvents Starting');
  writeLog('  onExit');
	blackberry.app.event.onExit(handleExit);
  writeLog('  BackKey');
	blackberry.system.event.onHardwareKey(blackberry.system.event.KEY_BACK, handleBackKey);
  writeLog('  onForeground');	
	blackberry.app.event.onForeground(handleForeground);	
  writeLog('  onCoverageChange');
	blackberry.system.event.onCoverageChange(handleCoverageChange);
	
  writeLog('  Push');	
  if (gBrowserType == gBrowserRippleBlackBerry) {
		blackberry.push.openPushListener(handlePushData, 3333);	
	}
	else {
		var options = {port : 3333, wakeUpPage : 'index.html'};
		//var ops = {port : 233, wakeUpPage : 'index.html', maxQueueCap : 100};
		blackberry.push.openBESPushListener(options, handlePushData, handleSIMChange);	
	}	
  writeLog('  Notification Extension');	
	notificationRegister();
  writeLog('initializeSecretKey()');
  initializeKeyEvents();
  writeLog('registerBBEvents Finished');
}

function setApplicationIcon(type) {
//*************************************************************
//* This function will set the application icon to the requested
//* image.
//* Parms:
//*		Type of icon to display
//* Value Returned: 
//*		Nothing
//*************************************************************		
	
	writeLog('setApplicationIcon Starting');
	if (type.toLowerCase() =='new') {
		blackberry.app.setHomeScreenIcon(gApplicationIconNew, false);
	}
	else {
		blackberry.app.setHomeScreenIcon(gApplicationIcon, false);
	}
	writeLog('setApplicationIcon Finished');
}

 function writeLog(msg) {
//*************************************************************
//* This function will write the value requested to the devices
//* log for troubleshooting.
//* Parms:
//*		Value to write to log
//* Value Returned: 
//*		Nothing
//*************************************************************	

	if (gDebugMode == true && gBrowserType == gBrowserBlackBerry) {
		webworks.system.log.write(gAppGUID, gAppName, msg);
	}
	if (gTroubleShootingMode == true) {
		alert (msg);
	}
}
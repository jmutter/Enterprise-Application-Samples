//*************************************************************
//* This library contains all functions and global variables
//* that are action based for the application
//*************************************************************	
window.onload=formLoad;
window.onorientationchange = function(){orientationChangeDetected();};
	
//Global variables
var gAdminConfirmationURL = ''; 
var gAdminDeleteStep = '';
var gAdminDisableStep = '';
var gAdminEmailSender = '';
var gAdminGroupName = '';
var gAdminRequest = '';
var gAdminURL = '';
var gAppGUID = '';
var gApplicationBannerIcon = 'images/ccabanner.png';
var gApplicationIcon = 'local:///images/cca.png';
var gApplicationIconNew = 'local:///images/ccanew.png';
var gAppName = '';
var gBrowserBlackBerry = 'BlackBerry';
var gBrowserGeneric = 'Browser';
var gBrowserRippleBlackBerry = 'RippleBlackBerry';
var gBrowserType = '';
var gDelim = '(OvO)';
var gInsertCounter = 0;
var gParentFunctionToCall = '';
var gScreenDisplayed = '';
var gScreenNameAbout = 'about';
var gScreenNameContacts = 'contacts';
var gScreenNameEmergencyCall = 'emergencycall';
var gScreenNameEmergencyNotification = 'emergencynotification';
var gScreenNameGroups = 'groups';
var gScreenNameNoContacts = 'nocontacts';
var gScreenNameOptions = 'options';
var gScreenNamePrevious = '';
var gTestingMode = false;
var gTroubleShootingMode = false;
var gURLCounter = 0;
var gURLID = '';
var gURLRecords;
var gURLToPost = '';
//The next variables are used to hold information relative to the user information
//table.  This allows persistent storage of data for the user
var gUserDateDisplay = 'MM/DD/YYYY'; //MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD
var gUserListingOrder = 'LastName';  //LastName, FirstName
var gUserShowAllGroup = 'False';
var gUserShowCompanyOnContactBar = 'True';
var gUserShowContactDividers = 'True';
var gUserShowTitleOnContactBar = 'True';
//The next variables will hold information for user information but are not changeable by the user
var gUserRecordID = '1';
var gUserEmailSender = 'jbentley@rim.com';	//Recipient address to accept emails for payloads
var gUserEmailSenderDefault = 'jbentley@rim.com';	//Default sender email address to allow email payloads if email sender gets deleted
var gUserApplicationStatus = 'enabled';

function adminDeleteGroup(msg) {
//*************************************************************
//* This function will delete the requested group and contacts
//* associated with it
//* Parms:
//*		Success/Error messages to analyze from called functions
//* Value Returned: 
//*		none
//*************************************************************	
	
  var errMsg = '';
  var sql;
  var errorFound = false;
  if (msg == '') {
  	writeLog('adminDeleteGroup Starting');		
		gAdminDeleteStep = 'contacts';
  	writeLog('  Deleting \'' + gAdminGroupName + '\' contact records');
		sql = 'DELETE FROM ' + gTableNameContacts + ' WHERE groupname = \'' + gAdminGroupName + '\'';
		fn_DBDeleteRecord(sql, 'adminDeleteGroup');	
	}		
	else if (msg == 'DBDELETERECORDSUCCESS') {
		if (gAdminDeleteStep == 'contacts') {
			gAdminDeleteStep = 'groups';
  		writeLog('  Deleting \'' + gAdminGroupName + '\' group record');
			sql = 'DELETE FROM ' + gTableNameGroups + ' WHERE groupname = \'' + gAdminGroupName + '\'';
			fn_DBDeleteRecord(sql, 'adminDeleteGroup');
		}
		else {
		 	saveURL('',gAdminConfirmationURL);
  		writeLog('adminDeleteGroup Finished');	
  		resetListings('');
		}
	}
	else if (msg.substring(0,20) == 'DBDELETERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		writeLog('adminDeleteGroup Finished - ERROR - ' + errMsg);		
	}	
}

function adminDeleteURL(msg) {
//*************************************************************
//* This function will delete the requested outstanding URL
//* Parms:
//*		Success/Error messages to analyze from called functions
//* Value Returned: 
//*		none
//*************************************************************	

  var errMsg = '';
  var sql;
  var errorFound = false;
  if (msg == '') {
  	writeLog('adminDeleteURL Starting');		
  	writeLog('  Deleting URL: ' + gAdminURL);
		sql = 'DELETE FROM ' + gTableNameOutstandingURLs + ' WHERE url = \'' + gAdminURL + '\'';
		fn_DBDeleteRecord(sql, 'adminDeleteURL');	
	}		
	else if (msg == 'DBDELETERECORDSUCCESS') {
		saveURL('',gAdminConfirmationURL);
		writeLog('adminDeleteURL Finished');
	}
	else if (msg.substring(0,20) == 'DBDELETERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		writeLog('adminDeleteURL Finished - ERROR - ' + errMsg);		
	}	
}

function adminDeleteURLs(msg) {
//*************************************************************
//* This function will delete all outstanding URLs
//* Parms:
//*		Success/Error messages to analyze from called functions
//* Value Returned: 
//*		none
//*************************************************************	
	
  var errMsg = '';
  var sql;
  var errorFound = false;
  if (msg == '') {
  	writeLog('adminDeleteURLs Starting');		
  	writeLog('  Deleting URLs');
		sql = 'DELETE FROM ' + gTableNameOutstandingURLs;
		fn_DBDeleteRecord(sql, 'adminDeleteURLs');	
	}		
	else if (msg == 'DBDELETERECORDSUCCESS') {
		saveURL('',gAdminConfirmationURL);
		writeLog('adminDeleteURLs Finished');
	}
	else if (msg.substring(0,20) == 'DBDELETERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		writeLog('adminDeleteURLs Finished - ERROR - ' + errMsg);		
	}	
}

function adminDisableApplication(msg) {
//*************************************************************
//* This function will delete all data from the tables and disable
//* the application from running again
//* Parms:
//*		Success/Error messages to analyze from called functions
//* Value Returned: 
//*		none
//*************************************************************	
	
  var errMsg = '';
  var sql;
  if (msg == '') {
  	writeLog('adminDisableApplication Starting');		
		gAdminDisableStep = 'contacts';
  	writeLog('  Deleting contacts');
		sql = 'DELETE FROM ' + gTableNameContacts;
		fn_DBDeleteRecord(sql, 'adminDisableApplication');	
	}		
	else if (msg == 'DBDELETERECORDSUCCESS') {
		if (gAdminDisableStep == 'contacts') {
			gAdminDisableStep = 'groups';
  		writeLog('  Deleting groups');
			sql = 'DELETE FROM ' + gTableNameGroups;
			fn_DBDeleteRecord(sql, 'adminDisableApplication');
		}
		else if (gAdminDisableStep == 'groups') {
			gAdminDisableStep = 'urls';
  		writeLog('  Deleting urls');
			sql = 'DELETE FROM ' + gTableNameOutstandingURLs;
			fn_DBDeleteRecord(sql, 'adminDisableApplication');
		}		
		else if (gAdminDisableStep == 'urls') {
  		writeLog('  Setting disabled status');
			sql = 'UPDATE ' + gTableNameUser + ' SET applicationstatus = \'disabled\' WHERE recordid = \'' + gUserRecordID + '\'';
			fn_DBUpdateRecord(sql, 'adminDisableApplication'); 	
		}
	}
	else if (msg.substring(0,20) == 'DBDELETERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else if (msg.substring(0,20) == 'DBUPDATERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else if (msg == 'DBUPDATERECORDSUCCESS') {
		saveURL('',gAdminConfirmationURL);
  	writeLog('adminDisableApplication Finished');	
  	if (gBrowserType == gBrowserBlackBerry) {
  		blackberry.app.exit();	
  	}
	}		
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		writeLog('adminDisableApplication Finished - ERROR - ' + errMsg);		
	}	
}

function adminEnableApplicationStatus(msg) {
//*************************************************************
//* This function will update user table to allow the application
//* to function again
//* Parms:
//*		Success/Error messages to analyze from called functions
//* Value Returned: 
//*		none
//*************************************************************	
	
  var errMsg = '';
  if (msg == '') {
  	writeLog('adminEnableApplicationStatus Starting');		
		var	sql = 'UPDATE ' + gTableNameUser + ' SET applicationstatus = \'enabled\' WHERE recordid = \'' + gUserRecordID + '\'';
		fn_DBUpdateRecord(sql, 'adminEnableApplicationStatus'); 	
	}
	else if (msg == 'DBUPDATERECORDSUCCESS') {
		saveURL('',gAdminConfirmationURL);
		displayMessage('Application has been enabled');
		gUserApplicationStatus = 'enabled';
  	writeLog('adminEnableApplicationStatus Finished');	
	}		
	else if (msg.substring(0,20) == 'DBUPDATERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		writeLog('adminEnableApplicationStatus - ERROR - ' + errMsg);		
	}	
}

function adminProcessPayload() {
//*************************************************************
//* This function will process the admin request by parsing 
//* the JSON information and calling the appropriate function
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
  var errorFound = false;
 	writeLog('adminProcessPayload Starting');		
	writeLog('  Validating payload');		
	//Validate that all required properties exist in the object and if not, make them blank.
	if (gJSONPayload.Administration[0].request == undefined) {
		gJSONPayload.Administration[0].request = '';
	}	
	if (gJSONPayload.Administration[0].groupname == undefined) {
		gJSONPayload.Administration[0].groupname = '';
	}	 
	if (gJSONPayload.Administration[0].url == undefined) {
		gJSONPayload.Administration[0].url = '';
	}	
	if (gJSONPayload.Administration[0].emailsender == undefined) {
		gJSONPayload.Administration[0].emailsender = '';
	}	
	if (gJSONPayload.Administration[0].confirmationurl == undefined) {
		gJSONPayload.Administration[0].confirmationurl = '';
	}	
	gAdminRequest = gJSONPayload.Administration[0].request;
	gAdminGroupName = gJSONPayload.Administration[0].groupname;
	gAdminURL = gJSONPayload.Administration[0].url;
	gAdminEmailSender = gJSONPayload.Administration[0].emailsender;
	gAdminConfirmationURL = gJSONPayload.Administration[0].confirmationurl; 

	if (gAdminRequest == '') {
		errorFound = true;
    writeLog('  request was blank');
	}	
	else {
		if (gAdminRequest != 'deletegroup' && gAdminRequest != 'deleteurl' && gAdminRequest != 'deleteurls' && gAdminRequest != 'disableapplication' && gAdminRequest != 'enableapplication' && gAdminRequest != 'updateemailsender') {
			errorFound = true;
			writeLog('  request <> deletegroup, deleteurl, deleteurls, updateemailsender, disableapplication, or enableapplication');
		}
		else {
			if (gAdminRequest == 'deletegroup' && gAdminGroupName == '') {
				errorFound = true;
    		writeLog('  groupname was blank');
			}					
			else if (gAdminRequest == 'deleteurl' && gAdminURL == '') {
				errorFound = true;
    		writeLog('  url was blank');
			}	
			else if (gAdminRequest == 'updateemailsender' && gAdminEmailSender == '') {
				errorFound = true;
    		writeLog('  email sender was blank');
			}	
		}
	} 
	if (errorFound == true) {
		writeLog('AdminProcessPayload Finished - ERROR - Invalid JSON payload value(s)');	
	}
	else {
		writeLog('AdminProcessPayload Finished');	
		if (gUserApplicationStatus == 'enabled') {	
			if (gAdminRequest == 'deletegroup') {
				adminDeleteGroup('');
			}
			else if (gAdminRequest == 'deleteurl') {
				adminDeleteURL('');
			}
			else if (gAdminRequest == 'deleteurls') {
				adminDeleteURLs('');
			}
			else if (gAdminRequest == 'disableapplication') {
				adminDisableApplication('');
			}
			else if (gAdminRequest == 'updateemailsender') {
				adminUpdateEmailSender('');
			}
		}	
		else {
			if (gAdminRequest == 'enableapplication') {
				adminEnableApplicationStatus('');
			}
			else {
		  	var tempCode = gDebugMode;		
		  	gDebugMode = true;		
				writeLog('ApplicatIon is disabled, cannot process administration request');
				gDebugMode = tempCode;
			}
		}
	}
}

function adminUpdateEmailSender(msg) {
//*************************************************************
//* This function will update the email sender address in the 
//* user table
//* Parms:
//*		Success/Error messages to analyze from called functions
//* Value Returned: 
//*		none
//*************************************************************	
	
  var errMsg = '';
  if (msg == '') {
  	writeLog('adminUpdateEmailSender Starting');		
		var	sql = 'UPDATE ' + gTableNameUser + ' SET emailsender = \'' + fieldPrepare(gAdminEmailSender) + '\' WHERE recordid = \'' + gUserRecordID + '\'';
		fn_DBUpdateRecord(sql, 'adminUpdateEmailSender'); 	
	}
	else if (msg == 'DBUPDATERECORDSUCCESS') {
		saveURL('',gAdminConfirmationURL);
  	writeLog('adminUpdateEmailSender Finished');	
	}		
	else if (msg.substring(0,20) == 'DBUPDATERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		writeLog('adminUpdateEmailSender Finished - ERROR - ' + errMsg);		
	}	
}

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
//* This function will check for an outstanding URLs and if found
//* call the postURL function to attempt to complete the 
//* notification of an accept or decline from the user.
//* Once the post has been successful, postURLConfirmation will call
//* this function to get the next URL (if any).
//* Parms:
//*		Success/Error messages to analyze from called functions
//* Value Returned: 
//*		none
//*************************************************************		
	
	var errMsg = '';
	if (msg == '' || msg == undefined) {
		writeLog('checkForOutstandingURLs Starting');
		var	sql = 'SELECT urlid, url FROM ' + gTableNameOutstandingURLs;
		fn_DBGetRecords(sql, 'checkForOutstandingURLs');
	}
	else if (msg == 'DBGETRECORDSSUCCESS') {
		gURLRecords = gDBRecordsRetrieved;
		writeLog('  ' + gURLRecords.length + ' outstanding URLs');
		gURLCounter == 0;		//Initialize the counter
		checkForOutstandingURLs('PROCESSURLS');		//Call this function with our needed msg for processing
	}
	else if (msg == 'PROCESSURLS') {
		if (gURLCounter < gURLRecords.length) {
			writeLog('  processing outstanding URL # ' + gURLCounter);
			var array = gURLRecords[gURLCounter].split(gDelim);		
			gURLID = array[0];
			gURLToPost = array[1];
			gURLCounter ++;
		  postURL();			
		}
		else {
			writeLog('checkForOutstandingURLs Finished');
		}
	}
	else if (msg.substring(0,18) == 'DBGETRECORDSERROR:') {
		errMsg = msg.substring(18);
	}
	else { 
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		writeLog('checkForOutstandingURLs Finished - ERROR - ' + errMsg);
	}	
}

function displayMessage(message) {
//*************************************************************
//* This function will display the requested message using the 
//* appropriate method based on environment.
//* Parms:
//*		Message to be displayed
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
  alert (message);
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
	
  writeLog('displayScreen Starting');
  gScreenNamePrevious = gScreenDisplayed;
	if (gScreenDisplayed == '') {
  	$('#listing').hide();  
  	$('#' + gScreenNameNoContacts).hide();
  	$('#' + gScreenNameOptions).hide();
  	$('#' + gScreenNameAbout).hide();
  	$('#' + gScreenNameEmergencyCall).hide();
  	$('#' + gScreenNameEmergencyNotification).hide();
	}
	else {
		if ((gScreenDisplayed == gScreenNameGroups || gScreenDisplayed == gScreenNameContacts) && screenName != gScreenNameGroups) {
			$('#listing').hide(1000);
		}
		else {
 			$('#' + gScreenDisplayed).fadeOut('slow');
		}
	}

	if (screenName == gScreenNameGroups) {
	  if (gScreenDisplayed != gScreenNameContacts) {
	  	$('#listing').show('slow');
	  }
	}
	else if (screenName == gScreenNameNoContacts) {
	}
	else if (screenName == gScreenNameContacts) {
	  if (gScreenDisplayed != gScreenNameGroups) {
	  	$('#listing').show('slow');
	  }
	}
	else if (screenName == gScreenNameOptions) {
		$('#' + gScreenNameOptions).fadeIn(1500);
	}
	else if (screenName == gScreenNameAbout) {
		$('#' + gScreenNameAbout).fadeIn(1500);
	}
	else if (screenName == gScreenNameEmergencyCall) {
  	if (blackberry.app.isForeground == false) {
			blackberry.app.requestForeground(); 
		}  
		$('#' + gScreenNameEmergencyCall).show();	
	}	
	else if (screenName == gScreenNameEmergencyNotification) {	
  	if (blackberry.app.isForeground == false) {
			blackberry.app.requestForeground(); 
		} 
		$('#' + gScreenNameEmergencyNotification).show();
	}	
	gScreenDisplayed = screenName;
  writeLog('displayScreen Finished');
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
 	 	displayMessage ('You are running in TEST mode.\nCertain pieces of code work differently based on this mode.\nEnsure you set the value appropriately prior to deployment');
 	  var answer = confirm ('Do you wish to have log messages displayed in alerts for trouble shooting?');
		if (answer == true) {
   		answer = confirm ('Are you sure?');
			if (answer == true) {
				gTroubleShootingMode = true;
			}	
		}
 	}

  //Register required BlackBerry events
  registerBBEvents();
	
	if (gHTTPObject == false) {		
		displayMessage('Unable to start application:\nUnable to create HTTP object');	
	}
	else {
		getStarted('');		
	}
}

function getRecords(msg, functionToCall){
//*************************************************************
//* This function will retrieve records from the database and
//* build the group listing screen
//* Parms:
//*		Success/Failure message from called functions (from callbacks)
//*		Function name to call when we are done (success or failure)
//* Value Returned: 
//*		Nothing
//*************************************************************
	
	var errMsg = '';
	var sql = '';
	if (msg == '') {		
		gParentFunctionToCall = functionToCall;  //Save off function since recursive calls back here won't preserve it
		writeLog('getRecords Starting');	
		writeLog('  Retrieving Contacts');
		sql = 'SELECT contactid, groupname, firstname, lastname, title, company, email, pin, workphone, mobilephone, homephone, address, address2, city, state, zipcode, country FROM ' + gTableNameContacts;
		if (gUserListingOrder == 'FirstName') {
			sql += ' ORDER BY firstname, lastname';
		}	
		else {
			sql += ' ORDER BY lastname, firstname';
		}
		gRetrievalStep = 'contacts';
		fn_DBGetRecords(sql, 'getRecords');
	}	
	else if (msg == 'DBGETRECORDSSUCCESS') {	
		var counter = 0;
		if (gRetrievalStep == 'contacts') {
			writeLog('  Processing ' + gDBRecordsRetrieved.length + ' contacts');
			gContactRecords.length = 0;
	  	for (counter = 0; counter < gDBRecordsRetrieved.length; ++counter) {
     		gContactRecords[counter] = gDBRecordsRetrieved[counter];
			}
			writeLog('  Retrieving Groups');
			sql = 'SELECT groupname, contactrecords, recordsreceived FROM ' + gTableNameGroups + ' ORDER BY groupname';
			gRetrievalStep = 'groups';
			fn_DBGetRecords(sql, 'getRecords');
		}
		else {
			writeLog('  Processing ' + gDBRecordsRetrieved.length + ' groups');
			gGroupRecords.length = 0;
	  	for (counter = 0; counter < gDBRecordsRetrieved.length; ++counter) {
     		gGroupRecords[counter] = gDBRecordsRetrieved[counter];
			}			
			writeLog('getRecords Finished');	
			window[gParentFunctionToCall]('GETRECORDSSUCCESS');
		}
	}
	else if (msg.substring(0,18) == 'DBGETRECORDSERROR:') {
		errMsg = msg.substring(18);
	}
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		writeLog('getRecords Finished - ERROR - ' + errMsg);
		window[gParentFunctionToCall]('GETRECORDSERROR:' + errMsg);
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
	else if (msg == 'DATABASEOKAY') {
		sql = 'SELECT showallgroup, listingorder, showcontactdividers, showtitleoncontactbar, showcompanyoncontactbar, datedisplay, emailsender, applicationstatus FROM ' + gTableNameUser + ' WHERE recordid = \'' + gUserRecordID + '\'';
		fn_DBGetRecord(sql, 'getStarted');
	}
	else if (msg == 'DBGETRECORDSUCCESS') {
		if (gDBRecordRetrieved == '') {		
		  sql = 'INSERT INTO ' + gTableNameUser;
		  sql += '(recordid, showallgroup, listingorder, showcontactdividers, showtitleoncontactbar, showcompanyoncontactbar, datedisplay, emailsender, applicationstatus)';
		  sql += ' VALUES(\'' + gUserRecordID + '\',\'' + gUserShowAllGroup + '\',\'' + gUserListingOrder + '\',\'' + gUserShowContactDividers + '\',\'';
		  sql += gUserShowTitleOnContactBar + '\',\'' + gUserShowCompanyOnContactBar + '\',\'' + gUserDateDisplay + '\',\'' 
		  sql += gUserEmailSender + '\',\'' + gUserApplicationStatus + '\')';		  
		  fn_DBAddRecord(sql, 'getStarted');		
		}
		else {
			getStarted('DBADDRECORDSUCCESS');
		}
	}
	else if (msg == 'DBADDRECORDSUCCESS') {
		writeLog('  Parsing user information');
		if (gDBRecordRetrieved != '' ) {
		  var array = gDBRecordRetrieved.split(gDelim);
		  gUserShowAllGroup = array[0];
		  gUserListingOrder = array[1];
		  gUserShowContactDividers = array[2];
		  gUserShowTitleOnContactBar = array[3];
		  gUserShowCompanyOnContactBar = array[4];
		  gUserDateDisplay = array[5];
		  gUserEmailSender = array[6];
		  gUserApplicationStatus = array[7];
		}	
		getRecords('','getStarted');
	}
	else if (msg == 'GETRECORDSSUCCESS') {
		writeLog('getStarted Finished');
		displayGroups();
	}
	else if (msg.substring(0,18) == 'DATABASEOPENERROR:') {
		errMsg = msg.substring(18);
	}
	else if (msg.substring(0,17) == 'DBGETRECORDERROR:') {
		errMsg = msg.substring(17);
	}
	else if (msg.substring(0,17) == 'DBADDRECORDERROR:') {
		errMsg = msg.substring(17);
	}
	else if (msg.substring(0,16) == 'GETRECORDSERROR:' ) {
		errMsg = msg.substring(16);
	}
	else {
		errMsg ('Invalid msg: ' + msg); 	
	} 
	if (errMsg != '') {
		writeLog('getStarted Finished - ERROR - ' + errMsg);	
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
		displayMessage('You must choose to accept or decline this request.\nDo not close this application until you have done so.');
	}
	else {
		if (gScreenDisplayed == gScreenNameOptions) {
			var answer = true;
			if (gOptionsChangeDetected == true) {
				if (confirm("A change was made.\nIf you continue, you will lose those changes.") == false) {
					answer = false;
				}
			}
			if (answer == true) {				
				writeLog('handleBackKey Finished');
				gOptionsChangeDetected = false;
				//At this time Options can only be invoked from the Groups screen and no changes were detected so simply display the screen
				displayScreen(gScreenNameGroups);
			}
		}	
		else if (gScreenDisplayed == gScreenNameAbout) {
			writeLog('handleBackKey Finished');
			displayScreen(gScreenNamePrevious);
		}
		else if (gScreenDisplayed == gScreenNameGroups) {
			writeLog('handleBackKey Finished');
			writeLog('Application going to background');
			blackberry.app.requestBackground();
		}
		else {
			writeLog('handleBackKey Finished');				
			displayGroups();
		}		
	}	
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
		checkForOutstandingURLs('');
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
	if (gScreenDisplayed == gScreenNameEmergencyCall || gScreenDisplayed == gScreenNameEmergencyNotification) {
		//Intercept and block request from user to leave this screen without responding
		displayMessage('You must choose to accept or decline this request.\nDo not close this application until you have done so.');
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

function orientationChangeDetected() {
	var orientation = window.orientation;
	if (gScreenDisplayed == gScreenNameOptions) {
		//alert ('rebuilding option screen');
		//buildOptions();
	}
	switch(orientation) {
   	case 0:
   		//Top side up.
  	case -90:
   		//Left side up (turned 90 degrees to the right)
   	case 90: 
   		//Right side up (turned 90 degrees to the left)
  }
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

function resetListings(msg) {
//*************************************************************
//* This function will reset the listings as a result of a 
//* push being received.  All data will have been stored in the
//* database before this function is called
//* Parms:
//*		Success/Failure message of recursive calls
//* Value Returned: 
//*		Nothing
//*************************************************************	

	var errMsg = '';
	if (msg == '') {
		writeLog('resetListing Starting');
		getRecords('','resetListings');
	}
  else if (msg == 'GETRECORDSSUCCESS') {
		writeLog('resetListings Finished');
  	if (blackberry.app.isForeground == true) {
	 	 	displayMessage ('An administrative request was received and processed.\nIt has changed the data on your device, so you will be shown the group listing screen when you click OK');
		} 		
		displayGroups();
	}
	else if (msg.substring(0,16) == 'GETRECORDSERROR:' ) {
		errMsg = msg.substring(16);
	}
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		writeLog('resetListings Finished - ERROR - ' + errMsg);
	}
}

function saveURL(msg, urlToAdd) {
//*************************************************************
//* This function will add the reqeusted URL to the outstandingurl 
//* table.
//* Parms:
//*		Success/Failure message of recursive calls
//*   URL to add
//* Value Returned: 
//*		Nothing
//*************************************************************	

	var errMsg = '';
	if (msg == '') {
		writeLog('saveURL Starting');
		if (urlToAdd == '') {
			writeLog('  No URL to save');
			writeLog('saveURL Finished');	
		}
		else {
		sql = 'INSERT INTO ' + gTableNameOutstandingURLs;
		sql += '(urlid, url, datetime, lastattemptdatetime, statuscode)';
		sql += ' VALUES(null,\'' + fieldPrepare(urlToAdd) + '\',\'' + getDate(gUserDateDisplay) + ' @ ' + getTime() + '\',\'\',\'\')';
		fn_DBAddRecord(sql, 'saveURL');	
		}	
	}
	else if (msg == 'DBADDRECORDSUCCESS') {
		writeLog('saveURL Finished');	
		checkForOutstandingURLs('');
	}
	else if (msg.substring(0,17) == 'DBADDRECORDERROR:') {
		errMsg = msg.substring(17);
	}
	else {
		errMsg = 'Invalid msg: ' + msg;
	}	
	if (errMsg != '') {
		writeLog('saveURL Finished - ERROR - ' + errMsg);	
	}
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

function toggleSection(parentId, targetId) {
	var parentEle = document.getElementById(parentId);
	var targetEle = document.getElementById(targetId);
	if (targetEle && parentEle) {
		//Remove the existing icon
		var newIcon = '';
		var image = parentEle.getElementsByTagName("img")[0];
		if (image.src.indexOf('minus.png') == -1) {
			newIcon = 'images/minus.png';
			//Expand the contents
			targetEle.style.display = '';
		}
		else {
			newIcon = 'images/plus.png';
			//Collapse the contents
		  targetEle.style.display = 'none';
		}
		parentEle.removeChild(image);

		//Add the new icon
		var icon = new Image();
		icon.src = newIcon;
		parentEle.appendChild(icon);
	}
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
		displayMessage(msg);
	}
}
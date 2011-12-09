//*************************************************************
//* This library contains all functions and global variables
//* that are action based for the application
//*************************************************************	
window.onload=formLoad;
window.onorientationchange = function(){orientationChangeDetected();};
	
//Global variables
var gBrowserPlayBook = 'PlayBook';
var gBrowserGeneric = 'Browser';
var gBrowserRipplePlayBook = 'RipplePlayBook';
var gBrowserType = '';
var gDelim = '(OvO)';
var gConfigRecords = new Array();
var gConfigsValid = true;
var gInsertConfigCounter = 0;
var gParentFunctionToCall = '';
var gScreenNameContacts = 'contacts';
var gScreenNameDocuments = 'documents';
var gScreenNameGroups = 'groups';
var gScreenNameHome = 'home';
var gScreenNameNoContacts = 'nocontacts';
var gScreenNameRSS = 'rss';
var gScreenNameSettings = 'settings';
var gTestingMode = true;
var gTroubleShootingMode = false;
//The next variables are used to hold information relative to the user preferences
//This allows persistent storage of data for the user
var gUserDateDisplay = 'MM/DD/YYYY'; //MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD for displaying dates
var gUserListingOrder = 'LastName';  //LastName or FirstName for ordering the display of contacts
var gUserShowAllGroup = 'False';  //True or False for adding the All group to the group listing
var gUserShowCompanyOnContactBar = 'False';  //True or False for adding the company name (if supplied) on the contact name bar
var gUserShowContactDividers = 'True';  //True or False for creating dividers to separate alphabetic differences between names
var gUserShowTitleOnContactBar = 'False';  //True or False for adding the persons title (if supplied) on the contact name bar
//The next variable will hold information for user information but are not changeable by the user
var gUserRecordID = '1';
//The next variables are used to hold information relative to the connection preferences
//This allows persistent storage of data for the application
var gConfigDateTime = '';
var gConfigPrimaryURL = 'http://www.dagobaahserver.com/pbdr/Config.ashx';
var gConfigPrimaryUserID = '';
var gConfigPrimaryPassword = '';
var gConfigSecondaryURL = 'http://www.dagobaahserver.com/pbdr/Config.ashx';
var gConfigSecondaryUserID = '';
var gConfigSecondaryPassword = '';
var gContactsDateTime = '';
var gContactsPrimaryURL = 'http://www.dagobaahserver.com/pbdr/Contacts.ashx';
var gContactsPrimaryUserID = '';
var gContactsPrimaryPassword = '';
var gContactsSecondaryURL = 'http://www.dagobaahserver.com/pbdr/Contacts.ashx';
var gContactsSecondaryUserID = '';
var gContactsSecondaryPassword = '';
var gDocumentsDateTime = '';
var gDocumentsPrimaryURL = 'http://www.dagobaahserver.com/pbdr/Documents.ashx';
var gDocumentsPrimaryUserID = '';
var gDocumentsPrimaryPassword = '';
var gDocumentsSecondaryURL = 'http://www.dagobaahserver.com/pbdr/Documents.ashx';
var gDocumentsSecondaryUserID = '';
var gDocumentsSecondaryPassword = '';
var gRSSDateTime = '';
var gRSSPrimaryURL = 'http://www.dagobaahserver.com/pbdr/RSS.ashx';
var gRSSPrimaryUserID = '';
var gRSSPrimaryPassword = '';
var gRSSSecondaryURL = 'http://www.dagobaahserver.com/pbdr/RSS.ashx';
var gRSSSecondaryUserID = '';
var gRSSSecondaryPassword = '';

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
	if (userAgentInfo.search("playbook") > -1) {
		if (window.tinyHippos) {
			gBrowserType = gBrowserRipplePlayBook;
		}
		else {
		  gBrowserType = gBrowserPlayBook;
		}	
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
 	$('#' + gScreenNameHome).hide();
 	$('#' + gScreenNameDocuments).hide();
 	$('#' + gScreenNameNoContacts).hide();
 	$('#listing').hide();
 	$('#' + gScreenNameRSS).hide();
 	$('#' + gScreenNameSettings).hide();

	if (screenName == gScreenNameHome) {
	  $('#' + gScreenNameHome).show('slow');
	}
	else if (screenName == gScreenNameDocuments) {
	  $('#' + gScreenNameDocuments).show('slow');
	}
	else if (screenName == gScreenNameNoContacts) {
		document.getElementById(gScreenNameNoContacts).style.backgroundImage = "url(images/background-nocontacts.jpg)";
		document.getElementById(gScreenNameNoContacts).style.width = screen.availWidth + "px";
		document.getElementById(gScreenNameNoContacts).style.height = screen.availHeight + "px";
		document.getElementById(gScreenNameNoContacts).style.backgroundRepeat = "repeat";
	  $('#' + gScreenNameNoContacts).show('slow');
	}
	else if (screenName == gScreenNameGroups) {
	  $('#listing').show('slow');
	}
	else if (screenName == gScreenNameContacts) {
		$('#listing').fadeIn(1500);
	}
	else if (screenName == gScreenNameRSS) {
	  $('#' + gScreenNameRSS).show('slow');
	}
	else if (screenName == gScreenNameSettings) {	
		$('#' + gScreenNameSettings).fadeIn(1500);
	}
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

  //if (gTestingMode == true) {
 	// 	displayMessage ('You are running in TEST mode.\nCertain pieces of code work differently based on this mode.\nEnsure you set the value appropriately prior to deployment');
 	//  var answer = confirm ('Do you wish to have log messages displayed in alerts for trouble shooting?');
	//	if (answer == true) {
  // 		answer = confirm ('Are you sure?');
	//		if (answer == true) {
	//			gTroubleShootingMode = true;
	//		}	
	//	}
 	//}

	//Detect browser type
	browserDetection();
	
	displayScreen('');  //Ensure all screens are hidden until we figure out what to display

	gHTTPObject = getHTTPObject();	
		
 	//gDebugMode = true;
	writeLog('Application starting');		

  //Register required BlackBerry events
  registerPBEvents();
	
	if (gHTTPObject == false) {		
		displayMessage('Unable to start application:\nUnable to create HTTP object');	
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

		dbOpenDatabase('', 'getStarted');  //Call function to open database and create tables
	}
	else if (msg == 'DATABASEOKAY') {
		retrieveUserSettings('','getStarted');
	}
	else if (msg == 'USERSETTINGSRETRIEVED') {
		retrieveConfigSettings('','getStarted');
	}
	else if (msg == 'CONFIGSETTINGSRETRIEVED') {
		validateConfigs();
		displayScreen(gScreenNameHome);
		if (gConfigsValid == true) {
			gJSONPayload = {"Contact":[{"groupname":"WAAs","firstname":"Jeffrey","lastname":"Bentley","workphone":"704-508-1600"},
				{"groupname":"WAAs","firstname":"Richard","lastname":"Balsewich","workphone":"704-508-1600"}]};		
			processContactsPayload('');			
			alert ('call for stuff goes here');
		}
	}
	else if (msg.substring(0,19) == 'USERSETTINGSFAILED:') {
		errMsg = msg.substring(19);
	}
	else if (msg.substring(0,21) == 'CONFIGSETTINGSFAILED:') {
		errMsg = msg.substring(21);
	}
	else if (msg.substring(0,18) == 'DATABASEOPENERROR:') {
		errMsg = msg.substring(18);
	}
	else {
		errMsg = ('Invalid msg: ' + msg); 	
	} 
	if (errMsg != '') {
		writeLog('getStarted Finished - ERROR - ' + errMsg);	
	}
} 

function handleBackground() {
//*************************************************************
//* This function is executed when the user is attempting to 
//* leave the application.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************		
	
	writeLog('handleBackground Starting');
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
	writeLog('handleForeground Finished');
}

function orientationChangeDetected() {
	var orientation = window.orientation;
	//alert ('orientation: ' + orientation);
	switch(orientation) {
   	case 0:
   		//Top side up.
  	case -90:
   		//Left side up (turned 90 degrees to the right)
   	case 90: 
   		//Right side up (turned 90 degrees to the left)
  }
}

function registerPBEvents() {
//*************************************************************
//* This function will register the required PlayBook API events
//* to allow this application to work properly.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************		
  
  writeLog('registerPBEvents Starting');
  writeLog('  onBackGround');
	blackberry.app.event.onBackground(handleBackground);
  writeLog('  onForeground');	
	blackberry.app.event.onForeground(handleForeground);	
  writeLog('registerPBEvents Starting');
}

function retrieveConfigSettings(msg, functionToCall) {
//*************************************************************
//* This function will retrieve the user settings from the 
//* database and set the appropriate global variables.
//* Parms:
//*		Success/Error messages to analyze from called functions
//*		Function to call when finished
//* Value Returned: 
//*		none
//*************************************************************	

	var errMsg = '';
	var sql = '';
	if (msg == '') {	
		gParentFunctionToCall = functionToCall;	
		writeLog('retrieveConfigSettings Starting');
		sql = 'SELECT type, primaryurl, primaryuserid, primarypassword, secondaryurl, secondaryuserid, secondarypassword, datetime FROM ' + gTableNameConfig;
		dbGetRecords(sql, 'config', 'retrieveConfigSettings');
	}
	else if (msg == 'DBGETRECORDSSUCCESS') {
		if (gConfigRecords.length > 0) {
			var counter;
			for (counter = 0; counter < gConfigRecords.length; ++counter) {
				var array = gConfigRecords[counter].split(gDelim);	
				if (array[0] == 'Documents') {
					gDocumentsPrimaryURL = array[1];
					gDocumentsPrimaryUserID = array[2];
					gDocumentsPrimaryPassword = array[3];
					gDocumentsSecondaryURL = array[4];
					gDocumentsSecondaryUserID = array[5];
					gDocumentsSecondaryPassword = array[6];
					gDocumentsDateTime = array[7];	
				}
				else if (array[0] == 'Contacts') {
					gContactsPrimaryURL = array[1];
					gContactsPrimaryUserID = array[2];
					gContactsPrimaryPassword = array[3];
					gContactsSecondaryURL = array[4];
					gContactsSecondaryUserID = array[5];
					gContactsSecondaryPassword = array[6];					
					gContactsDateTime = array[7];
				}
				else if (array[0] == 'RSS') {
					gRSSPrimaryURL = array[1];
					gRSSPrimaryUserID = array[2];
					gRSSPrimaryPassword = array[3];
					gRSSSecondaryURL = array[4];
					gRSSSecondaryUserID = array[5];
					gRSSSecondaryPassword = array[6];
					gRSSDateTime = array[7];					
				}
				else if (array[0] == 'Config') {
					gConfigPrimaryURL = array[1];
					gConfigPrimaryUserID = array[2];
					gConfigPrimaryPassword = array[3];
					gConfigSecondaryURL = array[4];
					gConfigSecondaryUserID = array[5];
					gConfigSecondaryPassword = array[6];					
					gConfigDateTime = array[7];
				}				
			}
			window[gParentFunctionToCall]('CONFIGSETTINGSRETRIEVED');			
		}
		else {
			retrieveConfigSettings('DBADDRECORDSUCCESS');  //Call to start adding the necessary records
		}		
	}
	else if (msg == 'DBADDRECORDSUCCESS') {
		gInsertConfigCounter ++;
		if (gInsertConfigCounter > 4) {
			writeLog('retrieveConfigSettings Finished');
			window[gParentFunctionToCall]('CONFIGSETTINGSRETRIEVED');
		}
		else {
			sql = 'INSERT INTO ' + gTableNameConfig;
		  sql += '(type, primaryurl, primaryuserid, primarypassword, secondaryurl, secondaryuserid, secondarypassword, datetime)';
			if (gInsertConfigCounter == 1) {
			  sql += ' VALUES(\'Documents\',\'' + gDocumentsPrimaryURL + '\',\'' + gDocumentsPrimaryUserID + '\',\'' + gDocumentsPrimaryPassword + '\',\'';
			  sql += gDocumentsSecondaryURL + '\',\'' + gDocumentsSecondaryUserID + '\',\'' + gDocumentsSecondaryPassword + '\',\'' + '' + '\')';
			}		
			else if (gInsertConfigCounter == 2) {
			  sql += ' VALUES(\'Contacts\',\'' + gContactsPrimaryURL + '\',\'' + gContactsPrimaryUserID + '\',\'' + gContactsPrimaryPassword + '\',\'';
			  sql += gContactsSecondaryURL + '\',\'' + gContactsSecondaryUserID + '\',\'' + gContactsSecondaryPassword + '\',\'' + '' + '\')'; 	  
			}	
			else if (gInsertConfigCounter == 3) {
			  sql += ' VALUES(\'RSS\',\'' + gRSSPrimaryURL + '\',\'' + gRSSPrimaryUserID + '\',\'' + gRSSPrimaryPassword + '\',\'';
			  sql += gRSSSecondaryURL + '\',\'' + gRSSSecondaryUserID + '\',\'' + gRSSSecondaryPassword + '\',\'' + '' + '\')'; 	  
			}	
			else if (gInsertConfigCounter == 4) {
			  sql += ' VALUES(\'Config\',\'' + gConfigPrimaryURL + '\',\'' + gConfigPrimaryUserID + '\',\'' + gConfigPrimaryPassword + '\',\'';
			  sql += gConfigSecondaryURL + '\',\'' + gConfigSecondaryUserID + '\',\'' + gConfigSecondaryPassword + '\',\'' + '' + '\')'; 	  
			}			
			dbAddRecord(sql, 'retrieveConfigSettings');	
		}
	}
	else if (msg.substring(0,19) == 'DBGETRECORDSDERROR:') {
		errMsg = msg.substring(19);
	}
	else if (msg.substring(0,17) == 'DBADDRECORDERROR:') {
		errMsg = msg.substring(17);
	}
	else {
		errMsg = ('Invalid msg: ' + msg); 	
	} 
	if (errMsg != '') {
		writeLog('retrieveConfigSettings Finished - ERROR - ' + errMsg);
		window[gParentFunctionToCall]('CONFIGSETTINGSFAILED:' + errMsg);
	}
} 

function retrieveUserSettings(msg, functionToCall) {
//*************************************************************
//* This function will retrieve the user settings from the 
//* database and set the appropriate global variables.
//* Parms:
//*		Success/Error messages to analyze from called functions
//*		Function to call when finished
//* Value Returned: 
//*		none
//*************************************************************	

	var errMsg = '';
	var sql = '';
	if (msg == '') {	
		gParentFunctionToCall = functionToCall;	
		writeLog('retrieveUserSettings Starting');
		sql = 'SELECT showallgroup, listingorder, showcontactdividers, showtitleoncontactbar, showcompanyoncontactbar, datedisplay FROM ' + gTableNameUser + ' WHERE recordid = \'' + gUserRecordID + '\'';
		dbGetRecord(sql, 'retrieveUserSettings');
	}
	else if (msg == 'DBGETRECORDSUCCESS') {
		if (gDBRecordRetrieved == '') {		
		  sql = 'INSERT INTO ' + gTableNameUser;
		  sql += '(recordid, showallgroup, listingorder, showcontactdividers, showtitleoncontactbar, showcompanyoncontactbar, datedisplay)';
		  sql += ' VALUES(\'' + gUserRecordID + '\',\'' + gUserShowAllGroup + '\',\'' + gUserListingOrder + '\',\'' + gUserShowContactDividers + '\',\'';
		  sql += gUserShowTitleOnContactBar + '\',\'' + gUserShowCompanyOnContactBar + '\',\'' + gUserDateDisplay + '\')'; 	  
		  dbAddRecord(sql, 'retrieveUserSettings');		
		}
		else {
			retrieveUserSettings('DBADDRECORDSUCCESS');  //Call to simulate our adding the default values
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
		}	
		writeLog('retrieveUserSettings Finished');
		window[gParentFunctionToCall]('USERSETTINGSRETRIEVED');
	}
	else if (msg.substring(0,17) == 'DBGETRECORDERROR:') {
		errMsg = msg.substring(17);
	}
	else if (msg.substring(0,17) == 'DBADDRECORDERROR:') {
		errMsg = msg.substring(17);
	}
	else {
		errMsg = ('Invalid msg: ' + msg); 	
	} 
	if (errMsg != '') {
		writeLog('retrieveUserSettings Finished - ERROR - ' + errMsg);
		window[gParentFunctionToCall]('USERSETTINGSFAILED:' + errMsg);
	}
} 

function toggleSection(headerId, contentId, direction) {
//*************************************************************
//* This function will control how a header and content get 
//* displayed and hidden using the header as a toggle
//* Parms:
//*		name of header id tag
//*		name of content id tag
//* Value Returned: 
//*		Nothing
//*************************************************************		
	var header = document.getElementById(headerId);
	var content = document.getElementById(contentId);
	if (header && content) {
		var image = header.getElementsByTagName("img")[0];
		if (direction == undefined) {
			if (image.src.indexOf('minus.png') == -1) {
				direction = 'expand';
			}
			else {
				direction = 'collapse';
			}
		}
		else {
			direction = direction.toLowerCase();
		}

		var newIcon = '';
		if (direction == 'expand') {
			newIcon = 'images/minus.png';
			//Expand the contents
	    document.getElementById(headerId).style.borderBottomLeftRadius = '0em';
  	  document.getElementById(headerId).style.borderBottomRightRadius = '0em';
			content.style.display = '';
		}
		else {
			newIcon = 'images/plus.png';
	    document.getElementById(headerId).style.borderBottomLeftRadius = '.25em';
  	  document.getElementById(headerId).style.borderBottomRightRadius = '.25em';
			//Collapse the contents
		  content.style.display = 'none';
		}
		//Remove the existing icon
		header.removeChild(image);
		//Add the new icon and set the class
		var icon = new Image();
		icon.src = newIcon;
		icon.className = 'sectionHeaderImage';
		header.appendChild(icon);
	}
}

function validateConfigs() {
//*************************************************************
//* This function will validate the needed config settings for
//* the application
//* Parms:
//*   Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************		
	
	var errMsg = '';
	writeLog('validateConfigs Starting');
	if (gDocumentsPrimaryURL == '' && gDocumentsSecondaryURL == '') {	
		errMsg += '  No URL specified for documents lookup\n';
	}
	if (gContactsPrimaryURL == '' && gContactsSecondaryURL == '') {	
		errMsg += '  No URL specified for contacts lookup\n';
	}
	if (gRSSPrimaryURL == '' && gRSSSecondaryURL == '') {	
		errMsg += '  No URL specified for RSS lookup\n';
	}
	if (gConfigPrimaryURL == '' && gConfigSecondaryURL == '') {	
		errMsg += '  No URL specified for Config lookup\n';
	}
	if (errMsg != '') {
		gConfigsValid = false;
		errMsg = 'Unable to properly start this application!\nCritical error(s) were found:\n' + errMsg + '\nUnable to update content\n\nPlease contact your Administrator';
		alert (errMsg);
	}	
	writeLog('validateConfigs Finished');
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

	if (gTroubleShootingMode == true) {
		displayMessage(msg);
	}
}
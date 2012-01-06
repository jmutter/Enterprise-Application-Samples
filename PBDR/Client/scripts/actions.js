//*************************************************************
//* This library contains all functions and global variables
//* that are action based for the application
//*************************************************************	
window.onload=formLoad;
window.onorientationchange = function(){orientationChangeDetected();};
	
//Global variables
var gApplicationWaiting = false;
var gBrowserPlayBook = 'PlayBook';
var gBrowserGeneric = 'Browser';
var gBrowserRipplePlayBook = 'RipplePlayBook';
var gBrowserType = '';
var gDelim = '(OvO)';
var gConfigRecords = new Array();
var gConfigsValid = true;
var gInsertConfigCounter = 0;
var gParentFunctionToCall = '';
var gScreenDisplayed = '';
var gScreenNameContacts = 'contacts';
var gScreenNameDocuments = 'documents';
var gScreenNameGroups = 'groups';
var gScreenNameHome = 'home';
var gScreenNameNoContacts = 'nocontacts';
var gScreenNameNoRSS = 'norss';
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
var gConfigPrimaryURL = 'http://www.dagobahserver.com/pbdr/updatecheck.ashx';
var gConfigPrimaryUserID = '';
var gConfigPrimaryPassword = '';
var gConfigSecondaryURL = 'http://www.dagobahserver.com/pbdr/updatecheck.ashx';
var gConfigSecondaryUserID = '';
var gConfigSecondaryPassword = '';
var gContactsDateTime = '';
var gContactsPrimaryURL = 'http://www.dagobahserver.com/pbdr/Contacts.ashx';
var gContactsPrimaryUserID = '';
var gContactsPrimaryPassword = '';
var gContactsSecondaryURL = 'http://www.dagobahserver.com/pbdr/Contacts.ashx';
var gContactsSecondaryUserID = '';
var gContactsSecondaryPassword = '';
var gDocumentsDateTime = '';
var gDocumentsPrimaryURL = 'http://www.dagobahserver.com/pbdr/Documents.ashx';
var gDocumentsPrimaryUserID = '';
var gDocumentsPrimaryPassword = '';
var gDocumentsSecondaryURL = 'http://www.dagobahserver.com/pbdr/Documents.ashx';
var gDocumentsSecondaryUserID = '';
var gDocumentsSecondaryPassword = '';
//Delete these 3 lines when finished testing
var gDocuments2PrimaryURL = 'http://www.dagobahserver.com/pbdr/Documents2.ashx';
var gDocuments2SecondaryURL = 'http://www.dagobahserver.com/pbdr/Documents.ashx';
var gUseSmallDocumentCollection = false;

var gRSSDateTime = '';
var gRSSPrimaryURL = 'http://www.dagobahserver.com/pbdr/RSS.ashx';
var gRSSPrimaryUserID = '';
var gRSSPrimaryPassword = '';
var gRSSSecondaryURL = 'http://www.dagobahserver.com/pbdr/RSS.ashx';
var gRSSSecondaryUserID = '';
var gRSSSecondaryPassword = '';
//The next variables are for sound
var gSoundIntro = new Audio("Intro.mp3");
var gSoundWait = new Audio("Wait.mp3");

function browserDetection() {
//*************************************************************
//* This function will retrieve browser information
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
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
  if (gScreenDisplayed == '') {
  	//Hide all <div> areas when we first start.
 		displayDownloadStatus('Hide');
 		$('#showMenuBar').hide();
 		$('#' + gScreenNameHome).hide();
 		$('#' + gScreenNameDocuments).hide();
 		$('#' + gScreenNameNoContacts).hide();
 		$('#' + gScreenNameGroups).hide();
 		$('#' + gScreenNameContacts).hide(); 		
 		$('#' + gScreenNameNoRSS).hide();
 		$('#' + gScreenNameRSS).hide();
		$('#' + gScreenNameSettings).hide();
	}
	
	hideMenuBar();
	
	if (screenName == gScreenNameHome) {
		$('#showMenuBar').hide();
		//If this is the home screen, we need to show it, then show the ropes hanging
		if (gScreenDisplayed != '') {
			$('#' + gScreenDisplayed).hide();			
		}
 		$('#' + gScreenNameHome).show();
		showOptions(true);	 		
	}
	else {
		if (gScreenDisplayed == gScreenNameHome) {
			//If the previous screen was the home screen, pull the options ropes up
			showOptions(false);	
		}
		$('#showMenuBar').show();	
		switch (screenName) {
			case gScreenNameDocuments:
			  setTimeout(function() {
			  	$('#' + gScreenNameHome).fadeOut(750);
			  	$('#' + gScreenNameDocuments).fadeIn(1500);
			  }, 1000); 
			  break;
			case gScreenNameNoContacts:	  	
			  setTimeout(function() {
			  	$('#' + gScreenNameHome).fadeOut(500);
			  	var element = document.getElementById(gScreenNameNoContacts);
			  	element.onclick = null;  //Disable the onclick so they don't accidentally press the screen
			  	$('#' + gScreenNameNoContacts).show(1500);
			  	setTimeout(function() {
			  		element.onclick = function() {displayScreen(gScreenNameHome);};  //Add the onclick after 1.5 seconds of wait
			  	}, 1500); 
			  }, 500); 
			  break;
			case gScreenNameGroups:
			  if (gScreenDisplayed == gScreenNameContacts) {
					$('#' + gScreenNameContacts).fadeOut(1000);
			  	setTimeout(function() {
			  		$('#' + gScreenNameGroups).show(1500);
			  	}, 1000);  
			  }
			  else {
			  	setTimeout(function() {
			  		$('#' + gScreenNameHome).fadeOut(500);
			  		$('#' + gScreenNameGroups).show(1500);		
			  	}, 500);  
				}
			  break;
			case gScreenNameContacts:	
				$('#' + gScreenNameGroups).fadeOut(500);
				setTimeout(function() {
				 	$('#' + gScreenNameContacts).fadeIn(1500);  
				  }, 500);
				  break;
			case gScreenNameNoRSS:			  	
			  setTimeout(function() {
			  	$('#' + gScreenNameHome).fadeOut(500);
			  	var element = document.getElementById(gScreenNameNoRSS);
			  	element.onclick = null;  //Disable the onclick so they don't accidentally press the screen
			  	$('#' + gScreenNameNoRSS).show(1500);
			  	setTimeout(function() {
			  		element.onclick = function() {displayScreen(gScreenNameHome);};  //Add the onclick after 1.5 seconds of wait
			  	}, 1500); 
			  }, 500); 
			  break;
			case gScreenNameRSS:	
			  setTimeout(function() {
			  	$('#' + gScreenNameHome).fadeOut(500);
			  	$('#' + gScreenNameRSS).show(1500);		 	  	
			  }, 500); 
			  break;
			case gScreenNameSettings:	
				hideMenuBar();
				if (gScreenDisplayed != gScreenNameSettings) {	
					$('#' + gScreenDisplayed).fadeOut(1500);
					setTimeout(function() {
						$('#' + gScreenNameSettings).fadeIn(1500);
					}, 500);
				}
				break;
		}
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
	
	buildNoContactsScreen();
	buildNoRSSScreen();
	
	displayScreen('');  //Ensure all screens are hidden until we figure out what to display

 	//gDebugMode = true;
	writeLog('Application starting');		

  //Register required BlackBerry events
  registerPBEvents();
	
	getStarted('');		
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
//*		Nothing
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
		setupHome();
		displayScreen(gScreenNameHome);
		manageMusic('Start', 'Intro');
		downloadConfig('','getStarted');
		//getStarted('DOWNLOADCONFIGSUCCESS');
	}
	else if (msg == 'DOWNLOADCONFIGSUCCESS') {
		validateConfigs();
		if (gConfigsValid == true) {
			gDownloadWindowDisplayed = true;  //Set to prevent errant clicking of options	
			setTimeout(function() {
				downloadContent('');
			}, 2500);			
		}
	}
	else if (msg.substring(0,20) == 'DOWNLOADCONFIGERROR:') {
		errMsg = msg.substring(20);
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

function manageMusic(method, song) {
//*************************************************************
//* This function is executed to stop or start music requests
//* based on request type and song.
//* Parms:
//*		method to perform (start or stop)
//*   song to manipulate (intro or waiting)
//* Value Returned: 
//*		Nothing
//*************************************************************		
	
	writeLog('manageMusic Starting');
	if (song == undefined) {
		song = '';
	}

	if (method.toLowerCase() == 'start') {
		gStopMusicRope.fallDown();
		if (song.toLowerCase() == 'intro') {
			gSoundIntro.play();
		}
		else {
			gSoundWait.play();
		}
	}
	else {
		gStopMusicRope.pullUp();		
		if (song.toLowerCase() == 'intro' || song == '') {
			gSoundIntro.pause();
		}
		if (song.toLowerCase() == 'waiting' || song == '') {
			gSoundWait.pause();
		}
	}
	writeLog('manageMusic Finished');	
}

function manageWait(method) {
//*************************************************************
//* This function is executed to show or hide the PleaseWait
//* image and start the music
//* Parms:
//*		method to perform (show or hide)
//* Value Returned: 
//*		Nothing
//*************************************************************		
	
	writeLog('manageWait Starting');
	if (method.toLowerCase() == 'show') {
		gApplicationWaiting = true;
		showOptions(false);
		setTimeout(function() {
			gPleaseWaitRope.fallDown();
			setTimeout(function() {
				manageMusic('Start','Waiting');
				displayDownloadStatus('Show');	
			}, 500); 
		}, 500); 
	}
	else {
		gPleaseWaitRope.pullUp();
		setTimeout(function() {
			manageMusic('Stop','Waiting');
			displayDownloadStatus('false');
			setTimeout(function() {
				showOptions(true);
			}, 1000); 
		}, 500);
		gApplicationWaiting = false;
	}
	writeLog('manageWait Finished');	
}

function orientationChangeDetected() {
//*************************************************************
//* This function is executed whenever the device is rotated
//* and we can detect the orientation.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************			
	
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
  writeLog('  onSwipeDown');	
	blackberry.app.event.onSwipeDown(showMenuBar);
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
//*		Nothing
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
//*		Nothing
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

function showMenuBar() {
	if (gApplicationWaiting == false) {
		document.getElementById('menuBar').className = 'showMenuBar';
	}	
}

function hideMenuBar() {
	document.getElementById('menuBar').className = 'hideMenuBar';
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
	if (myTrim(gDocumentsPrimaryURL) == '') {	
		errMsg += '  No primary URL specified for documents download\n';
	}
	if (myTrim(gContactsPrimaryURL) == '') {	
		errMsg += '  No primary URL specified for contacts download\n';
	}
	if (myTrim(gRSSPrimaryURL) == '') {	
		errMsg += '  No primary URL specified for RSS download\n';
	}
	if (myTrim(gConfigPrimaryURL) == '') {	
		errMsg += '  No primary URL specified for Config download\n';
	}
	if (errMsg != '') {
		gConfigsValid = false;
		errMsg = 'Unable to properly start this application!\nCritical error(s) were found:\n' + errMsg + '\n\nPlease contact your Administrator';
		displayMessage (errMsg);
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
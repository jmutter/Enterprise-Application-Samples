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
var gTroubleShootingMode = false;
//The next variables are used to hold information relative to the user preferences
//This allows persistent storage of data for the user
var gUserDateDisplay = 'MM/DD/YYYY'; //MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD for displaying dates
var gUserListingOrder = 'LastName';  //LastName or FirstName for ordering the display of contacts
var gUserPlayWaitingMusic = 'True';  //True or False for playing music during downlaod of files
var gUserPlayIntroMusic = 'True';  //True or False for playing music at introduction
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

var timer;
function dialogWobble () {
  
  var dialog = document.getElementById('dialog');
  dialog.className = 'wobble';
  clearTimeout(timer);
}

function displayMessage(content, dialogType, returnFunction) {
//*************************************************************
//* This function will display a message using the requested parameters.
//* The attempt is to simulate the Javascript alert() function by 
//* making this appear modal or synchronous.  To accomplish this,
//* a callback function is required in order for this to wait and complete.
//* If no dialogType is supplied, and alert is simply issued.
//* Parms:
//*		Content of message
//*   Type of dialog (okOnly or YesNo)
//*   Function to call when a button has been clicked
//* Value Returned: 
//*		Type of button clicked as a parameter to the function requested
//*************************************************************
	
	menuBar('Hide');
	if (dialogType == undefined ) {
		alert (content);
	}
	else {
		if (content.substring(0,1) != '<') {
			content = content.replace("\n", '</p><p>');
			content = '<p>' + content + '</p>';
		}

		$('#yesnobuttons').hide();
		$('#okbutton').hide();
		if(dialogType.toLowerCase() == 'yesno') {
			$('#yesnobuttons').show();
		}
		else {
			$('#okbutton').show();
		}	
		$('#dialog').modal({
			//closeHTML: "<a href='#' title='Close' class='modal-close'>x</a>",
			position: ["20%",],
			overlayId: 'overlay',
			containerId: 'dialog', 
			onShow: function (dialog) {
				var modal = this;
				$('.content', dialog.data[0]).append(content);	
				//Need the timer to allow code to complete to setup the click functions for our buttons	
        timer = setTimeout(dialogWobble, 100);
				//Setup the classes for when the user clicks a button
				$('.ok', dialog.data[0]).click(function () {
					if ($.isFunction(returnFunction)) {
						returnFunction('USERCLICKEDOK');
					}
					$.modal.close();  //Close the dialog 
				});
				$('.yes', dialog.data[0]).click(function () {
					if ($.isFunction(returnFunction)) {
						returnFunction('USERCLICKEDYES');
					}
					$.modal.close();  //close the dialog 
				});
				$('.no', dialog.data[0]).click(function () {
					if ($.isFunction(returnFunction)) {
						returnFunction('USERCLICKEDNO');
					}
					$.modal.close();  //Close the dialog 
				});				
			}
		});
	}	
}

function displayScreen(screenName, displayHomeScreenRopes) {
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
		displayDownloadStatus('false'); 	
 		$('#' + gScreenNameHome).hide();
 		$('#' + gScreenNameDocuments).hide();
 		$('#' + gScreenNameNoContacts).hide();
 		$('#' + gScreenNameGroups).hide();
 		$('#' + gScreenNameContacts).hide(); 		
 		$('#' + gScreenNameNoRSS).hide();
 		$('#' + gScreenNameRSS).hide();
		$('#' + gScreenNameSettings).hide();
	}
	
 	menuBar('Hide');
	
	if (screenName == gScreenNameHome) {
		//If this is the home screen, we need to show it, then show the ropes hanging
		if (gScreenDisplayed != '') {
			$('#' + gScreenDisplayed).hide();			
		}
 		$('#' + gScreenNameHome).show();
 		if (displayHomeScreenRopes == undefined || displayHomeScreenRopes == true) {
			showOptions(true);	 		
		}
	}
	else {
		if (gScreenDisplayed == gScreenNameHome && screenName != gScreenNameSettings) {
			//If the previous screen was the home screen, pull the options ropes up
			showOptions(false);	
		}
		switch (screenName) {
			case gScreenNameDocuments:
				manageMusic('Stop');
			  setTimeout(function() {
			  	$('#' + gScreenNameHome).fadeOut(750);
			  	$('#' + gScreenNameDocuments).fadeIn(1500);
			  }, 1000); 
			  break;
			case gScreenNameNoContacts:	  	
				manageMusic('Stop');
			  $('#' + gScreenNameHome).hide();
			  setTimeout(function() {
			  	var element = document.getElementById(gScreenNameNoContacts);
			  	element.onclick = null;  //Disable the onclick so they don't accidentally press the screen
			  	$('#' + gScreenNameNoContacts).slideUp(1000);
			  	setTimeout(function() {
			  		element.onclick = function() {displayScreen(gScreenNameHome);};  //Add the onclick after 1.5 seconds of wait
			  	}, 1500); 
			  }, 500); 
			  break;
			case gScreenNameGroups:
				manageMusic('Stop');			
			  if (gScreenDisplayed == gScreenNameHome) {
			  	setTimeout(function() {
			  		$('#' + gScreenNameHome).hide();
			  		$('#' + gScreenNameGroups).show(500);		
			  	}, 500);  
			  }
			  else {
					$('#' + gScreenNameContacts).hide();
			  	$('#' + gScreenNameGroups).show(750);
				}
			  break;
			case gScreenNameContacts:		
				$('#' + gScreenNameGroups).hide();
				$('#' + gScreenNameContacts).fadeIn(1000);  
				break;
			case gScreenNameNoRSS:		
				manageMusic('Stop');				  	
			  $('#' + gScreenNameHome).hide();
			  setTimeout(function() {
			  	var element = document.getElementById(gScreenNameNoRSS);
			  	element.onclick = null;  //Disable the onclick so they don't accidentally press the screen
			  	$('#' + gScreenNameNoRSS).slideUp(1000);
			  	setTimeout(function() {
			  		element.onclick = function() {displayScreen(gScreenNameHome);};  //Add the onclick after 1.5 seconds of wait
			  	}, 1500); 
			  }, 500); 
			  break;
			case gScreenNameRSS:
				manageMusic('Stop');				
			  setTimeout(function() {
			  	$('#' + gScreenNameHome).hide();
			  	$('#' + gScreenNameRSS).show(500);		
			  }, 500);  
			  break;
			case gScreenNameSettings:	
				if (gScreenDisplayed != gScreenNameSettings) {	
					setTimeout(function() {				
						$('#settings').modal({
							//closeHTML: "<a href='#' title='Close' class='modal-close'>x</a>",
							position: ["7%",],
							overlayId: 'overlay',
							containerId: 'settings', 
							onShow: function (settings) {
								var modal = this;
								//Setup the classes for when the user clicks close button
								$('.settingsCloseButton', settings.data[0]).click(function () {
									saveSettings('');
									$.modal.close();  //Close the dialog 
								});						
							}
						});
					}, 500);
				}
				break;
		}
	}
	if (screenName != gScreenNameSettings) {
		gScreenDisplayed = screenName;
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

	writeLog('Application starting');		

	displayScreen('');  //Ensure all screens are hidden until we figure out what to display
	
	//Ensure unneeded ropes are pulled up
	gDownloadingContactsRope.pullUp();
	gDownloadingRSSRope.pullUp();			
	gDownloadingDocumentsRope.pullUp();
	gPleaseWaitRope.pullUp();
	gStopMusicRope.pullUp();		
	
	//Detect browser type	
	browserDetection();
	
	//Apply the appropriate backgrounds to our screens
	buildNoContactsScreen();
	buildNoRSSScreen();
	var width = screen.availWidth + 1; 
	var height = screen.availHeight + 1; 
	document.getElementById(gScreenNameGroups).style.backgroundImage = "url(images/background.png)";
	document.getElementById(gScreenNameGroups).style.width = width + "px";
	document.getElementById(gScreenNameGroups).style.height = height + "px";
	document.getElementById(gScreenNameContacts).style.backgroundImage = "url(images/background.png)";
	document.getElementById(gScreenNameContacts).style.width = width + "px";
	document.getElementById(gScreenNameContacts).style.height = height + "px";	
	document.getElementById(gScreenNameRSS).style.backgroundImage = "url(images/background.png)";
	document.getElementById(gScreenNameRSS).style.width = width + "px";
	document.getElementById(gScreenNameRSS).style.height = height + "px";	
		


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
		validateConfigs();
		//If database configuration values were read and accessible, let's proceed
		if (gConfigsValid == true) {
			setTimeout(function() {
				downloadConfig('','getStarted');				
			}, 1000);		
		}	
	}
	else if (msg == 'DOWNLOADCONFIGSUCCESS') {
		downloadContent('');
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
		displayMessage('<p>Error starting PBDR application:<\p>' + errMsg + '<p><\p><p>Please exit and restart.  If this problem persists, please contact your Administrator<\p>', 'OkOnly');
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
		if (song.toLowerCase() == 'intro' && gUserPlayIntroMusic == 'True') {
			gStopMusicRope.fallDown();
			gSoundIntro.play();
		}
		else if (song.toLowerCase() == 'waiting' && gUserPlayWaitingMusic == 'True') {
			gStopMusicRope.fallDown();
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
			gDownloadingContactsRope.fallDown();
			gDownloadingRSSRope.fallDown();			
			gDownloadingDocumentsRope.fallDown();
			manageMusic('Start','Waiting');
			setTimeout(function() {
				gPleaseWaitRope.fallDown();
				//displayDownloadStatus('Show');	
			}, 1000); 
		}, 500); 
	}
	else  {
		setTimeout(function() {
			gDownloadingContactsRope.pullUp();
			gDownloadingRSSRope.pullUp();			
			gDownloadingDocumentsRope.pullUp();
			gPleaseWaitRope.pullUp();
			setTimeout(function() {
				manageMusic('Stop','Waiting');
				displayDownloadStatus('false');
				setTimeout(function() {
					showOptions(true);
				}, 1000); 
			}, 500);
		}, 500);
		gApplicationWaiting = false;
	}
	writeLog('manageWait Finished');	
}

function menuBar(method) {
//*************************************************************
//* This function will show or hide the menu bar based on the 
//* method requested.
//* Parms:
//*   Method to perform on the menuBar (Show or Hide)
//* Value Returned: 
//*		Nothing
//*************************************************************		
	
	if (method.toLowerCase() == 'show') {
		if (gScreenDisplayed != gScreenNameSettings) {
			document.getElementById('menuBar').className = 'showMenuBar';
		}
	}
	else {
		document.getElementById('menuBar').className = 'hideMenuBar';
	}
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
	//blackberry.app.event.onBackground(handleBackground);
  writeLog('  onForeground');	
	blackberry.app.event.onForeground(handleForeground);	
  writeLog('  onSwipeDown');	
	blackberry.app.event.onSwipeDown(swipeDownShowMenuBar);
  writeLog('registerPBEvents Starting');
}

function requestDisplay(visualToDisplay) {
//*************************************************************
//* This function will display the requested option so we have 
//* a consistent start point to control any UI elements
//* Parms:
//*		Option to be displayed
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	switch (visualToDisplay.toLowerCase()) {
		case 'menubar':
			menuBar('Show');
		  break;
		case 'documents':
			buildDocumentsScreen();
		  break;
		case 'groups':		
			buildGroupsScreen('');
		  break;
		case 'rss':
			buildRSSScreen('');
		  break;
	}  
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
		sql = 'SELECT showallgroup, listingorder, showcontactdividers, showtitleoncontactbar, showcompanyoncontactbar, datedisplay, playintromusic, playwaitingmusic FROM ' + gTableNameUser + ' WHERE recordid = \'' + gUserRecordID + '\'';
		dbGetRecord(sql, 'retrieveUserSettings');
	}
	else if (msg == 'DBGETRECORDSUCCESS') {
		if (gDBRecordRetrieved == '') {		
		  sql = 'INSERT INTO ' + gTableNameUser;
		  sql += '(recordid, showallgroup, listingorder, showcontactdividers, showtitleoncontactbar, showcompanyoncontactbar, datedisplay, playintromusic, playwaitingmusic)';
		  sql += ' VALUES(\'' + gUserRecordID + '\',\'' + gUserShowAllGroup + '\',\'' + gUserListingOrder + '\',\'' + gUserShowContactDividers + '\',\'';
		  sql += gUserShowTitleOnContactBar + '\',\'' + gUserShowCompanyOnContactBar + '\',\'' + gUserDateDisplay + '\',\'' + gUserPlayIntroMusic + '\',\'' + gUserPlayWaitingMusic + '\')'; 	  
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
		  gUserPlayIntroMusic = array[6];
		  gUserPlayWaitingMusic = array[7];
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

function swipeDownShowMenuBar() {
//*************************************************************
//* This function is called when the user makes the swiping 
//* gesture from the bezel to bring up our menu bar.  Since the
//* registration of the API event call won't allow parameters
//* to be passed to a function, this had to be created to call
//* the appropriate function with the correct parameter.
//* Parms:
//*   Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************
	
	requestDisplay('MenuBar')
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
		errMsg = '<p>Unable to properly start this application!</p><p>Critical error(s) were found:</p>' + errMsg + '<p>Please contact your Administrator</p>';
		displayMessage (errMsg,'OkOnly');
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
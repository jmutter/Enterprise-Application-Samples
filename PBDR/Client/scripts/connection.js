//*************************************************************
//* This library contains all functions and global variables
//* that pertain to connections to and from the device.
//*************************************************************	

//Global Variables
var gConfigUpdateCounter = 0;
var gContactsServerDateTime = '';
var gDocumentsServerDateTime = '';
var gDownloadRequest = '';
var gDownloadResults = '';
var gDownloadWindowDisplayed = false;
var gJSONPayload;
var gProgressBarDocumentsCounter = 0;
var gProgressBarDocumentsMaximum = 0;
var gProgressBarDocumentsPercentage = 0;
var gProgressBarOverallCounter = 0;
var gProgressBarOverallMaximum = 0;
var gProgressBarOverallPercentage = 0;
var gRequestingFunction = '';
var gRSSServerDateTime = '';

function displayDownloadStatus(method) {
//*************************************************************
//* This function will show or hide the download status area
//* Parms:
//*		Method to show or hide status
//* Value Returned: 
//*		Nothing
//*************************************************************		
	
	if (method.toLowerCase() == 'show') {
	 	$('#downloadstatus').fadeIn(1500);
	}
	else {
		if (gScreenDisplayed == '') {
			$('#downloadstatus').hide();
		}
		else {
	 		$('#downloadstatus').fadeOut(1000);
		}
 		document.getElementById('overallprogress').style.width = 0 + "%";
 		document.getElementById('documentprogress').style.width = 0 + "%";
	 	$('#documentsbar').hide();
	}
}

function downloadConfig(msg, functionToCall) {
//*************************************************************
//* This function attempts to download the config and update
//* JSON payloads from the server.  There is no prompt while 
//* this is taking place.   It is also called from the following
//* functions upon completion with success or failure:
//*   sendSecondaryHTTPRequest()
//*   processJSONPayload()
//*   processConfigPayload()
//* Parms:
//*		Success/failure information from the called functions
//*   Function to call when complete (success or failure)
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	var errMsg = '';
	if (msg == '') {
		gParentFunctionToCall = functionToCall;	
		gRequestingFunction = 'downloadConfig';	
		gDownloadRequest = 'Config';	
		if (blackberry.system.hasDataCoverage() == true) {	
			testingSendPrimaryHTTPRequest(gConfigPrimaryURL, gConfigSecondaryURL);	
		  //sendPrimaryHTTPRequest(gConfigPrimaryURL, gConfigSecondaryURL);	
 		}
 		else {		
			window[gParentFunctionToCall]('DOWNLOADCONFIGSUCCESS'); 
		}
	}
 	else if (msg == 'CONFIGLOADED') {
		window[gParentFunctionToCall]('DOWNLOADCONFIGSUCCESS');  		
	}
 	else if (msg.substring(0,30) == 'SENDSECONDARYHTTPREQUESTERROR:') {
		errMsg = 'Unable to contact server(s): ' + msg.substring(30);
	}
 	else if (msg.substring(0,24) == 'PROCESSJSONPAYLOADERROR:') {
		errMsg = msg.substring(24);
	}
 	else if (msg.substring(0,16) == 'CONFIGLOADERROR:') {
		errMsg = msg.substring(16);
	}
 	else {
 		errMsg = 'Invalid msg: ' + msg;
 	} 	
 	if (errMsg != '') {
 		window[gParentFunctionToCall]('DOWNLOADCONFIGERROR:' + errMsg); 	
	}			
}

function downloadContent(msg) {
//*************************************************************
//* This function prompts the user if they wish to download
//* the latest content by showing them when the last download
//* was completed for each content type.  It is also called 
//* from the following functions upon completion with success
//* or failure:
//*   sendSecondaryHTTPRequest()
//*   processJSONPayload()
//*   processContactsPayload()
//*   processRSSPayload()
//*   processDocumentsPayload()
//* Parms:
//*		Success/failure information from the called functions
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	var proceedWithDownload = true;
	var errMsg = '';
	if (msg == '') {
		if (blackberry.system.hasDataCoverage() == true) {			
			gDownloadWindowDisplayed = true;
			gRequestingFunction = 'downloadContent';
			gProgressBarOverallMaximum = 3;
			document.getElementById('overallprogressbarheader').innerText = 'Overall (' + gProgressBarOverallMaximum + ' Types)';		
			gProgressBarOverallCounter = 0;
			gProgressBarOverallPercentage = gProgressBarOverallMaximum / 100;
			var display = 'The content of this application was last updated:\n';
			var dateTime = '';
			if (gDocumentsDateTime == '') {
				dateTime = 'Never';
			}
			else {
				dateTime = convertDateTime(gDocumentsDateTime, gUserDateDisplay);	
			}
			display += '\n    Documents:';
			display += '\n        Local:  ' + dateTime;
			display += '\n        Server: ' + convertDateTime(gDocumentsServerDateTime, gUserDateDisplay);		
			if (gContactsDateTime == '') {
				dateTime = 'Never';
			}
			else {
				dateTime = convertDateTime(gContactsDateTime, gUserDateDisplay);	
			}
			display += '\n    Contacts:';
			display += '\n        Local:  ' + dateTime;
			display += '\n        Server: ' + convertDateTime(gContactsServerDateTime, gUserDateDisplay);	
			if (gRSSDateTime == '') {
				dateTime = 'Never';
			}
			else {
				dateTime = convertDateTime(gRSSDateTime, gUserDateDisplay);	
			}
			display += '\n    RSS:';
			display += '\n        Local:  ' + dateTime;
			display += '\n        Server: ' + convertDateTime(gRSSServerDateTime, gUserDateDisplay);		
					
			display += '\n\nWould you like to request the latest information now?';	
			proceedWithDownload = confirm(display);		
		
	 		if (proceedWithDownload == true) {
				//When completed testing remove these 5 lines
				gUseSmallDocumentCollection = false;
				var answer = confirm ('Do you want to download the large document collection?');
				if (answer == false) {
					gUseSmallDocumentCollection = true;
				}	
	 			manageMusic('Stop'); 	
	 		}		
 		}
 		else {
 			displayMessage ('There doesn\'t appear to be sufficient coverage to perform the server lookup.\n\nYou will only have access to the current content on the device.')
 			proceedWithDownload = false;
 		}
 		gDownloadRequest = '';
 		gDownloadWindowDisplayed = false;
 	}
 	else if (msg == 'CONTACTSLOADED') {
		//Nothing to do
	}
 	else if (msg == 'RSSLOADED') {
		//Nothing to do
	}	
 	else if (msg == 'DOCUMENTSLOADED') {
		//Nothing to do
	}	
 	else if (msg.substring(0,30) == 'SENDSECONDARYHTTPREQUESTERROR:') {
		//errMsg = msg.substring(30);
		errMsg = 'Unable to contact server(s): ' + msg.substring(30);
	}
 	else if (msg.substring(0,24) == 'PROCESSJSONPAYLOADERROR:') {
		errMsg = msg.substring(24);
	}
 	else if (msg.substring(0,18) == 'CONTACTSLOADERROR:') {
		errMsg = msg.substring(18);
	}
 	else if (msg.substring(0,13) == 'RSSLOADERROR:') {
		errMsg = msg.substring(13);
	}
 	else if (msg.substring(0,19) == 'DOCUMENTSLOADERROR:') {
		errMsg = msg.substring(19);
	}	
 	else {
 		errMsg = 'Invalid msg: ' + msg;
 	} 	
 	if (errMsg != '') {
 		gDownloadResults += '\n    ' + gDownloadRequest + ' - ' + errMsg;
 	}		

 	if (proceedWithDownload == true) {
		switch (gDownloadRequest) {
			case '':
				manageWait('Show');
			  gDownloadRequest = 'Contacts';
				setTimeout(function() {		
			  	//testingSendPrimaryHTTPRequest(gContactsPrimaryURL, gContactsSecondaryURL);				  
			  	sendPrimaryHTTPRequest(gContactsPrimaryURL, gContactsSecondaryURL);						  	
			  }, 1000);
			  break;
			case 'Contacts':
				updateOverAllProgressBar();	
			  gDownloadRequest = 'RSS';
				setTimeout(function() {	
					hideDownloadingOption('Contacts');
					setTimeout(function() {				
				  	//testingSendPrimaryHTTPRequest(gRSSPrimaryURL, gRSSSecondaryURL);	
				  	sendPrimaryHTTPRequest(gRSSPrimaryURL, gRSSSecondaryURL);	
			  	}, 1000); 
			  }, 1000); 						  	
			  break;
			case 'RSS':
				updateOverAllProgressBar();
	 			$('#documentsbar').show();  //Show our additional progress bar that is only needed for documents				
			  gDownloadRequest = 'Documents';
				setTimeout(function() {	
					hideDownloadingOption('RSS');
					setTimeout(function() {
				  	//testingSendPrimaryHTTPRequest(gRSSPrimaryURL, gRSSSecondaryURL);	
//				  	sendPrimaryHTTPRequest(gDocumentsPrimaryURL, gDocumentsSecondaryURL);	
				//When completed testing remove these 7 lines and uncomment the line above
						if (gUseSmallDocumentCollection == false) {
						  sendPrimaryHTTPRequest(gDocumentsPrimaryURL, gDocumentsSecondaryURL);	
						}
						else {
					  	sendPrimaryHTTPRequest(gDocuments2PrimaryURL, gDocuments2SecondaryURL);	
						}	
			  	}, 1000); 
			  }, 1000); 
			  break;
			case 'Documents':
				updateOverAllProgressBar();
				hideDownloadingOption('Documents');
				setTimeout(function() {
					if (gDownloadResults != '') {
					 	gDownloadResults = 'Contacts, RSS, and Document downloads were attempted.\n\nOne or more issues/errors occurred while downloading and updating the information:' + gDownloadResults;
				  	displayMessage (gDownloadResults);
				  }	
				  else {
				  	displayMessage ('The latest Contacts, RSS, and Documents have been downloaded.');
				  }	
					manageWait('Hide');
				}, 1000);		  
			  break;
		}
	}
}

function processConfigPayload(msg) {
//*************************************************************
//* This function will process the Updates and Config payload to
//* put the information into the table and global variables
//* Parms:
//*		Success/Error messages to analyze from called functions
//* Value Returned: 
//*		Nothing
//*************************************************************	

	var sql = '';
	var errMsg = '';	
	if (msg == '') {
  	writeLog('ProcessUpdatesPayload Starting');
  	writeLog('Analyzing JSON');
		if (gJSONPayload.Config[0].configprimaryurl == undefined) {
			gJSONPayload.Config[0].configprimaryurl = '';
		}	
		if (gJSONPayload.Config[0].configprimaryuserid == undefined) {
			gJSONPayload.Config[0].configprimaryuserid = '';
		}
		if (gJSONPayload.Config[0].configprimarypassword == undefined) {
			gJSONPayload.Config[0].configprimarypassword = '';
		}				
		if (gJSONPayload.Config[0].configsecondaryurl == undefined) {
			gJSONPayload.Config[0].configsecondaryurl = '';
		}	
		if (gJSONPayload.Config[0].configsecondaryuserid == undefined) {
			gJSONPayload.Config[0].configsecondaryuserid = '';
		}
		if (gJSONPayload.Config[0].configsecondarypassword == undefined) {
			gJSONPayload.Config[0].configsecondarypassword = '';
		}	
		if (myTrim(gJSONPayload.Config[0].configprimaryurl) != '') {
			gConfigPrimaryURL = myTrim(gJSONPayload.Config[0].configprimaryurl)
			gConfigPrimaryUserID = myTrim(gJSONPayload.Config[0].configprimaryuserid);
			gConfigPrimaryPassword = myTrim(gJSONPayload.Config[0].configprimarypassword);
			gConfigSecondaryURL = myTrim(gJSONPayload.Config[0].configsecondaryurl);
			gConfigSecondaryUserID = myTrim(gJSONPayload.Config[0].configsecondaryuserid);
			gConfigSecondaryPassword = myTrim(gJSONPayload.Config[0].configsecondarypassword);
		}
				
		if (gJSONPayload.Config[0].contactsprimaryurl == undefined) {
			gJSONPayload.Config[0].contactsprimaryurl = '';
		}			
		if (gJSONPayload.Config[0].contactsprimaryuserid == undefined) {
			gJSONPayload.Config[0].contactsprimaryuserid = '';
		}
		if (gJSONPayload.Config[0].contactsprimarypassword == undefined) {
			gJSONPayload.Config[0].contactsprimarypassword = '';
		}			
		if (gJSONPayload.Config[0].contactssecondaryurl == undefined) {
			gJSONPayload.Config[0].contactssecondaryurl = '';
		}	
		if (gJSONPayload.Config[0].contactssecondaryuserid == undefined) {
			gJSONPayload.Config[0].contactssecondaryuserid = '';
		}
		if (gJSONPayload.Config[0].contactssecondarypassword == undefined) {
			gJSONPayload.Config[0].contactssecondarypassword = '';
		}	
		if (myTrim(gJSONPayload.Config[0].contactsprimaryurl) != '') {
			gContactsPrimaryURL = myTrim(gJSONPayload.Config[0].contactsprimaryurl)
			gContactsPrimaryUserID = myTrim(gJSONPayload.Config[0].contactsprimaryuserid);
			gContactsPrimaryPassword = myTrim(gJSONPayload.Config[0].contactsprimarypassword);
			gContactsSecondaryURL = myTrim(gJSONPayload.Config[0].contactssecondaryurl);
			gContactsSecondaryUserID = myTrim(gJSONPayload.Config[0].contactssecondaryuserid);
			gContactsSecondaryPassword = myTrim(gJSONPayload.Config[0].contactssecondarypassword);
		}
		
		if (gJSONPayload.Config[0].documentsprimaryurl == undefined) {
			gJSONPayload.Config[0].documentsprimaryurl = '';
		}			
		if (gJSONPayload.Config[0].documentsprimaryuserid == undefined) {
			gJSONPayload.Config[0].documentsprimaryuserid = '';
		}
		if (gJSONPayload.Config[0].documentsprimarypassword == undefined) {
			gJSONPayload.Config[0].documentsprimarypassword = '';
		}		
		if (gJSONPayload.Config[0].documentssecondaryurl == undefined) {
			gJSONPayload.Config[0].documentssecondaryurl = '';
		}	
		if (gJSONPayload.Config[0].documentssecondaryuserid == undefined) {
			gJSONPayload.Config[0].documentssecondaryuserid = '';
		}
		if (gJSONPayload.Config[0].documentssecondarypassword == undefined) {
			gJSONPayload.Config[0].documentssecondarypassword = '';
		}	
		if (myTrim(gJSONPayload.Config[0].documentsprimaryurl) != '') {
			gDocumentsPrimaryURL = myTrim(gJSONPayload.Config[0].documentsprimaryurl)
			gDocumentsPrimaryUserID = myTrim(gJSONPayload.Config[0].documentsprimaryuserid);
			gDocumentsPrimaryPassword = myTrim(gJSONPayload.Config[0].documentsprimarypassword);
			gDocumentsSecondaryURL = myTrim(gJSONPayload.Config[0].documentssecondaryurl);
			gDocumentsSecondaryUserID = myTrim(gJSONPayload.Config[0].documentssecondaryuserid);
			gDocumentsSecondaryPassword = myTrim(gJSONPayload.Config[0].documentssecondarypassword);
		}
		
		if (gJSONPayload.Config[0].rssprimaryurl == undefined) {
			gJSONPayload.Config[0].rssprimaryurl = '';
		}	
		if (gJSONPayload.Config[0].rssprimaryuserid == undefined) {
			gJSONPayload.Config[0].rssprimaryuserid = '';
		}
		if (gJSONPayload.Config[0].rssprimarypassword == undefined) {
			gJSONPayload.Config[0].rssprimarypassword = '';
		}	
		if (gJSONPayload.Config[0].rsssecondaryurl == undefined) {
			gJSONPayload.Config[0].rsssecondaryurl = '';
		}	
		if (gJSONPayload.Config[0].rsssecondaryuserid == undefined) {
			gJSONPayload.Config[0].rsssecondaryuserid = '';
		}
		if (gJSONPayload.Config[0].rsssecondarypassword == undefined) {
			gJSONPayload.Config[0].rsssecondarypassword = '';
		}			
		if (myTrim(gJSONPayload.Config[0].rssprimaryurl) != '') {
			gRSSPrimaryURL = myTrim(gJSONPayload.Config[0].rssprimaryurl)
			gRSSPrimaryUserID = myTrim(gJSONPayload.Config[0].rssprimaryuserid);
			gRSSPrimaryPassword = myTrim(gJSONPayload.Config[0].rssprimarypassword);
			gRSSSecondaryURL = myTrim(gJSONPayload.Config[0].rsssecondaryurl);
			gRSSSecondaryUserID = myTrim(gJSONPayload.Config[0].rsssecondaryuserid);
			gRSSSecondaryPassword = myTrim(gJSONPayload.Config[0].rsssecondarypassword);
		}
		
		//Let's get the server datetime for last updates
		if (gJSONPayload.Updates[0].contacts == undefined) {
			gJSONPayload.Updates[0].contacts = '';
		}			
		gContactsServerDateTime = gJSONPayload.Updates[0].contacts;
		if (gJSONPayload.Updates[0].documents == undefined) {
			gJSONPayload.Updates[0].documents = '';
		}	
		gDocumentsServerDateTime = gJSONPayload.Updates[0].documents;
		if (gJSONPayload.Updates[0].rss == undefined) {
			gJSONPayload.Updates[0].rss = '';
		}	
		gRSSServerDateTime = gJSONPayload.Updates[0].rss;
	}
	if (msg == '' || msg == 'DBUPDATERECORDSUCCESS') {
		gConfigUpdateCounter ++;	
		var sql = ''	
		switch (gConfigUpdateCounter) {
			case 1:
				if (gConfigPrimaryURL != '') {
					sql = 'UPDATE ' + gTableNameConfig + ' SET primaryurl = \'' + gConfigPrimaryURL + '\', primaryuserid = \'' + gConfigPrimaryUserID + '\'';
					sql += ', primarypassword = \'' + gConfigPrimaryPassword + '\', secondaryurl = \'' + gConfigSecondaryURL + '\'';
					sql += ', secondaryuserid = \'' + gConfigSecondaryUserID + '\', secondarypassword = \'' + gConfigSecondaryPassword + '\'';
					sql += ' WHERE type = \'Config\'';
				}
			  break;
			case 2:
				if (gContactsPrimaryURL != '') {
					sql = 'UPDATE ' + gTableNameConfig + ' SET primaryurl = \'' + gContactsPrimaryURL + '\', primaryuserid = \'' + gContactsPrimaryUserID + '\'';
					sql += ', primarypassword = \'' + gContactsPrimaryPassword + '\', secondaryurl = \'' + gContactsSecondaryURL + '\'';
					sql += ', secondaryuserid = \'' + gContactsSecondaryUserID + '\', secondarypassword = \'' + gContactsSecondaryPassword + '\'';
					sql += ' WHERE type = \'Contacts\'';
				}
			  break;
			case 3:
				if (gDocumentsPrimaryURL != '') {
					sql = 'UPDATE ' + gTableNameConfig + ' SET primaryurl = \'' + gDocumentsPrimaryURL + '\', primaryuserid = \'' + gDocumentsPrimaryUserID + '\'';
					sql += ', primarypassword = \'' + gDocumentsPrimaryPassword + '\', secondaryurl = \'' + gDocumentsSecondaryURL + '\'';
					sql += ', secondaryuserid = \'' + gDocumentsSecondaryUserID + '\', secondarypassword = \'' + gDocumentsSecondaryPassword + '\'';
					sql += ' WHERE type = \'Documents\'';
				}
			  break;
			case 4:
				if (gRSSPrimaryURL != '') {
					sql = 'UPDATE ' + gTableNameConfig + ' SET primaryurl = \'' + gRSSPrimaryURL + '\', primaryuserid = \'' + gRSSPrimaryUserID + '\'';
					sql += ', primarypassword = \'' + gRSSPrimaryPassword + '\', secondaryurl = \'' + gRSSSecondaryURL + '\'';
					sql += ', secondaryuserid = \'' + gRSSSecondaryUserID + '\', secondarypassword = \'' + gRSSSecondaryPassword + '\'';
					sql += ' WHERE type = \'RSS\'';
				}				
			  break;
			case 5:
			  gConfigDateTime = getDate('yyyymmdd') + getTime('hhmmss');
  			sql = 'UPDATE ' + gTableNameConfig + ' SET datetime = \'' + gConfigDateTime + '\' WHERE type = \'Config\'';
			  break;
		}
		if (gConfigUpdateCounter < 6) {
			//We performed a check to ensure there was at least the primary URL in order to 'fetch' data
			//If there wasn't one in the payload, we don't want to update the record since there had to be one to start
			//This can be fixed by correcting the JSON payload on the server
			if (sql != '') {
				dbUpdateRecord(sql, 'processConfigPayload'); 
			}
			else {
				//Since there wasn't an SQL statement (primary URL check) call ourselves to simulate a successful database update
				processConfigPayload('DBUPDATERECORDSUCCESS');
			}
		}
		else {	
			writeLog('processConfigPayload Finished');
			window[gRequestingFunction]('CONFIGLOADED'); 			
		}
	}
	else if (msg.substring(0,20) == 'DBUPDATERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else if (msg.substring(0,20) == 'DBDELETERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else if (msg.substring(0,17) == 'DBADDRECORDERROR:') {
		errMsg = msg.substring(17);
	}
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		writeLog('processRSSPayload Finished - ERROR - ' + errMsg);
		window[gRequestingFunction]('CONFIGLOADERROR:'+ errMsg);
	}	
}

function processJSONPayload() {
//*************************************************************
//* This function is called from either sendPrimaryHTTPRequest
//* or sendSecondaryHTTPRequest to determine the validity of 
//* the JSON payload and call the appropriate function to process
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************	

	writeLog('processJSONPayload Starting');
	if (gJSONPayload.Config != undefined) {	
		writeLog('processJSONPayload Finished - Config payload');
		processConfigPayload('');					
	}		
	else if (gJSONPayload.Contacts != undefined) {	
		writeLog('processJSONPayload Finished - Contact payload');
		processContactsPayload('');					
	}	
	else if (gJSONPayload.RSS != undefined) {	
   	writeLog('processJSONPayload Finished - RSS payload');
   	processRSSPayload('');
	}
	else {
		try {	
			if (gJSONPayload[0].filename != undefined) {	
				writeLog('processJSONPayload Finished - Documents payload');
				processDocumentsPayload('');					
			}	
		}
		catch (e) {
			window[gRequestingFunction]('PROCESSJSONPAYLOADERROR:Invalid payload received for \'' + gDownloadRequest + '\' request'); 			
		}
	}	
}

function sendPrimaryHTTPRequest(primaryURL, secondaryURL) {	
//*************************************************************
//* This function will attempt to download a JSON file using 
//* the primary URL parameter.  If it fails, it will call the 
//* secondary URL function.
//* Parms:
//*		primary URL to call
//*		secondary URL to pass to next function
//* Value Returned: 
//*		Nothing
//*************************************************************		
	
	var request = $.getJSON(primaryURL, function(data) {
		gJSONPayload = data;
		})
		.success(function() { 
			processJSONPayload();
		})
		.error (function() {	
			sendSecondaryHTTPRequest(secondaryURL);
		})
		.complete(function() { 
			//Nothing to do here
		});
}

function sendSecondaryHTTPRequest(secondaryURL) {	
//*************************************************************
//* This function will attempt to download a JSON file using 
//* the secondary URL as supplied from the sendPrimaryHTTPRequest
//* function.
//* Parms:
//*		URL to pass to next function
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	if (secondaryURL != '') {
		var request = $.getJSON(secondaryURL, function(data) {
			gJSONPayload = data;
			})
			.success(function() { 
				processJSONPayload();
			})		
			.error (function (XMLHttpRequest, textStatus, errorThrown) {
				window[gRequestingFunction]('SENDSECONDARYHTTPREQUESTERROR:' + errorThrown);                                                 
      })
			.complete(function() { 
				//Nothing to do here
			});
	}
	else {
		window[gRequestingFunction]('SENDSECONDARYHTTPREQUESTERROR:No secondary URL in database'); 
	}
}

function updateDocumentsProgressBar() {	
//*************************************************************
//* This function will update the documents progress bar
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	gProgressBarDocumentsCounter ++;
	var percentage = 0;
	if (gProgressBarDocumentsCounter < gProgressBarDocumentsMaximum) {
		percentage = gProgressBarDocumentsCounter * gProgressBarDocumentsPercentage;
	}
	else {
		percentage = 100;
	}
	document.getElementById('documentprogress').style.width = percentage + "%"; 	
}		

function updateOverAllProgressBar() {	
//*************************************************************
//* This function will update the overall progress bar
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************		
	
	gProgressBarOverallCounter ++;
	var percentage = 0;
	if (gProgressBarOverallCounter < gProgressBarOverallMaximum) {
		percentage = gProgressBarOverallCounter * gProgressBarOverallPercentage;
	}
	else {
		percentage = 100;
	}
	document.getElementById('overallprogress').style.width = percentage + "%"; 	
}		
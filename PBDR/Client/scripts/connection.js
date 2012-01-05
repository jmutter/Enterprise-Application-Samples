//*************************************************************
//* This library contains all functions and global variables
//* that pertain to connections to and from the device.
//*************************************************************	

//Global Variables
var gDownloadRequest = '';
var gDownloadResults = '';
var gJSONPayload;

function checkUpdates(msg) {
//*************************************************************
//* This function prompts the user if they wish to download
//* the latest content by showing them when the last download
//* was completed for each content type.  It is also called 
//* from the following functions upon completion of failure:
//*   sendSecondaryHTTPRequest()
//*   processJSONPayload()
//*   processContactsPayload()
//*   processRSSPayload()
//*   processDocumentsPayload()
//* Parms:
//*		Success/failure information from the called functions
//* Value Returned: 
//*		none
//*************************************************************	
	
	var proceedWithDownload = true;
	var errMsg = '';
	if (msg == '') {
		var display = 'The content of this application was last updated:\n';
		var dateTime = '';
		if (gDocumentsDateTime == '') {
			dateTime = 'Never';
		}
		else {
			dateTime = convertDateTime(gDocumentsDateTime, gUserDateDisplay);	
		}
		display += '\n    Documents:  ' + dateTime;
		if (gContactsDateTime == '') {
			dateTime = 'Never';
		}
		else {
			dateTime = convertDateTime(gContactsDateTime, gUserDateDisplay);	
		}
		display += '\n    Contacts:  ' + dateTime;
		if (gRSSDateTime == '') {
			dateTime = 'Never';
		}
		else {
			dateTime = convertDateTime(gRSSDateTime, gUserDateDisplay);	
		}
		display += '\n    RSS:  ' + dateTime;	
				
		display += '\n\nWould you like to request the latest information now?';	
		proceedWithDownload = confirm(display);
		manageMusic('Stop');
 	}
 	else if (msg == 'CONFIGSLOADED') {
		//Nothing to do
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
		errMsg = 'Unable to contact server(s)';
	}
 	else if (msg.substring(0,24) == 'PROCESSJSONPAYLOADERROR:') {
		errMsg = msg.substring(24);
	}
 	else if (msg.substring(0,16) == 'CONFIGLOADERROR:') {
		errMsg = msg.substring(16);
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
 		errMsg = 'Invalid msg received';
 	} 	
 	if (errMsg != '') {
 		gDownloadResults += '\n    ' + gDownloadRequest + ' - ' + errMsg;
 	}		

 	if (proceedWithDownload == true) {
		switch (gDownloadRequest) {
			case '':
				manageWait('Show');
//			  gDownloadRequest = 'Config';
//			  testingSimulateSendPrimaryHTTPRequest(gConfigPrimaryURL, gConfigSecondaryURL);	
//			  sendPrimaryHTTPRequest(gConfigPrimaryURL, gConfigSecondaryURL);
//			  break;
//			case 'Config':
			  gDownloadRequest = 'Contacts';
			  testingSimulateSendPrimaryHTTPRequest(gContactsPrimaryURL, gContactsSecondaryURL);				  
			  //sendPrimaryHTTPRequest(gContactsPrimaryURL, gContactsSecondaryURL);						  	
			  break;
			case 'Contacts':
			  gDownloadRequest = 'RSS';
			  testingSimulateSendPrimaryHTTPRequest(gRSSPrimaryURL, gRSSSecondaryURL);	
			  //sendPrimaryHTTPRequest(gRSSPrimaryURL, gRSSSecondaryURL);						  	
			  break;
			case 'RSS':
//			  gDownloadRequest = 'Documents';
//			  testingSimulateSendPrimaryHTTPRequest(gDocumentsPrimaryURL, gDocumentsSecondaryURL);	
//			  sendPrimaryHTTPRequest(gDocumentsPrimaryURL, gDocumentsSecondaryURL);	
//			  checkUpdates('DOCUMENTSLOADED');					  	
//			  break;
//			case 'Documents':
				setTimeout(function() {
					if (gDownloadResults != '') {
				  	gDownloadResults = 'Contacts, RSS, and Document downloads were attempted.\n\nOne or more issues/errors occurred while downloading and updating the information:' + gDownloadResults;
			  		displayMessage (gDownloadResults);
			  	}	
			  	else {
			  		displayMessage ('The latest Contacts, RSS, and Documents have been downloaded.');
			  	}	
					manageWait('Hide');
				}, 2000);		  
			  break;
		}
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
//*		none
//*************************************************************	

	writeLog('processJSONPayload Starting');
	if (gJSONPayload.Updates != undefined) {	
		writeLog('processJSONPayload Finished - Update payload');
		processContactsPayload('');					
	}		
//	else if (gJSONPayload[0].filename != undefined) {	
//		alert ('documents being processed');
//		writeLog('processJSONPayload Finished - Documents payload');
//		processDocumentsPayload('');					
//	}	
	else if (gJSONPayload.Contacts != undefined) {	
		writeLog('processJSONPayload Finished - Contact payload');
		processContactsPayload('');					
	}	
	else if (gJSONPayload.RSS != undefined) {	
   	writeLog('processJSONPayload Finished - RSS payload');
   	processRSSPayload('');
	}
	else {
		checkUpdate('PROCESSJSONPAYLOADERROR:Invalid payload received for \'' + gDownloadRequest + '\' request');
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
//*		none
//*************************************************************		
	
	var request = $.getJSON(primaryURL, function(data) {
		//debug("success: " + data[0].filename);
		//fullFileList = data;
		gJSONPayload = data;
		})
		//.success(function() { debug("second success"); })
		.error (function() {	
			sendSecondaryHTTPRequest(secondaryURL);
		})
		.complete(function() { 
			processJSONPayload();
		});
}

function sendSecondaryHTTPRequest(secondaryURL) {	
	//debug('Im in sendRequest');
	var request = $.getJSON(secondaryURL, function(data) {
		//debug("success: " + data[0].filename);
		//fullFileList = data;
		gJSONPayload = data;
		})
		//.success(function() { debug("second success"); })
		.error (function() {	
			checkUpdate('SENDSECONDARYHTTPREQUESTERROR:' + 'not sure what to put here');
		})
		.complete(function() { 
			processJSONPayload();
		});
}

function requestUpdatesAndConfigs() {
	if (blackberry.system.hasDataCoverage() == true) {
		//manageMusic('Stop');
		//manageWait('Show');
		var request = $.getJSON("http://www.dagobahserver.com/pbdr/updatecheck.ashx", function(data) {
			//debug("success: " + data[0].filename);
			//fullFileList = data;
			gJSONPayload = data;
		})
		//.success(function() { debug("second success"); })
		.error (function() {	
			//manageWait('Hide');			
			debug("error"); 
		})
		.complete(function() { 
			//manageWait('Hide');
			//processJSONPayload();
		});
	}
}

var fullFileList;
function sendRequest() {	
	debug("Im in sendRequest");
	var jqxhr = $.getJSON("http://www.dagobahserver.com/pbdr/Documents.ashx", function(data) {
		//debug("success: " + data[0].filename);
		fullFileList = data;
		})
		//.success(function() { debug("second success"); })
		.error(function() { debug("error"); })
		.complete(function() { 
			debug("Complete: " + fullFileList, "clear"); 
			//downloader.startDownloader(fullFileList, FULL_DIR_PATH, onDownloadComplete);
		});

}
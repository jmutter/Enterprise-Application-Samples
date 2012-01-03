//*************************************************************
//* This library contains all functions and global variables
//* that pertain to connections to and from the device.
//*************************************************************	

//Global Variables
var gJSONPayload;

function processJSONPayload() {
//*************************************************************
//* This function is called when the application receives data
//* from a PUSH.
//* Parms:
//*		payload from PUSH
//* Value Returned: 
//*		none
//*************************************************************	

	writeLog('processJSONPayload Starting');
	if (gJSONPayload.Updates != undefined) {	
		alert ('updates being processed');
		writeLog('processJSONPayload Finished - Update payload');
		processContactsPayload('');					
	}		
	else if (gJSONPayload.Documents != undefined) {	
		alert ('documents being processed');
		writeLog('processJSONPayload Finished - Documents payload');
		processDocumentsPayload('');					
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
		alert ('Invalid payload received: ' + gJSONPayload);
	}	
}

function sendHTTPRequest() {	
	//debug('Im in sendRequest');
	var request = $.getJSON("http://www.dagobahserver.com/pbdr/Documents.ashx", function(data) {
		//debug("success: " + data[0].filename);
		//fullFileList = data;
		gJSONPayload = data;
		})
		//.success(function() { debug("second success"); })
		.error (function() {	
			debug("error"); 
		})
		.complete(function() { 
			processJSONPayload();
		});
}


function getLatestUpdates() {
	
				var msg = '';
			if (gConfigDateTime == '' && gDocumentsDateTime == '' && gContactsDateTime == '' && gRSSDateTime == '') {
				msg = 'You have never connected to download information for Documents, Contacts, or RSS.';
			}
			else {
			}
			msg += '\n\nWould you like to request the latest information now?';
			//alert (msg);
//			setTimeout(function() {
//				manageMusic('Stop');
//				setTimeout(function() {
//					manageWait('Show');
//					setTimeout(function() {
//						manageWait('Hide');
//					}, 10000); 
//				}, 500); 
//			}, 2000); 

			
			
			//alert ('call for stuff goes here');
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
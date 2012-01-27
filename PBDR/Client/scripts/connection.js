//*************************************************************
//* This library contains all functions and global variables
//* that pertain to connections to and from the device.
//*************************************************************	

//Global Variables
var gConfigUpdateCounter = 0;
var gContactsServerDateTime = '';
var gDocumentsServerDateTime = '';
var gDownloadInProgress = false;
var gDownloadRequest = '';
var gDownloadResults = '';
var gJSONPayload;
var gProgressBarDocumentsCounter = 0;
var gProgressBarDocumentsMaximum = 0;
var gProgressBarDocumentsPercentage = 0;
var gProgressBarOverallCounter = 0;
var gProgressBarOverallMaximum = 0;
var gProgressBarOverallPercentage = 0;
var gRequestingFunction = '';
var gRSSServerDateTime = '';
var gScreenDisplayedAtDownload = '';
var gServerTimeout = 10000;

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
		if (blackberry.system.hasDataCoverage() == true) {		
			gDownloadInProgress = true;
			gParentFunctionToCall = functionToCall;	
			gRequestingFunction = 'downloadConfig';	
			gDownloadRequest = 'Config';	
			if (blackberry.system.hasDataCoverage() == true) {	
				if (gTestingMode == true) {
					testingSendPrimaryHTTPRequest(gConfigPrimaryURL, gConfigSecondaryURL);	
				}
				else {			
				  sendPrimaryHTTPRequest(gConfigPrimaryURL, gConfigSecondaryURL);	
				}
	 		}
	 		else {		
				window[gParentFunctionToCall]('DOWNLOADCONFIGSUCCESS'); 
			}
		}
		else {
			displayMessage ('<p>There doesn\'t appear to be sufficient coverage to perform the server lookup.</p><p>You will only have access to the current content on the device.</p>', 'OkOnly')
			proceedWithDownload = false;
		}
	}
	else if (msg == 'CONFIGLOADED') {
		gDownloadInProgress = false;
		window[gParentFunctionToCall]('DOWNLOADCONFIGSUCCESS');  		
	}
	else if (msg.substring(0,30) == 'SENDSECONDARYHTTPREQUESTERROR:') {
		errMsg = 'Unable to contact configuration server(s): ' + msg.substring(30);
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
 		gDownloadInProgress = false;
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
	
	var proceedWithDownload = false;
	var errMsg = '';
	if (msg == '') {
		if (blackberry.system.hasDataCoverage() == true) {			
			gProgressBarOverallMaximum = 3;
			document.getElementById('overallprogressbarheader').innerText = 'Overall (' + gProgressBarOverallMaximum + ' Types)';		
			gProgressBarOverallCounter = 0;
			gProgressBarOverallPercentage = gProgressBarOverallMaximum / 100;

			var display = '<p>The following table shows when the content of this application was last updated.</p>'; 
			display += '<p>Would you like to request the latest information?</p>';
			display += '<table width="95%" border="2">';
			display += '<tr>';
	  	display += '<td style="text-align:left; font-weight:bold" colspan="2">Documents:</td>';
			display += '</tr>';
			display += '<tr>';
	  	display += '<td style="text-align:right">Local:</td>';
			if (gDocumentsDateTime == '') {
				dateTime = 'Never';
			}
			else {
				dateTime = convertDateTime(gDocumentsDateTime, gUserDateDisplay);	
			}
	  	display += '<td>' + dateTime + '</td>';
			display += '</tr>';
			display += '<tr>';
	  	display += '<td style="text-align:right">Server:</td>';
	  	display += '<td>' + convertDateTime(gDocumentsServerDateTime, gUserDateDisplay) + '</td>';
			display += '</tr>';
			display += '<tr>';
	  	display += '<td style="text-align:left; font-weight:bold" colspan="2">Contacts:</td>';
			display += '</tr>';
			display += '<tr>';
	  	display += '<td style="text-align:right">Local:</td>';
			if (gContactsDateTime == '') {
				dateTime = 'Never';
			}
			else {
				dateTime = convertDateTime(gContactsDateTime, gUserDateDisplay);	
			}
	  	display += '<td>' + dateTime + '</td>';
			display += '</tr>';
			display += '<tr>';
	  	display += '<td style="text-align:right">Server:</td>';
	  	display += '<td>' + convertDateTime(gContactsServerDateTime, gUserDateDisplay) + '</td>';
			display += '</tr>';
			display += '<tr>';
	  	display += '<td style="text-align:left; font-weight:bold" colspan="2">RSS:</td>';
			display += '</tr>';
			display += '<tr>';
	  	display += '<td style="text-align:right">Local:</td>';
			if (gRSSDateTime == '') {
				dateTime = 'Never';
			}
			else {
				dateTime = convertDateTime(gRSSDateTime, gUserDateDisplay);	
			}
	  	display += '<td>' + dateTime + '</td>';
			display += '</tr>';
			display += '<tr>';
	  	display += '<td style="text-align:right">Server:</td>';
	  	display += '<td>' + convertDateTime(gRSSServerDateTime, gUserDateDisplay) + '</td>';
			display += '</tr>';			
			display += '</table>';
			displayMessage(display, 'YesNo', downloadContent);
			
			//proceedWithDownload = confirm(display);			
	 		//if (proceedWithDownload == true) {
	 			//manageMusic('Stop'); 	
	 		//}		
 		}
 		else {
 			displayMessage ('<p>There doesn\'t appear to be sufficient coverage to perform the server lookup.</p><p>You will only have access to the current content on the device.</p>', 'OkOnly')
 			proceedWithDownload = false;
 		}
 	}
 	else if (msg == 'USERCLICKEDYES') {
 		manageMusic('Stop','Intro');
		gRequestingFunction = 'downloadContent';
 		gDownloadRequest = '';
		proceedWithDownload = true;
	}
 	else if (msg == 'USERCLICKEDNO') {
		proceedWithDownload = false;
	}
 	else if (msg == 'CONTACTSLOADED') {
		proceedWithDownload = true;
	}
 	else if (msg == 'RSSLOADED') {
		proceedWithDownload = true;
	}	
 	else if (msg == 'DOCUMENTSLOADED') {
		proceedWithDownload = true;
	}	
 	else if (msg.substring(0,30) == 'SENDSECONDARYHTTPREQUESTERROR:') {
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
 		gDownloadResults += '<p>    ' + gDownloadRequest + ' - ' + errMsg + '</p>';
		proceedWithDownload = true;
 	}		

 	if (proceedWithDownload == false) {
 		gDownloadRequest = '';
 	} 	
 	else {
		switch (gDownloadRequest) {
			case '':
				gDownloadInProgress = true;
				gDownloadResults = '';
				gScreenDisplayedAtDownload = gScreenDisplayed;
				displayScreen(gScreenNameHome,'NoStrings');
				manageWait('Show');
			  gDownloadRequest = 'Contacts';
				setTimeout(function() {		
					if (gTestingMode == true) {					
			  		testingSendPrimaryHTTPRequest(gContactsPrimaryURL, gContactsSecondaryURL);				  
				  }
				  else {
				  	sendPrimaryHTTPRequest(gContactsPrimaryURL, gContactsSecondaryURL);						  	
				  }
			  }, 1000);
			  break;
			case 'Contacts':
				updateOverAllProgressBar();	
			  gDownloadRequest = 'RSS';
				hideDownloadingOption('Contacts');
				setTimeout(function() {		
					if (gTestingMode == true) {							
				  	testingSendPrimaryHTTPRequest(gRSSPrimaryURL, gRSSSecondaryURL);	
				  }
				  else {
			 		 	sendPrimaryHTTPRequest(gRSSPrimaryURL, gRSSSecondaryURL);	
			 		}
		  	}, 1000); 						  	
			  break;
			case 'RSS':
				updateOverAllProgressBar();
	 			$('#documentsbar').show();  //Show our additional progress bar that is only needed for documents				
			  gDownloadRequest = 'Documents';
				hideDownloadingOption('RSS');
				setTimeout(function() {
					if (gTestingMode == true) {
			 			testingSendPrimaryHTTPRequest(gRSSPrimaryURL, gRSSSecondaryURL);	
			 		}
			 		else {
					  //sendPrimaryHTTPRequest(gDocumentsPrimaryURL, gDocumentsSecondaryURL);	
						//When completed testing with multiple document counts, remove these 7 lines and uncomment the line above
						if (gTestingSmallDocumentCollection == false) {
						  sendPrimaryHTTPRequest(gDocumentsPrimaryURL, gDocumentsSecondaryURL);	
						}
						else {
				  		sendPrimaryHTTPRequest(gTestingDocuments2PrimaryURL, gTestingDocuments2SecondaryURL);	
						}	
					}
		  	}, 1000); 
			  break;
			case 'Documents':
				updateOverAllProgressBar();
				hideDownloadingOption('Documents');
				gDownloadInProgress = false;
				setTimeout(function() {
					if (gDownloadResults != '') {
					 	gDownloadResults = '<p>Contacts, RSS, and Document downloads were attempted.</p><p>One or more issues/errors occurred while downloading and updating the information:</p>' + gDownloadResults;
					 	gDownloadResults = gDownloadResults + '<p><\p><p>If this problem persists, please contact your Administrator<\p>';
				  	displayMessage (gDownloadResults,'OkOnly');
				  }	
					manageWait('Hide');
					setTimeout(function() {
						displayScreen(gScreenDisplayedAtDownload);
					}, 1000);	
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

function sendPrimaryHTTPReques(primaryURL, secondaryURL) {	
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
	
	var httpRequest = $.ajax({
    url : primaryURL,
    dataType : "jsonp",
    timeout : gServerTimeout
	});

	httpRequest.success(function(data) {
		gJSONPayload = data;
		alert (data);
		//processJSONPayload();
	});

	httpRequest.error(function(XMLHttpRequest, status, error) {
		alert (error);
		//sendSecondaryHTTPRequest(secondaryURL);
	});
}

function sendSecondaryHTTPReques(secondaryURL) {	
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
		
	if (secondaryURL != '') {
		var httpRequest = $.ajax({
	    url : secondaryURL,
 	   dataType : "jsonp",
 	   timeout : gServerTimeout
		});
	
		httpRequest.success(function(data) {
			gJSONPayload = data;
			processJSONPayload();
		});
	
		httpRequest.error(function(XMLHttpRequest, status, error) {
			window[gRequestingFunction]('SENDSECONDARYHTTPREQUESTERROR:' + error);  		
		});
	}
	else {
		window[gRequestingFunction]('SENDSECONDARYHTTPREQUESTERROR:No secondary URL in database'); 
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
		//.error (function() {	
		.error (function (XMLHttpRequest, status, error) {
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
			.error (function (XMLHttpRequest, status, error) {
				window[gRequestingFunction]('SENDSECONDARYHTTPREQUESTERROR:' + error);                                                 
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
//*************************************************************
//* This library contains all functions and global variables
//* that pertain to connections to and from the device.
//*************************************************************	

//Global Variables
var gHTTPObject = null;
var gJSONPayload;

function getHTTPObject() {
//*************************************************************
//* This function will instantiate an HTTP object
//* Parms:
//*		Nothing
//* Value Returned: 
//*		HTTP object
//*************************************************************	
		
	writeLog('Building HTTP object');	
   var xmlhttp;
   if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
       try {
           xmlhttp = new XMLHttpRequest();
       } catch (e) {
           xmlhttp = false;
       }
   } 
   writeLog('HTTP object built');	   
   return xmlhttp;
}

function handlePushData(data, pushType) {
//*************************************************************
//* This function is called when the application receives data
//* from a PUSH.
//* Parms:
//*		payload from PUSH
//* Value Returned: 
//*		none
//*************************************************************	

  var errMsg = '';
	try {
		writeLog('handlePushData Starting');
		if (data == null) {
			writeLog(' Received push but no data');
		}
		else {			
			var jsonData = "";
			if (gBrowserType == gBrowserRippleBlackBerry) {
				var receivedData = data.payload;  //Use this when testing with Ripple
			}
			else if (pushType == 'Internal') {
				receivedData = data;
			}
			else {
				var receivedData = blackberry.utils.blobToString(data.payload);
			}

			if (receivedData.substr(0,1) == "{") {	//Is this a normal JSON payload
				jsonData = receivedData;
			}			
			else {	//Must be our special format for parsing
				//Appears that any data > 256 bytes gets random information appended to it
				//Need to supply a length before the actual JSON payload
				//Workaround until the payload function is fixed				
				var index = receivedData.indexOf('{');
				var size = receivedData.substr(0, index);
				jsonData = receivedData.substr(index, size);				
			}			
			gJSONPayload = JSON.parse(jsonData);
			var tempMode;		
			if (gJSONPayload.Contact != undefined) {	
				if (gUserApplicationStatus == 'enabled') {	
					writeLog('handlePushData Finished - Contact payload');
					processContactsPayload('');					
				}
				else {
					tempMode = gDebugMode;
					gDebugMode = true;
					writeLog('Contact payload ignored since application is disabled');
					gDebugMode = tempMode;
				}
			}	
			else if (gJSONPayload.EmergencyCall != undefined) {
				if (gApplicationStatus = 'enabled') {	
		    	writeLog('handlePushData Finished - EmergencyCall payload');
		    	processEmergencyPayload('','Call');
				}
				else {
					tempMode = gDebugMode;
					gDebugMode = true;
					writeLog('EmergencyCall payload ignored since application is disabled');
					gDebugMode = tempMode;
				}
			}
			else if (gJSONPayload.EmergencyNotification != undefined) {		
				alert ('Processing Notification');				
		    if (gApplicationStatus = 'enabled') {	
		    	writeLog('handlePushData Finished - EmergencyNotification payload');
		    	processEmergencyPayload('','Notification');
				}				
				else {
					tempMode = gDebugMode;
					gDebugMode = true;
					writeLog('EmergencyNotification payload ignored since application is disabled');
					gDebugMode = tempMode;
				}			
			}	
			else if (gJSONPayload.Administration != undefined) {		
		    writeLog('handlePushData Finished - Administration payload');
				adminProcessPayload('');					
			}	
			else {
				errMsg = 'Invalid payload received';
			}	
		} 
	}
	catch (e) {
		errMsg = 'JSON error: ' + e.message;
	}
	if (errMsg != '') {
		alert ('errMsg: ' +errMsg);
		writeLog('handlePushData Finished - ERROR - ' + errMsg);
	}
}

function handleSIMChange() {
	//This function could be used to perform certain functions should you need to know what 
	//happens when the user changes the SIM card.
	//This is defined in the registerBBEvents when building the parameters for the 
	//openBESPushListener API.
}

function postURL(msg) {	
//*************************************************************
//* This function is called to post the outstanding URL back 
//* to the server
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************

	var errMsg = '';
	if (msg == undefined) {
  	try {
   		if (blackberry.system.hasDataCoverage()) {
   			writeLog('postURL Starting');   		
   			writeLog('  Sending: ' + gURLToPost);
     		gHTTPObject.onreadystatechange = postURLConfirmation;
     		gHTTPObject.open('get', gURLToPost, true); 
     		gHTTPObject.send(null);
   			writeLog('postURL Finished');  
   		}
   		else { 
				writeLog('  Updating table entry with No Coverage status');
   			sql = 'UPDATE ' + gTableNameOutstandingURLs + ' SET lastattemptdatetime = \'' + getDate(gUserDateDisplay) + ' @ ' + getTime() + '\', statuscode = \'NoCoverage\'' + gURLID + '\'';
				dbUpdateRecord(sql, 'postURL'); 
  		}
  	}	 
  	catch (e) {
   		writeLog('postURL Finished - ERROR - ' + e.message);
  	}
	}
	else if (msg == "DBUPDATERECORDSUCCESS") {
   	writeLog('postURL Finished');
	}	
	else if (msg.substring(0,20) == "DBUPDATERECORDERROR:") {
		errMsg = msg.substring(20);
	}
	else {
		errMsg = 'Invalid msg:' + msg;
	}
	if (errMsg != '') {
		writeLog('postURL Finished - ERROR - ' + errMsg);
	}	
}

function postURLConfirmation(msg) {
//*************************************************************
//* This function is called when the Web Server of which the URL
//* sent via postURL function, responds to the request from that 
//* function
//* Parms:
//*		Success/Error messages to analyze from called functions
//* Value Returned: 
//*		Nothing
//*************************************************************
	
	//Test for initial call since we couldn't pass anything when defining this function as the call back in postURL
	//if (msg == undefined) {
		//msg = '';
	//}	
	var errMsg = '';
	var deleteURL = false;
	var sql = '';
	if (msg == '' || msg == undefined) {
		if (gHTTPObject.readyState == 4) {   	
			writeLog('postURLConfirmation Starting');
			writeLog('  Status: ' + gHTTPObject.status);
			writeLog('  StatusText: ' + gHTTPObject.statusText);
      if (gHTTPObject.status == 200) {
				writeLog('  Requesting delete');
      	//Need to delete the outstanding URL since it isn't needed anymore
				sql = 'DELETE FROM ' + gTableNameOutstandingURLs + ' WHERE urlid = \'' + gURLID + '\'';
				dbDeleteRecord(sql, 'postURLConfirmation');
			}   
      else {
      	//408 = Request Timeout
      	//503 = Service Unavailable
      	//504 = Gateway Timeout (going through proxy)
      	//Will not remove URL from table to allow for later processing
				writeLog('  Updating table entry with status');
   			sql = 'UPDATE ' + gTableNameOutstandingURLs + ' SET lastattemptdatetime = \'' + getDate(gUserDateDisplay) + ' @ ' + getTime() + '\', statuscode = \'' + gHTTPObject.status + '\' WHERE urlid = \'' + gURLID + '\'';
				dbUpdateRecord(sql, 'postURLConfirmation');        	
      }
    }
  }  
	else if (msg == 'DBDELETERECORDSUCCESS') {
		writeLog('  Delete completed');
		writeLog('postURLConfirmation Finished');
		checkForOutstandingURLs('PROCESSURLS');	//Go look for more outstanding URLs to post
	}
	else if (msg == "DBUPDATERECORDSUCCESS") {
		writeLog('  Update completed');
		writeLog('postURLConfirmation Finished');
		checkForOutstandingURLs('PROCESSURLS');	 //Go look for more outstanding URLs to post
	}	
	else if (msg.substring(0,20) == 'DBDELETERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else if (msg.substring(0,20) == "DBUPDATERECORDERROR:") {
		errMsg = msg.substring(20);
	}
	else {
		errMsg = 'Invalid msg:' + msg;
	}
	if (errMsg != '') {
		writeLog('postURLConfirmation Finished - ERROR - ' + errMsg);
	}
}


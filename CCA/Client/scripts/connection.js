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

function handlePushData(data) {
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
			if (gJSONPayload.Contact != undefined) {		
		    writeLog('handlePushData Finished - Notification payload');
				processContactsPayload('');					
			}	
			else if (gJSONPayload.EmergencyCall != undefined) {
		    writeLog('handlePushData Finished - EmergencyCall payload');
		    displayEmergencyCall();
			}
			else if (gJSONPayload.EmergencyNotification != undefined) {		
		    writeLog('handlePushData Finished - EmergencyNotification payload');
				displayEmergencyNotification();					
			}	
			else if (gJSONPayload.Administration != undefined) {		
		    writeLog('handlePushData Finished - Administration payload');
				//processAdminPayload();					
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
		alert (errMsg);
		writeLog(errMsg);		
	}
}

function handleSIMChange() {
	//This function could be used to perform certain functions should you need to know what 
	//happens when the user changes the SIM card.
	//This is defined in the registerBBEvents when building the parameters for the 
	//openBESPushListener API.
}

function postURLs(msg) {	
//*************************************************************
//* This function is called to post the outstanding URL back 
//* to the server
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************

  try {
   	if (blackberry.system.hasDataCoverage()) {
   		writeLog('postURL sending URL: ' + gUserOutstandingURL);
     	gHTTPObject.onreadystatechange = postURLConfirmation;
     	gHTTPObject.open('get', gUserOutstandingURL, true); 
     	gHTTPObject.send(null);
   	}
   	else { 
   		writeLog('postURL doesn\'t have data coverage.  onForeground or handleDataCoverage events will take care of it');
  	  }
  }	 
  catch (e) {
   	writeLog('postURL failed - errName: ' + e.name);
   	writeLog('postURL failed - errMessage: ' + e.message);
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
	
	//Test for initial call since we couldn't pass anything when defining this function as the call back
	//in postURL
	if (msg == undefined) {
		msg = '';
	}	
	var errMsg = '';
	var clearURL = false;
	if (msg == '') {
		if (gHTTPObject.readyState == 4) {   	
      if (gHTTPObject.status == 200) {
				writeLog('postURLConfirmation status: 200');
       	alert ('post worked, need to ensure following code works');
				clearURL = true;  //Remove URL from table 	
			}   
      else if (gHTTPObject.status == 408 || gHTTPObject.status == 503 || gHTTPObject.status == 504) {
      	//408 = Request Timeout
      	//503 = Service Unavailable
      	//504 = Gateway Timeout (going through proxy)
				writeLog('postURLConfirmation status: ' + gHTTPObject.status);
				writeLog('postURLConfirmation delaying post');
       	alert ('post delayed: '+ gHTTPObject.status);
      	//Will not remove URL from table to allow for later processing
			}
      else {
				writeLog('HTTP post status code:' + gHTTPObject.status);
				writeLog('HTTP post status text:' + gHTTPObject.statusText);
				//Might want to notify user so they can call their support folks
				clearURL = true;  //Remove URL from table to show processed (even though with error
      }
      if (clearURL == true) {
       	//Need to clear out our outstanding values so they don't appear upon next restart
				var	sql = 'UPDATE ' + gTableNameUser + ' SET outstandingurl = \'\', outstandingurldatetime = \'\' WHERE recordid = \'' + gUserRecordID + '\'';
				fn_DBUpdateRecord(sql, 'postURLConfirmation');        	
      }
    }
  }  
	else if (msg.substring(0,20) == "DBUPDATERECORDERROR:") {
		errMsg = msg.substring(20);
	}
	else if (msg == "DBUPDATERECORDSUCCESS") {
		alert ('postURLConfirmation - SQL update worked');
		writeLog('postURLConfirmation Finished');
	}
	else {
		errMsg = 'Invalid msg received:' + msg;
	}
	if (errMsg != '') {
		alert ('postURLConfirmation error: ' + errMsg);
		writeLog('postURLConfirmation error: ' + errMsg);
		writeLog('postURLConfirmation Finished');
	}
}


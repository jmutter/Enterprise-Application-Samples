function requestTestData(msg) {	
	//*************************************************************
	//* This function is called to post the outstanding URL back 
	//* to the server
	//* Parms:
	//*		Nothing
	//* Value Returned: 
	//*		Nothing
	//*************************************************************
	alert(msg);
	
	var testService = "http://dagobahserver.com/eclsampledata/eclJsonSample.ashx";
	
	try {
	   	if (blackberry.system.hasDataCoverage()) {
	   		writeLog('httpGetTestData sending URL: ' + testService);
	   		ghttpGetTestData.onreadystatechange = testDataURLConfirmation;
	   		ghttpGetTestData.open('get', testService, true); 
	   		ghttpGetTestData.send(null);
	   	}
	   	else { 
	   		writeLog('testDataURL doesn\'t have data coverage.  onForeground or handleDataCoverage will take care of it');
	  	  }
	  }	 
	  catch (e) {
	   	writeLog('testDataURL failed - errName: ' + e.name);
	   	writeLog('postestDataURLURL failed - errMessage: ' + e.message);
	  }
	}
function testDataURLConfirmation(msg) {
	//*************************************************************
	//* This function is called when the Web Server of which the URL
	//* sent via testDataURL function, responds to the request from that 
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
		if (msg == '') {
			if (ghttpGetTestData.readyState == 4) {   	
	      if (ghttpGetTestData.status == 200) {
	    	  writeLog("got 200 son");
	    	  
	    	  handlePushData(ghttpGetTestData.responseText);	
	    	  
	    	  writeLog('testDataURLConfirmation status: 200');
	       	alert ('post worked, passed response test to handlepushdata');
				}   
	      else if (ghttpGetTestData.status == 408 || ghttpGetTestData.status == 503 || ghttpGetTestData.status == 504) {
	      	//408 = Request Timeout
	      	//503 = Service Unavailable
	      	//504 = Gateway Timeout (going through proxy)
					writeLog('testDataURLConfirmation status: ' + ghttpGetTestData.status);
					writeLog('testDataURLConfirmation delaying post');
	       	alert ('post delayed: '+ ghttpGetTestData.status);
	      	//Will not remove URL from table to allow for later processing
				}
	      else {
					writeLog('HTTP post status code:' + ghttpGetTestData.status);
					writeLog('HTTP post status text:' + ghttpGetTestData.statusText);
					//Might want to notify user so they can call their support folks
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
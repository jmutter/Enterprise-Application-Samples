//*************************************************************
//* This library contains all functions and global variables
//* that pertain to the RSS screen
//*************************************************************	

//Global Variables
var gRSSCounter = 0;
var gRSSRecords = new Array();

function buildNoRSSScreen() {
//*************************************************************
//* This function will build the norss <div> to build
//* a repeated background.
//* Only need to call this function once
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************	

	document.getElementById(gScreenNameNoRSS).style.backgroundImage = "url(images/norss.png)";
	document.getElementById(gScreenNameNoRSS).style.width = screen.availWidth + "px";
	document.getElementById(gScreenNameNoRSS).style.height = screen.availHeight + "px";
	document.getElementById(gScreenNameNoRSS).style.backgroundRepeat = "repeat";
}

function buildRSSScreen(msg) {	
//*************************************************************
//* This function will build the list of RSS feeds
//* Parms:
//*		Success/Failure message from called functions (from callbacks)
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	var errMsg = '';
	if (msg == '' || msg == undefined) {
		manageMusic('Stop');
		writeLog('buildRSSScreen Starting');
		var	sql = 'SELECT rssid, feedid, title, detail FROM ' + gTableNameRSS;
		dbGetRecords(sql, 'rss', 'buildRSSScreen');
	}
	else if (msg == 'DBGETRECORDSSUCCESS') {
		if (gRSSRecords.length == 0) {
			displayScreen(gScreenNameNoRSS);
		}
		else {
			var array;
			for (counter = 0; counter < gRSSRecords.length; ++counter) {	
				array = gRSSRecords[counter].split(gDelim);	
				//array[0] = unique id from database
				//array[1] = unique id from feed
				//array[2] = title
				//array[3] = detail
				//Use the above information to display in a listview of some kind
			}
			displayScreen(gScreenNameRSS);
		}
		writeLog('buildRSSScreen Finished');
	}
	else if (msg.substring(0,18) == 'DBGETRECORDSERROR:') {
		errMsg = msg.substring(18);
	}	
	else {
  	errMsg = 'Invalid msg: ' + msg;
	}	
	if (errMsg != '') {
		writeLog('buildRSSScreen Finished - ERROR - '+ errMsg);
	}	
}

function processRSSPayload(msg) {
//*************************************************************
//* This function will process the RSS payload to put the entries
//* into the table
//* Parms:
//*		Success/Error messages to analyze from called functions
//* Value Returned: 
//*		Nothing
//*************************************************************	

	var sql = '';
	var errMsg = '';
	if (msg == '') {
  	writeLog('ProcessRSSPayload Starting');
		sql = 'DELETE FROM ' + gTableNameRSS;
		dbDeleteRecord(sql, 'processRSSPayload');
	}
	else if (msg == 'DBDELETERECORDSUCCESS' || msg == 'DBADDRECORDSUCCESS') {
		if (gRSSCounter < gJSONPayload.RSS.length) { 
			if (gJSONPayload.RSS[gRSSCounter].id == undefined) {
				gJSONPayload.RSS[gRSSCounter].id = '';				
			}
			if (gJSONPayload.RSS[gRSSCounter].title == undefined) {
				gJSONPayload.RSS[gRSSCounter].title = '';				
			}
			if (gJSONPayload.RSS[gRSSCounter].detail == undefined) {
				gJSONPayload.RSS[gRSSCounter].detail = '';				
			}		
			//Ensure the values added are in the order of which they were defined for the database
			sql = 'INSERT INTO ' + gTableNameRSS;
			sql += '(rssid,feedid,title,detail)';		
			sql += ' VALUES(null';
			sql += ', \'' + fieldPrepare(gJSONPayload.RSS[gRSSCounter].id.toString()) + '\'';
			sql += ', \'' + fieldPrepare(gJSONPayload.RSS[gRSSCounter].title) + '\'';
			sql += ', \'' + fieldPrepare(gJSONPayload.RSS[gRSSCounter].detail) + '\'';																																							
			sql += ')';
			gRSSCounter ++;
			dbAddRecord(sql, 'processRSSPayload');
		}
		else {
			writeLog('processRSSPayload Finished');
			//window[gParentFunctionToCall]('INSERTCONTACTSSUCCESS');			
		}
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
	}	
}
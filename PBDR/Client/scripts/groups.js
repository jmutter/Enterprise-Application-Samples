//*************************************************************
//* This library contains all functions and global variables
//* that pertain to the groups listing
//*************************************************************	

//Global Variables
var gGroupCounter;
var gGroupNameSelected = '';
var gGroupRecords = new Array();
var gInsertGroupCounter;
var gRetrievalStep = '';

function buildGroupsScreen(msg) {
//*************************************************************
//* This function will display the listing of groups
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	var errMsg = '';
	if (msg == '') {
		writeLog('buildGroupsScreen Starting');
		var	sql = 'SELECT groupname, contactrecords, recordsreceived FROM ' + gTableNameGroups + ' ORDER BY groupname';
		dbGetRecords(sql, 'groups', 'buildGroupsScreen');
	}
	else if (msg == 'DBGETRECORDSSUCCESS') {
		if (gGroupRecords.length == 0) {
			writeLog('displayGroups Finished - No Contacts');
			displayScreen(gScreenNameNoContacts);
		}
		else {	
			writeLog('Processing ' + gGroupRecords.length + ' groups');
			var counter = 0;
			var groupArray;	
			$('#groupslisting').empty();
			document.getElementById('groupsheader').innerHTML = '<label>Groups</label>';
			var html = '';
			if (gUserShowAllGroup == 'True') {
				var totalUsers = 0;
 			 	for (counter = 0; counter < gGroupRecords.length; ++counter) {
 			   	groupArray = gGroupRecords[counter].split(gDelim);  
					totalUsers = totalUsers + parseInt(groupArray[1]);	 	
				}		
  			html = '<li data-theme="e"><a onclick="buildContactsScreen(\'\',\'AllOfThem\');">' + 'All' + '</a> <span class="ui-li-count">' + totalUsers + '</span>';
			  html += '</li>';
			 	$('#groupslisting').append(html);
			}
		  for (counter = 0; counter < gGroupRecords.length; ++counter) {
 		   groupArray = gGroupRecords[counter].split(gDelim);  
		    html = '<li data-theme="e"><a onclick="buildContactsScreen(\'\',\'' + groupArray[0] + '\');">' + groupArray[0] + '</a> <span class="ui-li-count">' + groupArray[1] + '</span>';
				html += '</li>';
	 			$('#groupslisting').append(html);
			}
			$('#groupslisting').listview('refresh');		
			writeLog('buildGroupsScreen Finished');	
			displayScreen(gScreenNameGroups);
		}	
	}
	else if (msg.substring(0,18) == 'DBGETRECORDSERROR:') {
		errMsg = msg.substring(18);
	}	
	else {
  	errMsg = 'Invalid msg: ' + msg;
	}	
	if (errMsg != '') {
		writeLog('buildGroupsScreen Finished - ERROR - '+ errMsg);
	}	
}

function updateGroups(msg, functionToCall) {
//*************************************************************
//* This function will add all groups that were specified when
//* adding contacts from a JSON payload.
//* Parms:
//*		Success/Failure message from called functions (from callbacks)
//* Value Returned: 
//*		Nothing
//*************************************************************		
	
  var errMsg = '';
  var array;
  var sql;
  if (msg == '') {
  	writeLog('upateGroups Starting');		
  	gParentFunctionToCall = functionToCall; 
		gInsertGroupCounter = 0;
		sql = 'DELETE FROM ' + gTableNameGroups;
		dbDeleteRecord(sql, 'updateGroups');
	}
	else if (msg == 'DBDELETERECORDSUCCESS' || msg == 'DBADDRECORDSUCCESS') {
		if (gInsertGroupCounter < gContactPayloadGroups.length) {			
			array = gContactPayloadGroups[gInsertGroupCounter].split(gDelim);
			gInsertGroupCounter++;  //This needs to go after the last usage of the counter to get it incremented 
			sql = 'INSERT INTO ' + gTableNameGroups;
			sql += '(groupname, contactrecords, recordsreceived)';
			sql += ' VALUES(\'' + fieldPrepare(array[0]) + '\',\'' + array[1] + '\',\'' + array[2] + '\')';
			dbAddRecord(sql, 'updateGroups');	
		}
		else {	
			writeLog('updateGroups Finished');
			window[gParentFunctionToCall]('UPDATEGROUPSSUCCESS');		
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
		writeLog('updateGroups Finished - ERROR - '+ errMsg);
		window[gParentFunctionToCall]('UPDATEGROUPSERROR:' + errMsg);	
	}
}
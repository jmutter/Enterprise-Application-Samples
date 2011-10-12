//*************************************************************
//* This library contains all functions and global variables
//* that pertain to the about screen.
//*************************************************************	

//Global Variables
var gGroupCounter;
var gGroupRecords;
var gGroupScreenIsVisible = false;

function addMenuGroups() {
//*************************************************************
//* This function will add the appropriate menu items for the 
//* Groups screen
//* Parms:
//*		Success/Failure message of recursive calls
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	writeLog('addMenuGroups Starting');	
	try {
		blackberry.ui.menu.clearMenuItems();  //Clear the menu items		
		var menuItemSeparator1 = new blackberry.ui.menu.MenuItem(true, 1);
		var menuItemOptions = new blackberry.ui.menu.MenuItem(false, 2,"Options", buildOptions);
		var menuItemAbout = new blackberry.ui.menu.MenuItem(false, 3,"About", displayAbout);
		blackberry.ui.menu.addMenuItem(menuItemSeparator1);
		blackberry.ui.menu.addMenuItem(menuItemOptions);
		blackberry.ui.menu.addMenuItem(menuItemAbout);
		writeLog('addMenuGroups Finished');
	} 
	catch (e) {
		writeLog('addMenuGroups Finished - ERROR - ' + e.message);
	}
}

function buildGroupsListing(msg, functionToCall){
//*************************************************************
//* This function will retrieve records from the database and
//* build the group listing screen
//* Parms:
//*		Success/Failure message from called functions (from callbacks)
//*		Function name to call when we are done (success or failure)
//* Value Returned: 
//*		Nothing
//*************************************************************
	
	var errMsg = '';
	var sql = '';
	if (msg == '') {		
		gParentFunctionToCall = functionToCall;  //Save off function since recursive calls back here won't preserve it
		writeLog('buildGroupsListing Starting');	
		writeLog('  Retrieving Groups');
		sql = 'SELECT groupname, contactrecords FROM ' + gTableNameGroups;
		fn_DBGetRecords(sql, 'buildGroupsListing');
	}	
	else if (msg.substring(0,18) == 'DBGETRECORDSERROR:') {
		errMsg = msg.substring(18);
	}
	else if (msg == 'DBGETRECORDSSUCCESS') {	
		gGroupRecords = gDBRecordsRetrieved;
		if (gGroupRecords.length == 0) {
			gGroupScreenIsVisible = false;
			writeLog('buildGroupsListing Finished');	
			window[gParentFunctionToCall]('BUILDGROUPSNOENTRIES');
		}
		else if (gDBRecordsRetrieved.length == 1) {
			array = gGroupRecords[0].split(gDelim);
			gGroupNameSelected = array[0];
			gGroupScreenIsVisible = false;
			writeLog('buildGroupsListing Finished');				
			window[gParentFunctionToCall]('BUILDGROUPSONEENTRY');
		}		
		else {
			writeLog('  Processing ' + gGroupRecords.length + ' groups');
			var counter;
			var html = '';
			for (counter = 0; counter < gGroupRecords.length; ++counter) {
				array = gGroupRecords[counter].split(gDelim);	
				html += '<label onclick="showContactsFromSelectedGroup(\'\',\'' + array[0] + '\');">' + array[0] + '    (' + array[1] + ')</label>';
				html += '<br>';
			}
			document.getElementById(gScreenNameGroups).innerHTML = html;
			writeLog('buildGroupsListing Finished');	
			gGroupScreenIsVisible = true;
			window[gParentFunctionToCall]('BUILDGROUPSSUCCESS');
		}
	}
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		writeLog('buildGroupsListing Finished - ERROR - ' + errMsg);
		window[gParentFunctionToCall]('BUILDGROUPSLISTINGERROR:' + errMsg);
	}
}

function displayGroups(msg) {
//*************************************************************
//* This function will display the listing of groups
//* Parms:
//*		Success/Failure message from called functions (from callbacks)
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	var errMsg = '';
	var sql = '';
	if (msg == '') {		
		writeLog('displayGroups Starting');	
		buildGroupsListing('','displayGroups');
	}
	else if (msg.substring(0,24) == 'BUILDGROUPSLISTINGERROR:' ) {
		errMsg = msg.substring(24);
	}
	else if (msg == 'BUILDGROUPSNOENTRIES') {
		writeLog('displayGroups Finished');
		displayScreen(gScreenNameNoContacts);
	}
	else if (msg == 'BUILDGROUPSONEENTRY') {
		buildContactsListing('','displayGroups');
	}
	else if (msg == 'BUILDGROUPSSUCCESS') {
		writeLog('displayGroups Finished');
		displayScreen(gScreenNameGroups);
	}	
	else if (msg.substring(0,26) == 'BUILDCONTACTSLISTINGERROR:' ) {
		errMsg = msg.substring(26);
	}	
	else if (msg == 'BUILDCONTACTSLISTINGSUCCESS') {
		writeLog('displayGroups Finished');
		displayScreen(gScreenNameContacts);
	}		
	else {
		errMsg = 'Invalid msg: ' + msg; 	
	} 
	if (errMsg != '') {
		writeLog('displayGroups Finished - ERROR - ' + errMsg);
	}
}


function showContactsFromSelectedGroup(msg, groupName) {
//*************************************************************
//* This function will build the list of contacts based on the 
//* selected group from the group listing
//* Parms:
//*		Success/Failure message from called functions (from callbacks)
//*   Group to build listing from
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	var errMsg = '';
	if (msg == '') {
		writeLog('showContactsFromSelectedGroup Starting');
		gGroupNameSelected = groupName;
		buildContactsListing('','showContactsFromSelectedGroup');		
	}
	else if (msg.substring(0,26) == 'BUILDCONTACTSLISTINGERROR:' ) {
		errMsg = msg.substring(26);
	}	
	else if (msg == 'BUILDCONTACTSLISTINGSUCCESS') {
		writeLog('showContactsFromSelectedGroup Finished');
		displayScreen(gScreenNameContacts);
	}		
	else {
		errMsg = 'Invalid msg: ' + msg; 	
	} 
	if (errMsg != '') {
		writeLog('showContactsFromSelectedGroup Finished - ERROR - ' + errMsg);
	}
}

function updateGroups(msg) {
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
		gInsertGroupCounter = 0;
  	msg = 'DBADDRECORDSUCCESS';  //Set to default to start the process
	}
	if (msg == 'DBADDRECORDSUCCESS') {
		if (gInsertGroupCounter < gContactPayloadGroups.length) {			
			array = gContactPayloadGroups[gInsertGroupCounter].split(gDelim);
			sql = 'DELETE FROM ' + gTableNameGroups + ' WHERE groupname = \'' + array[0] + '\'';
			fn_DBDeleteRecord(sql, 'updateGroups');	
		}
		else {			
			writeLog('updateGroups Finished');
			displayGroups('');
		}
	}
	else if (msg.substring(0,20) == 'DBDELETERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else if (msg == 'DBDELETERECORDSUCCESS') {
		array = gContactPayloadGroups[gInsertGroupCounter].split(gDelim);
		gInsertGroupCounter++;  //This needs to go after the last usage of the counter to get it incremented 
		sql = 'INSERT INTO ' + gTableNameGroups;
		sql += '(groupname,contactrecords,recordsreceived)';
		sql += ' VALUES(\'' + array[0] + '\',\'' + array[1] + '\',\'' + array[2] + '\')';
		fn_DBAddRecord(sql, 'updateGroups');		
	}
	else if (msg.substring(0,17) == 'DBADDRECORDERROR:') {
		errMsg = msg.substring(17);
	}
	else {
  	errMsg = 'Invalid msg: ' + msg;
	}	
	if (errMsg != '') {
		writeLog('updateGroups Finished - ERROR - '+ errMsg);
	}
}
//*************************************************************
//* This library contains all functions and global variables
//* that pertain to the about screen.
//*************************************************************	

//Global Variables
var gGroupCounter;
var gGroupRecords = new Array();
var gRetrievalStep = '';

function addGroupsMenu() {
//*************************************************************
//* This function will add the appropriate menu items for the 
//* Groups screen
//* Parms:
//*		Success/Failure message of recursive calls
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	writeLog('addGroupsMenu Starting');	
	if (gBrowserType == gBrowserBlackBerry || gBrowserType == gBrowserRippleBlackBerry) {	
		blackberry.ui.menu.clearMenuItems();  //Clear the menu items		
		var menuItemSeparator1 = new blackberry.ui.menu.MenuItem(true, 1);
		blackberry.ui.menu.addMenuItem(menuItemSeparator1);
		var menuItemOptions = new blackberry.ui.menu.MenuItem(false, 2,'Options', displayOptions);
		blackberry.ui.menu.addMenuItem(menuItemOptions);
		var menuItemAbout = new blackberry.ui.menu.MenuItem(false, 3,'About', displayAbout);
		blackberry.ui.menu.addMenuItem(menuItemAbout);
		writeLog('  menu built');	
		if (gTestingMode == true) {
			addTestingMenu();
		}	
	}
	else {
		writeLog('  invalid environment for menu');
	}	
	writeLog('addGroupsMenu Finished');
}

function buildGroupsListing(){
//*************************************************************
//* This function will retrieve records from the database and
//* build the group listing screen
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************
	
	writeLog('buildGroupsListing Starting');	
	writeLog('  Processing ' + gGroupRecords.length + ' groups');
	var counter = 0;
	var groupArray;	
	$('#listofentries').empty();
	//$('#listofentries').removeAttr('data-filter');
	document.getElementById('listheader').innerHTML = '<label>Groups</label>';
	var html = '';
	if (gUserShowAllGroup == 'True') {
		var totalUsers = 0;
  	for (counter = 0; counter < gGroupRecords.length; ++counter) {
    	groupArray = gGroupRecords[counter].split(gDelim);  
			totalUsers = totalUsers + parseInt(groupArray[2]);	 	
		}		
    html = '<li data-theme="e" style="font-size:10pt"><a onclick="displayContacts(\'\',\'AllOfThem\');">' + 'All' + '</a> <span class="ui-li-count">' + totalUsers + '</span>';
		html += '</li>';
	 	$('#listofentries').append(html);
	}
  for (counter = 0; counter < gGroupRecords.length; ++counter) {
    groupArray = gGroupRecords[counter].split(gDelim);  
    html = '<li data-theme="e" style="font-size:10pt"><a onclick="displayContacts(\'\',\'' + groupArray[0] + '\');">' + groupArray[0] + '</a> <span class="ui-li-count">' + groupArray[2] + '</span>';
		html += '</li>';
	 	$('#listofentries').append(html);
	}
	$('#listofentries').listview('refresh');
	writeLog('buildGroupsListing Finished');	
}

function displayGroups(msg) {
//*************************************************************
//* This function will display the listing of groups
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	var errMsg = '';
	if (msg == '') {
		writeLog('displayGroups Starting');
		var	sql = 'SELECT groupname, machinename, contactrecords, recordsreceived FROM ' + gTableNameGroups + ' ORDER BY groupname';
		dbGetRecords(sql, 'groups', 'displayGroups');
	}
	else if (msg == 'DBGETRECORDSSUCCESS') {
		if (gGroupRecords.length == 0) {
			writeLog('displayGroups Finished - No Contacts');
			displayScreen(gScreenNameNoContacts);
		}
		else {
			buildGroupsListing();
			writeLog('displayGroups Finished');
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
		writeLog('displayGroups Finished - ERROR - '+ errMsg);
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
  	msg = 'DBADDRECORDSUCCESS';  //Set to default to start the process
	}
	if (msg == 'DBADDRECORDSUCCESS') {
		if (gInsertGroupCounter < gContactPayloadGroups.length) {			
			array = gContactPayloadGroups[gInsertGroupCounter].split(gDelim);
			sql = 'DELETE FROM ' + gTableNameGroups + ' WHERE groupname = \'' + fieldPrepare(array[0]) + '\'';
			dbDeleteRecord(sql, 'updateGroups');	
		}
		else {	
			writeLog('updateGroups Finished');
			window[gParentFunctionToCall]('UPDATEGROUPSSUCCESS');		
		}
	}
	else if (msg == 'DBDELETERECORDSUCCESS') {
		array = gContactPayloadGroups[gInsertGroupCounter].split(gDelim);
		gInsertGroupCounter++;  //This needs to go after the last usage of the counter to get it incremented 
		sql = 'INSERT INTO ' + gTableNameGroups;
		sql += '(groupname, machinename, contactrecords, recordsreceived)';
		sql += ' VALUES(\'' + fieldPrepare(array[0]) + '\',\'' + array[1] + '\',\'' + array[2] + '\',\'' + array[3] + '\')';
		dbAddRecord(sql, 'updateGroups');		
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
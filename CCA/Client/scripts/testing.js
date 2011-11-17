//*************************************************************
//* This library contains all functions and global variables
//* that pertain to adding testing options
//*************************************************************	

//Global Variables
var gTestingClearMethod ='';

function addTestingMenu() {
//*************************************************************
//* This function will add the appropriate menu items for the 
//* Groups screen
//* Parms:
//*		Success/Failure message of recursive calls
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	writeLog('addGroupsTestingMenu Starting');	
	if (gBrowserType == gBrowserBlackBerry || gBrowserType == gBrowserRippleBlackBerry) {	
		var menuItemSeparator1 = new blackberry.ui.menu.MenuItem(true, 10);
		blackberry.ui.menu.addMenuItem(menuItemSeparator1);
		var menuItemClear = new blackberry.ui.menu.MenuItem(false, 11,'Clear Tables', testingClearTables);
		blackberry.ui.menu.addMenuItem(menuItemClear);
		var menuItemAdd = new blackberry.ui.menu.MenuItem(false, 12,'Add Contacts', testingAddContacts);
		blackberry.ui.menu.addMenuItem(menuItemAdd);
		var menuItemSeparator2 = new blackberry.ui.menu.MenuItem(true, 13);
		blackberry.ui.menu.addMenuItem(menuItemSeparator2);
		var menuItemCall = new blackberry.ui.menu.MenuItem(false, 14,'Emerg Call', testingEmergencyCall);
		blackberry.ui.menu.addMenuItem(menuItemCall);
		var menuItemNotification = new blackberry.ui.menu.MenuItem(false, 15,'Emerg Notify', testingEmergencyNotification);
		blackberry.ui.menu.addMenuItem(menuItemNotification);
		writeLog('  testing menu added');	
	}
	writeLog('addGroupsTestingMenu Finished');
}

function testingAddContacts() {
	alert ("AddContacts");
	//Build payload from text and call processPayload
}

function testingClearTables(msg) {
//*************************************************************
//* This function will clear the tables for testing
//* Parms:
//*		Success/Failure message of recursive calls
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	var sql = '';
	var errMsg = '';
	if (msg == undefined || msg == 'DBDELETERECORDSUCCESS') {
		if (msg == undefined) {
  		gTestingClearMethod = 'groups';
			sql = 'DELETE FROM ' + gTableNameGroups;
  	}
  	else if (gTestingClearMethod == 'groups') {
			gTestingClearMethod = 'contacts';
			sql = 'DELETE FROM ' + gTableNameContacts;			
  	}
  	else if (gTestingClearMethod == 'contacts') {
			gTestingClearMethod = 'urls';
			sql = 'DELETE FROM ' + gTableNameOutstandingURLs;			
  	}
		else {
			sql = '';
			getRecords('','testingClearTables');
		}
		if (sql != '') {
			dbDeleteRecord(sql, 'testingClearTables');	
		}			
	}
	else if (msg == 'GETRECORDSSUCCESS') {
		displayGroups();
	}
	else if (msg.substring(0,16) == 'GETRECORDSERROR:' ) {
		errMsg = msg.substring(16);
	}
	else if (msg.substring(0,20) == 'DBDELETERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		alert ('Clearing error: ' + errMsg);
	}
}

function testingEmergencyCall(msg) {
//*************************************************************
//* This function will insert an Emergency Call request to simulate
//* a push to the device
//* Parms:
//*		Success/Failure message of recursive calls
//* Value Returned: 
//*		Nothing
//*************************************************************	

  var errMsg = '';
	if (msg == undefined) {
		var machineName = 'Server10945351';
		var confirmationURL = 'http://CI0000001380643/PushConfirmation/PUSHConfirmationHandler.ashx?MyMessage=EmergencyCallProcessed';
		var milliseconds = '1318443259500';
		var phoneNumber = '866-834-4161 x123456';
		var details = '<p>just testing.</p><p>need to test what this looks like with line returns and how to handle them in the payload but build them properly for the display</p>';
		var acceptURL = 'http://CI0000001380643/PushConfirmation/PUSHConfirmationHandler.ashx?MyMessage=EmergencyCallAccept';
		var declineURL = 'http://CI0000001380643/PushConfirmation/PUSHConfirmationHandler.ashx?MyMessage=EmergencyCallDecline';
		var sql = 'INSERT INTO ' + gTableNameEmergency;
		sql += '(emergencyid,type,receiveddatetime,machinename,milliseconds,phonenumber,details,accepturl,declineurl)';
		sql += ' VALUES(null, \'' + 'Call' + '\'';	
		sql += ', \'' + getDate(gUserDateDisplay) + ' @ ' + getTime() + '\''; 						
		sql += ', \'' + machineName + '\''; 		
		sql += ', \'' + milliseconds + '\'';  			
		sql += ', \'' + phoneNumber + '\''; 
		sql += ', \'' + details + '\''; 			
		sql += ', \'' + acceptURL + '\'';
		sql += ', \'' + declineURL + '\'';																																								
		sql += ')';	
		dbAddRecord(sql, 'testingEmergencyCall');					
	}
	else if (msg == 'DBADDRECORDSUCCESS') {
		if (gProcessingEmergencyRequest == false) {
			displayEmergencyRequest('');
		}
	}
	else if (msg.substring(0,17) == 'DBADDRECORDERROR:') {
		errMsg = msg.substring(17);
	}	
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		alert ('Error creating Emergency Call: ' + errMsg);
	}
}

function testingEmergencyNotification(msg) {
//*************************************************************
//* This function will insert an Emergency Notificatoin request to simulate
//* a push to the device
//* Parms:
//*		Success/Failure message of recursive calls
//* Value Returned: 
//*		Nothing
//*************************************************************	

  var errMsg = '';
	if (msg == undefined) {
		var machineName = 'Server20111116';
		var confirmationURL = 'http://CI0000001380643/PushConfirmation/PUSHConfirmationHandler.ashx?MyMessage=EmergencyNotification';
		var details = '<p>Please take note of the impending snowstorm that is being forecasted for your area</p><p>Please ensure you leave work in time to get home before the storm arrives.</p>';
		var acceptURL = 'http://CI0000001380643/PushConfirmation/PUSHConfirmationHandler.ashx?MyMessage=EmergencyNotificationAccept';
		var sql = 'INSERT INTO ' + gTableNameEmergency;
		sql += '(emergencyid,type,receiveddatetime,machinename,milliseconds,phonenumber,details,accepturl,declineurl)';
		sql += ' VALUES(null, \'' + 'Notification' + '\'';	
		sql += ', \'' + getDate(gUserDateDisplay) + ' @ ' + getTime() + '\''; 						
		sql += ', \'' + machineName + '\''; 		
		sql += ', \'' + '' + '\'';  			
		sql += ', \'' + '' + '\''; 
		sql += ', \'' + details + '\''; 			
		sql += ', \'' + acceptURL + '\'';
		sql += ', \'' + '' + '\'';																																								
		sql += ')';	
		dbAddRecord(sql, 'testingEmergencyNotification');					
	}
	else if (msg == 'DBADDRECORDSUCCESS') {
		if (gProcessingEmergencyRequest == false) {
			displayEmergencyRequest('');
		}
	}
	else if (msg.substring(0,17) == 'DBADDRECORDERROR:') {
		errMsg = msg.substring(17);
	}	
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		alert ('Error creating Emergency Notification: ' + errMsg);
	}
}
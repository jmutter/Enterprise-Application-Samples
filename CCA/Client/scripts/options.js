//*************************************************************
//* This part of the library contains all functions and global variables
//* that pertain to the user options screen.
//*************************************************************	

//Global Variables
var gOptionsChangeDetected = false;

function addMenuOptions() {
//*************************************************************
//* This function will add the appropriate menu items for the 
//* Options screen
//* Parms:
//*		Success/Failure message of recursive calls
//* Value Returned: 
//*		Nothing
//*************************************************************		
	try {
		writeLog('addMenuOptions Starting');
		blackberry.ui.menu.clearMenuItems();  //Clear the menu items		
		var menuItemSeparator1 = new blackberry.ui.menu.MenuItem(true, 1);
		var menuItemSave = new blackberry.ui.menu.MenuItem(false, 2,"Save", saveOptions);
		var menuItemCancel = new blackberry.ui.menu.MenuItem(false, 3,"Cancel", cancelOptions);		
		blackberry.ui.menu.addMenuItem(menuItemSeparator1);
		blackberry.ui.menu.addMenuItem(menuItemSave);
		blackberry.ui.menu.addMenuItem(menuItemCancel);
		writeLog('addMenuOptions Finished');
	} 
	catch (e) {
		writeLog('addMenuOptions Finished - ERROR - ' + e.message);
	}
}

function buildOptions() {
	
	if (gUserListingOrder == 'FirstName') {
		rbListingFirstName.checked = true;
	}
	else {
		rbListingLastName.checked = true;
	}
	if (gUserDateDisplay == 'YYYY-MM-DD') {
		rbDateDisplayYYYYMMDD.checked = true;		
	}
	else if (gUserDateDisplay == 'DD/MM/YYYY') {
		rbDateDisplayDDMMYYYY.checked = true;
	}
	else {
		rbDateDisplayMMDDYYYY.checked = true;		
	}	
	displayScreen (gScreenNameOptions);
}

function cancelOptions() {
	
	gOptionsChangeDetected = false;
	displayScreen(gScreenNamePrevious);
}

function rbDateDisplayDDMMYYYY_Click() {
	
	gOptionsChangeDetected = true;
}

function rbDateDisplayMMDDYYYY_Click() {
	
	gOptionsChangeDetected = true;
}

function rbDateDisplayYYYYMMDD_Click() {
	
	gOptionsChangeDetected = true;
}

function rbListingFirstName_Click() {
	
	gOptionsChangeDetected = true;
}

function rbListingLastName_Click() {
	
	gOptionsChangeDetected = true;
}

function saveOptions(msg) {
	
	var errMsg = '';
	if (msg == undefined) {
		if (rbListingFirstName.checked == true) {
			gUserListingOrder = "FirstName";
		}
		else {
			gUserListingOrder = "LastName";
		}
		if (rbDateDisplayYYYYMMDD.checked == true) {
			gUserDateDisplay = 'YYYYMMDD';
		}
		else if (rbDateDisplayDDMMYYYY.checked == true) {
			gUserDateDisplay = 'DDMMYYYY';
		}
		else {
			gUserDateDisplay = 'MMDDYYYY';
		}
		var	sql = 'UPDATE ' + gTableNameUser + ' SET listingorder = \'' + gUserListingOrder + '\', datedisplay = \'' + gUserDateDisplay + '\' WHERE recordid = \'' + gUserRecordID + '\'';
		fn_DBUpdateRecord(sql, 'saveOptions'); 	
	}
	else if (msg.substring(0,20) == 'DBUPDATERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else if (msg == 'DBUPDATERECORDSUCCESS') {	
		displayMessage('Options information saved');
		buildContactsListing('', 'saveOptions');  //Build listing screen
	}
	else if (msg.substring(0,26) == 'BUILDCONTACTSLISTINGERROR:') {
		errMsg = msg.substring(26);
	}
	else if (msg == 'BUILDCONTACTSLISTINGSUCCESS') {	
		writeLog('saveOptions Finished');	
		cancelOptions();		
	}
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		writeLog('saveOptions Finished - ERROR - ' + errMsg);	
	}
}
//*************************************************************
//* This part of the library contains all functions and global variables
//* that pertain to the user options screen.
//*************************************************************	

//Global Variables
var gOptionsChangeDetected = false;

function addMenu_Options() {
	try {
		blackberry.ui.menu.clearMenuItems();  //Clear the menu items
		
		var menuItem_topSeperator1 = new blackberry.ui.menu.MenuItem(true, 1);
		var menuItem_save = new blackberry.ui.menu.MenuItem(false, 2,"Save", saveOptions);
		var menuItem_cancel = new blackberry.ui.menu.MenuItem(false, 3,"Cancel", cancelOptions);		
		blackberry.ui.menu.addMenuItem(menuItem_topSeperator1);
		blackberry.ui.menu.addMenuItem(menuItem_save);
		blackberry.ui.menu.addMenuItem(menuItem_cancel);
	} 
	catch (e) {
		alert('exception (addMenus): ' + e.name + '; ' + e.message);
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
	
	blackberry.ui.menu.clearMenuItems();  //Clear the menu items
	gOptionsChangeDetected = false;
	displayScreen(gScreenNameListing);
}

function rbDateDisplayDDMMYYYY_Click() {
	
	gOptionsDetected = true;
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
		alert ('Options information saved');
		buildListing('', 'saveOptions');  //Build listing screen
	}
	else if (msg.substring(0,18) == 'BUILDLISTINGERROR:') {
		errMsg = msg.substring(18);
	}
	else if (msg == 'BUILDLISTINGSUCCESS') {	
		writeLog('saveOptions Finished');	
		cancelOptions();		
	}
	else {
		errMsg = 'saveOptions invalid msg: ' + msg;
	}
	if (errMsg != '') {
		writeLog('saveOptions Finished - Errors:' + errMsg);	
		alert ('Error saving options information:\n' + errMsg);
	}
}
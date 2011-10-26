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
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************		
	writeLog('addMenuOptions Starting');
	if (gBrowserType == gBrowserBlackBerry || gBrowserType == gBrowserRippleBlackBerry) {	
		blackberry.ui.menu.clearMenuItems();  //Clear the menu items		
		var menuItemSeparator1 = new blackberry.ui.menu.MenuItem(true, 1);
		blackberry.ui.menu.addMenuItem(menuItemSeparator1);
		var menuItemSave = new blackberry.ui.menu.MenuItem(false, 2,"Save", saveOptions);
		blackberry.ui.menu.addMenuItem(menuItemSave);
		var menuItemCancel = new blackberry.ui.menu.MenuItem(false, 3,"Cancel", cancelOptions);		
		blackberry.ui.menu.addMenuItem(menuItemCancel);
		writeLog('  menu built');		
	}
	else {
		writeLog('  invalid environment for menu');
	}
	writeLog('addMenuOptions Finished');
}

function cbShowAllGroup_Change() {
	
	gOptionsChangeDetected = true;
}

function cbShowCompanyOnContactBar_Change() {
	
	gOptionsChangeDetected = true;
}

function cbShowContactDividers_Change() {
	
	gOptionsChangeDetected = true;
}

function cbShowTitleOnContactBar_Change() {
	
	gOptionsChangeDetected = true;
}

function displayOptions() {
//*************************************************************
//* This function will setup and display the options screen.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************		
	
	document.getElementById(gScreenNameOptions).style.backgroundImage = "url(images/background-options.jpg)";
	document.getElementById(gScreenNameOptions).style.width = screen.availWidth + "px";
	document.getElementById(gScreenNameOptions).style.height = screen.availHeight + "px";
	document.getElementById(gScreenNameOptions).style.backgroundRepeat = "repeat";
	//Set the checkboxes and readio buttons according to values from database
	if (gUserShowAllGroup == 'True') {
		cbShowAllGroup.checked = true 
	}
	
	if (gUserListingOrder == 'FirstName') {
		rbListingFirstName.checked = true;
	}
	else {
		rbListingLastName.checked = true;
	}
	
	if (gUserShowContactDividers == 'True') {
		cbShowContactDividers.checked = true 
	}	
	
	if (gUserShowTitleOnContactBar == 'True') {
		cbShowTitleOnContactBar.checked = true 
	}
	
	if (gUserShowCompanyOnContactBar == 'True') {
		cbShowCompanyOnContactBar.checked = true 
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
	displayScreen(gScreenNameGroups);
}

function rbDateDisplayDDMMYYYY_Change() {
	
	gOptionsChangeDetected = true;
}

function rbDateDisplayMMDDYYYY_Change() {
	
	gOptionsChangeDetected = true;
}

function rbDateDisplayYYYYMMDD_Change() {
	
	gOptionsChangeDetected = true;
}

function rbListingFirstName_Change() {
	
	gOptionsChangeDetected = true;
}

function rbListingLastName_Change() {
	
	gOptionsChangeDetected = true;
}

function saveOptions(msg) {
//*************************************************************
//* This function is called when the user clicks on the Save 
//* menu option
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************		
	
	var errMsg = '';
	if (msg == undefined) {
		if (cbShowAllGroup.checked == true) {
			gUserShowAllGroup = 'True';
		}
		else {
			gUserShowAllGroup = 'False';
		}
	
		if (rbListingFirstName.checked == true) {
			gUserListingOrder = 'FirstName';
		}
		else {
			gUserListingOrder = 'LastName';
		}
		
		if (cbShowContactDividers.checked == true) {
			gUserShowContactDividers = 'True';
		}
		else {
			gUserShowContactDividers = 'False';
		}
		
		if (cbShowTitleOnContactBar.checked == true) {
			gUserShowTitleOnContactBar = 'True';
		}
		else {
			gUserShowTitleOnContactBar = 'False';
		}

		if (cbShowCompanyOnContactBar.checked == true) {
			gUserShowCompanyOnContactBar = 'True';
		}
		else {
			gUserShowCompanyOnContactBar = 'False';
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

		var	sql = 'UPDATE ' + gTableNameUser + ' SET showallgroup = \'' + gUserShowAllGroup + '\', listingorder = \'' + gUserListingOrder + '\'';
		sql += ', showcontactdividers = \'' + gUserShowContactDividers + '\', showtitleoncontactbar = \'' + gUserShowTitleOnContactBar + '\'';
		sql += ', showcompanyoncontactbar = \'' + gUserShowCompanyOnContactBar + '\', datedisplay = \'' + gUserDateDisplay + '\'';
		sql += ' WHERE recordid = \'' + gUserRecordID + '\'';
		fn_DBUpdateRecord(sql, 'saveOptions'); 	
	}
	else if (msg.substring(0,20) == 'DBUPDATERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else if (msg == 'DBUPDATERECORDSUCCESS') {	
		gOptionsChangeDetected = false;			
		displayMessage('Options information saved');
		getRecords('','saveOptions');
	}	
	else if (msg == 'GETRECORDSSUCCESS') {
		writeLog('saveOptions Finished');	
		displayGroups();
	}
	else if (msg.substring(0,16) == 'GETRECORDSERROR:' ) {
		errMsg = msg.substring(16);
	}
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		writeLog('saveOptions Finished - ERROR - ' + errMsg);	
	}
}
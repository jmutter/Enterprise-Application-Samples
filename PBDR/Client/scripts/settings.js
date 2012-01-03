//*************************************************************
//* This part of the library contains all functions and global variables
//* that pertain to the user settings screen.
//*************************************************************	

//Global Variables

function cancelSettings() {
//*************************************************************
//* This function is called when the user clicks on the Cancel
//* menu item.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************			
	gSettingsChangeDetected = false;
	displayScreen(gScreenNameGroups);
}

function displaySettings() {
//*************************************************************
//* This function will setup and display the options screen.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************		
	
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
	displayScreen (gScreenNameSettings);
}

function saveSettings(msg) {
//*************************************************************
//* This function is called when the user clicks on the Save 
//* menu option
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************		
	
	var errMsg = '';
	if (msg == undefined || msg == '') {
		writeLog('saveSettings Starting');
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
		dbUpdateRecord(sql, 'saveSettings'); 	
	}
	else if (msg == 'DBUPDATERECORDSUCCESS') {	
		gSettingsChangeDetected = false;			
		displayMessage('Settings saved');
		displayGroups('');
	}
	else if (msg.substring(0,20) == 'DBUPDATERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		writeLog('saveSettings Finished - ERROR - ' + errMsg);	
	}
}
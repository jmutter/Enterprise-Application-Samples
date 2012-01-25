//*************************************************************
//* This part of the library contains all functions and global variables
//* that pertain to the user settings screen.
//*************************************************************	

//Global Variables
var gElementSelectedImage = 'images/elementselected.png';
var gElementUnselectedImage = 'images/elementunselected.png';

function buildSettingsScreen() {
//*************************************************************
//* This function will setup and display the options screen.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************		
	
	//Set the checkboxes and readio buttons according to values from database
	//General
	if (gUserDateDisplay == 'YYYY-MM-DD') {
		document.getElementById('imgDateDisplayMMDDYYYY').src = gElementUnselectedImage;
		document.getElementById('imgDateDisplayDDMMYYYY').src = gElementUnselectedImage;
		document.getElementById('imgDateDisplayYYYYMMDD').src = gElementSelectedImage;
	}
	else if (gUserDateDisplay == 'DD/MM/YYYY') {
		document.getElementById('imgDateDisplayMMDDYYYY').src = gElementUnselectedImage;		
		document.getElementById('imgDateDisplayYYYYMMDD').src = gElementUnselectedImage;
		document.getElementById('imgDateDisplayDDMMYYYY').src = gElementSelectedImage;
	}
	else {
		document.getElementById('imgDateDisplayDDMMYYYY').src = gElementUnselectedImage;
		document.getElementById('imgDateDisplayYYYYMMDD').src = gElementUnselectedImage;
		document.getElementById('imgDateDisplayMMDDYYYY').src = gElementSelectedImage;
	}
	if (gUserPlayIntroMusic == 'True') {
		document.getElementById('imgPlayIntroMusic').src = gElementSelectedImage;
	}
	if (gUserPlayWaitingMusic == 'True') {
		document.getElementById('imgPlayWaitingMusic').src = gElementSelectedImage;
	}

	//Groups
	if (gUserShowAllGroup == 'True') {
		document.getElementById('imgShowAllGroup').src = gElementSelectedImage;
	}
	
	//Contacts
	if (gUserListingOrder == 'FirstName') {
		document.getElementById('imgNameDisplayLastName').src = gElementUnselectedImage;		
		document.getElementById('imgNameDisplayFirstName').src = gElementSelectedImage;
	}
	else {
		document.getElementById('imgNameDisplayFirstName').src = gElementUnselectedImage;
		document.getElementById('imgNameDisplayLastName').src = gElementSelectedImage;
	}	
	if (gUserShowContactDividers == 'True') {
		document.getElementById('imgContactDividers').src = gElementSelectedImage;
	}	
	
	if (gUserShowTitleOnContactBar == 'True') {
		document.getElementById('imgTitleOnContactBar').src = gElementSelectedImage;
	}
	
	if (gUserShowCompanyOnContactBar == 'True') {
		document.getElementById('imgCompanyOnContactBar').src = gElementSelectedImage;
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
		var	sql = 'UPDATE ' + gTableNameUser + ' SET showallgroup = \'' + gUserShowAllGroup + '\', listingorder = \'' + gUserListingOrder + '\'';
		sql += ', showcontactdividers = \'' + gUserShowContactDividers + '\', showtitleoncontactbar = \'' + gUserShowTitleOnContactBar + '\'';
		sql += ', showcompanyoncontactbar = \'' + gUserShowCompanyOnContactBar + '\', datedisplay = \'' + gUserDateDisplay + '\'';
		sql += ', playintromusic = \'' + gUserPlayIntroMusic + '\', playwaitingmusic = \'' + gUserPlayWaitingMusic + '\'';
		sql += ' WHERE recordid = \'' + gUserRecordID + '\'';
		dbUpdateRecord(sql, 'saveSettings'); 	
	}
	else if (msg == 'DBUPDATERECORDSUCCESS') {	
		if (gScreenDisplayed == gScreenNameGroups) {
			buildGroupsScreen('');
		}
		else if (gScreenDisplayed == gScreenNameContacts) {
			buildContactsListing('', gGroupNameSelected);
		}
	}
	else if (msg.substring(0,20) == 'DBUPDATERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		writeLog('saveSettings Finished - ERROR - ' + errMsg);	
		displayMessage('<p>An error occurred while saving settings.  Please retry.</p><p>If this problem persists, please contact your Administrator</p>', 'OkOnly');		
	}
}

function setCheckBoxIcon(elementToSet) {
//*************************************************************
//* This function will set the appropriate icon for Show Title 
//* on Contact bar
//* Parms:
//*		Icon to set and use to process global variable
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	var element = document.getElementById(elementToSet);
	//Check to ensure the element passed is a value on the form
	if (element != null) {
		var iconValue = '';
		var variableValue = '';
		element = element.src;  //Get source of image
		if (element.indexOf(gElementSelectedImage) > 0) {
			iconValue = gElementUnselectedImage;
			variableValue = 'False';
		}	
		else {
			iconValue = gElementSelectedImage;
			variableValue = 'True';
		}

		switch (elementToSet.toLowerCase()) {
			case 'imgcompanyoncontactbar':
				gUserShowCompanyOnContactBar = variableValue;	
			  break;	
			case 'imgcontactdividers':
				gUserShowContactDividers = variableValue;	
			  break;
			case 'imgplaywaitingmusic':
				gUserPlayWaitingMusic = variableValue;	
			  break;	
			case 'imgplayintromusic':
				gUserPlayIntroMusic = variableValue;	
			  break;
			case 'imgshowallgroup':
				gUserShowAllGroup = variableValue;	
			  break;		  
			case 'imgtitleoncontactbar':
				gUserShowTitleOnContactBar = variableValue;	
			  break;	
		}
		//Set the icon to the determined value
		document.getElementById(elementToSet).src = iconValue;
	}
}

function setRadioButtonIcon(elementToSet) {
//*************************************************************
//* This function will set the appropriate icon for the selected
//* date display
//* Parms:
//*		Icon to set and use to process global variable
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	switch (elementToSet.toLowerCase()) {
		case 'mmddyyyy':
			gUserDateDisplay = 'MM/DD/YYYY';
			document.getElementById('imgDateDisplayDDMMYYYY').src = gElementUnselectedImage;
			document.getElementById('imgDateDisplayYYYYMMDD').src = gElementUnselectedImage;
			document.getElementById('imgDateDisplayMMDDYYYY').src = gElementSelectedImage;	
			break;
		case 'ddmmyyyy':
			gUserDateDisplay = 'DD/MM/YYYY';
			document.getElementById('imgDateDisplayMMDDYYYY').src = gElementUnselectedImage;		
			document.getElementById('imgDateDisplayYYYYMMDD').src = gElementUnselectedImage;
			document.getElementById('imgDateDisplayDDMMYYYY').src = gElementSelectedImage;	
			break;
		case 'yyyymmdd':
			gUserDateDisplay = 'YYYY-MM-DD';
			document.getElementById('imgDateDisplayMMDDYYYY').src = gElementUnselectedImage;		
			document.getElementById('imgDateDisplayDDMMYYYY').src = gElementUnselectedImage;
			document.getElementById('imgDateDisplayYYYYMMDD').src = gElementSelectedImage;	
			break;
		case 'lastname':
			gUserListingOrder = 'LastName';
			document.getElementById('imgNameDisplayFirstName').src = gElementUnselectedImage;
			document.getElementById('imgNameDisplayLastName').src = gElementSelectedImage;	
			break;		
		case 'firstname':				
			gUserListingOrder = 'FirstName';
			document.getElementById('imgNameDisplayLastName').src = gElementUnselectedImage;		
			document.getElementById('imgNameDisplayFirstName').src = gElementSelectedImage;
			break;			
	}
}

function toggleSection(headerId, contentId, direction) {
//*************************************************************
//* This function will control how a header and content get 
//* displayed and hidden using the header as a toggle
//* Parms:
//*		Name of header id tag
//*		Name of content id tag
//* Value Returned: 
//*		Nothing
//*************************************************************		
	var header = document.getElementById(headerId);
	var content = document.getElementById(contentId);
	if (header && content) {
		var image = header.getElementsByTagName("img")[0];
		if (direction == undefined) {
			if (image.src.indexOf('minus.png') == -1) {
				direction = 'expand';
			}
			else {
				direction = 'collapse';
			}
		}
		else {
			direction = direction.toLowerCase();
		}

		var newIcon = '';
		if (direction == 'expand') {
			newIcon = 'images/minus.png';
			//Expand the contents
			content.style.display = '';
		}
		else {
			newIcon = 'images/plus.png';
			//Collapse the contents
		  content.style.display = 'none';
		}
		//Remove the existing icon
		header.removeChild(image);
		//Add the new icon and set the class
		var icon = new Image();
		icon.src = newIcon;
		icon.className = 'sectionHeaderImage';
		header.appendChild(icon);
	}
}
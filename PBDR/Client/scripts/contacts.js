//*************************************************************
//* This library contains all functions and global variables
//* that pertain to the contacts listing screen.
//*
//* Options are only available from the Group listing menu 
//* to aleviate any problems with data changing while the options 
//* screen was displayed.  This also helps for re-ordering if 
//* the user chnages the way the contacts should be listed
//*************************************************************	

//Global Variables
var gContactCounter = 0;
var gContactRecords = new Array();
var gGroupPayloadCounter = 0;
var gContactPayloadAddedCounter = 0;
var gContactPayloadGroupName = '';
var gContactPayloadGroups;

function buildContactPanel(contactid, group, firstname, lastname, title, company, email, pin, workphone, mobilephone, homephone, address, address2, city, state, zipcode, country) {	
//*************************************************************
//* This function will build the panel title and details for 
//* each contact record using the detail values supplied.
//* Parms:
//* 	All necessary detail values to build the panel
//* Value Returned: 
//*		Nothing
//*************************************************************
	
	var commaCheck = '';
	var html = '';
	html += '<div class="panelTitle ui-header ui-bar-c collIco" data-role="header" data-position="inline">';
	if (gUserListingOrder == 'FirstName') {
		html += '<div style="font-size:10pt; font-weight:strong">' + firstname + ' ' + lastname + '</div>';
	}
	else {
		html += '<div style="font-size:10pt; font-weight:strong">' + lastname + ', ' + firstname + '</div>';
	}
	if (title != '' && gUserShowTitleOnContactBar == 'True') {
		html += '<div style="font-size:7pt; color:#7E2217; font-weight:normal">' + title + '</div>';
	}
	if (company != '' && gUserShowCompanyOnContactBar == 'True') {
		html += '<div style="font-size:7pt; font-weight:normal">' + company + '</div>';
	}	
	html += '</div>';
	html += '<div class="panel">';
	html +=	'<div class="ui-body-a">';
	if (gGroupNameSelected == 'AllOfThem') {
		html += '<div style="font-size:7pt; font-weight:normal">' + 'Group: ';
		html += '<label style="font-size:9pt; color:#006600; font-weight:normal">' + group + '</label></div>';
	}
	if (title != '' && gUserShowTitleOnContactBar != 'True') {
		html += '<div style="font-size:9pt; color:#347235; font-weight:normal">' + title + '</div>';
	}
	if (company != '' && gUserShowCompanyOnContactBar != 'True') {
		html += '<div style="font-size:9pt; color:#AF7817; font-weight:normal">' + company + '</div>';
	}	
	if (email != '') {
		html +=	'<div><img src="images/email.png"/>';
		if (email != 'missingvalue') {
			html +=	'<a style="font-size:9pt; font-weight:normal" href="mailto:' + email + '?subject=Emergency_Contact&body=Please contact me at">  ' + email + '</a></div>';
		}
		else {
			html += '<div style="font-size:9pt; font-weight:normal">' + email + '</div>';
		}
	}
	if (workphone != '') {
		html += '<div><img src="images/phone.png"/><label style="font-size:7pt; font-weight:normal"> (w):</label>';
		html += '<a style="font-size:9pt; font-weight:normal">' + workphone +'</a></div>';
	}
	if (mobilephone != '') {
		html += '<div><img src="images/phone.png"/><label style="font-size:7pt; font-weight:normal"> (m):</label>';
		html += '<a style="font-size:9pt; font-weight:normal">' + mobilephone + '</a></div>';
	}
	if (homephone != '') {
		html += '<div><img src="images/phone.png"/><label style="font-size:7pt; font-weight:normal"> (h):</label>';
		html += '<a style="font-size:9pt; font-weight:normal">' + homephone + '</a></div>';
	}
	if(pin != '') {
		html += '<div><img src="images/pin.png"/><label style="font-size:7pt; font-weight:normal"> pin:</label>';
		html += '<a style="font-size:9pt; font-weight:normal">' + pin + '</a></div>';
	}
	if (address != '') {			
		html += '<div style="font-size:9pt; font-weight:normal">' + address + '</div>';
	}
	if (address2 != '') {			
		html += '<div style="font-size:9pt; font-weight:normal">' + address2 + '</div>';
	}
	if (city != '' || state != '' || country != '') {			
		commaCheck = ((city != '' && state != '') ? (city + ', ' + state) : (city + state));
		html += '<div style="font-size:9pt; font-weight:normal">' + commaCheck + '  ' + zipcode + '  ' + country + '</div>';
	} 
	html += '</div>';
	return html;	
}

function buildContactsListing() {
//*************************************************************
//* This function will retrieve records from the database and
//* build the listing screen as appropriate for display
//* Parms:
//* 	Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************
	
	writeLog('buildContactsListing Starting');	
	var header = gGroupNameSelected;
	if (gGroupNameSelected == 'AllOfThem') {
		header = 'All';
	}
	writeLog('  Processing ' + gContactRecords.length + ' contacts');	
	var panel = '';
	var array;
	var counter;
	var prevChar = '';
	var char = '';
	var html = '';
	var emails = '';
	var displayContact = true;
	
	var showDivider = false;
	if (gUserShowContactDividers == 'True') {
		showDivider = true;
	}
	if (gContactRecords.length == 1) {
		showDivider = false;
	}
	
	$('#contactslisting').empty();
	//$('#listofentries').attr('data-filter', 'true');
	for (counter = 0; counter < gContactRecords.length; ++counter) {
		array = gContactRecords[counter].split(gDelim);	
		displayContact = true;
		if (gGroupNameSelected == 'AllOfThem') {
			//Check to see if we have already put a contact with this email address in the listing
			if (emails.indexOf(array[6].toLowerCase() + gDelim) == -1) {
				emails = emails.toLowerCase() + array[6] + gDelim;
			}
			else {
				displayContact = false;
			}
		}
		if (displayContact == true) {			
			html = '';	
			if (showDivider == true) {
				if (gUserListingOrder == 'FirstName') {
					char = array[2].substr(0,1).toUpperCase();
				}
				else {
					char = array[3].substr(0,1).toUpperCase();
				}		
				if (prevChar != char) {
					html = '<li style="font-size:8pt; font-weight:strong" data-role="list-divider">' + char + '</li>';
				}
				prevChar = char;
			}
			panel = buildContactPanel(array[0], array[1], array[2], array[3], array[4], array[5], array[6], array[7], array[8], array[9], array[10],array[11],array[12],array[13],array[14],array[15], array[16]);
			html += panel;
			$('#contactslisting').append(html);
		}
	}
	$('#contactslisting').listview('refresh');
	
	//Apply the JQuery Mobile plug-in to build an accordian looking effect
	//applyAccordion();
	$('.panel').hide();                                                                    
  $('.panelTitle').collapser( {
    target: 'next',
    effect: 'slide',
    changeText: 0,
    expandClass: 'expIco',
    collapseClass: 'collIco'
  }, function() {
    $('.panel').slideUp();
  });
  
	document.getElementById('contactsheader').innerHTML = '<label>' + header + '</label>';	
	writeLog('buildContactsListing Finished');
}

function buildContactsScreen(msg, groupName) {
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
	if (msg == '' || msg == undefined) {
		writeLog('buildContactsScreen Starting');
		gGroupNameSelected = groupName;	
		var	sql = 'SELECT contactid, groupname, firstname, lastname, title, company, email, pin, workphone, mobilephone, homephone, address, address2, city, state, zipcode, country FROM ' + gTableNameContacts;
		if (groupName != 'AllOfThem') {
			sql += ' WHERE groupname like \'' + gGroupNameSelected + '\'';
		}
		if (gUserListingOrder == 'FirstName') {
			sql += ' ORDER BY firstname, lastname';
		}	
		else {
			sql += ' ORDER BY lastname, firstname';
		}
		dbGetRecords(sql, 'contacts', 'buildContactsScreen');
	}
	else if (msg == 'DBGETRECORDSSUCCESS') {
		if (gContactRecords.length > 0 ) {
			buildContactsListing();
			displayScreen(gScreenNameContacts);
		}
		else {
			alert ('No contacts found for Group: ' + gGroupNameSelected + '\n\nPlease contact your administrator.');
		}
		writeLog('buildContactsScreen Finished');
	}
	else if (msg.substring(0,18) == 'DBGETRECORDSERROR:') {
		errMsg = msg.substring(18);
	}	
	else {
  	errMsg = 'Invalid msg: ' + msg;
	}	
	if (errMsg != '') {
		writeLog('buildContactsScreen Finished - ERROR - '+ errMsg);
	}	
}

function buildNoContactsScreen() {
//*************************************************************
//* This function will build the nocontacts <div> to build
//* a repeated background.
//* Only need to call this function once
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************	

	document.getElementById(gScreenNameNoContacts).style.backgroundImage = "url(images/nocontacts.png)";
	document.getElementById(gScreenNameNoContacts).style.width = screen.availWidth + "px";
	document.getElementById(gScreenNameNoContacts).style.height = screen.availHeight + "px";
	document.getElementById(gScreenNameNoContacts).style.backgroundRepeat = "repeat";
}

function insertContactRecords(msg, functionToCall) {
//*************************************************************
//* This function will insert the records received by a PUSH
//* request.
//* Parms:
//*		Success/Error messages to analyze from called functions
//* Value Returned: 
//*		Nothing
//*************************************************************	

	var sql = '';
	var errMsg = '';
	if (msg == '') {
		gParentFunctionToCall = functionToCall;
  	writeLog('insertContactRecords Starting');
		sql = 'DELETE FROM ' + gTableNameContacts + ' WHERE groupname = \'' + fieldPrepare(gContactPayloadGroupName) + '\'';
		dbDeleteRecord(sql, 'insertContactRecords');
	}
	else if (msg == 'DBDELETERECORDSUCCESS' || msg == 'DBADDRECORDSUCCESS') {
		if (gContactCounter < gJSONPayload.Contacts.length) { 
			if (gJSONPayload.Contacts[gContactCounter].groupname.toLowerCase() == gContactPayloadGroupName.toLowerCase()) {				
				//Ensure the values added are in the order of which they were defined for the database
				sql = 'INSERT INTO ' + gTableNameContacts;
				//sql += '(contactid,firstname,lastname,title,company,email,pin,workphone,mobilephone,homephone,address,address2,city,state,zipcode,country)';
				sql += '(contactid,groupname,firstname,lastname,title,company,email,pin,workphone,mobilephone,homephone,address,address2,city,state,zipcode,country)';		
				sql += ' VALUES(null';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contacts[gContactCounter].groupname) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contacts[gContactCounter].firstname) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contacts[gContactCounter].lastname) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contacts[gContactCounter].title) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contacts[gContactCounter].company) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contacts[gContactCounter].email.toLowerCase()) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contacts[gContactCounter].pin) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contacts[gContactCounter].workphone) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contacts[gContactCounter].mobilephone) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contacts[gContactCounter].homephone) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contacts[gContactCounter].address) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contacts[gContactCounter].address2) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contacts[gContactCounter].city) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contacts[gContactCounter].state) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contacts[gContactCounter].zipcode) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contacts[gContactCounter].country) + '\'';																																							
				sql += ')';
				gContactCounter ++;
				gContactPayloadAddedCounter ++;
				dbAddRecord(sql, 'insertContactRecords');
			}
			else {
				gContactCounter ++;
				insertContactRecords('DBADDRECORDSUCCESS');
			}
		}
		else {
			writeLog('insertContactRecords Finished');
			window[gParentFunctionToCall]('INSERTCONTACTSSUCCESS');			
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
		writeLog('insertContactRecords Finished - ERROR - ' + errMsg);
		window[gParentFunctionToCall]('INSERTCONTACTSERROR:' + errMsg);	
	}
}

function processContactsPayload(msg) {
//*************************************************************
//* This function will insert the records received by a PUSH
//* request.
//* Parms:
//*		Success/Error messages to analyze from called functions
//* Value Returned: 
//*		Nothing
//*************************************************************	

	var sql = '';
	var errMsg = '';
	if (msg == '') {
  	writeLog('processContactPayload Starting');
  	var groupsFound = '';
  	var groupName;
  	writeLog('  Analyzing JSON payload');
  	var counter;	
		for (counter = 0; counter < gJSONPayload.Contacts.length; ++counter) {
			//Validate that all required properties exist in the object and if not, make them blank.
			//If any field is undefined, change to blank for consistent testing
			if (gJSONPayload.Contacts[counter].groupname == undefined) {
				gJSONPayload.Contacts[counter].groupname = '';
			}		
			if (gJSONPayload.Contacts[counter].firstname == undefined) {
				gJSONPayload.Contacts[counter].firstname = '';
			}				
			if (gJSONPayload.Contacts[counter].lastname == undefined) {
				gJSONPayload.Contacts[counter].lastname = '';
			}		
			if (gJSONPayload.Contacts[counter].title == undefined) {
				gJSONPayload.Contacts[counter].title = '';
			}		
			if (gJSONPayload.Contacts[counter].company == undefined) {
				gJSONPayload.Contacts[counter].company = '';
			}	
			if (gJSONPayload.Contacts[counter].email == undefined) {
				gJSONPayload.Contacts[counter].email = '';
			}	
			if (gJSONPayload.Contacts[counter].pin == undefined) {
				gJSONPayload.Contacts[counter].pin = '';
			}	
			if (gJSONPayload.Contacts[counter].workphone == undefined) {
				gJSONPayload.Contacts[counter].workphone = '';
			}	
			if (gJSONPayload.Contacts[counter].mobilephone == undefined) {
				gJSONPayload.Contacts[counter].mobilephone = '';
			}										
			if (gJSONPayload.Contacts[counter].homephone == undefined) {
				gJSONPayload.Contacts[counter].homephone = '';
			}
			if (gJSONPayload.Contacts[counter].address == undefined) {
				gJSONPayload.Contacts[counter].address = '';
			}	
			if (gJSONPayload.Contacts[counter].address2 == undefined) {
				gJSONPayload.Contacts[counter].address2 = '';
			}	
			if (gJSONPayload.Contacts[counter].city == undefined) {
				gJSONPayload.Contacts[counter].city = '';
			}
			if (gJSONPayload.Contacts[counter].state == undefined) {
				gJSONPayload.Contacts[counter].state = '';
			}	
			if (gJSONPayload.Contacts[counter].zipcode == undefined) {
				gJSONPayload.Contacts[counter].zipcode = '';
			}	
			if (gJSONPayload.Contacts[counter].country == undefined) {
				gJSONPayload.Contacts[counter].country = '';
			}		
																									
			//Set needed values to a default if not supplied in the payload
			if (gJSONPayload.Contacts[counter].groupname == '') {
				gJSONPayload.Contacts[counter].groupname = 'Not Defined';
			}	
			if (gJSONPayload.Contacts[counter].firstname == '') {
				gJSONPayload.Contacts[counter].firstname = 'MissingValue';
			}				
			if (gJSONPayload.Contacts[counter].lastname == '') {
				gJSONPayload.Contacts[counter].lastname = 'MissingValue';
			}	
			if (gJSONPayload.Contacts[counter].email == '') {
				gJSONPayload.Contacts[counter].email = 'MissingValue';
			}	
			//Look for groupname to see if we already have this	
			groupName = gJSONPayload.Contacts[counter].groupname;
			groupName = groupName.replace("'","");  //Remove apostrophe as this affects our onclick for the group
			if (groupsFound.toLowerCase().indexOf(groupName.toLowerCase() + '<-->') == -1) {
				groupsFound += groupName + '<-->'
			}
  	}
	}

  if (msg == '' || msg == 'INSERTCONTACTSSUCCESS') {
  	if (msg == '') {
  		groupsFound = groupsFound.substr(0,groupsFound.length - 4);  //Remove last delimeter
			gContactPayloadGroups = groupsFound.split('<-->')
			writeLog('  Processing ' + gContactPayloadGroups.length + ' groups');
			gGroupPayloadCounter = 0;
  	}
  	if (gGroupPayloadCounter < gContactPayloadGroups.length) { 
  		gContactPayloadGroupName = gContactPayloadGroups[gGroupPayloadCounter];
  		if (msg == 'INSERTCONTACTSSUCCESS') {
    		gContactPayloadGroups[gGroupPayloadCounter - 1] = gContactPayloadGroups[gGroupPayloadCounter - 1] + gDelim + gContactPayloadAddedCounter.toString() + gDelim + getDate(gUserDateDisplay) + ' @ ' + getTime();
  		}
  		gContactCounter = 0;
  		gContactPayloadAddedCounter = 0;
  		insertContactRecords('','processContactsPayload');
  	}
  	else {
  		gContactPayloadGroups[gGroupPayloadCounter - 1] =gContactPayloadGroups[gGroupPayloadCounter - 1] + gDelim + gContactPayloadAddedCounter.toString() + gDelim + getDate(gUserDateDisplay) + ' @ ' + getTime();
  		updateGroups('', 'processContactsPayload');  	
  	}
  	gGroupPayloadCounter++;
  }
  else if (msg == 'UPDATEGROUPSSUCCESS') {
  	gContactsDateTime = getDate('yyyymmdd') + ' @ ' + getTime('hhmmss');
  	var	sql = 'UPDATE ' + gTableNameConfig + ' SET datetime = \'' + gContactsDateTime + '\' WHERE type = \'Contacts\'';
		dbUpdateRecord(sql, 'processContactsPayload'); 
	} 
	else if (msg == 'DBUPDATERECORDSUCCESS') {	
		writeLog('processContactPayload Finished');
	}
	else if (msg.substring(0,20) == 'DBUPDATERECORDERROR:') {
		errMsg = msg.substring(20);
	}  
	else if (msg.substring(0,20) == 'INSERTCONTACTSERROR:') {
		errMsg = msg.substring(20);
	}
	else if (msg.substring(0,13) == 'UPDATEGROUPS:') {
		errMsg = msg.substring(13);
	}
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		var tempCode = gDebugMode;
		if (abort == true) {
			gDebugMode = true;
		}
		writeLog('processContactPayload Finished - ERROR - ' + errMsg);
		if (abort == true) {
			gDebugMode = tempCode;
		}
	}
}
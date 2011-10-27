//*************************************************************
//* This library contains all functions and global variables
//* that pertain to the listing screen.
//*
//* Options are only available from the Group listing menu 
//* to aleviate any problems with data changing while the options 
//* screen was displayed.  This also helps for re-ordering if 
//* the user chnages the way the contacts should be listed
//*************************************************************	

//Global Variables
var gContactCounter = 0;
var gContactRecords = new Array();
var gGroupCounter = 0;
var gGroupNameSelected = '';
var gGroupPayloadCounter = 0;
var gContactPayloadAddedCounter = 0;
var gContactPayloadGroupName = '';
var gContactPayloadGroups;
var gContactPayloadURL = '';
var gInsertGroupCounter;

function addContact(msg, email){

	alert("adding msg" + msg + "email: " + email);
	try {
		if (msg == ''){
			alert("msge set right");
			//Set up the FilterExpressions used to search the contact list 		
			var filter = new blackberry.find.FilterExpression("email1", "REGEX", email);	
		
			//Search contact based on filter expressions
			var contacts = blackberry.pim.Contact.find(filter);	
		
			//Check the length of the contact array. If we find a record, prompt user to manually add contact	
			if (contacts.length > 0) {
				alert ("A Contact already exists for " + email + ". Contact must be manually deleted prior to adding");
			}
			else {
				writeLog ("adding contact " + email);	
		
				var contactRecord; 
				writeLog('  Retrieving user record');
				sql = 'SELECT contactid, firstname, lastname, title, company, email, pin, workphone, mobilephone, homephone, address, address2, city, state, zipcode, country FROM ' + gTableNameContacts + ' WHERE email = \'' + fieldPrepare(email) + '\'';;
				fn_DBGetRecord(sql, 'addContact');
			}
		}else if (msg == 'DBGETRECORDSUCCESS') {
			alert("msg success" + gDBRecordRetrieved.length);
			for (counter = 0; counter < gDBRecordRetrieved.length; ++counter) {
				//Our main listitem that display's the user's name
				array = gDBRecordRetrieved[counter].split(gDelim);	
	
				//array order: 0-contactid,1-firstname,2-lastname,3-title,4-company,5-email,6-pin
				//7-workphone, 8-mobilephone,9-homephone,10-address,11-address1
				//12-city, 13-state, 14-zip, 15-country
		 		
				var address = new blackberry.pim.Address();
			 	address.address1 = array[10];
			  address.address2 = array[11];
			  address.city = array[12];
			  address.stateProvince = array[13];
			  address.zipPostal = array[14];
			  address.country = array[15];
		  	
			  var contact = new blackberry.pim.Contact();
				contact.firstName = array[1];
				contact.lastName = array[2];
				contact.email1 = array[5];
				contact.workPhone = array[7];
				contact.homePhone = array[9];
				contact.mobilePhone = array[8];
				contact.pin = array[6];
				contact.workAddress = address;
				contact.jobTitle = array[3];
				contact.company = array[4];

				var args = new blackberry.invoke.AddressBookArguments(contact);
				args.view = blackberry.invoke.AddressBookArguments.VIEW_EDIT;
					   
				blackberry.invoke.invoke(blackberry.invoke.APP_ADDRESSBOOK, args);  
			}
		}
		
	} 
	catch (e) {
		writeLog('exception (): ' + e.name + '; ' + e.message);
	}

} 

function addContactsMenu() {
//*************************************************************
//* This function will add the appropriate menu items for the 
//* Contacts screen
//* Parms:
//*		Success/Failure message of recursive calls
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	writeLog('addContactsMenu Starting');
	if (gBrowserType == gBrowserBlackBerry || gBrowserType == gBrowserRippleBlackBerry) {
		blackberry.ui.menu.clearMenuItems();  //Clear the menu items		
		var menuItemSeparator1 = new blackberry.ui.menu.MenuItem(true, 1);
		blackberry.ui.menu.addMenuItem(menuItemSeparator1);
		var menuItemAbout = new blackberry.ui.menu.MenuItem(false, 2,"About", displayAbout);
		blackberry.ui.menu.addMenuItem(menuItemAbout);
		writeLog('  menu built');		
	}
	else {
		writeLog('  invalid environment for menu');
	}
	writeLog('addContactsMenu Finished');		
}

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
	html +=	'<div class="ui-body-e">';
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
		html +=	'<a style="font-size:9pt; font-weight:normal" href="mailto:' + email + '?subject=Emergency_Contact&body=Please contact me at">  ' + email + '</a></div>';
	}
	if (workphone != '') {
		html += '<div><img src="images/phone.png"/><label style="font-size:7pt; font-weight:normal"> (w):</label>';
		html += '<a style="font-size:9pt; font-weight:normal" href="tel:' + workphone + '">' + workphone +'</a></div>';
	}
	if (mobilephone != '') {
		html += '<div><img src="images/phone.png"/><label style="font-size:7pt; font-weight:normal"> (m):</label>';
		html += '<a style="font-size:9pt; font-weight:normal" href="tel:'+ mobilephone + '">' + mobilephone + '</a></div>';
	}
	if (homephone != '') {
		html += '<div><img src="images/phone.png"/><label style="font-size:7pt; font-weight:normal"> (h):</label>';
		html += '<a style="font-size:9pt; font-weight:normal" href="tel:'+ homephone +'">' + homephone + '</a></div>';
	}
	if(pin != '') {
		html += '<div><img src="images/pin.png"/><label style="font-size:7pt; font-weight:normal"> pin:</label>';
		html += '<a style="font-size:9pt; font-weight:normal" href="pin:' + pin+ '">' + pin + '</a></div>';
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
	if (email != '') {
	var escapedE = email.replace(".", "");
		html +=	'<div><a style="font-size:8pt; font-weight:normal" href="javascript:addContact(\'\'\,\'' + contactid + '\')"><img src="images/plus.png"/>  Add to Contacts</a></div>';
	} 
	html += '</div>';
	return html;	
}

function buildContactsListing(groupName) {
//*************************************************************
//* This function will retrieve records from the database and
//* build the listing screen as appropriate for display
//* Parms:
//* 	Name of group that user must belong to in order to display them
//* Value Returned: 
//*		Nothing
//*************************************************************
	
	writeLog('buildContactsListing Starting');	
	var header = groupName;
	if (groupName == 'AllOfThem') {
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
	var contactCounter = 0;
	for (counter = 0; counter < gContactRecords.length; ++counter) {
		array = gContactRecords[counter].split(gDelim);	
		if (array[1] == groupName) {
			contactCounter++;
		}	
	}	
	if (gUserShowContactDividers == 'True') {
		showDivider = true;
	}

	if (contactCounter == 1) {
		showDivider = false;
	}
	
	$('#listofentries').empty();
	//$('#listofentries').attr('data-filter', 'true');
	for (counter = 0; counter < gContactRecords.length; ++counter) {
		array = gContactRecords[counter].split(gDelim);	
		displayContact = false;
		if (array[1] == groupName) {
			displayContact = true;
		}	
		else if (groupName == 'AllOfThem') {
			//Check to see if we have already put a contact with this email address in the listing
			if (emails.indexOf(array[6].toLowerCase() + gDelim) == -1) {
				emails = emails.toLowerCase() + array[6] + gDelim;
				displayContact = true;  //Set to show we can display this contact
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
			$('#listofentries').append(html);
		}
	}
	$('#listofentries').listview('refresh');
	
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
  
	document.getElementById('listheader').innerHTML = '<label>' + header + '</label>';	
	writeLog('buildContactsListing Finished');
}

function displayContacts(groupName) {
//*************************************************************
//* This function will build the list of contacts based on the 
//* selected group from the group listing
//* Parms:
//*		Success/Failure message from called functions (from callbacks)
//*   Group to build listing from
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	writeLog('displayContacts Starting');
	gGroupNameSelected = groupName;			
	buildContactsListing(groupName);	
	gScreenDisplayed = gScreenNameContacts;	
	addContactsMenu();
	writeLog('displayContacts Finished');
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
		gInsertCounter = 0;
		sql = 'DELETE FROM ' + gTableNameContacts + ' WHERE groupname = \'' + fieldPrepare(gContactPayloadGroupName) + '\'';
		fn_DBDeleteRecord(sql, 'insertContactRecords');		
	}
	else if (msg == 'DBDELETERECORDSUCCESS' || msg == 'DBADDRECORDSUCCESS') {
		if (gContactCounter < gJSONPayload.Contact.length) { 
			if (gJSONPayload.Contact[gContactCounter].groupname.toLowerCase() == gContactPayloadGroupName.toLowerCase()) {
				//Ensure the values added are in the order of which they were defined for the database
				sql = 'INSERT INTO ' + gTableNameContacts;
				//sql += '(contactid,firstname,lastname,title,company,email,pin,workphone,mobilephone,homephone,address,address2,city,state,zipcode,country)';
				sql += '(contactid,groupname,firstname,lastname,title,company,email,pin,workphone,mobilephone,homephone,address,address2,city,state,zipcode,country)';		
				sql += ' VALUES(null';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contact[gContactCounter].groupname) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contact[gContactCounter].firstname) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contact[gContactCounter].lastname) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contact[gContactCounter].title) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contact[gContactCounter].company) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contact[gContactCounter].email.toLowerCase()) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contact[gContactCounter].pin) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contact[gContactCounter].workphone) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contact[gContactCounter].mobilephone) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contact[gContactCounter].homephone) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contact[gContactCounter].address) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contact[gContactCounter].address2) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contact[gContactCounter].city) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contact[gContactCounter].state) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contact[gContactCounter].zipcode) + '\'';
				sql += ', \'' + fieldPrepare(gJSONPayload.Contact[gContactCounter].country) + '\'';																																							
				sql += ')';
				gContactCounter ++;
				gContactPayloadAddedCounter ++;
				fn_DBAddRecord(sql, 'insertContactRecords');
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
		for (counter = 0; counter < gJSONPayload.Contact.length; ++counter) {
			//Validate that all required properties exist in the object and if not, make them blank.
			if (gJSONPayload.Contact[counter].confirmationurl == undefined) {
				gJSONPayload.Contact[counter].confirmationurl = '';
			}
			if (counter == 0) {
				gContactPayloadURL = myTrim(gJSONPayload.Contact[counter].confirmationurl);
			}	
			if (gJSONPayload.Contact[counter].groupname == undefined) {
				gJSONPayload.Contact[counter].groupname = '';
			}		
			if (gJSONPayload.Contact[counter].firstname == undefined) {
				gJSONPayload.Contact[counter].firstname = '';
			}				
			if (gJSONPayload.Contact[counter].lastname == undefined) {
				gJSONPayload.Contact[counter].lastname = '';
			}		
			if (gJSONPayload.Contact[counter].title == undefined) {
				gJSONPayload.Contact[counter].title = '';
			}		
			if (gJSONPayload.Contact[counter].company == undefined) {
				gJSONPayload.Contact[counter].company = '';
			}	
			if (gJSONPayload.Contact[counter].email == undefined) {
				gJSONPayload.Contact[counter].email = '';
			}	
			if (gJSONPayload.Contact[counter].pin == undefined) {
				gJSONPayload.Contact[counter].pin = '';
			}	
			if (gJSONPayload.Contact[counter].workphone == undefined) {
				gJSONPayload.Contact[counter].workphone = '';
			}	
			if (gJSONPayload.Contact[counter].mobilephone == undefined) {
				gJSONPayload.Contact[counter].mobilephone = '';
			}										
			if (gJSONPayload.Contact[counter].homephone == undefined) {
				gJSONPayload.Contact[counter].homephone = '';
			}
			if (gJSONPayload.Contact[counter].address == undefined) {
				gJSONPayload.Contact[counter].address = '';
			}	
			if (gJSONPayload.Contact[counter].address2 == undefined) {
				gJSONPayload.Contact[counter].address2 = '';
			}	
			if (gJSONPayload.Contact[counter].city == undefined) {
				gJSONPayload.Contact[counter].city = '';
			}
			if (gJSONPayload.Contact[counter].state == undefined) {
				gJSONPayload.Contact[counter].state = '';
			}	
			if (gJSONPayload.Contact[counter].zipcode == undefined) {
				gJSONPayload.Contact[counter].zipcode = '';
			}	
			if (gJSONPayload.Contact[counter].country == undefined) {
				gJSONPayload.Contact[counter].country = '';
			}																						
			//Validate that we have certain fields, otherwise insert text to let the user know there was a problem
			if (gJSONPayload.Contact[counter].groupname == '') {
				gJSONPayload.Contact[counter].groupname = 'Not Defined';
			}	
			if (gJSONPayload.Contact[counter].firstname == '') {
				gJSONPayload.Contact[counter].firstname = 'MissingValue';
			}				
			if (gJSONPayload.Contact[counter].lastname == '') {
				gJSONPayload.Contact[counter].lastname = 'MissingValue';
			}	
			if (gJSONPayload.Contact[counter].email == '') {
				gJSONPayload.Contact[counter].email = 'MissingValue';
			}	
			//Look for groupname to see if we already have this	
			groupName = gJSONPayload.Contact[counter].groupname;
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
  		saveURL('', gContactPayloadURL);
  		updateGroups('', 'processContactsPayload');  	
  	}
  	gGroupPayloadCounter++;
  }
  else if (msg == 'UPDATEGROUPSSUCCESS') {
		writeLog('processContactPayload Finished');
  	resetListings('');
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
		writeLog('processContactPayload Finished - ERROR - ' + errMsg);
	}
}
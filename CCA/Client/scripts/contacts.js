//*************************************************************
//* This library contains all functions and global variables
//* that pertain to the listing screen.
//*************************************************************	

//Global Variables
var gContactCounter = 0;
var gContactRecords;
var gContactGroups;
var gGroupCounter = 0;
var gGroupNameToProcess = '';

function addContact(msg, email){
//function addContact(msg, email){

	alert("adding msg" + msg + "email: " + email);
	try {
		if (msg.length == 0){
			alert("msge set right");
			//Set up the FilterExpressions used to search the contact list 		
			var filter = new blackberry.find.FilterExpression("email1", "REGEX", email);	
		
			//Search contact based on filter expressions
			var contacts = blackberry.pim.Contact.find(filter);	
		
			//Check the length of the contact array. If we find a record, prompt user to manually add contact	
			if (contacts.length > 0) {
				alert ("A Contact already exist for " + email + ". Contact must be manually deleted prior to adding");
			}
			else {
				writeLog ("adding contact " + email);	
		
				var contactRecord; 
				writeLog('  Retrieving user record');
				sql = 'SELECT contactid, firstname, lastname, title, company, email, pin, workphone, mobilephone, homephone, address, address2, city, state, zipcode, country FROM ' + gTableNameContacts + ' WHERE email = \'' + email + '\'';;
		
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

function addMenu_Contacts() {
	try {
		blackberry.ui.menu.clearMenuItems();  //Clear the menu items
		
		var menuItem_topSeparator1 = new blackberry.ui.menu.MenuItem(true, 1);
		var menuItem_options = new blackberry.ui.menu.MenuItem(false, 2,"Options", buildOptions);
		blackberry.ui.menu.addMenuItem(menuItem_topSeparator1);
		blackberry.ui.menu.addMenuItem(menuItem_options);
		if (gDebugMode == true) {
		  var menuItem_topSeparator2 = new blackberry.ui.menu.MenuItem(true, 3);
			//var menuItem_testdata = new blackberry.ui.menu.MenuItem(false, 4,"Add Test Data", requestTestData);			
			blackberry.ui.menu.addMenuItem(menuItem_topSeparator2);
			//blackberry.ui.menu.addMenuItem(menuItem_testdata);
		}
	} 
	catch (e) {
		alert('Error building listing menu: ' + e.name + '; ' + e.message);
	}
}

function applyAccordion(){
//*************************************************************
//* This function will apply a JQuery method to allow the contact
//* entry in the listing to expand and contract within the listing.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************

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
}

function buildContactsListing(msg, functionToCall){
//*************************************************************
//* This function will retrieve records from the database and
//* build the listing screen as appropriate for display
//* Parms:
//*		Success/Failure message from called functions (from callbacks)
//*		Function name to call when we are done (success or failure)
//* Value Returned: 
//*		Nothing
//*************************************************************
	
	var errMsg = '';
	var sql = '';
	alert ('buildContactsListing: ' + msg);
	if (msg == '') {		
		gParentFunctionToCall = functionToCall;  //Save off function since recursive calls back here won't preserve it
		writeLog('buildContactsListing Starting');	
		writeLog('  Retrieving contact entries for selected name');
		sql = 'SELECT contactid, firstname, lastname, title, company, email, pin, workphone, mobilephone, homephone, address, address2, city, state, zipcode, country FROM ' + gTableNameContacts;
		sql += ' WHERE group = \'' + gContactGroupName + '\'';
		if (gUserListingOrder == 'FirstName') {
		  sql += ' ORDER BY firstname, lastname';
		}	
		else {
		  sql += ' ORDER BY lastname, firstname';
		}
		fn_DBGetRecords(sql, 'buildContactsListing');
	}	
	else if (msg.substring(0,18) == 'DBGETRECORDSERROR:') {
		errMsg = msg.substring(18);
	}
	else if (msg == 'DBGETRECORDSSUCCESS') {	
		if (gDBRecordsRetrieved.length == 0) {
			writeLog('    no records');	
			//This is an error situation since we have a group listing, but no contacts
			var html = '<div class="panelTitle ui-header ui-bar-a collIco" data-role="header" data-position="inline">';
			html += '<div id="recordTitle"><h3>' + 'No contact records' + '</h3></div>';	
			html += '</div>';		
			$('#listprofiles').append(html);
		}	
		else {
			writeLog('    ' + gDBRecordsRetrieved.length + ' records');	
			var panel = '';
			var array;
			var counter;
			for (counter = 0; counter < gDBRecordsRetrieved.length; ++counter) {
				//Our main listitem that display's the user's name
				array = gDBRecordsRetrieved[counter].split(gDelim);	
	
				panel = buildContactsPanels_div(array[1], array[2], array[3], array[4], array[5], array[6], array[7], array[8], array[9], array[10],array[11],array[12],array[13],array[14],array[15]);
				$('#listprofiles').append(panel);
			}
		}	
		//Here we replace the list with our new data and call a JQuery Mobile refresh.
		//$('#listprofiles').html(html).listview("refresh");
		$('#listprofiles').listview("refresh");
		applyAccordion();
		
		writeLog('buildContactsListing Finished');
		window[gParentFunctionToCall]('BUILDCONTACTSLISTINGSUCCESS');
	}	
	else {
		errMsg = 'Invalid parm for buildContactsListing: ' + msg; 	
	} 
	if (errMsg != '') {
		writeLog('buildContactsListing Finished - ERROR');
		window[gParentFunctionToCall]('BUILDCONTACTSLISTINGERROR:' + errMsg);
	}
}

function buildContactsPanels_div(firstname, lastname, title, company, email, pin, workphone, mobilephone, homephone, address, address2, city, state, zipcode, country) {	
	
	var commaCheck = '';
	
	try {	
		var html = '';
		html += '<div class="panelTitle ui-header ui-bar-a collIco" data-role="header" data-position="inline">';
		if (gUserListingOrder == 'FirstName') {
			html += '<div id="recordTitle"><h3>' + firstname + ' ' + lastname + '</h3></div>';
		}
		else {
			html += '<div id="recordTitle"><h3>' + lastname + ', ' + firstname + '</h3></div>';
		}
		//Check to make sure we clean up errant commas
		commaCheck = ((title != '' && company != '')? (title + ', ' + company) : (title + company));
		
		html += '<div id="recordSubTitle">' + commaCheck + '</div>';
		html += '</div>';
		html += '<div class="panel">';
		html +=	'<div class="ui-body ui-body-a">';
		html +=	'<div id="emailAddress"><img src="images/email.png"/>';
		html +=	'<a href="mailto:' + email + '?subject=Emergency_Contact&body=Please contact me at">  ' + email + '</a></div>';
		
		if (workphone != '') {
			html += '<div id="workPhone"><img src="images/phone.png"/><label for name="workTel"> (w):</label>';
			html += '<a name="workTel" href="tel:' + workphone + '">' + workphone +'</a></div>';
		}
		if (mobilephone != '') {
			html += '<div id="mobilePhone"><img src="images/phone.png"/><label for name="mobileTel"> (m):</label>';
			html += '<a name="mobileTel" href="tel:'+ mobilephone + '">' + mobilephone + '</a></div>';
		}
		if (homephone != '') {
			html += '<div id="homePhone"><img src="images/phone.png"/><label for name=\"homeTel\">  (h):</label>';
			html += '<a name="homeTel" href="tel:'+ homephone +'">' + homephone + '</a></div>';
		}
		if(pin != '') {
			html += '<div id="pinNumber"><img src="images/pin.png"/><label for name="pinNum"> pin:</label>';
			html += '<a name="pinNum" href="pin:' + pin+ '">' + pin + '</a></div><br/>';
		}
		if (address != '' || address2 != '') {			
			html += '<div id="addressAddress2"  data-theme="a">' + address + ' ' + address2 + '</div>';
		}
		if (city != '' || state != '' || country != '') {			
			commaCheck = ((city != '' && state != '') ? (city + ', ' + state) : (city + state));
			html += '<div id="cityStateZip" >' + commaCheck + '   ' + zipcode + '  ' + country + '</div></div>';
		}
		if (email != '') {
			var escapedE = email.replace(".", "");
			html +=	'<div class="ui-bar ui-bar-a"><a href="javascript:addContact(\'\'\,\'' + email + '\')"><img src="images/plus.gif"/>  Add to Contacts</a></div></div>';
		} 
		else {
			html +=	'<div class="ui-bar ui-bar-a"></div></div>';
		}
	}
	catch (e) {
		alert('exception (): ' + e.name + '; ' + e.message);
	}	
	return html;	
}

function displayContactGroups(msg) {
	
	var errMsg = '';
	var sql = '';
	//alert ('displayContactGroups: ' + msg);
	if (msg == '') {		
		writeLog('displayContactGroups Starting');	
		writeLog('  Retrieving list of groups');			
		sql = 'SELECT groupname, recordsreceived FROM ' + gTableNameContactGroups;
		fn_DBGetRecords(sql, 'displayContactGroups');
	}
	else if (msg.substring(0,18) == 'DBGETRECORDSERROR:') {
		errMsg = msg.substring(18);
	}
	else if (msg == 'DBGETRECORDSSUCCESS') {
		gContactRecords = gDBRecordsRetrieved;
		if (gContactRecords.length == 0) {
			displayScreen(gScreenNameNoContacts);
		}
		else {
		}		
	}
	else {
		errMsg = 'Invalid parm for getContactGroups: ' + msg; 	
	} 
	if (errMsg != '') {
		writeLog('getContactGroups Finished - ERROR');
	}
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
		sql = 'DELETE FROM ' + gTableNameContacts + ' WHERE groupname = \'' + gGroupNameToProcess + '\'';
		fn_DBDeleteRecord(sql, 'insertContactRecords');		
	}
	else if (msg.substring(0,20) == 'DBDELETERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else if (msg.substring(0,17) == 'DBADDRECORDERROR:') {
		errMsg = msg.substring(17);
	}
	else if (msg == 'DBDELETERECORDSUCCESS' || msg == 'DBADDRECORDSUCCESS') {
		if (gContactCounter < gJSONPayload.Contact.length) { 
			if (gJSONPayload.Contact[gContactCounter].groupname.toLowerCase == gGroupNameToProcess.toLowerCase) {
				//Ensure the values added are in the order of which they were defined for the database
				sql = 'INSERT INTO ' + gTableNameContacts;
				//sql += '(contactid,firstname,lastname,title,company,email,pin,workphone,mobilephone,homephone,address,address2,city,state,zipcode,country)';
				sql += '(contactid,groupname,firstname,lastname,title,company,email,pin,workphone,mobilephone,homephone,address,address2,city,state,zipcode,country)';		
				sql += ' VALUES(null';
				sql += ', \'' + gJSONPayload.Contact[gContactCounter].groupname + '\'';
				sql += ', \'' + gJSONPayload.Contact[gContactCounter].firstname + '\'';
				sql += ', \'' + gJSONPayload.Contact[gContactCounter].lastname + '\'';
				sql += ', \'' + gJSONPayload.Contact[gContactCounter].title + '\'';
				sql += ', \'' + gJSONPayload.Contact[gContactCounter].company + '\'';
				sql += ', \'' + gJSONPayload.Contact[gContactCounter].email + '\'';
				sql += ', \'' + gJSONPayload.Contact[gContactCounter].pin + '\'';
				sql += ', \'' + gJSONPayload.Contact[gContactCounter].workphone + '\'';
				sql += ', \'' + gJSONPayload.Contact[gContactCounter].mobilephone + '\'';
				sql += ', \'' + gJSONPayload.Contact[gContactCounter].homephone + '\'';
				sql += ', \'' + gJSONPayload.Contact[gContactCounter].address + '\'';
				sql += ', \'' + gJSONPayload.Contact[gContactCounter].address2 + '\'';
				sql += ', \'' + gJSONPayload.Contact[gContactCounter].city + '\'';
				sql += ', \'' + gJSONPayload.Contact[gContactCounter].state + '\'';
				sql += ', \'' + gJSONPayload.Contact[gContactCounter].zipcode + '\'';
				sql += ', \'' + gJSONPayload.Contact[gContactCounter].country + '\'';																																							
				sql += ')';
				fn_DBAddRecord(sql, 'insertContactRecords');
			}
		}
		else {
			writeLog('insertContactRecords Finished - ERROR');
			window[gParentFunctionToCall]('INSERTCONTACTSSUCCESS');			
		}
		gContactCounter ++;
	}
	else if (msg.substring(0,20) == 'DBUPDATERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else {
		errMsg = 'insertContactRecords invalid msg: ' + msg;
	}
	if (errMsg != '') {
		writeLog('insertContactRecords Finished - ERROR');
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
	alert ('processContactRecords: ' + msg);
	if (msg == '') {
  	writeLog('processContactRecords Starting');
  	var groupsFound = '';
  	var groupName;
  	writeLog('  Analyzing JSON payload');
  	var counter;	
		for (counter = 0; counter < gJSONPayload.Contact.length; ++counter) {
			//Validate that all required properties exist in the object and if not, make them blank.
			if (gJSONPayload.Contact[counter].groupname == undefined) {
				gjJSONPayload.Contact[counter].groupname = '';
			}		
			if (gJSONPayload.Contact[counter].firstname == undefined) {
				gjJSONPayload.Contact[counter].firstname = '';
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
			if (groupsFound.indexOf(groupName.toLowerCase()+ ',') == -1) {
				groupsFound += groupName.toLowerCase() + ','
			}
  	}
	}
  if (msg == '' || msg == 'INSERTCONTACTSSUCCESS') {
  	if (msg == '') {
  		groupsFound = groupsFound.substr(0,groupsFound.length - 1);
			gContactGroups = groupsFound.split(',')
			writeLog('  Processing ' + gContactGroups.length + ' groups');
  	}
  	if (gGroupCounter < gContactGroups.length) { 
  		gGroupNameToProcess = gContactGroups[gGroupCounter];
  		insertContactRecords('','processContactsPayload');
  	}
  	else {
  		updateGroups('');  		
  	}
  	gGroupCounter++;
  }
	else if (msg.substring(0,20) == 'INSERTCONTACTSERROR:') {
		errMsg = msg.substring(20);
	}
	//else {
		//notifyUser();  //Now that we have received and stored all requested records, we can notify the user
		//var ourDate = getDate(gUserDateDisplay);
		//var ourTime = getTime();
		//sql = 'UPDATE ' + gTableNameUser + ' SET recordsreceived = \'' + ourDate + ' @ ' + ourTime + '\' WHERE recordid = \'' + gUserRecordID + '\'';
		//fn_DBUpdateRecord(sql, 'insertContactRecords'); 
	//}	
	else {
		errMsg = 'processContactRecords invalid msg: ' + msg;
	}
	if (errMsg != '') {
		writeLog('processContactRecords Finished - ERROR - ' + errMsg);
		alert('Error processing contact records:\n' + errMsg);
	}
}

function updateGroups(msg) {
  var errMsg = '';
  if (msg == '') {
  	writeLog('upateGroups Starting');	
  	gGroupCounter++;  	
	}
	
		gInsertCounter = 0;
		sql = 'DELETE FROM ' + gTableNameContacts + ' WHERE groupname = \'' + gGroupNameToProcess + '\'';
		fn_DBDeleteRecord(sql, 'insertContactRecords');		

	else if (msg.substring(0,20) == 'DBDELETERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else if (msg == 'DBDELETERECORDSUCCESS'
	}
	else {
  	errMsg = 'updateGroups invalid msg: ' + msg;
	}
	
	if (errMsg != '') {
		writeLog('updateGroups Finished - ERROR - '+ errMsg);
		alert('Error processing contact records:\n' + errMsg);
	}
}
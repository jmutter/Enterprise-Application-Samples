//*************************************************************
//* This part of the library contains all functions and global variables
//* that pertain to the listing screen.
//*************************************************************	

//Global Variables

function buildListing(msg, functionToCall){
//*************************************************************
//* This function will retrieve records from the database and
//* build the listing screen as appropriate for display
//* Parms:
//*		Success/Failure message from called functions (from callbacks)
//*		Function name to call when we are done (success or failure)
//* Value Returned: 
//*		Nothing
//*************************************************************/
	
	var errMsg = '';
	var sql = '';
	if (msg == '') {		
		gParentFunctionToCall = functionToCall;  //Save off function since recursive calls back here won't preserve it
		writeLog('buildListing Starting');	
		writeLog('  Retrieving user record');			
		sql = 'SELECT recordsreceived FROM ' + gTableNameUser + ' WHERE recordid = \'' + gUserRecordID + '\'';
		fn_DBGetRecord(sql, 'buildListing');
	}
	else if (msg.substring(0,17) == 'DBGETRECORDERROR:') {
		errMsg = msg.substring(17);
	}
	else if (msg == 'DBGETRECORDSUCCESS') {
		var recordsReceived = gDBRecordRetrieved;  //Only one field retrieved so use whole string
		writeLog('  Retrieving user record');
		sql = 'SELECT contactid, firstname, lastname, title, company, email, pin, workphone, mobilephone, homephone, address, address2, city, state, zipcode, country FROM ' + gTableNameContacts;
		if (gUserListingOrder == 'FirstName') {
		  sql += ' ORDER BY firstname, lastname';
		}	
		else {
		  sql += ' ORDER BY lastname, firstname';
		}
		fn_DBGetRecords(sql, 'buildListing');
	}	
	else if (msg.substring(0,18) == 'DBGETRECORDSERROR:') {
		errMsg = msg.substring(18);
	}
	else if (msg == 'DBGETRECORDSSUCCESS') {	
		if (gDBRecordsRetrieved.length == 0) {
			writeLog('    no records');	
			gscreenToDisplay = gscreenNameEmpty;
		}	
		else {
			writeLog('    ' + gDBRecordsRetrieved.length + ' records');	
			var panel = '';
			var array;
			var counter;
			for (counter = 0; counter < gDBRecordsRetrieved.length; ++counter) {
				//Our main listitem that display's the user's name
				array = gDBRecordsRetrieved[counter].split(gDelim);	
	
				panel = buildPanels_div(array[1], array[2], array[3], array[4], array[5], array[6], array[7], array[8], array[9], array[10],array[11],array[12],array[13],array[14],array[15]);
				$('#listprofiles').append(panel);
			}
			
			//Here we replace the list with our new data and call a JQuery Mobile refresh.
			gScreenToDisplay = gScreenNameListing;
			//$('#listprofiles').html(html).listview("refresh");
			$('#listprofiles').listview("refresh");
			applyAccordion();
		}	
		writeLog('buildListing Finished');
		window[gParentFunctionToCall]('BUILDLISTINGSUCCESS');
	}	
	else {
		errMsg = 'Invalid parm for buildListing: ' + msg; 	
	} 
	if (errMsg != '') {
		writeLog('buildListing Finished - ERROR');
		window[gParentFunctionToCall]('BUILDLISTINGERROR:' + errMsg);
	}
}

function buildPanels_div(firstname, lastname, title, company, email, pin, workphone, mobilephone, homephone, address, address2, city, state, zipcode, country)
{	
	var commaCheck='';
	
	try{
	
		var html = '';
		html += '<div class="panelTitle ui-header ui-bar-a collIco" data-role="header" data-position="inline">';
		html += '<div id="recordTitle"><h3>' + firstname + ' ' + lastname + '</h3></div>';
		
		//check to make sure we clean up errant commas
		commaCheck = ((title.length > 0 && company.length > 0)? (title + ', ' + company) : (title + company));
		
		html += '<div id="recordSubTitle">' + commaCheck + '</div>';
		html += '</div>';
		html += '<div class="panel">';
		html +=	'<div class="ui-body ui-body-a">';
		html +=	'<div id="emailAddress"><img src="images/email.png"/>';
		html +=	'<a href="mailto:' + email + '?subject=Emergency_Contact&body=Please contact me at">  ' + email + '</a></div>';
		
		if (workphone.length > 0){
			html += '<div id="workPhone"><img src="images/phone.png"/><label for name="workTel"> (w):</label>';
			html += '<a name="workTel" href="tel:' + workphone + '">' + workphone +'</a></div>';
		}
		if (mobilephone.length > 0){
			html += '<div id="mobilePhone"><img src="images/phone.png"/><label for name="mobilTel"> (m):</label>';
			html += '<a name="mobilTel" href="tel:'+ mobilephone + '">' + mobilephone + '</a></div>';
		}
		if (homephone.length > 0 ){
			html += '<div id="homePhone"><img src="images/phone.png"/><label for name=\"homeTel\">  (h):</label>';
			html += '<a name="homeTel" href="tel:'+ homephone +'">' + homephone + '</a></div>';
		}
		if(pin.length  > 0 ){
			html += '<div id="pinNumber"><img src="images/pin.png"/><label for name="pinNum"> pin:</label>';
			html += '<a name="pinNum" href="pin:' + pin+ '">' + pin + '</a></div><br/>';
		}
		if (address.length > 0 || address2.length > 0){
			
			html += '<div id="addressAddress2"  data-theme="a">' + address + ' ' + address2 + '</div>';
		}
		if (city.length > 0 || state.length > 0 || country.length > 0){
			
			commaCheck = ((city.length > 0 && state.length > 0) ? (city + ', ' + state) : (city + state));
			html += '<div id="cityStateZip" >' + commaCheck + '   ' + zipcode + '  ' + country + '</div></div>';
		}
		if (email.length > 0){
			var escapedE = email.replace(".", "");
			html +=	'<div class="ui-bar ui-bar-a"><a href="javascript:addContact(\'\'\,\'' + email + '\')"><img src="images/plus.gif"/>  Add to Contacts</a></div></div>';
		} else {
			html +=	'<div class="ui-bar ui-bar-a"></div></div>';
		}
	} catch (e) {
		alert('exception (): ' + e.name + '; ' + e.message);
	}
	
	return html;
	
}

function applyAccordion(){
    $('.panel').hide();
                                                                    
    $('.panelTitle').collapser({
                    target: 'next',
                    effect: 'slide',
                    changeText: 0,
                    expandClass: 'expIco',
                    collapseClass: 'collIco'
    }, function(){
                    $('.panel').slideUp();
    });
}

//*************************************************************
//* This library contains all functions and global variables
//* that pertain to the detail screen
//*************************************************************	
//Global Variables
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
		
	} catch (e) {
		writeLog('exception (): ' + e.name + '; ' + e.message);
	}

} 
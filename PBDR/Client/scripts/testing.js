//*************************************************************
//* This library contains all functions and global variables
//* that pertain to adding testing options
//*************************************************************	

//Global Variables
var gTestingClearMethod = '';
var gTestingDocuments2PrimaryURL = 'http://www.dagobahserver.com/pbdr/Documents2.ashx';
var gTestingDocuments2SecondaryURL = 'http://www.dagobahserver.com/pbdr/Documents.ashx';
var gTestingSmallDocumentCollection = false;
var gTestingMode = false;

function testingClearTables(msg) {
	
	var errMsg = '';
	var sql = '';
	if (msg == '') {
		gTestingClearMethod = 'Groups';
		sql = 'DELETE FROM ' + gTableNameGroups;
		dbDeleteRecord(sql, 'testingClearTables');
	}
	else if (msg == 'DBDELETERECORDSUCCESS') {
		if (gTestingClearMethod == 'Groups') {
			gTestingClearMethod = 'Contacts';
			sql = 'DELETE FROM ' + gTableNameContacts;
			dbDeleteRecord(sql, 'testingClearTables');
		}
		else if (gTestingClearMethod == 'Contacts') {
			gTestingClearMethod = 'RSS';
			sql = 'DELETE FROM ' + gTableNameRSS;
			dbDeleteRecord(sql, 'testingClearTables');
		}
		else {
			alert ('Tables cleared');
		}
	}	
	else if (msg.substring(0,20) == 'DBDELETERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else {
  	errMsg = 'Invalid msg: ' + msg;
	}	
	if (errMsg != '') {
		alert ('Error deleting ' + gTestingClearMethod + '\n' + errMsg);
	}		
}

function testingDownloadConfig() {
	
	gJSONPayload = {"Updates" : [   
  {"contacts" : "20111208193900" ,
  "documents": "20111208193900",
	"rss": "20111208193900",
  "configuration": "20111208193900"}
	],"Config" : [   
  { "configprimaryurl" : "http://www.dagobahserver.com/pbdr/updatecheck.ashx" ,
  "configprimaryuserid": "",
  "configprimarypassword": "",
  "configsecondaryurl": "http://www.dagobahserver.com/pbdr/updatecheck.ashx",
  "configsecondaryuserid": "",
  "configsecondarypassword": "",
  "contactsprimaryurl" : "http://www.dagobahserver.com/pbdr/Contacts.ashx" ,
  "contactsprimaryuserid": "",
  "contactsprimarypassword": "",
  "contactssecondaryurl": "http://www.dagobahserver.com/pbdr/Contacts.ashx",
  "contactssecondaryuserid": "",
  "contactssecondarypassword": "",
  "documentsprimaryurl" : "http://www.dagobahserver.com/pbdr/Documents.ashx" ,
  "documentsprimaryuserid": "",
  "documentsprimarypassword": "",  
  "documentssecondaryurl": "http://www.dagobahserver.com/pbdr/Documents.ashx",
  "documentssecondaryuserid": "",
  "documentssecondarypassword": "",
  "rssprimaryurl" : "http://www.dagobahserver.com/pbdr/Rss.ashx" ,
  "rssprimaryuserid": "",
  "rssprimarypassword": "",  
  "rsssecondaryurl": "http://www.dagobahserver.com/pbdr/Rss.ashx",
  "rsssecondaryuserid": "",
  "rsssecondarypassword": "",}
	]};	
	processJSONPayload();
}

function testingDownloadContacts() {
	//Build payload from text and call processPayload
	gJSONPayload = {"Contacts":[
{"groupname":"Directs"
,"firstname":"Alex"
,"lastname":"Ovechkin"
,"title":"Director, Caps Hockey"
,"email":"aovi@test.com"
,"address":"1234 test Rd"
,"state":"MA"
,"zipcode":"12345"
,"workphone":"123-53434"}
,{"groupname":"Directs"
,"firstname":"John"
,"lastname":"Doe"
,"title":"TV Repair man"
,"email":"jdoe@test.com"
,"address":"23313 Test Parkway"
,"state":"CA"
,"zipcode":"12345"
,"workphone":"(321) 123123"}
,{"groupname":"Directs"
,"firstname":"John"
,"lastname":"Mugger"
,"title":"Test Pioneer"
,"email":"jmugger@test.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":"(123) 2321232"}
,{"groupname":"Directs"
,"firstname":"Marky"
,"lastname":"Mark"
,"title":"Manager, Highspeed internet"
,"email":"MMark@test.com"
,"address":"34334 Street Ave"
,"state":"NJ"
,"zipcode":"01234"
,"workphone":"(343) 343423"}
,{"groupname":"Directs"
,"firstname":"Paul"
,"lastname":"Cornishhen"
,"title":"Manager, Work Parties"
,"email":"pcornishen@test.com"
,"address":"12354 Lane Lane"
,"state":"TX"
,"zipcode":"12323"
,"workphone":""}
,{"groupname":"Directs"
,"firstname":"Richie"
,"lastname":"Ticker"
,"title":"Manager"
,"email":"rticker@test.com"
,"address":"12311231 Blvd Blvd Suite AW"
,"state":"CA"
,"zipcode":"12343"
,"workphone":"(343) 34242"}
,{"groupname":"Directs"
,"firstname":"Ray"
,"lastname":"Bands"
,"title":"Test Engineer"
,"email":"rbands@test.com"
,"address":"123123 Park Pl"
,"state":"CA"
,"zipcode":"12312"
,"workphone":"(123) 1231231"}
,{"groupname":"Directs"
,"firstname":"Rob"
,"lastname":"Roy"
,"title":"Toy Manager"
,"email":"rroy@test.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":"(123) 1231231"}
,{"groupname":"Directs"
,"firstname":"Ron"
,"lastname":"John"
,"title":"Sales"
,"email":"rjohn@test.com"
,"address":"1232 Park Parkway"
,"state":"CA"
,"zipcode":"343434"
,"workphone":"(123) 123123"}
,{"groupname":"Directs"
,"firstname":"Steve"
,"lastname":"Wonder"
,"title":"Piano Engineer"
,"email":"pwonder@test.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":"(234) 24323"}
,{"groupname":"Customer Services"
,"firstname":"Big T"
,"lastname":"Tacos"
,"title":"Tester"
,"email":"ttacos@test.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":"(234) 2343324"}
,{"groupname":"Prof Services"
,"firstname":"Berry"
,"lastname":"Black"
,"title":"Human computer"
,"email":"test@test.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":"(123) 123131"}
,{"groupname":"Prof Services"
,"firstname":"Will"
,"lastname":"Ferrell"
,"title":"Blackberry Guy"
,"email":"wferrell@test.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":"(123) 1312311"}
,{"groupname":"Prof Services"
,"firstname":"Mike"
,"lastname":"Tyson"
,"title":"Boxer"
,"email":"mtyson@test.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":"(132) 123123"}
,{"groupname":"WAAs"
,"firstname":"Brent"
,"lastname":"Thornton"
,"title":"Wireless Application Architect"
,"email":"bthornton@test.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":"(123) 72095"}
,{"groupname":"WAAs"
,"firstname":"Jeff"
,"lastname":"Bizzle"
,"title":"Waa"
,"email":"jbizzle@test.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":"123-123-1232"}
,{"groupname":"WAAs"
,"firstname":"Mo"
,"lastname":"Town"
,"title":"Waa"
,"email":"motown@test.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":""}
,{"groupname":"WAAs"
,"firstname":"OD"
,"lastname":"Bizzle"
,"title":"WAA"
,"email":"odb@test.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":""}
]};	
	processJSONPayload();	
}

function testingDownloadDocuments() {
	gJSONPayload =[
  {"filename":"test.pdf"
  	,"url":"http://www.dagobahserver.com/pbdr/docs/test.pdf"} 	
 ,{"filename":"testdoc.doc"
  	,"url":"http://www.dagobahserver.com/pbdr/docs/testdoc.doc"} 
 ,{"filename":"testexcel.xls"
  	,"url":"http://www.dagobahserver.com/pbdr/docs/testexcel.xls"} 
 ,{"filename":"testgif.gif"
  	,"url":"http://www.dagobahserver.com/pbdr/docs/testgif.gif"}		
 ,{"filename":"testjpg.jpg"
  	,"url":"http://www.dagobahserver.com/pbdr/docs/testjpg.jpg"}
 ,{"filename":"testpng.png"
  	,"url":"http://www.dagobahserver.com/pbdr/docs/testpng.png"}
 ,{"filename":"testppt.ppt"
  	,"url":"http://www.dagobahserver.com/pbdr/docs/testppt.ppt"}
 ,{"filename":"testxlsx.xlsx"
  	,"url":"http://www.dagobahserver.com/pbdr/docs/testxlsx.xlsx"}
 ,{"filename":"testzip.zip"
  	,"url":"http://www.dagobahserver.com/pbdr/docs/testzip.zip"} 
];
	processJSONPayload();
}

function testingDownloadRSS() {
	
	gJSONPayload = {"RSS":[   
  	{"id" : 1 ,
  	"title" : "The System is down!",
    "detail" : "We are in a disaster recovery cycle" },
    {"id" : 2 , 
    "title" : "The System is rebooting!",
    "detail" : "We are still in a disaster recovery cycle" },
	  {"id" : 3 ,
    "title": "System still rebooting",
    "detail": "We are getting closer to recovery" },
	  {"id" : 4 ,
    "title": "Systems online, applications starting",
    "detail": "ETA 20 Minutes to back in operation" },
	  {"id" : 5 ,
    "title": "DR scenario completed",
    "detail": "All systems back online. report all discrepanices to anyone." }	
	]};
	processJSONPayload();
}

function testingDownloads(msg) {

	var errMsg = '';
	var sql = '';
	if (msg == '') {	
		gTestingMode = true;
		downloadConfig('','getStarted');				
	}
	else if (msg == 'DOWNLOADCONFIGSUCCESS') {
		downloadContent('');
		gTestingMode = false;
	}
	else if (msg.substring(0,20) == 'DOWNLOADCONFIGERROR:') {
		errMsg = msg.substring(20);
	}	
	else {
		errMsg = ('Invalid msg: ' + msg); 	
	} 
	if (errMsg != '') {
		gTestingMode = false;
		displayMessage('<p>Error loading test data:<\p>' + errMsg, 'OkOnly');
	}
} 

function testingSendPrimaryHTTPRequest(primaryURL, secondaryURL) {

	switch (gDownloadRequest) {
		case 'Config':
			testingDownloadConfig();					  	
		  break;
		case 'Contacts':
			testingDownloadContacts();				
		  break;
		case 'RSS':
			testingDownloadRSS();				
		  break;
		case 'Documents':
			testingDownloadDocuments();	
		  break;
	}	
}

function testingUpdateNow(msg) {
	
	if (msg == undefined || msg == '' ) {
		if (gDownloadInProgress == false) {
			manageMusic('Stop');
			menuBar('Hide');
			displayScreen(gScreenNameHome);
			gTestingSmallDocumentCollection = false;
 			downloadContent('USERCLICKEDYES');			
			//setTimeout(function() {
			//	displayMessage('Do you want to download the large document collection?','YesNo', testingUpdateNow);
			//}, 500); 	
		}
		else {
			displayMessage('Cannot process request as a previous download is already in progress.','OkOnly');
		}
	}
 	else if (msg == 'USERCLICKEDYES') {
 		gTestingSmallDocumentCollection = true;
 		downloadContent('USERCLICKEDYES');
	}
 	else if (msg == 'USERCLICKEDNO') {
		gTestingSmallDocumentCollection = false;
 		downloadContent('USERCLICKEDYES');
	}
}
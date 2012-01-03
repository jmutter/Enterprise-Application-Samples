//*************************************************************
//* This library contains all functions and global variables
//* that pertain to adding testing options
//*************************************************************	

//Global Variables
var gTestingClearMethod = '';
var gTestingWaitMethod = '';

function testingClearContacts(msg) {
	
	var errMsg = '';
	var sql = '';
	if (msg == '') {
		gTestingClearMethod = 'Groups';
		sql = 'DELETE FROM ' + gTableNameGroups;
		dbDeleteRecord(sql, 'testingClearContacts');
	}
	else if (msg == 'DBDELETERECORDSUCCESS') {
		if (gTestingClearMethod == 'Groups') {
			gTestingClearMethod = 'Contacts';
			sql = 'DELETE FROM ' + gTableNameContacts;
			dbDeleteRecord(sql, 'testingClearContacts');
		}
		else {
			buildGroupsScreen('');
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

function testingClearRSS(msg) {
	
	var errMsg = '';
	if (msg == '') {
		var sql = 'DELETE FROM ' + gTableNameRSS;
		dbDeleteRecord(sql, 'testingClearRSS');
	}
	else if (msg == 'DBDELETERECORDSUCCESS') {
		buildRSSScreen('');
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


function testingLoadContacts() {
	//Build payload from text and call processPayload
	gJSONPayload = {"Contacts":[
		{"groupname":"Directs"
		,"firstname":"Alex"
		,"lastname":"Willis"
		,"title":"Director, Technical Services"
		,"email":"awillis@rim.com"
		,"address":"377 County Rd"
		,"state":"MA"
		,"zipcode":"02341"
		,"workphone":"824-67166"}
		,{"groupname":"Directs"
		,"firstname":"John"
		,"lastname":"Kobularik"
		,"title":"Technical Channel Enablement Manager"
	,"email":"jkobe@rim.com"
	,"address":"2000 Bridge Parkway"
	,"state":"CA"
	,"zipcode":"94065"
	,"workphone":"(821) 62515"}
	,{"groupname":"Directs"
	,"firstname":"John"
	,"lastname":"Mutter"
	,"title":"Wireless Application Architect"
	,"email":"jmutter@rim.com"
	,"address":""
	,"state":""
	,"zipcode":""
	,"workphone":"(820) 63697"}
	,{"groupname":"Directs"
	,"firstname":"Mark"
	,"lastname":"Howden"
	,"title":"Manager, Technical Services"
	,"email":"MHowden@rim.com"
	,"address":"120 Center Ave"
	,"state":"New Jersey"
	,"zipcode":"07928"
	,"workphone":"(801) 75793"}
	,{"groupname":"Directs"
	,"firstname":"Paul"
	,"lastname":"Steel"
	,"title":"Manager, Technical Services"
	,"email":"psteel@rim.com"
	,"address":"1623 Durfey Lane"
	,"state":"TX"
	,"zipcode":"77449"
	,"workphone":""}
	,{"groupname":"Directs"
	,"firstname":"Raymond"
	,"lastname":"Chronister"
	,"title":"Manager, Sales Engineers"
	,"email":"rchronister@rim.com"
	,"address":"15260 Ventura Blvd Suite 1410"
	,"state":"CA"
	,"zipcode":"91403"
	,"workphone":"(821) 66129"}
	,{"groupname":"Directs"
	,"firstname":"Raymond"
	,"lastname":"Newman"
	,"title":"Field Engineer"
	,"email":"rnewman@rim.com"
	,"address":"1933 Meyer Pl"
	,"state":"CA"
	,"zipcode":"92627"
	,"workphone":"(821) 62056"}
	,{"groupname":"Directs"
	,"firstname":"Rob"
	,"lastname":"Iannacone Jr"
	,"title":"Technical Project Manager"
	,"email":"riannacone@rim.com"
	,"address":""
	,"state":""
	,"zipcode":""
	,"workphone":"(821) 66195"}
	,{"groupname":"Directs"
	,"firstname":"Ron"
	,"lastname":"Moses"
	,"title":"Sales Support Manager EMEA"
	,"email":"ramoses@rim.com"
	,"address":"2000 Bridge Parkway"
	,"state":"CA"
	,"zipcode":"94065"
	,"workphone":"(818) 29683"}
	,{"groupname":"Directs"
	,"firstname":"Steve"
	,"lastname":"Hu"
	,"title":"Converged Network Engineer"
	,"email":"shu@rim.com"
	,"address":""
	,"state":""
	,"zipcode":""
	,"workphone":"(821) 62509"}
	,{"groupname":"Prof Services"
	,"firstname":"Ajay"
	,"lastname":"Malhan"
	,"title":"Technical Account Manager"
	,"email":"amalhan@rim.com"
	,"address":""
	,"state":""
	,"zipcode":""
	,"workphone":"(801) 72131"}
	,{"groupname":"Prof Services"
	,"firstname":"Darlton"
	,"lastname":"Myers"
	,"title":"Technical Account Manager"
	,"email":"dmyers@rim.com"
	,"address":""
	,"state":""
	,"zipcode":""
	,"workphone":"(801) 72409"}
	,{"groupname":"Prof Services"
	,"firstname":"Kevin"
	,"lastname":"Davis"
	,"title":"Blackberry Enterprise Architect"
	,"email":"kdavis@rim.com"
	,"address":""
	,"state":""
	,"zipcode":""
	,"workphone":"(801) 71120"}
	,{"groupname":"Prof Services"
	,"firstname":"Tyson"
	,"lastname":"Wheeler"
	,"title":"Blackberry Enterprise Architect"
	,"email":"twheeler@rim.com"
	,"address":""
	,"state":""
	,"zipcode":""
	,"workphone":"(824) 67103"}
	,{"groupname":"WAAs"
	,"firstname":"Brent"
	,"lastname":"Thornton"
	,"title":"Wireless Application Architect"
	,"email":"bthornton@rim.com"
	,"address":""
	,"state":""
	,"zipcode":""
	,"workphone":"(801) 72095"}
	,{"groupname":"WAAs"
	,"firstname":"Jeff"
	,"lastname":"Bentley"
	,"title":"Wireless Application Architect"
	,"email":"jbentley@rim.com"
	,"address":""
	,"state":""
	,"zipcode":""
	,"workphone":"704-508-1600"}
	,{"groupname":"WAAs"
	,"firstname":"Maurice"
	,"lastname":"White"
	,"title":"Wireless Application Architect"
	,"email":"mauwhite@rim.com"
	,"address":""
	,"state":""
	,"zipcode":""
	,"workphone":""}
	,{"groupname":"WAAs"
	,"firstname":"Richard"
	,"lastname":"Balsewich"
	,"title":"Wireless Application Architect"
	,"email":"rbalsewich@rim.com"
	,"address":""
	,"state":""
	,"zipcode":""
	,"workphone":""}
	,{"groupname":"MVS TAMs"
	,"firstname":"John"
	,"lastname":"McMorrow"
	,"title":"Sales Engineer"
	,"email":"jmcmorrow@rim.com"
	,"address":"4 Copley Place S-603"
	,"state":"MA"
	,"zipcode":"02116"
	,"workphone":"(824) 67050"}
	,{"groupname":"MVS TAMs"
	,"firstname":"Patrick"
	,"lastname":"Jones"
	,"title":"Technical Account Manager"
	,"email":"patjones@rim.com"
	,"address":"3259 Manor Rd."
	,"state":"VA"
	,"zipcode":"19006"
	,"workphone":"(821) 62530"}
	,{"groupname":"MVS TAMs"
	,"firstname":"Regina"
	,"lastname":"Pepper"
	,"title":"Sales Engineer"
	,"email":"rpepper@rim.com"
	,"address":""
,"state":""
,"zipcode":""
,"workphone":"(821) 66135"}
,{"groupname":"MVS TAMs"
,"firstname":"Russell"
,"lastname":"Mohr"
,"title":"Sales Engineer"
,"email":"rmohr@rim.com"
,"address":"54 East 1st Street Apt 1C"
,"state":"NY"
,"zipcode":"10003"
,"workphone":"(821) 62565"}
,{"groupname":"MVS TAMs"
,"firstname":"Stuart"
,"lastname":"Cordery"
,"title":"Converged Network Engineer"
,"email":"scordery@rim.com"
,"address":"6 Bramley Road Kinson, Bournemouth"
,"state":""
,"zipcode":"BH10 5LU"
,"workphone":"(818) 47724"}
,{"groupname":"MVS Design"
,"firstname":"Raymond"
,"lastname":"Newman"
,"title":"Field Engineer"
,"email":"rnewman@rim.com"
,"address":"1933 Meyer Pl"
,"state":"CA"
,"zipcode":"92627"
,"workphone":"(821) 62056"}
,{"groupname":"MVS Design"
,"firstname":"Rob"
,"lastname":"Iannacone Jr"
,"title":"Technical Project Manager"
,"email":"riannacone@rim.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":"(821) 66195"}
,{"groupname":"MVS Design"
,"firstname":"Steve"
,"lastname":"Hu"
,"title":"Converged Network Engineer"
,"email":"shu@rim.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":"(821) 62509"}
,{"groupname":"TAMs East"
,"firstname":"Alex"
,"lastname":"Rainero"
,"title":"Technical Account Manager"
,"email":"arainero@rim.com"
,"address":"1642 Frank Street"
,"state":"NJ"
,"zipcode":"07076"
,"workphone":""}
,{"groupname":"TAMs East"
,"firstname":"Anthony"
,"lastname":"Sietz"
,"title":"Technical Account Manager"
,"email":"asietz@rim.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":"(820) 63656"}
,{"groupname":"TAMs East"
,"firstname":"Bill"
,"lastname":"Tucker"
,"title":"Technical Account Manager"
,"email":"btucker@rim.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":"(820) 63438"}
,{"groupname":"TAMs East"
,"firstname":"Brian"
,"lastname":"Dingman"
,"title":"Technical Account Manager"
,"email":"bdingman@rim.com"
,"address":"728 Woodfield Road"
,"state":"PA"
,"zipcode":"19085"
,"workphone":"(820) 63602"}
,{"groupname":"TAMs East"
,"firstname":"Craig"
,"lastname":"Ano"
,"title":"Technical Services,Federal Government-US"
,"email":"cano@rim.com"
,"address":"8805 Mourning Dove Ct    Gaithersburg, MD    20879"
,"state":""
,"zipcode":""
,"workphone":"(820) 63639"}
,{"groupname":"TAMs East"
,"firstname":"Douglas"
,"lastname":"Hillgren"
,"title":"Technical Account Manager"
,"email":"dhillgren@rim.com"
,"address":"227 Maple Ridge Lane"
,"state":"WV"
,"zipcode":"25425"
,"workphone":"(820) 63046"}
,{"groupname":"TAMs East"
,"firstname":"Joseph"
,"lastname":"Petroski"
,"title":"Technical Account Manager, Public Sector"
,"email":"jpetroski@rim.com"
,"address":"1465 Woodfield Dr"
,"state":"TN"
,"zipcode":"37211"
,"workphone":""}
,{"groupname":"TAMs East"
,"firstname":"Duane"
,"lastname":"Petroro"
,"title":"Technical Account Manager"
,"email":"dpetroro@rim.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":"(824) 61439"}
,{"groupname":"TAMs East"
,"firstname":"Jim"
,"lastname":"Doherty"
,"title":"Technical Account Manager"
,"email":"jdoherty@rim.com"
,"address":"20 Townline Rd"
,"state":"MA"
,"zipcode":"02038"
,"workphone":"(824) 67169"}
,{"groupname":"TAMs East"
,"firstname":"Lisa"
,"lastname":"Ricco"
,"title":"Technical Account Manager"
,"email":"lricco@rim.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":"(824) 61440"}
,{"groupname":"TAMs West"
,"firstname":"Aisha"
,"lastname":"Visram"
,"title":"Technical Account Manager"
,"email":"AVisram@rim.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":"(801) 72909"}
,{"groupname":"TAMs West"
,"firstname":"Alain"
,"lastname":"Marcil"
,"title":"Technical Account Manager, Public Sector"
,"email":"amarcil@rim.com"
,"address":"1, St-Tropez"
,"state":"QC"
,"zipcode":"J8T 6C9"
,"workphone":"(819) 246-8093"}
,{"groupname":"TAMs West"
,"firstname":"Bill"
,"lastname":"Padilla"
,"title":"Technical Account Manager"
,"email":"bpadilla@rim.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":""}
,{"groupname":"TAMs West"
,"firstname":"Darren"
,"lastname":"Greenough"
,"title":"Technical Account Manager"
,"email":"dgreenough@rim.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":"(801) 75105"}
,{"groupname":"TAMs West"
,"firstname":"Jay"
,"lastname":"Klauser"
,"title":"Technical Account Manager"
,"email":"jklauser@rim.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":""}
,{"groupname":"TAMs West"
,"firstname":"Lynne"
,"lastname":"Cassaday"
,"title":"Technical Account Manager"
,"email":"lcassaday@rim.com"
,"address":"26806 Serrano Place"
,"state":"CA"
,"zipcode":"91351"
,"workphone":"661-252-2220"}
,{"groupname":"TAMs West"
,"firstname":"Michael"
,"lastname":"Mantho"
,"title":"Technical Account Manager"
,"email":"mmantho@rim.com"
,"address":"8875 Trailwood Court    Mentor, OH    44060"
,"state":""
,"zipcode":""
,"workphone":""}
,{"groupname":"TAMs West"
,"firstname":"Rodney"
,"lastname":"Stokes"
,"title":"Technical Account Manager"
,"email":"rstokes@rim.com"
,"address":"160 Muir Hill Drive Aledo, TX 76008"
,"state":""
,"zipcode":""
,"workphone":"(820) 63604"}
,{"groupname":"TAMs West"
,"firstname":"Troy"
,"lastname":"Stark"
,"title":"Technical Account Manager"
,"email":"tstark@rim.com"
,"address":"254 Wissler Rd.,"
,"state":"Ontario"
,"zipcode":"N2K 2X4"
,"workphone":"(801) 72151"}
,{"groupname":"Channel"
,"firstname":"Cerafin"
,"lastname":"Castillo"
,"title":""
,"email":"cecastillo@rim.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":""}
,{"groupname":"Admin"
,"firstname":"Glenna"
,"lastname":"Huth"
,"title":"Executive Assistant"
,"email":"ghuth@rim.com"
,"address":""
,"state":""
,"zipcode":""
,"workphone":"(801) 78828"}
]};		

	processJSONPayload();	
	setTimeout(function() {
		alert ('People content loaded');
	}, 2500); 
}

function testingLoadRSS() {
	
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
	setTimeout(function() {
		alert ('RSS content loaded');
	}, 1500); 
}

function testingPleaseWait() {
	if (gTestingWaitMethod == '' || gTestingWaitMethod == 'Hidden') {
		showOptions(false);	 
		manageMusic('Stop');
		setTimeout(function() {
			manageWait('Show');
		}, 500); 
		gTestingWaitMethod = 'Shown';		
	}
	else {	
		gTestingWaitMethod = 'Hidden';		
		manageWait('Hide');
		setTimeout(function() {
			showOptions(true);	 
		}, 500); 
	}
}

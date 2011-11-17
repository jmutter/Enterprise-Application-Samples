//*************************************************************
//* This library contains all functions and global variables
//* that pertain to the about screen.
//*************************************************************	

//Global Variables

function addAboutMenu() {
//*************************************************************
//* This function will add the appropriate menu items for the 
//* Options screen
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************		
	writeLog('addAboutMenu Starting');
	if (gBrowserType == gBrowserBlackBerry || gBrowserType == gBrowserRippleBlackBerry) {	
		blackberry.ui.menu.clearMenuItems();  //Clear the menu items		
		writeLog('  menu built');		
	}
	else {
		writeLog('  invalid environment for menu');
	}
	writeLog('addAboutMenu Finished');
}

function buildAboutScreen() {
//*************************************************************
//* This function will setup the about screen for appropriate
//* display based on orientation
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************		

  document.getElementById(gScreenNameAbout).style.backgroundImage = "url(images/background-about.jpg)";
	document.getElementById(gScreenNameAbout).style.width = screen.availWidth + "px";
	document.getElementById(gScreenNameAbout).style.height = screen.availHeight + "px";
	document.getElementById(gScreenNameAbout).style.backgroundRepeat = "repeat";
	var html = '';
	if (gGroupRecords.length == 0) {
		document.getElementById('aboutcontactsheader').style.visibility = "hidden";
	}
	else {
		html = '<table width="100%" class="abouttable" border="1">';
		html += '<tr>';
		html += '<th>Group</th>';
		html += '<th>Received</th>';
		html += '</tr>';
		var counter = 0;
		var array;
		for (counter = 0; counter < gGroupRecords.length; ++counter) {
			array = gGroupRecords[counter].split(gDelim);	
			html += '<tr>';
			html += '<td>' + array[0] + '</td>';
			html += '<td style="font-size:8pt">' + array[3] + '</td>';
			html += '</tr>';
		}
		html += '</table>';
		document.getElementById('aboutcontactsheader').style.visibility = "visible";
	}
	document.getElementById('aboutgroupinfo').innerHTML = html;	
}

function displayAbout(msg) {	
//*************************************************************
//* This function will display the about screen with the appropriate
//* information.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************
	
	var errMsg = '';	
 	writeLog('displayAbout Starting');
	toggleSection('aboutgeneralheader','aboutgeneralcontent', 'expand'); 
	toggleSection('aboutcontactsheader','aboutcontactscontent', 'expand'); 
	buildAboutScreen();
 	writeLog('displayAbout Finished');
	displayScreen (gScreenNameAbout);
 }
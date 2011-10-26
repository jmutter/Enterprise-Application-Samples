//*************************************************************
//* This library contains all functions and global variables
//* that pertain to the about screen.
//*************************************************************	

//Global Variables

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
	if (msg == undefined) {
		msg = '';
	}	
	
  if (msg == '') {
  	writeLog('displayAbout Starting');
  	document.getElementById(gScreenNameAbout).style.backgroundImage = "url(images/background-about.jpg)";
		document.getElementById(gScreenNameAbout).style.width = screen.availWidth + "px";
		document.getElementById(gScreenNameAbout).style.height = screen.availHeight + "px";
		document.getElementById(gScreenNameAbout).style.backgroundRepeat = "repeat";
		displayScreen (gScreenNameAbout);
  }
  else {
  	errMsg = 'Invalid msg: ' + msg;
  }
  if (errMsg != '') {
  	writeLog('displayAbout Finished - ERROR - ' + errMsg);
  }	
 }
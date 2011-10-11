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
	alert('displayAbout msg: ' + msg);
	
  if (msg = '') {
  	writeLog('displayAbout Starting');
  }
  else {
  	errMsg = 'Invalid msg: ' + msg;
  }
  if (errMsg != '') {
  	writeLog('displayAbout Finished - ERROR - ' + errMsg);
  }	
 }
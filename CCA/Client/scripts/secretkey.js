//*************************************************************
//* This library contains all functions and global variables
//* that pertain to trapping the key sequences to put the application
//* into debug mode.
//* Debug mode will cause actually write the log messages to the device log
//*************************************************************	

//Global Variables
var gCurrentKeySequence = '';
var gDebugMode = true;
var gSecretKeySequence = 'up,down,up,up,down,';

function initializeKeyEvents(){
	blackberry.system.event.onHardwareKey(blackberry.system.event.KEY_VOLUMEUP, handleVolumeUp);
	blackberry.system.event.onHardwareKey(blackberry.system.event.KEY_VOLUMEDOWN, handleVolumeDown);
}

function handleVolumeUp(){
	writeLog('VolumeUp key detected');
	gCurrentKeySequence += 'up,';
	checkClearSequence();
	checkKeySequence();
}

function handleVolumeDown(){
	writeLog('VolumeDown key detected');
	gCurrentKeySequence += 'down,';
	checkClearSequence();
	checkKeySequence();
}

function checkKeySequence(){
	if (gCurrentKeySequence == gSecretKeySequence){
		gCurrentKeySequence = '';
		gDebugMode = true;	
		writeLog('Secret code entered - DebugMode');
		alert('secret code entered');		
	}
}

function checkClearSequence(){
	//4 ups in a row clears current sequence
	if (gCurrentKeySequence.indexOf('up,up,up,up,')>-1){
		gCurrentKeySequence = "";
		writeLog('secret code cleared');		
	}
}
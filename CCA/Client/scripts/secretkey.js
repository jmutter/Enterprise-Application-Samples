var gDebugMode = true;
var secretKeySequence = 'up,down,up,up,down,';
var currentKeySequence = '';

function initializeKeyEvents(){
	blackberry.system.event.onHardwareKey(blackberry.system.event.KEY_VOLUMEUP, handleVolumeUp);
	blackberry.system.event.onHardwareKey(blackberry.system.event.KEY_VOLUMEDOWN, handleVolumeDown);
}

function handleVolumeUp(){
	writeLog('VolumeUp key detected');
	currentKeySequence += 'up,';
	checkClearSequence();
	checkKeySequence();
}

function handleVolumeDown(){
	writeLog('VolumeDown key detected');
	currentKeySequence += 'down,';
	checkClearSequence();
	checkKeySequence();
}

function checkKeySequence(){
	if (currentKeySequence == secretKeySequence){
		currentKeySequence = '';
		gDebugMode = true;	
		writeLog('Secret code entered - DebugMode');
		alert('secret code entered');		
	}
}

function checkClearSequence(){
	//4 ups in a row clears current sequence
	if (currentKeySequence.indexOf('up,up,up,up,')>-1){
		currentKeySequence = "";
		writeLog('secret code cleared');		
	}
}
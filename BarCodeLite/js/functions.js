//Window/Form events
window.onload=AppLoad;

//Global variables
var currentPage = "MainScreen";
var capturedCode = "";
var capturedType = "";

// setup system and application events	
blackberry.system.event.onHardwareKey(blackberry.system.event.KEY_BACK,	fn_HandleBackKey);


function AppLoad() {
	//This function is called when the form is loaded
	//It allows us to setup the UI
	
		document.body.style.height = screen.height + 'px';
	
	//display main screen
	displayMainScreen();
		
}


//Handle System Events
function fn_HandleBackKey() {

	if (currentPage == "MainScreen") {
		
		blackberry.app.exit();
		
	} else {
		
		displayMainScreen();
	}
}

function Analyze_BarCode(value) {
	//This function is called from the Java Extension when a barcode is scanned
	//There is 1 parameters required to be passed into this function.  
	//vale = string passed from scanned barcode
	
	capturedCode = value;
	
	barcode_Details();
		
}


function barcode_Details(){
	
	var div = document.getElementById('Main');
	var html = "";//div.innerHTML;
	
	var receivedDateTime = scanDate();	
	
		html = '<div class="icon">';
		html += '<div class="listing" x-blackberry-focusable="true" >';
		html += '<div class="typeName">' + 'Scanned Image' + '</div>';
		html += '<div class="dateTime">' + receivedDateTime + '</div>';
		html += '<br/><br/>';
		
		if(string_contains(capturedCode.toLowerCase(), 'http')){
			    //alert("Contains URL " + capturedCode);				
			    html += '<a href="javascript:invokeURL()"> <div class="barcodeString">Visit Us at:    ' + capturedCode + '</div></a>';
			    invokeURL();
		} else {
				html += '<div class="barcodeString">'+'Barcode:  ' + capturedCode + '</div>';	
		}
		
		html += '<br/></div>';
		
		 		
		div.innerHTML = html;

		document.getElementById('returnContainer').style.display = "block";

}


// Scans QR codes and Barcodes 5,6,7
function doScan(value) {
 // default format = all
 // cheater formats 1d + 2d = all
//	 var options = {'tryHarder' : true, 'formats' : ['2D'] };
//	alert("Selected " + value + " barcode scan");
	capturedType = value;
	if(string_contains(value, '2D')){
			
		var options = {'tryHarder' : true, 'formats' : ['2D']};
		
	} else {
		
		var options = {'tryHarder' : true, 'formats' : [value]};
		
	}
		
	try{
		webworks.media.barcode.scan(Analyze_BarCode, onError, options);

	 }catch(e){
	     alert("Error: " + e);
	 }

}


function onError(error) {
	alert('Exception: ' + error);
}
function onCaptured(value) {
	alert(value);
}

function Debug(messagetodisplay) {

	alert ('Return value from start: ' + messagetodisplay);
}


function scanDate(){

	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	if (month < 10) {
		month = '0' + month;
	}
	var day = currentTime.getDate();
	if (day < 10) {
		day = '0' + day;
	}
	var year = currentTime.getFullYear();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	if (minutes < 10) {
		minutes = '0' + minutes;
	}
	var indicator = 'AM';
	if(hours > 11) {
		indicator = 'PM';
	} 	
	var receivedDateTime = month + '/' + day + '/' + year + ' ' + hours + ':' + minutes + ' ' + indicator;	
	
	return receivedDateTime;

}


function invokeURL(){
	
	try{
		
		var r=confirm("You are about to navigate to: " + capturedCode);
		if(r==true){

			var args = new blackberry.invoke.BrowserArguments(capturedCode);
			  blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, args);
		} else {
			return;
		}
		
		
		
	} catch (e){
		alert('Invoking Browser exception (): ' + e.name + '; ' + e.message);
	}

}

function string_contains(haystack, needle){
		if(haystack.indexOf(needle) == -1){
		  return false;
		}else{
		  return true;
		}
	} 


  

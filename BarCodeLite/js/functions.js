//Window/Form events
window.onload=AppLoad;

//Global variables
var currentPage = "MainScreen";
var capturedCode = "";
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


function Analyze_BarCode(value) {
	//This function is called from the Java Extension when a barcode is scanned
	//There is 1 parameters required to be passed into this function.  
	//vale = string passed from scanned barcode
	
	capturedCode = value;
	
	var div = document.getElementById('Main');
	var html = "";//div.innerHTML;
	
		html += '<div class="listing" x-blackberry-focusable="true" >';
		html += '<div class="typeName">' + 'Scanned Image' + '</div>';
		html += '<br/><br/>';
		html += '<div class="barcodeString">Barcode:' + capturedCode + '</div>';
		html += '<br/></div>';
		 		
		div.innerHTML = html;

		document.getElementById('returnContainer').style.display = "block";

}
  
function onError(error) {
	alert('Exception: ' + error);
}

function string_contains(haystack, needle){
		if(haystack.indexOf(needle) == -1){
		  return false;
		}else{
		  return true;
		}
	} 
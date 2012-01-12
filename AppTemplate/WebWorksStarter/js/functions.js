//Window/Form events
window.onload=AppLoad;

//Global variables
var currentPage = "MainScreen";

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







  


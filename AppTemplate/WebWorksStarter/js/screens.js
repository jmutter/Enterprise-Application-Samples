//FUNCTIONS TO TOGGLE DIVS FOR DIFFERENT SCREENS
//THIS IS JUST AN EXAMPLE FOR A SINGLE PAGE APPLICATION

function displayMainScreen(){
	
	currentPage = "MainScreen";
	document.getElementById('backButton').style.display = "none";
	document.getElementById('main_screen_container').style.display = "block";
	
}

function backScreen() {

		displayMainScreen();
		
}




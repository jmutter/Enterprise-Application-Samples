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


function fn_StartSpinner(parentNodeID, imgSpinnerIconID){
	var parentNode = document.getElementById(parentNodeID);
	
	var imgIcon = document.getElementById(imgSpinnerIconID);
	if (imgIcon ==null){
		parentNode.innerHTML = "";
		imgIcon = document.createElement("img");
		imgIcon.setAttribute("id", imgSpinnerIconID);
		imgIcon.setAttribute("src", "images/spinner.gif");	
		parentNode.appendChild(imgIcon);
	}
}
function fn_StopSpinner(parentNodeID, imgSpinnerIconID){
	var parentNode = document.getElementById(parentNodeID);
	if (parentNode != null){
		parentNode.removeChild(document.getElementById(imgSpinnerIconID));
	}
}

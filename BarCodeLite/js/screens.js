//FUNCTIONS TO TOGGLE DIVS FOR DIFFERENT SCREENS
//THIS IS JUST AN EXAMPLE FOR A SINGLE PAGE APPLICATION

function displayBarCodeScreen(){
	
	try {

		blackberry.ui.menu.clearMenuItems();					
		var menuItem_Scan = new blackberry.ui.menu.MenuItem(false, 1,"Scan Barcode", doScan);
		blackberry.ui.menu.addMenuItem(menuItem_Scan);	
		var menuItem_Separator1 = new blackberry.ui.menu.MenuItem(true, 2);			
		blackberry.ui.menu.addMenuItem(menuItem_Separator1);
		
	}catch (e){
	//	alert("displayBarCodeScreen failure: " + e.name + ";" + e.message);
	}
	currentPage = "BarCodeScreen";

	document.getElementById('main_screen_container').style.display = "none";	
	document.getElementById('barcodeScreen').style.display = "block";
	document.getElementById('backButton').style.display = "block";

}


function displayMainScreen(){
	
	currentPage = "MainScreen";
	document.getElementById('backButton').style.display = "none";
	document.getElementById('barcodeScreen').style.display = "none";
	document.getElementById('returnContainer').style.display = "none";	
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

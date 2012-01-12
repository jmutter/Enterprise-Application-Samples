//FUNCTIONS TO TOGGLE DIVS FOR DIFFERENT SCREENS
//THIS IS JUST AN EXAMPLE FOR A SINGLE PAGE APPLICATION


function displayMainScreen(){
	
	currentPage = "MainScreen";
	document.getElementById('backButton').style.display = "none";
	document.getElementById('main_screen_container').style.display = "block";
	
	document.getElementById('barcodeScreen').style.display = "none";
	document.getElementById('returnContainer').style.display = "none";	
}


function backScreen() {

		displayMainScreen();
		
}




function displayBarCodeScreen(){
	
	try {

		blackberry.ui.menu.clearMenuItems();					
		var menuItem_Scan = new blackberry.ui.menu.MenuItem(false, 1,"Scan Barcode", doScan);
		blackberry.ui.menu.addMenuItem(menuItem_Scan);	
		var menuItem_Separator1 = new blackberry.ui.menu.MenuItem(true, 2);			
		blackberry.ui.menu.addMenuItem(menuItem_Separator1);
	
	
		currentPage = "BarCodeScreen";
	
		document.getElementById('main_screen_container').style.display = "none";	
		document.getElementById('barcodeScreen').style.display = "block";
		document.getElementById('backButton').style.display = "block";
	}catch (e){
	 	alert("displayBarCodeScreen failure: " + e.name + ";" + e.message);
	}
}
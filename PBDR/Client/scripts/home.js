//*************************************************************
//* This library contains all functions and global variables
//* that pertain to the Home screen
//*************************************************************	

//Global Variables
var gDocumentRope;
var gDocumentTextRope;
var gDownloadingContactsRope;
var gDownloadingDocumentsRope;
var gDownloadingRSSRope;
var gPeopleRope;
var gPeopleTextRope;
var gPleaseWaitRope;
var rope = [];
var gRSSRope;
var gRSSTextRope;
var gStopMusicRope;
//var standard_transition = '-webkit-transition:all 0.6s linear;';

function buildHomeScreen() {
//*************************************************************
//* This function is called when the page is loaded/ready and it will 
//* initalize the variables necessary for animation on the home screen
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************			

	var home_background = document.getElementById('background');
	home_background.style.zIndex = 0;
	home_background.style.display = '';
	home_background.style.webkitAnimationName = 'fade_in';

	//var ropeHandler = new RopeHandler({"fps":10, "timeStep":1/5});
	var ropeHandler = new RopeHandler({"fps":2, "timeStep":1/10});
	
  //People
	gPeopleRope = ropeHandler.createRope({"length":250, "width":3,"anchorX":190,"anchorY":-480, "lock":false, "color":"white","attachElement":"imgPeople", "attachX":105, "attachY":70, "angle":10});
	gPeopleTextRope = ropeHandler.createRope({"length":30, "width":1,"anchorX":150,"anchorY":200, "lock":false, "color":"#333", "attachElement":"txtPeople", "attachX":75, "attachY":9});		
	gPeopleRope.attachRope(gPeopleTextRope, "0", "39");

	//Documents
	gDocumentRope = ropeHandler.createRope({"length":250, "width":3,"anchorX":475,"anchorY":-480, "lock":false, "color":"white","attachElement":"imgDocuments", "attachX":45, "attachY":61, "angle":8});
	gDocumentTextRope = ropeHandler.createRope({"length":70, "width":1,"anchorX":150,"anchorY":20, "lock":false, "color":"#333", "attachElement":"txtDocuments", "attachX":50, "attachY":40, "angle":3 });		
	gDocumentRope.attachRope(gDocumentTextRope, "20", "33");
	
  //News Feeds
	gRSSRope = ropeHandler.createRope({"length":270, "width":3,"anchorX":810,"anchorY":-480, "lock":false, "color":"white","attachElement":"imgNewsFeeds", "attachX":90, "attachY":61, "angle":5});
	gRSSTextRope = ropeHandler.createRope({"length":30, "width":1,"anchorX":150,"anchorY":200, "lock":false, "color":"#333", "attachElement":"txtNewsFeeds", "attachX":97, "attachY":0, "angle":5 });		
	gRSSRope.attachRope(gRSSTextRope, "5", "15");

	//Turn off music
	var xLocation = screen.width - 60;
	gStopMusicRope = ropeHandler.createRope({"length":100, "width":3,"anchorX":xLocation,"anchorY":0, "lock":false, "color":"white","attachElement":"imgStopMusic", "attachX":28, "attachY":15, "angle":8});
 
	//Please Wait	
	xLocation = (screen.width / 2) - 60;
	gPleaseWaitRope = ropeHandler.createRope({"length":175, "width":3,"anchorX":xLocation,"anchorY":-600, "lock":false, "color":"white","attachElement":"imgPleaseWait", "attachX":45, "attachY":61, "angle":8});
	gDownloadingContactsRope = ropeHandler.createRope({"length":150, "width":2,"anchorX":130,"anchorY":-600, "lock":false, "color":"white", "attachElement":"imgDownloadingContacts", "attachX":20, "attachY":50, "angle":5 });		
	gDownloadingDocumentsRope = ropeHandler.createRope({"length":165, "width":2,"anchorX":220,"anchorY":-600, "lock":false, "color":"white", "attachElement":"imgDownloadingDocuments", "attachX":20, "attachY":50, "angle":5 });		
	gDownloadingRSSRope = ropeHandler.createRope({"length":160, "width":2,"anchorX":315,"anchorY":-600, "lock":false, "color":"white", "attachElement":"imgDownloadingRSS", "attachX":20, "attachY":50, "angle":5 });		
		
	document.getElementById('data').innerHTML = '<label style="font-size:60%">Disaster Recovery</label>';
	document.getElementById('graphics').style.display="block";
}

//Document touch events
document.ontouchcancel = function(event) {
//*************************************************************
//* This function is for a touch cancel event
//* Parms:
//*		Event object that is no longer being touched
//* Value Returned: 
//*		Nothing
//*************************************************************	

	event.preventDefault();
}; 

document.ontouchend = function(event) {
//*************************************************************
//* This function is for a touch end event
//* Parms:
//*		Event object that ended the touch
//* Value Returned: 
//*		Nothing
//*************************************************************	

//	event.preventDefault();
//	var touchEvent = event.changedTouches[0];
//	var x = touchEvent.pageX;
//	var y = touchEvent.pageY;
//	touchEndMouseUp(x,y);
};

document.ontouchmove = function(event) {
//*************************************************************
//* This function is for a touch move event
//* Parms:
//*		Event object that was moved via touch event
//* Value Returned: 
//*		Nothing
//*************************************************************	

//	event.preventDefault();
//	var touchEvent = event.changedTouches[0];
//	var x = touchEvent.pageX;
//	var y = touchEvent.pageY;
//	var t = new Date();
//	updateDirection(x,y);
//	lastX = x;
//	lastY = y;
};

document.ontouchstart = function(event) {
//*************************************************************
//* This function is for a touch start event
//* Parms:
//*		Event object that started the touch
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
//	event.preventDefault();
//	var touchEvent = event.changedTouches[0];
//	var x = touchEvent.pageX;
//	var y = touchEvent.pageY;
//	touchStartMouseDown(x,y);
};


function setupHome() {
//*************************************************************
//* This function is called when the page is loaded/ready and it will 
//* or pulling up the rope.
//* Parms:
//*		true/false value to show or hide the images
//* Value Returned: 
//*		Nothing
//*************************************************************		

	setTimeout(function() {
		$('#overlay').css('opacity', '0');
		$('#data').css('-webkit-animation', 'slide-up2 2.2s');
		
		setTimeout(function() {
			document.getElementById('overlay').style.display = 'none';
		}, 0);
	}, 100);
}

function hideDownloadingOption(option) {
//*************************************************************
//* This function will show or hide the 3 main options by lowering
//* or pulling up the rope.
//* Parms:
//*   name of rope to pull up
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	option = option.toLowerCase();
	if (option == 'contacts') {
		gDownloadingContactsRope.pullUp();
	}
	if (option == 'documents') {
		gDownloadingDocumentsRope.pullUp();
	}
	if (option == 'rss') {
		gDownloadingRSSRope.pullUp();
	}		
}

function showOptions(visible) {
//*************************************************************
//* This function will show or hide the 3 main options by lowering
//* or pulling up the rope.
//* Parms:
//*		true/false value to show or hide the images
//* Value Returned: 
//*		Nothing
//*************************************************************	
		

	if (visible == true) {
		gDocumentRope.fallDown();
		gPeopleRope.fallDown();
		gRSSRope.fallDown();
	} 
	else {
		gDocumentRope.pullUp();
		gPeopleRope.pullUp();
		gRSSRope.pullUp();
	}	
}

/**
 * Native handler for mouse down event.
*/
//document.onmousedown = function(event) {
//	event.preventDefault();
//	var x = event.clientX;
//	var y = event.clientY;
//	touchStartMouseDown(x,y);
//};
// 
///**
// * Native handler for mouse up event.
//*/
//document.onmouseup = function(event) {
//	event.preventDefault();
//	var x = event.clientX;
//	var y = event.clientY;
//	touchEndMouseUp(x,y);
//	moveTrace = [];
////	alert("x: " + x + " y:" + y);
////	alert(event.target.getElement);
//
//} ;
 
/**
 * Native handler for mouse move event.
 */
//document.onmousemove = function(event) {
//	var x = event.clientX;
//	var y = event.clientY;
//	var t = new Date();
//	//updateDirection(x,y);
//	if(mouseDown) {
//		var mv = new moveTraceItem(x, y, t);
//		moveTrace.push(mv);
//	}
//	lastX = x;
//	lastY = y;
//};
/*  Copyright 2010-2011 Research in Motion

 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Variables related to our display Objects. 
 */
var introSound = new Audio("Intro_Music.mp3");
var waitSound = new Audio("Intro_Music.mp3");
var rope = [];
var bg_background = null;
var standard_transition = '-webkit-transition:all 0.6s linear;';

/**
 * Set the objects to be visible or not. We only update if the state is different than our current state.
 * 
 * @param visible true = visible, false = not visible.
 */
function showImages(visible) {
		
	var i = 0;
	if(visible == false) {
		for(i = 0; i<3; ++i) {
			rope[i*2].pullUp();
		}
	} 
	else {
		for(i = 0; i<3; ++i) {
			rope[i*2].fallDown();
		}
	}	
	document.getElementById('graphics').style.display="block";
}

/**
 * Set graphics.
 * 
 */
function updateGraphics() {
		
	document.getElementById('data').innerHTML = '<label style="font-size:60%">Disaster Recovery</label>';
	showImages(true);	
}

/**
 * Once our page is loaded, we will clear our splash screen and display our main application.
 */
function setupHome() {

	introSound.play();

	setTimeout(function() {
		$("#overlay").css("opacity", "0");
		$("#data").css("-webkit-animation", "slide-up2 2.2s");
		
		setTimeout(function() {
			document.getElementById('overlay').style.display = 'none';
		}, 0);
	}, 100);
}

/**
 * Once our document has loaded, we initialize the majority of our variables.
 */
function whenReady() {

	//currentHour = (new Date()).getHours();
		
	bg_background = document.getElementById('background');
	bg_background.style.zIndex = 0;
	bg_background.style.display = '';
	bg_background.style.webkitAnimationName = 'fade_in';

	var ropeHandler = new RopeHandler({"fps":10, "timeStep":1/5});

	
	//Documents
	rope[0] = ropeHandler.createRope({"length":250, "width":4,"anchorX":150,"anchorY":0, "lock":false, "color":"#333","attachElement":"imgDocuments", "attachX":45, "attachY":61, "angle":8});
	rope[1] = ropeHandler.createRope({"length":75, "width":1,"anchorX":150,"anchorY":20, "lock":false, "color":"#333", "attachElement":"txtDocuments", "attachX":50, "attachY":40, "angle":3 });		
	rope[0].attachRope(rope[1], "20", "33");
	
  //People
	rope[2] = ropeHandler.createRope({"length":225, "width":4,"anchorX":475,"anchorY":-460, "lock":false, "color":"#333","attachElement":"imgContacts", "attachX":105, "attachY":70, "angle":10});
	rope[3] = ropeHandler.createRope({"length":30, "width":1,"anchorX":150,"anchorY":200, "lock":false, "color":"#333", "attachElement":"txtContacts", "attachX":75, "attachY":9});		
	rope[2].attachRope(rope[3], "0", "39");

  //News Feeds
	rope[4] = ropeHandler.createRope({"length":225, "width":4,"anchorX":810,"anchorY":-480, "lock":false, "color":"#333","attachElement":"imgNewsFeeds", "attachX":90, "attachY":61, "angle":5});
	rope[5] = ropeHandler.createRope({"length":35, "width":1,"anchorX":150,"anchorY":200, "lock":false, "color":"#333", "attachElement":"txtNewsFeeds", "attachX":97, "attachY":0, "angle":5 });		
	rope[4].attachRope(rope[5], "5", "15");
 
	//Please Wait	
	var xLocation = (screen.width / 2) - 60;
	rope[99] = ropeHandler.createRope({"length":250, "width":4,"anchorX":xLocation,"anchorY":-480, "lock":false, "color":"#333","attachElement":"imgPleaseWait", "attachX":45, "attachY":61, "angle":8});
	
	updateGraphics();
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

/**
 * Native handler for touch start event.
 */
document.ontouchstart = function(event) {
//	event.preventDefault();
//	var touchEvent = event.changedTouches[0];
//	var x = touchEvent.pageX;
//	var y = touchEvent.pageY;
//	touchStartMouseDown(x,y);
};

/**
 * Native handler for touch move event.
 */
document.ontouchmove = function(event) {
//	event.preventDefault();
//	var touchEvent = event.changedTouches[0];
//	var x = touchEvent.pageX;
//	var y = touchEvent.pageY;
//	var t = new Date();
//	updateDirection(x,y);
//	lastX = x;
//	lastY = y;
};

/**
 * Native handler for touch end event.
 */
document.ontouchend = function(event) {
//	event.preventDefault();
//	var touchEvent = event.changedTouches[0];
//	var x = touchEvent.pageX;
//	var y = touchEvent.pageY;
//	touchEndMouseUp(x,y);
};

/**
 * Native handler for touch cancel event.
*/
document.ontouchcancel = function(event) {
	event.preventDefault();
}; 
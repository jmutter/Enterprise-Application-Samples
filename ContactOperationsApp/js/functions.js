//Window/Form events
window.onload=AppLoad;

//Global variables
var currentPage = "MainScreen";
var imagePath = "";

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


function callOps(){
	try 
	{				
		if (blackberry.system.hasDataCoverage())
		{
			//enter the proper number to dial, this is for Bing 411
			var args = new blackberry.invoke.PhoneArguments('1-800-246-4411', true);
			args.view = blackberry.invoke.PhoneArguments.VIEW_CALL;     
			blackberry.invoke.invoke(blackberry.invoke.APP_PHONE, args);						
		}
		else
		{
			alert ("Call can not be placed. You are out of coverage.");
		}		
	}
	catch (e) 
	{
		alert('exception (callOps): ' + e.name + '; ' + e.message);
	}
}



function textOps(){
	
	try 
	{				
		if (blackberry.system.hasDataCoverage())
		{

			blackberry.message.sms.send("Ops please contact me ASAP", "18005551212");
	
		} else {
			alert ("Text can not be placed. You are out of coverage.");
		}
		
	}
	catch (e){
		alert('exception (textOps): ' + e.name + '; ' + e.message);
	}	
	
	alert("SMS message sent to Ops.");
	
}


function emailOps(){
	
	try 
	{		
		if (blackberry.system.hasDataCoverage())
		{	
			//Vars used for setting up fields used in the email
			var strEmailAddress = "test@test.com"; 
			var strSubject = "Operations Please Help";		
			var strBody = "The message body can be filled in by user or prepopulated like this."; 
			
			//Create MessageArguments object, passing in arguments used to display email 
			var msg = new blackberry.invoke.MessageArguments(strEmailAddress, strSubject, strBody);		
			
			//Assign the "New/Compose" view property of the email then display email
			msg.view = blackberry.invoke.MessageArguments.VIEW_NEW;				
			blackberry.invoke.invoke(blackberry.invoke.APP_MESSAGES, msg);
		} else {
			alert ("Email can not be sent. You are out of coverage.");
		}
		
	} 
	catch (e){
		alert('exception (emailOps): ' + e.name + '; ' + e.message);
	}	

}

function photoOps(){
	
	  try {
			  blackberry.media.camera.takePicture(successCB, closedCB, errorCB);
	
	  } catch(e) {
		    alert("Error in supported: " + e);
	  }
}

function successCB(filePath) {
  
  imagePath = filePath; 
   	
}

function closedCB() {
	try 
	{		
		if (blackberry.system.hasDataCoverage())
		{	
			//Vars used for setting up fields used in the email
			var strEmailAddress = "test@test.com"; 
			var strSubject = "Operations Please Help";		
			var strBody = "Make sure to attach photo taken using Menu Button -> Attach -> Picture. "; 
			
			//Create MessageArguments object, passing in arguments used to display email 
			var msg = new blackberry.invoke.MessageArguments(strEmailAddress, strSubject, strBody);		
			
			//Assign the "New/Compose" view property of the email then display email
			msg.view = blackberry.invoke.MessageArguments.VIEW_NEW;				
			blackberry.invoke.invoke(blackberry.invoke.APP_MESSAGES, msg);
		} else {
			alert ("Email can not be sent. You are out of coverage.");
		}
		
	} 
	catch (e){
		alert('exception (closedCB): ' + e.name + '; ' + e.message);
	}	
}

function errorCB(e) {
  alert("Error occured taking a picture: " + e.name + '; ' + e.message);
}





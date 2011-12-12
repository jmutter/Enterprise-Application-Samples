addEventListener('load', setHandlers, false);

function showMenuBar()
{
	document.getElementById("menuBar").className = "showMenuBar";
}

function hideMenuBar()
{
	document.getElementById("menuBar").className = "hideMenuBar";
}	

function doMenuAction(msg)
{
	//TODO: need better way to modify html vs loading into htmlDlg variable 	
	
	var htmlDlg = 
	'<div>' +
		'<b>Date Display</b><br><hr>' +
	    '<input type="radio" name="dateformat" value="yearFirst" id="yearFirst">' + 
    	'<label for="yearFirst">yyyy-mm-dd</label>' +
  	'</div>' +
  	'<div>' +
	    '<input type="radio" name="dateformat" value="dayFirst" id="dayFirst">' +
	    '<label for="dayFirst">dd/mm/yyyy</label>' +
  	'</div>' +
  	'<div>' +
	    '<input type="radio" name="dateformat" value="monthFirst" id="monthFirst">' +
	    '<label for="monthFirst">mm/dd/yyyy</label>' +
    '</div>' +
    '<div>' +
    	'<br><b>Name Display Format</b><br><hr>' +
    	'<input type="radio" name="nameformat" value="lastNmFirst" id="lastNmFirst">' + 
    	'<label for="lastNmFirst">Last name, First name </label>' +
  	'</div>' +
  	'<div>' +
	    '<input type="radio" name="nameformat" value="firstNmFirst" id="firstNmFirst">' + 
    	'<label for="firstNmFirst">First name, Last name </label>' +
  	'</div>' +
  	'<div>' +
    	'<br><b>Company on Name Bar</b><br><hr>' +
    	'<input type="radio" name="compNmBarYes" value="compNmBarYes" id="compNmBarYes">' + 
    	'<label for="compNmBarYes">Yes</label>' +
  	'</div>' +
  	'<div>' +    	
    	'<input type="radio" name="compNmBarNo" value="compNmBarNo" id="compNmBarNo">' + 
    	'<label for="compNmBarNo">No</label>' +
  	'</div>' +
  	'<div>' +
    	'<br><b>Listing Separator</b><br><hr>' +
    	'<input type="radio" name="lstSepOn" value="lstSepOn" id="lstSepOn">' + 
    	'<label for="lstSepOn">On</label>' +
  	'</div>' +
  	'<div>' +    	
    	'<input type="radio" name="lstSepOff" value="lstSepOff" id="lstSepOff">' + 
    	'<label for="lstSepOff">Off</label>' +
  	'</div>' +
  	'<div>' +
    	'<br><b>Display "All" Group</b><br><hr>' +
    	'<input type="radio" name="dspAllGrpYes" value="dspAllGrpYes" id="dspAllGrpYes">' + 
    	'<label for="dspAllGrpYes">Yes</label>' +
  	'</div>' +
  	'<div>' +    	
    	'<input type="radio" name="dspAllGrpNo" value="dspAllGrpNo" id="dspAllGrpNo">' + 
    	'<label for="dspAllGrpNo">No</label>' +
  	'</div>'
	
	//TODO: need to style the dialog window, add a button/icon for pressing (apply/cancel)
	$(document).ready(function() {	
		var $dialog = $('<div></div>')
			///.html('This dialog will show every time!')
			.html(htmlDlg)
			.dialog({
				autoOpen: false,
				width: 'auto',
				height: 'auto',
				title: 'Disaster Recover Application Settings'
			});	
		
		$(document).ready(function() {
			$dialog.dialog('open');
			// prevent the default action, e.g., following a link
			return false;
		}); 
	});
	
	hideMenuBar();
}	

function setHandlers()
{
	if ((typeof blackberry == "undefined") || (typeof blackberry.app == "undefined")) return false;
	
	//WebWorks API Reference guide:
	//	http://www.blackberry.com/developers/docs/webworks/api/playbook/
	//
	blackberry.app.event.onSwipeDown(showMenuBar);
}

function newSettings()
{
	//TODO: need better way to modify html vs loading into htmlDlg variable 	
	
	var html = 
				   	'<div class="ui-body>' +
				   	'<div data-role="fieldcontain">' +
    '<fieldset data-role="controlgroup">' +
	   '<legend>Agree to the terms:</legend>' +
	   '<input type="checkbox" name="checkbox-1" id="checkbox-1" class="custom" />' +
	   '<label for="checkbox-1">I agree</label>' +
    '</fieldset>' +
'</div>' +
				   	
				   	
				   	'<div data-role="fieldcontain">' +
		   			'<fieldset data-role="controlgroup">' +
				   	'<legend>Groups:</legend>' +
			     	'<input type="checkbox" name="cbShowAllGroup" id="cbShowAllGroup"/>' +
			     	'<label for="cbShowAllGroups">Show All Listing</label>' +
			      '</fieldset>' +
						'</div>' +
				   	'<div data-role="fieldcontain">' +
				  	'<fieldset data-role="controlgroup">' +
				   	'<legend>Listing Order:</legend>' +
				   	'<input type="radio" name="listingorder" id="rbListingLastName" value="LastName" onchange="rbListingLastName_Change()"/>' +
			     	'<label for="rbListingLastName">By LastName</label>' +
				   	'<input type="radio" name="listingorder" id="rbListingFirstName" value="FirstName" onchange="rbListingFirstName_Change()"/>' +
			     	'<label for="rbListingFirstName">By FirstName</label>' +
				  	'</fieldset>' +
						'</div>' +
						'</div>'							
	//TODO: need to style the dialog window, add a button/icon for pressing (apply/cancel)
	$(document).ready(function() {	
		var $dialog = $('<div></div>')
		///.html('This dialog will show every time!')
		.html(html)
		.dialog({
			autoOpen: false,
			width: '80%',
			height: 'auto',
			title: 'Disaster Recovery Settings'
		});	
		$(document).ready(function() {
			$dialog.dialog('open');
			// prevent the default action, e.g., following a link
			return false;
		}); 
	});
}	

function menuSettings()
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
				title: 'Disaster Recovery Settings'
			});	
		
		$(document).ready(function() {
			$dialog.dialog('open');
			// prevent the default action, e.g., following a link
			return false;
		}); 
	});
	
	hideMenuBar();
}	

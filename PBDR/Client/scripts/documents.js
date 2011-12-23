//*************************************************************
//* This library contains all functions and global variables
//* that pertain to documents
//*************************************************************	

//Global Variables
var gScreenNameDocuments = 'documents';

function displayDocuments(msg){	
	
	
	alert('display documents');		
	var localFileList = getFileList();	
	var JSONPayload = JSON.parse(localFileList);	
	
		
	for (var i = 0; i < JSONPayload.length; i++)
	{		
		
		var docType = JSONPayload[i].ext;  
		var fModified = JSONPayload[i].dateModified; 
		var fName = JSONPayload[i].filename; 
		var fPath = JSONPayload[i].path; 
		var iconImage = null;		
		
		if (docType == ".pdf")
		{
			iconImage = "images/pdf.png";
		}
		else if (docType == ".doc")
		{
			iconImage = "images/documentsSmall.png";
		}
		else if (docType == ".mov")
		{
			iconImage = "images/movie.png";
		}
		else if (docType == ".xls" || docType == ".xlsx")
		{
			iconImage = "images/xls.png";
		}
		else if (docType == ".gif")
		{
			iconImage = "images/gif.png";
		}
		else if (docType == ".png")
		{
			iconImage = "images/png.png";
		}
		else if (docType == ".jpg")
		{
			iconImage = "images/jpg1.png";
		}
		else if (docType == ".ppt")
		{
			iconImage = "images/ppt.png";
		}
		else if (docType == ".zip")
		{
			iconImage = "images/WinZIP.png";
		}
		else
		{
			iconImage = "images/unknownFile.png";
		}
				
		html = '<li onclick= \"alert(' + i + ')\">' + '<img src=\"' + iconImage + '\" />' + '<h3>' + fName + '</h3>' + '<p>' + fModified + '</p></li>';		
		$('#lviewDocs').append(html);
		$('#lviewDocs').listview("refresh");
	
	}		
	
	displayScreen(gScreenNameDocuments);	
}

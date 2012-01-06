//*************************************************************
//* This library contains all functions and global variables
//* that pertain to documents
//*************************************************************	

//Global Variables

var FILE_STORAGE = blackberry.io.dir.appDirs.shared.documents;
//the directory to download files to in the FILE_STORAGE space
var gDirectoryName = "pbdr";
var FULL_DIR_PATH = FILE_STORAGE.path + '/'  + gDirectoryName;

function buildDocumentsScreen() {
//*************************************************************
//* This function will build the documents listing screen 
//* Parms:
//*   Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************				
		
	if (gDownloadWindowDisplayed == false) {
		manageMusic('Stop');		
		
		var localFileList = downloader.getCurrentFileList(FULL_DIR_PATH);		
		var JSONPayload = JSON.parse(localFileList);	
		
		var html = '';
		var iconImage = '';
			
		//clear out the listview before populating
		$('#documentslisting').empty();
		
		for (var counter = 0; counter < JSONPayload.length; counter++) {		
			var docType = JSONPayload[counter].ext;  
			var fModified = JSONPayload[counter].dateModified; 
			var fName = JSONPayload[counter].filename; 
			var fPath = JSONPayload[counter].path; 
			
			if (docType == ".pdf") {
				iconImage = "images/pdf.png";
			}
			else if (docType == ".doc" || docType == ".docx") {
				iconImage = "images/msword.png";
			}
			else if (docType == ".mov")	{
				iconImage = "images/movie.png";
			}
			else if (docType == ".xls" || docType == ".xlsx")	{
				iconImage = "images/msxls.png";
			}
			else if (docType == ".gif")	{
				iconImage = "images/imagesico.png";
			}
			else if (docType == ".png")	{
				iconImage = "images/imagesico.png";
			}
			else if (docType == ".jpg")	{
				iconImage = "images/imagesico.png";
			}
			else if (docType == ".ppt" || docType == ".pptx")	{
				iconImage = "images/msppt.png";
			}
			else if (docType == ".zip")	{
				iconImage = "images/winzip.png";
			}
			else if (docType == ".mp3")	{
				iconImage = "images/audio.png";
			}
			else {
				iconImage = "images/unknownfile.png";
			}
			
			html = '<li  onclick="launchFile(\'' + fPath + '\');">' + '<img src=\"' + iconImage + '\" />' + '<h3>' + fName + '</h3>' + '<p>' + fModified + '</p></li>';
			
			$('#documentslisting').append(html);
			$('#documentslisting').listview("refresh");	
		}		
		displayScreen(gScreenNameDocuments);
	}
}

function launchFile (filePath) {
//*************************************************************
//* This function will attempt to open the requested file if it
//* is found to exist on the file system.
//* Parms:
//*		File name to open
//* Value Returned: 
//*		Nothing
//*************************************************************		
	
	if (blackberry.io.file.exists(filePath)) {
    blackberry.io.file.open(filePath);	               
	}
	else {
		displayMessage('Selected document does not exist on the file system');
	}	
}

//function getFileList(){
//
//	var fileList = downloader.getCurrentFileList(FULL_DIR_PATH);	
//	return fileList;
//}

function documentsDownloaded(msg) {
//*************************************************************
//* This function is called upon completion of downloading all
//* the document files
//* Parms:
//*		Success/Failure message from called functions (from callbacks)
//* Value Returned: 
//*		Nothing
//*************************************************************		
	
	var errMsg = '';
	if (msg == '' || msg == undefined) {
		writeLog('downloadedDocuments Starting');				
  	gDocumentsDateTime = getDate('yyyymmdd') + getTime('hhmmss');
  	var	sql = 'UPDATE ' + gTableNameConfig + ' SET datetime = \'' + gDocumentsDateTime + '\' WHERE type = \'Documents\'';
		dbUpdateRecord(sql, 'documentsDownloaded'); 
	} 
	else if (msg == 'DBUPDATERECORDSUCCESS') {	
		writeLog('downloadedDocuments Finished');			
		window[gRequestingFunction]('DOCUMENTSLOADED');
	}
	else if (msg.substring(0,20) == 'DBUPDATERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	else {
		errMsg = 'Invalid msg: ' + msg;
	}
	if (errMsg != '') {
		writeLog('downloadedDocuments Finished - ERROR - ' + errMsg);				
		window[gRequestingFunction]('DOCUMENTSLOADERROR:' + errMsg);
	}
}

function processDocumentsPayload() {
//*************************************************************
//* This function will process the received JSON payload that 
//* contains the complete list of files that are to be on 
//* the device.
//* Parms:
//*		Nothing
//* Value Returned: 
//*		Nothing
//*************************************************************	
	
	gProgressBarDocumentsCounter = 0;
	gProgressBarDocumentsMaximum	= gJSONPayload.length;
	document.getElementById('documentprogressbarheader').innerText = 'Documents (' + gProgressBarDocumentsMaximum + ')';
	gProgressBarDocumentsPercentage = gProgressBarDocumentsMaximum / 100;
	//downloader.startDownloader(gJSONPayload, FULL_DIR_PATH, documentsDownloaded);
	documentsDownloaded();
}

function debug(str, cleartext){
	if (cleartext !== undefined) document.getElementById('results').innerHTML = "";
	document.getElementById('results').innerHTML += str + '<br />';
}

//*************************************************************
//* This library contains all functions and global variables
//* that pertain to documents
//*************************************************************	

//Global Variables

var FILE_STORAGE = blackberry.io.dir.appDirs.shared.documents;
//the directory to download files to in the FILE_STORAGE space
var gDirectoryName = "pbdr";
var FULL_DIR_PATH = FILE_STORAGE.path + '/'  + gDirectoryName;

function buildDocumentsScreen(msg){	
		
	manageMusic('Stop');
	alert('buildDocumentsScreen starting');	
		
	var localFileList = getFileList();	
	var JSONPayload = JSON.parse(localFileList);	
	var html = '';
	var iconImage = '';
		
	//clear out the listview before populating
	$('#lviewDocs').empty();
	
	for (var counter = 0; counter < JSONPayload.length; counter++) {		
		var docType = JSONPayload[counter].ext;  
		var fModified = JSONPayload[counter].dateModified; 
		var fName = JSONPayload[counter].filename; 
		var fPath = JSONPayload[counter].path; 
		
		if (docType == ".pdf") {
			iconImage = "images/pdf.png";
		}
		else if (docType == ".doc") {
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
		else if (docType == ".ppt")	{
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
		
		$('#lviewDocs').append(html);
		$('#lviewDocs').listview("refresh");	
	}		
		
	displayScreen(gScreenNameDocuments);
	alert('buildDocumentsScreen finished');		
}


//*************************************************************
//Integreating FileSync/download code below
//*************************************************************
function launchFile (filePath)
{ //filePath
	//alert("in launchFile filePath = " + filePath);
	alert("in launchFile filePath = " +  filePath);
	
	if (blackberry.io.file.exists(filePath))
	{
		alert ("launching file");
    	blackberry.io.file.open(filePath);	               
	}else
	{
		alert("file does not exist");
	}
	
}

function getFileList(){
	alert ('in getFileList');
	var fileList = downloader.getCurrentFileList(FULL_DIR_PATH);	
	//debug ("fileList = " + fileList);	
	return fileList;
}

function documentsDownloaded(msg) {
	
	alert("documents downloaded");
	var errMsg = '';
	if (msg == '' || msg == undefined) {
  	gDocumentsDateTime = getDate('yyyymmdd') + ' @ ' + getTime('hhmmss');
  	var	sql = 'UPDATE ' + gTableNameConfig + ' SET datetime = \'' + gDocumentsDateTime + '\' WHERE type = \'Documents\'';
		dbUpdateRecord(sql, 'documentsDownloaded'); 
	} 
	else if (msg == 'DBUPDATERECORDSUCCESS') {	
		//manageWait('Hide');
		//might need code here to add to a counter so we know which ones are done
	}
	else if (msg.substring(0,20) == 'DBUPDATERECORDERROR:') {
		errMsg = msg.substring(20);
	}
	if (errMsg != '') {
		alert ('Error downloading documents:\n' + errMsg);
	}
}

function processDocumentsPayload() {
	downloader.startDownloader(gJSONPayload, FULL_DIR_PATH, documentsDownloaded);
}

function debug(str, cleartext){
	if (cleartext !== undefined) document.getElementById('results').innerHTML = "";
	document.getElementById('results').innerHTML += str + '<br />';
}

/*
* Copyright 2010-2011 Research In Motion Limited.
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

downloader = {
	FULL_DIR_PATH: "",
	FILE_SIZE_LIMIT: 27498274,
	
	fileList: [],
	
	currentFile: 0,
	
	callBack: undefined,
	
	startDownloader: function(fList, savePath, onComplete){
		//reset counter
		this.currentFile = 0;
		this.FULL_DIR_PATH = savePath;
		this.fileList = [];
		
		//create the save directory if not created yet.
        if (!blackberry.io.dir.exists(this.FULL_DIR_PATH)) {
                //debug("Creating new directory: " + this.FULL_DIR_PATH);
                blackberry.io.dir.createNewDir(this.FULL_DIR_PATH);
        }else{
                //debug("Directory exists already");           
		}

		
		//get the file list from the server
		
		//parse out just the file names
		var fNamesOnly = [];
		for (var i = 0; i < fList.length; i++){
			fNamesOnly.push(fList[i].filename);
		}
		// debug("fNamesOnly = " + fNamesOnly);
		// debug("full_dir_path = " + this.FULL_DIR_PATH);
		
		//get the list of files from the filesystem
		var existingFiles = blackberry.io.dir.listFiles(this.FULL_DIR_PATH);
		// debug("existingFiles = " + existingFiles);
		
		
		for (var j = 0; j < existingFiles.length; j++){
			//if file is in the file list we downloaded then that is ok just leave alone
			//if the file is not in the download list we need to remove it from the file system
			if (!(fNamesOnly.indexOf(existingFiles[j])> -1)){
				// debug("file " + existingFiles[j] + " is not part of the download list - deleting it");
				//delete file
				blackberry.io.file.deleteFile(this.FULL_DIR_PATH + "/" + existingFiles[j]);
			}else{
				// debug("file " + existingFiles[j] + " is part of the download list so dont delete");
			}
		}
		
		//do the comparison of the list of files to filesystem
		for (var k = 0; k < fList.length; k++){
			//does file aleady exist? if so no need to add it to download list
			//if it doesnt exist on the file system but its in the list then we need to download
			if (!(existingFiles.indexOf(fList[k].filename) > -1)){
				//add to download list
				// debug ("file from list: " + fList[k].filename + " is not on the filesystem - which means we download it");
				this.fileList.push(fList[k]);
			}else{
				// debug ("file from list: " + fList[k].filename + " is on the filesystem - which menas we dont download it");
			}
			
		}
		
		// debug ("fileList = "  + this.fileList);
		//this.fileList = fList;
		
		this.doDownload();
		this.callBack = onComplete;
	},
	
	doDownload: function(){
		// debug(this.currentFile + " - " + this.fileList.length);
		if(this.currentFile < this.fileList.length){
			// debug(this.fileList[this.currentFile].filename + ' - ' + this.fileList[this.currentFile].url);
			try{
				var d = blackberry.io.fileTransfer;
				var remotePath = this.fileList[this.currentFile].url;
				// debug('Starting download of remotePath = ' + remotePath);
				
				var localPath = this.FULL_DIR_PATH + '/' + this.fileList[this.currentFile].filename;
				// debug("localPath = " + localPath);
				
				var options = { 'progressInterval': 0, 	//zero or non-zero - set to -1 to get progress call backs. zero will just call back when complete. 
								'username':'foo',		//not implemented
								'password' : 'bar',		//not implemented
								'connectionTimeout': 30000,
								'BESMaxSingeChunk' : 3279};
				
				//check that file is smaller than largest size
				var sizeInBytes = d.getRemoteFileSize(remotePath);
				if (sizeInBytes > this.FILE_SIZE_LIMIT) {
					// debug(this.fileList[this.currentFile].filename + ' -- file exceeds the limit, skipping.');
					this.currentFile++;
					this.doDownload();
				}else{
					// Path could be one of http/https
					d.download(remotePath, localPath, this.onProgress, this.onError, options);
				}
			}catch (e) {
				// debug ("error in doDownload for file " + this.fileList[this.currentFile].filename + ": " + e);
				this.currentFile++;
				this.doDownload();
			}
		}else{
			// debug("download complete - trying call back");
			//download complete
			this.callBack();	
		}
	},
	
	onError: function(error) {
		// debug ("error while downloading for file " + this.fileList[this.currentFile].filename + ": " + error.code + ":" +error.description);
		downloader.currentFile++;
		downloader.doDownload();
	},

	// Event when data is being downloaded/uploaded
	onProgress: function(status ){

		var output = "Percent complete: " + status.percent +
		"<br />Total file size: " + status.totalFileSize +
		"<br />Bytes of file: " + status.numBytes +
		"<br />Local path: " + status.localPath +
		"<br />Remote path: " + status.remotePath +
		"<br />Redirect path: " + status.redirectPath +
		"<br />Start time: " + (new Date(status.startTime)).toDateString() +
		"<br />MIME type: " + status.mimeType;
	
	
		// debug(output);
		downloader.currentFile++;
		downloader.doDownload();
	},
	
	getCurrentFileList: function(fullPath){
		//create the save directory if not created yet.
        if (!blackberry.io.dir.exists(fullPath)) {
            // debug("Creating new directory: " + fullPath);
            blackberry.io.dir.createNewDir(fullPath);
        }else{
            // debug("Directory exists already");           
        }
		
		// debug("Full Path: " + fullPath);
		var existingFiles = blackberry.io.dir.listFiles(fullPath);
		//debug ("existing files: " + existingFiles);
		var filePropertiesArray = [];		
		
		for (var i=0; i<existingFiles.length; i++){
			var fileProperties = {};
			fileProperties.filename = existingFiles[i];
			fileProperties.ext = existingFiles[i].substring(existingFiles[i].indexOf('.'));
			
			var filePath = fullPath + "/" + existingFiles[i];
			
			fileProperties.path = filePath;
			// debug("File path = " + filePath);
			if (blackberry.io.file.exists(filePath)) {
				var properties = blackberry.io.file.getFileProperties(filePath);
				// debug(properties.dateModified);
				fileProperties.dateModified = properties.dateModified;
				
			}
			
			filePropertiesArray.push(fileProperties);
		}
		// debug(filePropertiesArray);
		var jsonObj = JSON.stringify(filePropertiesArray);
		//debug ("json obj = " + jsonObj)
		return jsonObj;
	}
}



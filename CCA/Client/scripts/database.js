//*************************************************************
//* This library contains all functions and global variables
//* that pertain to database requests.  All functions require
//* a function to call back (usually the function that called it)
//* This allows procedural logic for asynchronous SQLite calls.
//*************************************************************	

//Global Variables
var gDatabase;  //Handle to open database for all future events
var gDatabaseName = 'CCA';
var gDatabaseTitle = 'Corporate Communication Application';
var gDatabaseVersion = '1.0';
var gTableNameContacts = 'Contacts';
var gTableNameGroups = 'Groups';
var gTableNameOutstandingURLs = 'OutstandingURLs';
var gTableNameUser = 'User';
var gDBRecordRetrieved = '';
var gDBRecordsRetrieved = new Array(); 
var gDBRecords = null;

function fn_DBAddRecord(sql, functionToCall) {
//*************************************************************
//* This function will add a record to a table as specified by  
//* the supplied SQL statement
//* Parms:
//*		SQL statement to execute
//*     Function to call when complete
//* Value Returned: 
//*		Success or error message to the function that called 
//*************************************************************		

// Ensure your record has ALL field values, blank or otherwise so the positioning of field values will work

	var returnValue = '';
	sql = myTrim(sql);
	if (sql.substring(0,12) != 'INSERT INTO ' || sql.indexOf(' VALUES(') == -1) {
		returnValue = 'DBADDRECORDERROR:Invalid formatted SQL string:' + '\n  SQL: ' + sql;
		window[functionToCall](returnValue); 
	}
	else {
		try {	
			gDatabase.transaction(function(tx) {
				tx.executeSql(sql, []	
				,function(tx, response) {  //Pass Callback - called when the transaction works 
					returnValue = 'DBADDRECORDSUCCESS';
					window[functionToCall](returnValue);
				}
				,function(err) { //Failure Callback - called when the transaction fails
					returnValue = 'DBADDRECORDERROR:SQL call failed with update:' + '\n  Msg: ' + err.message + '\n  SQL: ' + sql;
					window[functionToCall](returnValue);
				}		
				);			
			});
		} 
		catch (e) {
			returnValue = 'DBADDRECORDERROR:General SQL failure with:' + '\n  Name: ' + e.name + '\n  Msg: ' + e.message + '\n  SQL: ' + sql;
			window[functionToCall](returnValue);
		}			
	}
}

function fn_DBCreateTable(tableName, functionToCall) {
//*************************************************************
//* This function will create the requested table with the  
//* necessary fields
//* Parms:
//*		Table to create 
//*     Function to call when complete
//* Value Returned: 
//*		Success or error message to the function that called 
//*************************************************************			

	var returnValue = '';
	var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + '(';
	if (tableName == gTableNameContacts) {
		sql += ' contactid integer primary key';
		sql += ', groupname text';
		sql += ', firstname text'; 
		sql += ', lastname text';  
		sql += ', title text'; 
		sql += ', company text';  
		sql += ', email text';
		sql += ', pin text'; 
		sql += ', workphone text';  
		sql += ', mobilephone text';
		sql += ', homephone text';
		sql += ', address text';
		sql += ', address2 text'; 
		sql += ', city text';
		sql += ', state text';
		sql += ', zipcode text';		
		sql += ', country text)';
	}
	else if (tableName == gTableNameGroups) {
		sql += ' groupname text';  //Name of list of contacts
		sql += ', contactrecords text';  //Number of contacts associated to this group
		sql += ', recordsreceived text)';  //Date and time the records were received
	}	
	else if (tableName == gTableNameUser) {
		//There will only be 1 record for this table
		sql += ' recordid text';	//value should be set to 1 when we create the record so we always know how to reference this
		sql += ', listingorder text';	//LastName or FirstName
		sql += ', contacteffect text';	//Blind, Clip, Drop, Explode
		sql += ', emailsender text';	//Sender that is allowed to send email requests
		sql += ', datedisplay text';	//MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD
		sql += ', applicationactive text)';	//true, false
	}	
	else if (tableName == gTableNameOutstandingURLs) {
		//There will only be 1 record for this table
		sql += ' urlid integer primary key';
		sql += ', url text';  //URL that hasn't been posted
		sql += ', datetime text';  //Date and time the URL was put into the database
		sql += ', lastattemptdatetime text';  //Date and time the last post attempt was made for the URL
		sql += ', statuscode text)';  //Status code from last attempt if not 200
	}	
	else {
		returnValue = 'DBCREATETABLEERROR:Invalid table name (' + tableName + ') requested';
		window[functionToCall](returnValue);
	}
	if (returnValue == '') {
		try {
			gDatabase.transaction(function(tx) {
				tx.executeSql(sql, []
				, function(tx, response) {  //Pass Callback - called when the transaction works
					returnValue = 'DBCREATETABLESUCCESS' + tableName;
					window[functionToCall](returnValue);
				}
				,function(err) { //Failure Callback - called when the transaction fails
					returnValue = 'DBCREATETABLEERROR:Error creating table: ' + tableName + '\n  Msg: ' + err.message;
					window[functionToCall](returnValue);
				}		
				);			
			});
		} 
		catch (e) {
			returnValue = 'CREATETABLEERROR:Error creating table: ' + sTableName + '\n  Name: ' + e.name + '\n  Msg: ' + e.message;
			window[functionToCall](returnValue);
		}			
	}	
}

function fn_DBDeleteRecord(sql, functionToCall) {
//*************************************************************
//* This function will delete a record to a table as specified by  
//* the supplied SQL statement
//* Parms:
//*		SQL statement to execute
//*   Function to call when complete
//* Value Returned: 
//*		Success or error message to the function that called 
//*************************************************************	

	var returnValue = '';
	sql = myTrim(sql);
	if (sql.substring(0,12) != 'DELETE FROM ') {
		returnValue = 'DBDELETERECORDERROR:Invalid formatted SQL string:' + '\n  SQL: ' + sql;
		window[functionToCall](returnValue); 
	}
	else {
		try {	
			gDatabase.transaction(function(tx) {
				tx.executeSql(sql, []
				,function(tx, response) {  //Pass Callback - called when the transaction works 
					returnValue = 'DBDELETERECORDSUCCESS';	
					window[functionToCall](returnValue);
				}
				,function(err) { //Failure Callback - called when the transaction fails
					returnValue = 'DBDELETERECORDERROR:SQL call failed with update:\n  Msg: ' + err.message + '\n  SQL: ' + sql;
					window[functionToCall](returnValue);
				}		
				);			
			});
		} 
		catch (e) {
			returnValue = 'DBDELETERECORDERROR:General SQL failure with:\n  Name: ' + e.name + '\n  Msg: ' + e.message + '\n  SQL: ' + sql;
			window[functionToCall](returnValue);
		}			
	}
}

function fn_DBDropTable(tableName, functionToCall) {
//*************************************************************
//* This function will drop the requested table
//* Parms:
//*		Name of table to drop/remove
//*   Function to call when returned
//* Value Returned: 
//*		Success or error message to the function that called 
//*************************************************************		

	var sql = 'DROP TABLE IF EXISTS ' + tableName;
	try {	
		gDatabase.transaction(function(tx) {
			tx.executeSql(sql, []
			,function(tx, response) {  //Pass Callback - called when the transaction works 
				returnValue = 'DBDROPTABLESUCCESS' + tableName;
				window[functionToCall](returnValue);
			}
			,function(err) { //Failure Callback - called when the transaction fails
				returnValue = 'DBDROPTABLEERROR:SQL call failed dropping table: ' + tableName + '\n  Msg: ' + err.message + '\n  SQL: ' + sql;
				window[functionToCall](returnValue);
			}		
			);			
		});
	} 
	catch (e) {
		returnValue = 'DBDROPTABLEERROR:General SQL failure dropping table: ' + sTableName + '\n  Name: ' + e.name + '\n  Msg: ' + e.message + '\n  SQL: ' + sql;
		window[functionToCall](returnValue);
	}
}

function fn_DBGetField(sql, functionToCall) {
//*************************************************************
//* This function will get the value from a field as specified by  
//* the supplied SQL statement
//* Parms:
//*		SQL statement to execute
//*   Function to call when complete
//* Value Returned: 
//*		Success(with value) or error message to the function that called 
//*************************************************************		

	var returnValue = "";
	sql = myTrim(sql);
	if (sql.substring(0,7) != 'SELECT ' || sql.indexOf(' FROM ') == 0) {
		returnValue = 'DBGETFIELDERROR:Invalid formatted SQL string:\n  SQL: ' + sql;
		window[functionToCall](returnValue); 
	}
	else {
		var fieldName = sql.substring(0,sql.indexOf(" FROM "));	
		fieldName = myTrim(fieldName.substring(7));  //Move past the SELECT value
		if (fieldName.indexOf(",") > 0) {
			returnValue = 'DBGETFIELDERROR:Too many fields specified in SQL string:\n  SQL: ' + sql;
			window[functionToCall](returnValue);			
		}
		else {
			try {	
				gDatabase.transaction(function(tx) {
					tx.executeSql(sql, []
					,function(tx, response) {  //Pass Callback - called when the transaction works 
						if (response.rows.length > 1) {
							returnValue = 'DBGETFIELDERROR:' + response.rows.length + ' rows returned for:\n  SQL: ' + sql;
							window[functionToCall](returnValue);
						}
						else {
							var dbRow = response.rows.item(0);
							returnValue = 'DBGETFIELDVALUE:' + dbRow[fieldName];
							window[functionToCall](returnValue);
						}
					}
					,function(err) { //Failure Callback - called when the transaction fails
						returnValue = 'DBGETFIELDERROR:SQL call failed retrieving field:\n  Field: ' + fieldName + '\n  Msg: ' + err.message;
						window[functionToCall](returnValue);
					}		
					);			
				});
			} 
			catch (e) {
				returnValue = 'DBGETFIELDERROR:General SQL failure retrieving field:\n  Field: ' + fieldName + '\n Name: ' + e.name + '\n  Msg: ' + e.message;
				window[functionToCall](returnValue);
			}			
		}		

	}
}

function fn_DBGetRecord(sql, functionToCall) {
//*************************************************************
//* This function will retrieve a record as specified by  
//* the supplied SQL statement
//* Parms:
//*		SQL statement to execute
//*   Function to call when complete
//* Value Returned: 
//*		Success (fields returned in order in global variable) or error message to the function that called 
//*************************************************************		

	var returnValue = '';
	gDBRecordRetrieved = '';
	sql = myTrim(sql);
	if (sql.substring(0,7) != 'SELECT ' || sql.indexOf(' FROM ') == -1) {
		returnValue = 'DBGETRECORDERROR:Invalid formatted SQL string:\n  SQL: ' + sql;
		window[functionToCall](returnValue);
	}
	else if (sql.substring(0,8) == 'SELECT *') {
		//This validation can be removed once we are working with an object		
		returnValue = 'DBGETRECORDERROR:Invalid formatted SQL string:\n  SQL: ' + sql;
		window[functionToCall](returnValue);
	}
	else {
		try	{
			gDatabase.transaction(function(tx) {
				tx.executeSql(sql, []
				,function(tx, response) {  //Pass Callback - called when the transaction works 
					if (response.rows.length > 1) {
						returnValue = 'DBGETRECORDERROR:' + response.rows.length + ' rows returned for:\n  SQL: ' + sql;
					}
					else {
						if (response.rows.length > 0) {
							var dbRow = response.rows.item(0);
							var fields = sql.substring(0,sql.indexOf(" FROM "));	
							fields = myTrim(fields.substring(7));  //Move past the SELECT value
							var fieldValues = "";
							var array = fields.split(",");	
							for (var field_ctr = 0; field_ctr < array.length - 1; field_ctr++) {
								fieldValues = fieldValues + dbRow[myTrim(array[field_ctr])] + gDelim;						
							}
							fieldValues = fieldValues + dbRow[myTrim(array[field_ctr])];  //Get last field value
							gDBRecordRetrieved = fieldValues;
						}
						returnValue = 'DBGETRECORDSUCCESS';
					}
					window[functionToCall](returnValue);
				}
				,function(err) { //Failure Callback - called when the transaction fails
					returnValue = 'DBGETRECORDERROR:SQL call failed retrieving record:\n  Msg: ' + err.message + '\n  SQL: ' + sql;
					window[functionToCall](returnValue);
				}		
				);			
			});
		} 
		catch (e) {
			returnValue = 'DBGETRECORDERROR:General SQL failure retrieving record:\n  Name: ' + e.name + '\n  Msg: ' + e.message + '\n  SQL: ' + sql; 
			window[functionToCall](returnValue);
		}	
	}
}

function fn_DBGetRecords(sql, functionToCall) {
//*************************************************************
//* This function will retrieve many records as specified by  
//* the supplied SQL statement
//* Parms:
//*		SQL statement to execute
//*     Function to call when complete
//* Value Returned: 
//*		Success (records are placed in global array variable) or error message to the function that called 
//*************************************************************	

	var returnValue = "";
	gDBRecordsRetrieved.length = 0;
	sql = myTrim(sql);
	if (sql.substring(0,7) != 'SELECT ' || sql.indexOf(' FROM ') == -1) {
		returnValue = 'DBGETRECORDERROR:Invalid formatted SQL string:\n  SQL: ' + sql;
		window[functionToCall](returnValue);
	}
	else if (sql.substring(0,8) == 'SELECT *') {
		//This validation can be removed once we are working with an object
		returnValue = 'DBGETRECORDERROR:Invalid formatted SQL string:\n  SQL: ' + sql;
		window[functionToCall](returnValue);
	}
	else {
		try	{
			gDatabase.transaction(function(tx) {
				tx.executeSql(sql, []
				,function(tx, response) {  //Pass Callback - called when the transaction works 
					var dbRow;
					var fieldValues = '';
					var array;
					var fields = sql.substring(0,sql.indexOf(' FROM '));	
					fields = myTrim(fields.substring(7));  //Move past the SELECT value
					for (var row_ctr = 0; row_ctr < response.rows.length; row_ctr++) {
						dbRow = response.rows.item(row_ctr);
						fieldValues = '';
						array = fields.split(",");	
						for (var field_ctr = 0; field_ctr < array.length; field_ctr++) {
							fieldValues = fieldValues + dbRow[myTrim(array[field_ctr])] + gDelim;						
						}
						//fieldValues = fieldValues + dbRow[myTrim(array[field_ctr])];  //Get last field value
						gDBRecordsRetrieved[row_ctr] = fieldValues;						
					}
					returnValue = "DBGETRECORDSSUCCESS";					
					window[functionToCall](returnValue);
				}
				,function(err) { //Failure Callback - called when the transaction fails
					returnValue = 'DBGETRECORDSERROR:SQL call failed retrieving record:\n  Msg: ' + err.message + '\n  SQL: ' + sql;
					window[functionToCall](returnValue);
				}		
				);			
			});
		} 
		catch (e) {
			returnValue = 'DBGETRECORDSERROR:General SQL failure retrieving record:\n  Name: ' + e.name + '\n  Msg: ' + e.message + '\n  SQL: ' + sql; 
			window[functionToCall](returnValue);
		}	
	}
}

function fn_DBOpenDatabase(msg, functionToCall) {
//*************************************************************
//* This function will open the database and create the necessary 
//* tables
//* Parms:
//*		Message returned from called function (blank to start)
//*     Function to call when complete
//* Value Returned: 
//*		Success or error message to the function that called 
//*************************************************************		

	var errMsg = '';
	if (msg == '') {
		gParentFunctionToCall = functionToCall;
		//Open database and create it if it doesn't exist
		gDatabase = openDatabase(gDatabaseName, gDatabaseVersion, gDatabaseTitle, 2 * 1024 * 1024);	
		fn_DBOpenDatabase('DATABASEOPEN');
	}
	else if (msg.substring(0,19) == 'DBCREATETABLEERROR:') {
		errMsg = msg.substring(19);
	}
	else if (msg == 'DATABASEOPEN') {
		//fn_DBOpenDatabase('DBDROPTABLESUCCESS' + gTableNameContacts);
		fn_DBDropTable(gTableNameContacts,"fn_DBOpenDatabase");  //Only use this line when testing and wanting to clear data
	}
	else if (msg == 'DBDROPTABLESUCCESS' + gTableNameContacts) {
		fn_DBCreateTable(gTableNameContacts, 'fn_DBOpenDatabase');			
	}
	else if (msg == 'DBCREATETABLESUCCESS' + gTableNameContacts) {
		//fn_DBOpenDatabase('DBDROPTABLESUCCESS' + gTableNameGroups);  
		fn_DBDropTable(gTableNameGroups,'fn_DBOpenDatabase');  //Only use this line when testing and you want to redefine the table
	}
	else if (msg == 'DBDROPTABLESUCCESS' + gTableNameGroups) {
		fn_DBCreateTable(gTableNameGroups, 'fn_DBOpenDatabase');			
	}
	else if (msg == 'DBCREATETABLESUCCESS' + gTableNameGroups) {
		//fn_DBOpenDatabase('DBDROPTABLESUCCESS' + gTableNameUser);  
		fn_DBDropTable(gTableNameUser,'fn_DBOpenDatabase');  //Only use this line when testing and you want to redefine the table
	}
	else if (msg == 'DBDROPTABLESUCCESS' + gTableNameUser) {
		fn_DBCreateTable(gTableNameUser, 'fn_DBOpenDatabase');			
	}
	else if (msg == 'DBCREATETABLESUCCESS' + gTableNameUser) {
		//fn_DBOpenDatabase('DBDROPTABLESUCCESS' + gTableNameOutstandingURLs);  
		fn_DBDropTable(gTableNameOutstandingURLs,'fn_DBOpenDatabase');  //Only use this line when testing and you want to redefine the table
	}
	else if (msg == 'DBDROPTABLESUCCESS' + gTableNameOutstandingURLs) {
		fn_DBCreateTable(gTableNameOutstandingURLs, 'fn_DBOpenDatabase');			
	}
	else if (msg == 'DBCREATETABLESUCCESS' + gTableNameOutstandingURLs) {
		window[gParentFunctionToCall]('DATABASEOKAY');	
	}
	else if (msg.substring(0,17) == 'DBDROPTABLEERROR:') {
		errMsg = msg.substring(17);
	}
	else {
		errMsg = 'Invalid OpenDatabase msg: ' + msg;		
	}	
	if (errMsg != "") {
		errMsg = 'DATABASEOPENERROR:' + errMsg;
		window[gParentFunctionToCall](errMsg);
	}	
} 

function fn_DBUpdateRecord(sql, functionToCall) {
//*************************************************************
//* This function will update a record as specified by  
//* the supplied SQL statement
//* Parms:
//*		SQL statement to execute
//*   Function to call when complete
//* Value Returned: 
//*		Success or error message to the function that called 
//*************************************************************		

	var returnValue = '';
	sql = myTrim(sql);
	if (sql.substring(0,7) != 'UPDATE ' || sql.indexOf(' SET ') == -1 || sql.indexOf(' WHERE ') == -1) {
		returnValue = 'DBUPDATERECORDERROR:Invalid formatted SQL string:\n  SQL: ' + sql;
		window[functionToCall](returnValue); 
	}
	else {
		try {	
			gDatabase.transaction(function(tx) {
				tx.executeSql(sql, []
				,function(tx, response) {  //Pass Callback - called when the transaction works 
					returnValue = 'DBUPDATERECORDSUCCESS';
					window[functionToCall](returnValue);
				}
				,function(err) { //Failure Callback - called when the transaction fails
					returnValue = 'DBUPDATERECORDERROR:SQL call failed with update:\n  Msg: ' + err.message + '\n  SQL: ' + sql;
					window[functionToCall](returnValue);
				}		
				);			
			});
		} 
		catch (e) {
			returnValue = 'DBUPDATERECORDERROR:General SQL failure with:\n  Name: ' + e.name + '\n  Msg: ' + e.message + '\n  SQL: ' + sql;
			window[functionToCall](returnValue);
		}			
	}
}
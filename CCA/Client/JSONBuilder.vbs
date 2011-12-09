'Dim Active Directory Variables
Dim objCommand
Dim objConnection
Dim objContainer
dim objRoot
'File Variables
Dim fso
Dim objFile
Dim bOkayToProcess
Dim sADDomain
Dim sCNDomain
Dim sDelim
Dim sInfo
Dim sValue
Dim sSearchPath
Dim sTeamListing
Dim sTeams
Dim iField_ctr
Dim iTeam_ctr
Dim sUsers
Dim iUser_ctr
Dim sQuote

  Set fso = CreateObject("Scripting.FileSystemObject")
  sDelim = "(OvO)"
  sQuote = chr(34)
  'Setup Active Directory connection
  sADDomain = "rim.net"  
  Set objConnection = CreateObject("ADODB.Connection")
  objConnection.Open "Provider=ADsDSOObject;"
  Set objCommand = CreateObject("ADODB.Command")
  objCommand.ActiveConnection = objConnection
      
 'Build domain in proper format from value supplied
  sInfo = Split(sADDomain,".")
  sCNDomain = ""
  For iLoop_ctr = 0 to Ubound(sInfo)
    sCNDomain = sCNDomain & "dc=" & sInfo(iLoop_ctr) & ","
  Next
  sCNDomain = Mid(sCNDomain,1,Len(sCNDomain)-1)    'Remove last ,
  sSearchPath = "LDAP://" & sCNDomain 

  sTeamListing = "Directs,Prof Services,WAAs,MVS TAMs,MVS Design,TAMs East,TAMs West,Channel,Admin"
	sTeams = Split(sTeamListing, ",")
	Set objFile = fso.OpenTextFile("c:\development\webworks\cca\Contacts.txt",2,True)    'Set to open for writeeeeeee acreate if not exist
	objFile.WriteLine "{" & sQuote & "Contact" & sQuote & ":["
 	objFile.WriteLine "{" & sQuote & "machinename" & sQuote & ":" & sQuote & "testing" & sQuote 
  objFile.WriteLine "," & sQuote & "confirmationurl" & sQuote & ":" & sQuote & "http://CI0000001380643/PushConfirmation/PUSHConfirmationHandler.ashx?MyMessage=ContactsAdded" & sQuote  	
	For iTeam_ctr = 0 To Ubound(sTeams)
		bOkayToProcess = True
		msgbox "Processing users from: " & sTeams(iTeam_ctr)		
		Select Case sTeams(iTeam_ctr)
			Case "Directs"
				sUsers = Split("awillis,jkobe,jmutter,mhowden,psteel,rchronister,rnewman,riannacone,ramoses,shu",",")
			Case "Prof Services"
				sUsers = Split("amalhan,dmyers,kdavis,twheeler",",")
			Case "WAAs"
				sUsers = Split("bthornton,jbentley,mauwhite,rbalsewich",",")
			Case "MVS TAMs"
				sUsers = Split("jmcmorrow,patjones,rpepper,rmohr,scordery",",")
			Case "Channel"
				sUsers = Split("cecastillo",",")
			Case "MVS Design"
				sUsers = Split("rnewman,riannacone,shu",",")			
			Case "TAMs East"
				sUsers = Split("arainero,asietz,btucker,bdingman,cano,dhillgren,jpetroski,dpetroro,jdoherty,lricco",",")			
			Case "TAMs West"
				sUsers = Split("avisram,amarcil,bpadilla,dgreenough,jklauser,lcassaday,mmantho,rstokes,tstark",",")
			Case "Admin"
				sUsers = Split("ghuth",",")
			Case Else
				bOkayToProcess = False
		End Select
		If bOkayToProcess = False Then
			MsgBox "Invalid team name specified in listing: " & sTeams(iTeam_ctr)
		Else
			For iUser_ctr = 0 To Ubound(sUsers)			
  			sValue = Get_UserInfo(objCommand, sSearchPath, sUsers(iUser_ctr))
  			If Mid(sValue,1,6) = "ERROR:" Then
  				MsgBox "Error retrieving information for: " & sUsers(iUser_ctr) & vbCRLF & Mid(sValue,7)
  			Else
  				If iTeam_ctr = 0 And iUser_ctr = 0 Then
  					objFile.WriteLine "," & sQuote & "groupname" & sQuote & ":" & sQuote & sTeams(iTeam_ctr) & sQuote  
  				Else
  					objFile.WriteLine ",{" & sQuote & "groupname" & sQuote & ":" & sQuote & sTeams(iTeam_ctr) & sQuote 
  				End If
  				sInfo = Split(sValue,sDelim)
  				For iField_ctr = 0 To Ubound(sInfo)
  					Select Case iField_ctr
  						Case 0
  							objFile.WriteLine "," & sQuote & "firstname" & sQuote & ":" & sQuote & sInfo(0) & sQuote    						
  						Case 1
  							objFile.WriteLine "," & sQuote & "lastname" & sQuote & ":" & sQuote & sInfo(1) & sQuote    	
  						Case 2
  							objFile.WriteLine "," & sQuote & "title" & sQuote & ":" & sQuote & sInfo(2) & sQuote    	  						
  						Case 3
  							objFile.WriteLine "," & sQuote & "email" & sQuote & ":" & sQuote & sInfo(3) & sQuote    	
  						Case 4
  							objFile.WriteLine "," & sQuote & "address" & sQuote & ":" & sQuote & sInfo(4) & sQuote    	  						
  						Case 5
  							objFile.WriteLine "," & sQuote & "state" & sQuote & ":" & sQuote & sInfo(5) & sQuote   
  						Case 6
  							objFile.WriteLine "," & sQuote & "zipcode" & sQuote & ":" & sQuote & sInfo(6) & sQuote  
  						Case 7  							
  							objFile.WriteLine "," & sQuote & "workphone" & sQuote & ":" & sQuote & sInfo(7) & sQuote & "}"
  					End Select
  				Next
  			End If
  		Next
  	End If
	Next
  objFile.WriteLine "]}"   
  objFile.Close
	msgbox "User info put into JSON file"
		
Function Get_UserInfo(objCommand, sSearchPath, sSAMAccountName)
'***************************************************************************
'* This function will retrieve members from Active Directory Groups
'***************************************************************************
'Active Directory Variables
Dim objRecordset
'General Variables
Dim Address
Dim sReturnValue
Dim sFields
Dim sDelim

  sReturnValue = ""
  sDelim = "(OvO)"
  sFields = "givenname,sn,title,telephonenumber,mail,streetaddress,st,postalcode"
  'objcommand.commandtext = "SELECT member, displayname FROM '" & sSearchPath & "' WHERE objectClass='Group' AND DisplayName = '" & Replace(sURLADGroup_Public,"'","''") & "'"  
  objCommand.CommandText = "<" & sSearchPath & ">;(&(objectCategory=User)(samaccountname=" & Replace(sSAMAccountName,"'","''") & "));" & sFields & ";subtree"
  Set objRecordset = objCommand.Execute
  If objRecordset.RecordCount = 0 Then
    sReturnValue = "ERROR:Unable to find user (" & sSAMAccountName & ")"
  ElseIf objRecordSet.RecordCount > 1 Then
    sReturnValue = "ERROR:Multiple AD entries (" & objRecordSet.RecordCount & ") for user (" & sSAMAccountName & ")" 
  Else
    sFirstName = objRecordset.Fields("givenname")
    sLastName = objRecordset.Fields("sn")
    sTitle = objRecordset.Fields("title")    
    sAddress = objRecordset.Fields("streetaddress")
    If Instr(1,sAddress,vbCRLF) > 0 Then
    	sAddress = Replace(sAddress,vbCRLF," ")
  	End If
    sState = objRecordset.Fields("st")
    sPostalCode = objRecordset.Fields("postalcode")
    sWorkNumber = objRecordset.Fields("telephonenumber")
    sEmail = objRecordset.Fields("mail")
    sReturnValue = sFirstName & sDelim & sLastName & sDelim & sTitle & sDelim & sEmail & sDelim & sAddress & sDelim & sState & sDelim & sPostalCode & sDelim & sWorkNumber
  End If
  Get_UserInfo = sReturnValue
  
  'Garbage Collection
  Set objRecordSet = Nothing
  Set sErrMsg = Nothing  
End Function
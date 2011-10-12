'*********************************************************************
'* VB Script sample to send Data to BlackBerry applications.
'**********************************************************
'*    Copyright (c) 2010 Research In Motion Limited.      *
'*    All Rights Reserved.                                *
'*    This code is provides *AS IS* without warranty of   *
'*    any kind, either express or implied, including any  *
'*    implied warranties of fitness for a particular      *
'*    purpose, meerchantability, or non-infringement.     *
'*                                                        *
'*    This code is strictly A SAMPLE                      *
'*    By using this code you accept all responsibility.   *
'**********************************************************
'*********************************************************************
Option Explicit              'Ensure all variables are declared
'Declare variables
Dim bExecutionSuccessful     'Boolean value to determine success
Dim objPC                    'Object for Local Machine
Dim objFile                  'Allow open and read of data contents
Dim objShell                 'Object for Script Shell
Dim sApplicationDataFile     'File in proper format to supply data for device application
Dim sApplicationPort         'Port defined in device application to receive data
Dim sBESPort                 'Port available on BES MDS-CS server to receive push
Dim sBESServer               'Server name to connect to
Dim sComputerName            'Value from environment variable
Dim sConfirmationData        'Value to be passed back to web application that receives device delivery confirmation
Dim sConfirmationURL         'URL of web application that receives device delivery confirmations
Dim sCurrentFolder           'Folder where this script is executing
Dim sFailureReason           'Reason why execution did not work
Dim sFileContents            'Resulting contents of data file in format to be pushed to device application
Dim fso                      'File Scripting object
Dim sMDSServerURL            'URL of MDS server using values from variables
Dim sRecipient               'User to receive data push
Dim sSource                  'Location of file with invalid characters removed
Dim WinHttpReq               'Object establish connection to BES MDS-CS server

  Set objShell = CreateObject("WScript.Shell")
  sCurrentFolder = objShell.CurrentDirectory    'Get folder name where script is being executed from

  '********************************************************************
  'Define values to variables that are required for execution
  '********************************************************************

  sApplicationPort = "3333"
  sBESPort = "8080"
  'sBESPort = "28080"
  sApplicationDataFile = sCurrentFolder & "/jsonadminupdateemailsender.txt"

  sFailureReason = ""
  
  'Get environment variable for 

  Set objPC = CreateObject("WSCRIPT.NETWORK")
  sComputerName = objPC.COMPUTERNAME
  sBESServer = sComputerName

  sRecipient = "simulator@pushme.com" 
  
  
  sSource = Replace(sApplicationDataFile," ","~")
  sSource = Replace(sSource,"/","~")
  sSource = Replace(sSource,"\","~")
  sConfirmationData = "%20ConfirmationData:" & "Data" & "," & sSource & "," & sRecipient
    
  'The contents of this next variable depends entirely on how the receiving web application receives an HTTP POST
  sConfirmationURL = "http://" & sComputerName & "/PushConfirmation/PUSHConfirmationHandler.ashx?MyMessage=" & sConfirmationData

  Set fso = CreateObject("Scripting.FileSystemObject")   'Initialize instance for file processing
  
  If fso.FileExists(sApplicationDataFile) = False Then    'Does the source application data file exist?
    sFailureReason = "Unable to locate Application data file"
  Else
    'Get application data in the format required to receive it on the device
    Set objFile = fso.OpenTextFile(sApplicationDataFile, 1)
    sFileContents = objFile.ReadAll
    objFile.Close

    If Mid(sFileContents,1,1) = "{" Then
      sFileContents = Len(sFileContents) & sFileContents
    End If
 
    Set WinHttpReq = WScript.CreateObject("WinHttp.WinHttpRequest.5.1")    'Create object for posting HTTP request
   
    'Build headers        
    sMDSServerURL = "http://" & sBESServer & ":" & sBESPort   'Build URL of BES MDS server with appropriate values
    WinHttpReq.Open "POST", sMDSServerURL & "/push?DESTINATION=" & sRecipient & "&PORT=" & sApplicationPort & "&REQUESTURI=/", False

    'If there is a receiving application, will need to specify this header to ensure delivery to the device
    'WinHttpReq.SetRequestHeader "X-Rim-Push-NotifyURL", sConfirmationURL    'Add header for device delivery confirmation (simply comment out if not required)
    
    WinHttpReq.SetRequestHeader "Content-Type", "text/plain"    'Set content type
    WinHttpReq.Send  sFileContents    'Send request to BES MDS-CS server with data       
        
    Select Case WinHttpReq.Status    'Analyze the status code for the post
      Case 200
        'It worked, nothing to do here  
      Case 400
        sFailureReason = "General error (" & WinHttpReq.StatusText & ")"
      Case 403
        sFailureReason = "Email address '" & sRecipient & "' not found"
      Case 404
        sFailureReason = "Request not received by MDS-CS (" & WinHttpReq.StatusText & ")"
      Case 503
        sFailureReason = "MDS-CS busy"    
      Case Else
        sFailureReason = "Invalid server or port (" & WinHttpReq.StatusText & ")"        
    End Select 
  End If
  
  If sFailureReason <> "" Then    'Did the data push work?
    MsgBox "Unable to push data to BlackBerry device:" & vbCRLF & Space(4) & sFailureReason, vbOKOnly + vbCritical,"DataPush Failure"
  Else
    Msgbox "Data successfully received by MDS server",vbOKOnly, "DataPush Completion"
  End If
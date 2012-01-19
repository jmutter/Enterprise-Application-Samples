/*
* Copyright 2011 Research In Motion Limited.
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
package eclserver.threads;


/**
 * EmergencyNotify pushes Emergency Notification information from database.
 * It retrieves the data in recipients tables and from emergency notify panel.
 * 
 * @auther rbalsewich
 */

import javax.swing.SwingWorker;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.awt.event.ActionEvent;
import java.util.*;
import java.net.*;
import java.io.*;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;

import eclserver.db.objects.RecipientObject;
import eclserver.db.objects.ServerObject;
import eclserver.db.objects.RecListDao;
import eclserver.db.objects.BesListDao;
import eclserver.panels.RecipientsPanel;
import eclserver.panels.EmergencyNotificationPanel;

import java.util.concurrent.ExecutionException;


public class EmergencyNotifyPush extends SwingWorker<String, Void>  {
    
     private static final long serialVersionUID = -1845453591727608149L;
     private static final Random _r = new Random(System.currentTimeMillis());
     private DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
     private  HttpURLConnection conn = null;
     private  InputStream ins = null;
     private OutputStream out = null;
  
   
   private EmergencyNotifyPush() {
      
    }
    
  public EmergencyNotifyPush(BesListDao besListDao, RecListDao recListDao, EmergencyNotificationPanel enPanel,
          RecipientsPanel recPanel,  String strAppPort, String machineName, String confirmURL) {
        this.besListDao = besListDao;
        this.recListDao = recListDao;
        this.enPanel = enPanel;
        this.recPanel = recPanel;
        this.strAppPort = strAppPort;
        this.machineName = machineName;
        this.confirmURL = confirmURL;
  }
    
   
    
    @Override
    //protected String doInBackground() {
    protected String doInBackground() {
        //sometimes the initial delay can be long,
        //so let the user know we're working on it.
        //by giving a little progress    
        String pushId = "";
        Date date = new Date();
        System.out.println(dateFormat.format(date));

            //Get recipients objects from database 
          recipients = recListDao.getListEntries();
          //get Bes List from database;
          besList = besListDao.getListEntries();
        
          enPanel.printToResults("\nRecipients found:" + recipients.size());
          enPanel.printToResults("\nBES list size: " + besList.size());
          
          if ((recipients.size() > 0) && (besList.size() > 0)) {
            if(!this.isCancelled()) {
             
              recipientCheck: for(RecipientObject ro : recipients) {
                try {  
                      HashMap<String, URL> urlList = new HashMap();
                      int responseCode = -99;
                      for(int b=0; b<besList.size(); b++){

                          System.out.println("HERE IS THE DETAILS: " + "\n " + besList.get(b).getServerHost() + "\n " + besList.get(b).getServerPort() +  "\n " + ro.getRecEmail() +  "\n " + strAppPort );

                          URL builtURL = getPushURL(besList.get(b).getServerHost(), besList.get(b).getServerPort(),
                                  ro.getRecEmail(), strAppPort);

                          urlList.put(besList.get(b).getServerHost() + ":" + besList.get(b).getServerPort(), builtURL);
                      }
                                                   
                       pushBES: for(Map.Entry<String, URL> entry : urlList.entrySet()){
                                pushId = "pushID:" + _r.nextInt();
                                
                                String strBESServer = "";
                                
                                if (urlList.containsKey(ro.getUserBes())){
                                   // System.out.println("CONTAINS KEY" );
                                    responseCode  = userCallPush(pushId, urlList.get(new String(ro.getUserBes())));
                                    //enPanel.printToResults("\nExisting USER BES Defined Trying First......... " + ro.getRecEmail() + "   on BES: " + ro.getUserBes() );
                                    strBESServer = ro.getUserBes();
                                
                                } else {
                                    responseCode = userCallPush(pushId, entry.getValue());
                                    strBESServer = entry.getKey();
                                }
                               
                                if(responseCode == 200){
                                   
                                    enPanel.printToResults("\nNotification Sent:    USER: " + ro.getRecEmail() + "    BES: " + strBESServer );
                                    
                                    recListDao.editRecord(new RecipientObject
                                                         (ro.getRecEmail(), strBESServer, dateFormat.format(date) , ro.getId()));
                                    
                                    
                                    
                                    continue recipientCheck;
                               
                                } else {
                                    enPanel.printToResults("\nDidn't match USER: " + ro.getRecEmail() + " on BES: " + strBESServer );
                                    recListDao.editRecord(new RecipientObject
                                                            (ro.getRecEmail(), "ERROR CODE: " + responseCode, (String)dateFormat.format(date) , ro.getId()));
                                }
                              }
                              

                        }catch (Exception ex ){
                            enPanel.printToResults("\nException during BES Validation: " + ex.getMessage());
                        }
                        
                       } //end for loop: recipients
               } //check for canceled thread
       } else {
            enPanel.printToResults("\n\nYou must have at least 1 Recipient and 1 BES entered.");
       }
                   
            return pushId;
    }
    
    
    @Override
    protected void done() {
        // whether we retrieved anything or not
        // we're done, so set the progress indicator accordingly
          
        try {
                
                recipients = recListDao.getListEntries();
                ActionEvent callReload = new ActionEvent(new Object[] { "Reload Recs" }, 1, "RELOAD_RECS" );
                recPanel.actionPerformed(callReload);
                recPanel.setRecipientsListEntries(recipients);
                  
                String recCompleted = (String) get();
                
                System.out.println("\nNotification Push THREAD: " + recCompleted);
                
                enPanel.printToResults("\n\nCompleted Pushing Notification content to Users.");
                
                setProgress(100);
                System.out.println("Thread wrapping up");

        } catch (ExecutionException ex) {
            System.out.println("\nNotifications Push THREAD Thread Execution Exception: " + ex.getMessage());
            ex.printStackTrace();

        } catch (InterruptedException ex) {
            System.out.println("\nNotifications Push THREAD Thread Interrupted Exception: " + ex.getMessage());
            ex.printStackTrace();
        }
        if (recipients.isEmpty()) {
            enPanel.printToResults("\nDidn't retrieve anything from file in DONE() thread.");
        }
        
    }
    
     private URL getPushURL(String host, String port, String email, String aPort) throws MalformedURLException {
        
      return new URL("http", host, Integer.valueOf(port), "/push?DESTINATION=" + email + "&PORT=" + aPort + "&REQUESTURI=/");
                      
    }
     
    private String getJsonString(String machineName, String confirmURL){
        
        JSONObject m1 = new JSONObject();
        m1.clear();
        JSONArray list1 = new JSONArray();
        
        
        try {  
            m1.put("details", enPanel.getNotifyDetails());
            m1.put("acknowledgeurl", confirmURL + "?MyMessage=EmergencyNotificationAcknowledged");
            

            list1.add(m1);
            
          } catch(Exception ex) {
            ex.printStackTrace();
        }
    
        String jsonString = "{\"Source\":[{\"machinename\":\""+ machineName + "\"}],";
        jsonString += "\"Confirmation\":[{\"url\":\"" + confirmURL + "\"}],";
        jsonString += "\"EmergencyCall\":" + list1.toString() + "}";
        
        System.out.println("Call JSON: " + jsonString);
        
        return jsonString;
    
    } 
     
     
     private int userCallPush(String pushId, URL testURL){
         int respCode = 0;
         try {    
             
             pushPayload = getJsonString(machineName, confirmURL);
             
             conn = (HttpURLConnection)testURL.openConnection();
             conn.setDoInput(true);
             conn.setDoOutput(true);
             conn.setRequestMethod("POST");
             conn.setRequestProperty("X-RIM-PUSH-ID", pushId);
             conn.setRequestProperty("X-RIM-Push-Reliability-Mode", "TRANSPORT");

              out = conn.getOutputStream();
              out.write(pushPayload.getBytes());
             
             respCode = conn.getResponseCode();
             
             if (respCode != HttpURLConnection.HTTP_OK) {
                String serverMessage = conn.getResponseMessage();
                enPanel.printToResults(
                    "HTTP-" + respCode + ": " + serverMessage);
            }
     
             System.out.println("Response Code " + conn.getResponseCode());
         
         }catch (MalformedURLException ex){
            System.out.println("Malformed URL Exception in EmergencyNotifyPush: " + ex.getMessage());
            enPanel.printToResults("\nMalformed URL Exception in EmergencyNotifyPush" + ex.getMessage());
         
         } catch (UnknownHostException ex) {
            System.out.println("UnknownHostException Exception in EmergencyNotifyPush: " + ex.getMessage());
             enPanel.printToResults("\nUnknownHostException: " + ex.getMessage() );
       
        } catch (ConnectException ex) {
            // Unable to connect to the MDS
           System.out.println("ConnectException Exception in EmergencyNotifyPush: " + ex.getMessage());
             enPanel.printToResults("\nConnectException: " + ex.getMessage() );
         
         }catch (Exception ex ){
             System.out.println("Exception in EmergencyNotifyPush: " + ex.getMessage());
         } finally {
            if(ins != null) {
                try {
                        ins.close();
                } catch (Exception ex) {
                    System.out.println("Error in EmergencyNotifyPush finally: " + ex.getMessage());

                }
                ins = null;
            }

            if (conn != null) {
                conn.disconnect();
                conn = null;
            }
        }
       
         return respCode;
     }
    
      
    private RecListDao recListDao;
    private BesListDao besListDao;
    private RecipientsPanel recPanel;
    private EmergencyNotificationPanel enPanel;

    private List<ServerObject> besList;
    private  List<RecipientObject> recipients;
   
    private String strAppPort;
    private String pushPayload;
    private String machineName;
    private String confirmURL;

}

/*
 * 
 * 
 * 
 * {{
    "Source": [
        {
            "machinename": "localhost"
        }
    ],
    "Confirmation": [
        {
            "url": "http://CI0000001380643/PushConfirmation/PUSHConfirmationHandler.ashx?MyMessage=EmergencyNotificationQueued"
        }
    ],
    "EmergencyNotification": [
        {
            "details": "just testing.  need to test what this looks like with line returns",
            "acknowledgeurl": "http://CI0000001380643/PushConfirmation/PUSHConfirmationHandler.ashx?MyMessage=EmergencyNotificationAcknowledged"
        }
    ]
}
 */
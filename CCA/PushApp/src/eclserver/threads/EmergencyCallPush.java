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
 * EmergencyCallPush pushes Emergency Call information from database.
 * It retrieves the data in recipients tables and from emergency call panel.
 * 
 * @auther rbalsewich
 */

import javax.swing.SwingWorker;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.concurrent.ExecutionException;
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
import eclserver.panels.EmergencyCallPanel;


public class EmergencyCallPush extends SwingWorker<String, Void> {

   private static final long serialVersionUID = -1845453591727608149L;
   private static final Random _r = new Random(System.currentTimeMillis());
   private DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
   private  HttpURLConnection conn = null;
   private  InputStream ins = null;
   private OutputStream out = null;
    
  private EmergencyCallPush() {}
        
    
    public EmergencyCallPush(BesListDao besListDao, RecListDao recListDao, EmergencyCallPanel ecPanel,
          RecipientsPanel recPanel,  String strAppPort, String machineName, String confirmURL) {
        this.besListDao = besListDao;
        this.recListDao = recListDao;
        this.ecPanel = ecPanel;
        this.recPanel = recPanel;
        this.strAppPort = strAppPort;
        this.machineName = machineName;
        this.confirmURL = confirmURL;
        
    }
    
   
    @Override
    protected String doInBackground() {
        //sometimes the initial delay can be long,
        //so let the user know we're working on it.
        //by giving a little progress    
        String pushId = "";
        Date date = new Date();
        String strBESServer = "";
        int responseCode = -99;
          //Get recipients objects from database 
          recipients = recListDao.getListEntries();
          //get Bes List from database;
          besList = besListDao.getListEntries();
        
          ecPanel.printToResults("\nRecipients found:" + recipients.size());
          ecPanel.printToResults("\nBES list size: " + besList.size());
          
          if ((recipients.size() > 0) && (besList.size() > 0)) {
            if(!this.isCancelled()) {
             
              recipientCheck: for(RecipientObject ro : recipients) {
                
                  try {  
                    
                    if(ro.getMatched().matches("Y")){
                         // ecPanel.printToResults("\n Matched " + ro.getMatched());
                          String[] strMatchedValue = ro.getUserBes().split(":");
                          URL builtURL = getPushURL(strMatchedValue[0], strMatchedValue[1], 
                                                    ro.getRecEmail(), strAppPort);
                           
                          pushId = "pushID:" + _r.nextInt();
                          responseCode  =  userCallPush(pushId, builtURL);
                         
                          if(responseCode == 200){

                                ecPanel.printToResults("\nMATCH:  USER-> " + ro.getRecEmail() + "    BES-> " + ro.getUserBes() );
                                recListDao.editRecord(new RecipientObject
                                                                 (ro.getRecEmail(), ro.getUserBes(), "Y", dateFormat.format(date) , ro.getId()));
                                continue recipientCheck;
                                
                           } else {
                               ecPanel.printToResults("\nUSER NOT FOUND ON PREVIOUS MATCHED BES: " + ro.getRecEmail() + "   on BES: " + strBESServer);
                               recListDao.editRecord(new RecipientObject
                                              (ro.getRecEmail(), "ERROR CODE: " + responseCode, "N", (String)dateFormat.format(date) , ro.getId())); 
                               ro.setMatched("N");
                              
                          }
                    }
                    if(ro.getMatched().matches("N")) {
                          
                          HashMap<String, URL> urlList = new HashMap();
                          responseCode = -99;
                         
                          for(int b=0; b<besList.size(); b++){
                                                            
                          // WE PUSHING TO BROWSER CACHE ONLY FOR TESTING WHETHER BES KNOWS THE PEEP.
                           URL builtURL = getPushURL(besList.get(b).getServerHost(), besList.get(b).getServerPort(),
                                  ro.getRecEmail(), strAppPort);

                           urlList.put(besList.get(b).getServerHost() + ":" + besList.get(b).getServerPort(), builtURL);
                          }
                                        
                    puahBES: for(Map.Entry<String, URL> entry : urlList.entrySet()){
                        pushId = "pushID:" + _r.nextInt();

                         strBESServer = "";
                         responseCode = userCallPush(pushId, entry.getValue());
                         strBESServer = entry.getKey();

                         if(responseCode == 200){

                            ecPanel.printToResults("\nMATCH:    USER: " + ro.getRecEmail() + "    BES: " + strBESServer );
                            recListDao.editRecord(new RecipientObject
                                             (ro.getRecEmail(), strBESServer, "Y", dateFormat.format(date) , ro.getId()));

                        continue recipientCheck;

                         } else {
                             ecPanel.printToResults("\nUSER NOT FOUND " + ro.getRecEmail() + "   on BES: " + strBESServer);
                             recListDao.editRecord(new RecipientObject
                                                (ro.getRecEmail(), "ERROR CODE: " + responseCode, "N", (String)dateFormat.format(date) , ro.getId()));                                        }
                     }//end for loop
                 }

                }catch (Exception ex ){
                    ecPanel.printToResults("\nException during BES Validation: " + ex.getMessage());
                }

               } //end for loop: recipients
       } //check for canceled thread
       } else {
            ecPanel.printToResults("\n\nYou must have at least 1 Recipient and 1 BES entered.");
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
                
                System.out.println("Call Push THREAD: " + recCompleted);
                
                ecPanel.printToResults("\n\nCompleted Pushing Call content to Users.");
                
                setProgress(100);
                System.out.println("Thread wrapping up");

        } catch (ExecutionException ex) {
            System.out.println("\nContacts Push THREAD Thread Execution Exception: " + ex.getMessage());

            
        } catch (InterruptedException ex) {
            System.out.println("\nCall Push THREAD Thread Interrupted Exception: " + ex.getMessage());

        }
        if (recipients.isEmpty()) {
            ecPanel.printToResults("\nDidn't retrieve anything from file in DONE() thread.");
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
            m1.put("milliseconds", ecPanel.getCallDateTime());
            m1.put("phonenumber", ecPanel.getCallBridge());
            m1.put("details", ecPanel.getCallDescription());
            m1.put("accepturl", confirmURL + "?MyMessage=EmergencyCallAccepted");
            m1.put("declineurl", confirmURL + "?MyMessage=EmergencyCallDeclined");

            list1.add(m1);
            
          } catch(Exception ex) {
            System.out.println("EXCEPTION GETTING JSON STRING: " + ex.getMessage());

          }
    
        String jsonString = "{\"Source\":[{\"machinename\":\""+ machineName + "\"}],";
        jsonString += "\"Confirmation\":[{\"url\":\"" + confirmURL + "\"}],";
        jsonString += "\"EmergencyCall\":" + list1.toString() + "}";
        
       // System.out.println("Call JSON STRING: " + jsonString);
        
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
                ecPanel.printToResults(
                    "HTTP-" + respCode + ": " + serverMessage);
            }
     
             System.out.println("Response Code " + conn.getResponseCode());
         
         }catch (MalformedURLException ex){
            System.out.println("Malformed URL Exception in EmergencyCallPush: " + ex.getMessage());
         //   ecPanel.printToResults("\nMalformed URL Exception in EmergencyCallPush" + ex.getMessage());
         
         } catch (UnknownHostException ex) {
            System.out.println("UnknownHostException Exception in EmergencyCallPush: " + ex.getMessage());
          //   ecPanel.printToResults("\nUnknownHostException: " + ex.getMessage() );
       
        } catch (ConnectException ex) {
            // Unable to connect to the MDS
           System.out.println("ConnectException Exception in EmergencyCallPush: " + ex.getMessage());
          //   ecPanel.printToResults("\nConnectException: " + ex.getMessage() );
         
         }catch (Exception ex ){
             System.out.println("Exception in EmergencyCallPush: " + ex.getMessage());
         } finally {
            if(ins != null) {
                try {
                        ins.close();
                } catch (Exception ex) {
                    System.out.println("Error in push finally: " + ex.getMessage());

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
    private EmergencyCallPanel ecPanel;

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
 * {
    "Source": [
        {
            "machinename": "localhost"
        }
    ],
    "Confirmation": [
        {
            "url": "http://CI0000001380643/PushConfirmation/PUSHConfirmationHandler.ashx?MyMessage=EmergencyCallQueued"
        }
    ],
    "EmergencyCall": [
        {
            "milliseconds": "1318443259500",
            "phonenumber": "866-834-4161 x123456",
            "details": "<p>just testing.</p><p>need to test what this looks like with line returns and how to handle them in the payload but build them properly for the display</p>",
            "accepturl": "http://CI0000001380643/PushConfirmation/PUSHConfirmationHandler.ashx?MyMessage=EmergencyCallAccepted",
            "declineurl": "http://CI0000001380643/PushConfirmation/PUSHConfirmationHandler.ashx?MyMessage=EmergencyCallDeclined"
        }
    ]
}
 * 
 */
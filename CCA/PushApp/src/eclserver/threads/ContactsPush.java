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

import javax.swing.SwingWorker;

import javax.swing.JTextArea;
import java.awt.event.ActionEvent;

import eclserver.db.objects.ServerObject;
import eclserver.db.objects.ContactsDao;
import eclserver.db.objects.RecListDao;
import eclserver.db.objects.BesListDao;
import eclserver.db.objects.RecipientObject;
import eclserver.panels.RecipientsPanel;
import java.util.concurrent.ExecutionException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

import java.util.*;
import java.net.*;
import java.io.*;
/**
 *
 * @author rbalsewich
 */
public class ContactsPush  extends SwingWorker<String, Void> {
    
   private static final long serialVersionUID = -1845453591727608149L;
   private static final Random _r = new Random(System.currentTimeMillis());
   private DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
   private  HttpURLConnection conn = null;
   private  InputStream ins = null;
   private OutputStream out = null;
    
   private ContactsPush() {}
        
    
    public ContactsPush(BesListDao besListDao, ContactsDao contactsDao, RecListDao recListDao, 
           RecipientsPanel recPanel, JTextArea contactsResultsArea, String strAppPort, String machineName, String confirmURL) {
        this.besListDao = besListDao;
        this.contactsResultsArea = contactsResultsArea;
        this.contactsDao = contactsDao;
        this.recListDao = recListDao;
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
      contactsResultsArea.append("Thread Started: " + dateFormat.format(date));
      String strBESServer = "";
      int responseCode = -99;

      //Get recipients objects from database 
      recipients = recListDao.getListEntries();
      //get Bes List from database;
      besList = besListDao.getListEntries();

      contactsResultsArea.append("\nRecipients found:" + recipients.size());
      contactsResultsArea.append("\nBES list size: " + besList.size());

       if ((recipients.size() > 0) && (besList.size() > 0)) {
          if(!this.isCancelled()) {
      
              recipientCheck: for(RecipientObject ro : recipients) {
                         
                        try {

                          if(ro.getMatched().matches("Y")){
                            //  contactsResultsArea.append("\n Matched " + ro.getMatched());
                              String[] strMatchedValue = ro.getUserBes().split(":");
                              URL builtURL = getPushURL(strMatchedValue[0], strMatchedValue[1], 
                                                        ro.getRecEmail(), strAppPort);

                              pushId = "pushID:" + _r.nextInt();
                              responseCode  =  userPush(pushId, builtURL);
                         
                              if(responseCode == 200){

                                contactsResultsArea.append("\nMATCH:  USER-> " + ro.getRecEmail() + "    BES-> " + ro.getUserBes() );
                                recListDao.editRecord(new RecipientObject
                                                                 (ro.getRecEmail(), ro.getUserBes(), "Y", dateFormat.format(date) , ro.getId()));
                                continue recipientCheck;
                                
                           } else {
                               contactsResultsArea.append("\nUSER NOT FOUND ON PREVIOUS MATCHED BES: " + ro.getRecEmail() + "   on BES: " + strBESServer);
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
                         responseCode = userPush(pushId, entry.getValue());
                         strBESServer = entry.getKey();

                         if(responseCode == 200){

                            contactsResultsArea.append("\nMATCH:    USER: " + ro.getRecEmail() + "    BES: " + strBESServer );
                            recListDao.editRecord(new RecipientObject
                                             (ro.getRecEmail(), strBESServer, "Y", dateFormat.format(date) , ro.getId()));

                        continue recipientCheck;

                         } else {
                             contactsResultsArea.append("\nUSER NOT FOUND " + ro.getRecEmail() + "   on BES: " + strBESServer);
                             recListDao.editRecord(new RecipientObject
                                                (ro.getRecEmail(), "ERROR CODE: " + responseCode, "N", (String)dateFormat.format(date) , ro.getId()));                                        }
                        }//end for loop
                      }

                }catch (Exception ex ){
                    contactsResultsArea.append("\nException during BES Validation: " + ex.getMessage());
                }
               } //end for loop: recipients
             } //check for canceled thread
       } else {
            contactsResultsArea.append("\n\nYou must have at least 1 Recipient and 1 BES entered.");
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
                
                System.out.println("Contacts Push THREAD: " + recCompleted);
                
                contactsResultsArea.append("\nCompleted Pushing Content to Users.");
                
                setProgress(100);
                System.out.println("Thread wrapping up");

        } catch (ExecutionException ex) {
            System.out.println("\nContacts Push THREAD Thread Execution Exception: " + ex.getMessage());

        } catch (InterruptedException ex) {
            System.out.println("\nContacts Push THREAD Thread Interrupted Exception: " + ex.getMessage());
        }
        if (recipients.isEmpty()) {
            contactsResultsArea.append("\nDidn't retrieve anything from file in DONE() thread.");
        }
        
    }
    
     private URL getPushURL(String host, String port, String email, String aPort) throws MalformedURLException {
        
      return new URL("http", host, Integer.valueOf(port), "/push?DESTINATION=" + email + "&PORT=" + aPort + "&REQUESTURI=/");
                      
    }
     
     private int userPush(String pushId, URL testURL){
         int respCode = 0;
         try {    
             
             pushPayload = contactsDao.getJSONString(machineName, confirmURL);
             
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
                contactsResultsArea.append(
                    "HTTP-" + respCode + ": " + serverMessage);
            }
     
             System.out.println("Response Code " + conn.getResponseCode());
         
         }catch (MalformedURLException ex){
            System.out.println("Malformed URL Exception in ContactsPush: " + ex.getMessage());
        //    contactsResultsArea.append("\nMalformed URL Exception in ContactsPush" + ex.getMessage());
         
         } catch (UnknownHostException ex) {
            System.out.println("UnknownHostException Exception in ContactsPush: " + ex.getMessage());
        //     contactsResultsArea.append("\nUnknownHostException: " + ex.getMessage() );
       
        } catch (ConnectException ex) {
            // Unable to connect to the MDS
           System.out.println("ConnectException Exception in ContactsPush: " + ex.getMessage());
         //    contactsResultsArea.append("\nConnectException: " + ex.getMessage() );
         
         }catch (Exception ex ){
             System.out.println("Exception in ContactsPush: " + ex.getMessage());
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
    private ContactsDao contactsDao;

    private RecipientsPanel recPanel;
    private String strAppPort;
    private JTextArea contactsResultsArea;
    
    private List<ServerObject> besList;
    private  List<RecipientObject> recipients;

    private String pushPayload;
    private String machineName;
    private String confirmURL;

}



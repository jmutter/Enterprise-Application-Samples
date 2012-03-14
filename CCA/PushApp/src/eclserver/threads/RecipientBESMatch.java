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
 *
 * @author rbalsewich
 */


import javax.swing.SwingWorker;
import java.awt.event.ActionEvent;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ConnectException;
import java.net.UnknownHostException;
import java.net.URL;
import java.util.Random;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

import eclserver.db.objects.RecipientObject;
import eclserver.db.objects.RecListDao;
import eclserver.db.objects.BesListDao;
import eclserver.db.objects.ServerObject;
import eclserver.panels.RecipientsPanel;


public class RecipientBESMatch extends SwingWorker<String, Void> {
    
   private static final long serialVersionUID = -1845453591727608149L;
   private static final Random _r = new Random(System.currentTimeMillis());
   private DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
   private  HttpURLConnection conn = null;
   private  InputStream ins = null;
    
    public RecipientBESMatch(RecipientsPanel recPanel, RecListDao recListDao, BesListDao besListDao, String strAppPort){
        this.recPanel = recPanel;
        this.recListDao = recListDao;
        this.besListDao = besListDao;
        this.strAppPort = strAppPort;
    }
   
    
    
   @Override
    //protected String doInBackground() {
    protected String doInBackground() {
        //sometimes the initial delay can be long,
        //so let the user know we're working on it.
        //by giving a little progress  
      
      String pushId = "";
      Date date = new Date();
//      System.out.println(dateFormat.format(date));
      String strBESServer = "";
      int responseCode = -99;
      //Get recipients objects from database 
      recipients = recListDao.getListEntries();
      //get Bes List from database;
      besList = besListDao.getListEntries();

      recPanel.printToResults("Recipients found:" + recipients.size());
      recPanel.printToResults("BES list size: " + besList.size());

       if ((recipients.size() > 0) && (besList.size() > 0)) {
          if(!this.isCancelled()) {
      
              recipientCheck: for(RecipientObject ro : recipients) {
                                            
                  try {
               //       recPanel.printToResults("details:  matched: " + ro.getMatched() +
               //               " email " + ro.getRecEmail() + " userBES: " + ro.getUserBes() );
                      if(ro.getMatched().matches("Y")){
                          recPanel.printToResults(" Matched " + ro.getMatched());
                          String[] strMatchedValue = ro.getUserBes().split(":");
                          URL builtURL = getPushURL(strMatchedValue[0], strMatchedValue[1],
                                   ro.getRecEmail(), "7874");
                           
                          pushId = "pushID:" + _r.nextInt();
                          responseCode  = userBesCheck(pushId, builtURL);
                         
                          if(responseCode == 200){

                                recPanel.printToResults("MATCH:  USER-> " + ro.getRecEmail() + "    BES-> " + ro.getUserBes() );
                                recListDao.editRecord(new RecipientObject
                                                                 (ro.getRecEmail(), ro.getUserBes(), "Y", dateFormat.format(date) , ro.getId()));
                                continue recipientCheck;
                                
                           } else {
                               recPanel.printToResults("USER NOT FOUND ON PREVIOUS MATCHED BES: " + ro.getRecEmail() + "   on BES: " + strBESServer);
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
                                   ro.getRecEmail(), "7874");
                           urlList.put(besList.get(b).getServerHost() + ":" + besList.get(b).getServerPort(), builtURL);
                          }
                                        
                    validateBES: for(Map.Entry<String, URL> entry : urlList.entrySet()){
                        pushId = "pushID:" + _r.nextInt();

                         strBESServer = "";
                         responseCode = userBesCheck(pushId, entry.getValue());
                         strBESServer = entry.getKey();

                         if(responseCode == 200){

                            recPanel.printToResults("MATCH:    USER: " + ro.getRecEmail() + "    BES: " + strBESServer );
                            recListDao.editRecord(new RecipientObject
                                             (ro.getRecEmail(), strBESServer, "Y", dateFormat.format(date) , ro.getId()));

                        continue recipientCheck;

                         } else {
                             recPanel.printToResults("USER NOT FOUND " + ro.getRecEmail() + "   on BES: " + strBESServer);
                             recListDao.editRecord(new RecipientObject
                                                (ro.getRecEmail(), "ERROR CODE: " + responseCode, "N", (String)dateFormat.format(date) , ro.getId()));                                        }
                     }//end for loop
                 }
                      
                  
                }catch (MalformedURLException mue){
                    recPanel.printToResults("Malformed Exception during BES Validation: " + mue.getMessage());

                }catch (Exception ex ){
                     recPanel.printToResults("Exception during BES Validation: "  + ex.getMessage());
                }

               } //end for loop: recipients
       } //check for canceled thread
       } else {
            recPanel.printToResults("You must have at least 1 Recipient and 1 BES entered.");
       }
                   
            return pushId;
    }
    
    
    @Override
    protected void done() {
        // whether we retrieved anything or not
        // we're done, so set the progress indicator accordingly
            setProgress(100);
            System.out.println("Thread wrapping up");
            
            try {
                
               
                  
                String recCompleted = (String) get();
                
                System.out.println("BES MATCH THREAD: " + recCompleted);
                
                 recipients = recListDao.getListEntries();
                ActionEvent callReload = new ActionEvent(new Object[] { "Reload Recs" }, 1, "RELOAD_RECS" );
                recPanel.actionPerformed(callReload);
                recPanel.setRecipientsListEntries(recipients);
                
                recPanel.printToResults("\nCompleted Verifying USER BES.  Check the list above for any exceptions. "
                        + "You should correct those before performing any sort of push");

        } catch (ExecutionException ex) {
            System.out.println("RecipientsBESMatch Thread Execution Exception: " + ex.getMessage());

        } catch (InterruptedException ex) {
            System.out.println("RecipientsBESMatch Thread Interrupted Exception: " + ex.getMessage());
        }
        if (recipients.isEmpty()) {
            recPanel.printToResults("Didn't retrieve anything from file in DONE() thread.");
        }
        
    }
    
     private URL getPushURL(String host, String port, String email, String aPort) throws MalformedURLException {
        
      return new URL("http", host, Integer.valueOf(port), "/push?DESTINATION=" + email + "&PORT=" + aPort + "&REQUESTURI=/");
     // http://besserver:8080/push?DESTINATION=rbalsewich@rim.com&PORT=1234&REQUESTUI="           
    }
     
     private int userBesCheck(String pushId, URL testURL){
         int respCode = 0;
         try {    
             conn = (HttpURLConnection)testURL.openConnection();
             conn.setDoInput(true);
             conn.setDoOutput(true);
             conn.setRequestMethod("POST");
             conn.setRequestProperty("X-RIM-PUSH-ID", pushId);
             conn.setRequestProperty("X-RIM-Push-Reliability-Mode", "TRANSPORT");
             conn.setRequestProperty("X-RIM-Push-Type", "browser-content");

         System.out.println("Response Code " + conn.getResponseCode());
         respCode = conn.getResponseCode();
         
         }catch (MalformedURLException ex){
            System.out.println("Malformed URL Exception in BesMatch: " + ex.getMessage());
        //    recPanel.printToResults("\nMalformed URL Exception in BesMatch" + ex.getMessage());
         
         } catch (UnknownHostException ex) {
            System.out.println("UnknownHostException Exception in BesMatch: " + ex.getMessage());
         //    recPanel.printToResults("\nUnknownHostException: " + ex.getMessage() );
       
        } catch (ConnectException ex) {
            // Unable to connect to the MDS
           System.out.println("ConnectException Exception in BesMatch: " + ex.getMessage());
             //recPanel.printToResults("\nConnectException: " + ex.getMessage() );
         
         }catch (Exception ex ){
             System.out.println("Exception in BES Match: " + ex.getMessage());
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
    private String strAppPort;
    private RecipientsPanel recPanel;

    private List<ServerObject> besList;
    private  List<RecipientObject> recipients;



}
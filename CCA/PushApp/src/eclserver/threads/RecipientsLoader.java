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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.io.File;
import java.io.IOException;
import java.io.StringReader;

import java.util.Scanner;

import eclserver.db.objects.RecipientObject;
import eclserver.db.objects.RecListDao;
import eclserver.panels.RecipientsPanel;
import java.util.concurrent.ExecutionException;

import au.com.bytecode.opencsv.bean.CsvToBean;
import au.com.bytecode.opencsv.bean.HeaderColumnNameTranslateMappingStrategy;


public class RecipientsLoader extends SwingWorker<List<RecipientObject>, Void> { 
       
    private RecipientsLoader() {}
        
    public RecipientsLoader(RecListDao recListDao, RecipientsPanel recipientsPanel, File source){
        this.recListDao = recListDao;
        this.recipientsPanel = recipientsPanel;
        this.source = source;
    }
   
    
    
   @Override
    protected List<RecipientObject> doInBackground() {
        //sometimes the initial delay can be long,
        //so let the user know we're working on it.
        //by giving a little progress    
            CsvToBean<RecipientObject> bean = new CsvToBean<RecipientObject>();
        
            Map<String, String> columnMapping = new HashMap<String, String>();
            //mapping is (CSV Header, Bean element)
             columnMapping.put("email", "recEmail");
 
             try {  
                 StringBuilder fileContents = new StringBuilder((int)source.length());
                 Scanner scanner = new Scanner(source);
                 String lineSeparator = System.getProperty("line.separator");

                while(scanner.hasNextLine()){

                    fileContents.append(scanner.nextLine() + lineSeparator);
                 }

                 csvString = fileContents.toString();

                 HeaderColumnNameTranslateMappingStrategy<RecipientObject> strategy = 
                    new HeaderColumnNameTranslateMappingStrategy<RecipientObject>();
                strategy.setType(RecipientObject.class);
                strategy.setColumnMapping(columnMapping);

               //Parse the CSV
               recipients = bean.parse(strategy, new StringReader(csvString));
               System.out.println("rec.szie:" + recipients.size());
               if (recipients.size() > 0) {
                    for(RecipientObject ro : recipients) {
                        if(!this.isCancelled()) {
                            
                            ro.setMatched("N");
                            ro.setUserBes("none");
                            ro.setSyncDate("none");
                            int id = recListDao.saveRecord(ro);
                            RecipientObject recObj = new RecipientObject(ro.getRecEmail(),
                                         ro.getUserBes(), "N", "none", id);
                            recipientsPanel.addRecipientsListEntry(recObj);
                            recipientsPanel.printToResults("Adding Recipient Email: " + ro.getRecEmail());
                        }
                    }
             }else {
                System.out.println("Could not create recipient objects. Check CSV to ensure 1 column with heading:  email");
             }
        } catch (IOException ex) {
         System.out.println("RecipientsLoader IOException:  " + ex.getMessage());
        } catch (Exception e) {
        System.out.println("Major failure in RecipientsLoader Thread. " + e.getMessage());
        

    } 
        return recipients;
    }
    
    
    @Override
    protected void done() {
        // whether we retrieved anything or not
        // we're done, so set the progress indicator accordingly
            setProgress(100);
            System.out.println("Thread wrapping up");
            recipientsPanel.printToResults("\nCompleted Loading Recipients Details.");

              List<RecipientObject> recipients = null;

              try {
                recipients = (List<RecipientObject>) get();
                
                recipientsPanel.validateRecipients();

        } catch (ExecutionException ex) {
            System.out.println("RecipientsLoader Thread Execution Exception: " + ex.getMessage());
            ex.printStackTrace();
        } catch (InterruptedException ex) {
            System.out.println("RecipientsLoader Thread Interrupted Exception: " + ex.getMessage());
            //ex.printStackTrace();
        }
        if (recipients.isEmpty()) {
            recipientsPanel.printToResults("Didn't retrieve anything from file in DONE() thread.");
        }
        
    }
    

    private RecListDao recListDao;
    private RecipientsPanel recipientsPanel;
    private File source;
    private String csvString;
    private  List<RecipientObject> recipients;

}
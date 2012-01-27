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
 * ContactsLoader loads the CSV file of contact details.
 * It stores the data in the Contacts database.
 * 
 * @auther rbalsewich
 */
import javax.swing.SwingWorker;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.JTextArea;
import java.io.File;
import java.io.IOException;
import java.io.StringReader;

import java.util.Scanner;

import eclserver.db.objects.AddressObject;
import eclserver.db.objects.ContactsDao;
import eclserver.panels.ContactsPanel;

import java.util.concurrent.ExecutionException;

import au.com.bytecode.opencsv.bean.CsvToBean;
import au.com.bytecode.opencsv.bean.HeaderColumnNameTranslateMappingStrategy;



  public class ContactsLoader extends SwingWorker<List<AddressObject>, Void> {     
    
      private ContactsLoader() {}
        
    
    public ContactsLoader(ContactsDao addressDao, ContactsPanel contactsPanel, JTextArea resultsBox, String group, File source) {
        this.resultsBox = resultsBox;
        this.groupName = group;
        this.source = source;
        this.addressDao = addressDao;
        this.contactsPanel = contactsPanel;
    }
    
   
    
    @Override
    protected List<AddressObject> doInBackground() {
        //sometimes the initial delay can be long,
        //so let the user know we're working on it.
        //by giving a little progress    
            CsvToBean<AddressObject> bean = new CsvToBean<AddressObject>();
        
            Map<String, String> columnMapping = new HashMap<String, String>();
            //mapping is (CSV Header, Bean element)
             columnMapping.put(groupName, "groupName");
             columnMapping.put("LastName", "lastName");
             columnMapping.put("FirstName", "firstName");
             columnMapping.put("email", "email");
             columnMapping.put("homephone", "homePhone");
             columnMapping.put("workphone", "workPhone");
             columnMapping.put("cellphone", "mobilePhone");
             columnMapping.put("pin", "pin");
             columnMapping.put("address1", "address1");
             columnMapping.put("address2", "address2");
             columnMapping.put("city", "city");
             columnMapping.put("state", "state");
             columnMapping.put("zip", "zip");
             columnMapping.put("country", "country");
             columnMapping.put("Title", "title");
             columnMapping.put("Company", "company");        


             try {  
                 StringBuilder fileContents = new StringBuilder((int)source.length());
                 Scanner scanner = new Scanner(source);
                 String lineSeparator = System.getProperty("line.separator");

                while(scanner.hasNextLine()){

                    fileContents.append(scanner.nextLine() + lineSeparator);
                 }

                 csvString = fileContents.toString();

                 HeaderColumnNameTranslateMappingStrategy<AddressObject> strategy = 
                    new HeaderColumnNameTranslateMappingStrategy<AddressObject>();
                strategy.setType(AddressObject.class);
                strategy.setColumnMapping(columnMapping);

               //Parse the CSV
               contacts = bean.parse(strategy, new StringReader(csvString));
                    
                    for(AddressObject ao : contacts) {
                        if(!this.isCancelled()) {
                            ao.setGroupName(groupName);
                            System.out.println("object id = " + ao.getId() + " stuff= " + ao.getAddressListObject());
                            int id = addressDao.saveRecord(ao);
                            AddressObject adObj = new AddressObject(ao.getGroupName(),
                                         ao.getLastName(), ao.getFirstName(), ao.getEmail(),
                                         ao.getHomePhone(), ao.getWorkPhone(), ao.getMobilePhone(),
                                         ao.getPin(), ao.getAddress1(), ao.getAddress2(), 
                                         ao.getCity(), ao.getState(), ao.getZip(),
                                         ao.getCountry(), ao.getTitle(), ao.getCompany(), id);
                            contactsPanel.addContactsListEntry(adObj);
                        }
                    }
                    
                } catch (IOException ex) {
                 System.out.println("ContactsLoader IOException:  " + ex.getMessage());
                } catch (Exception e) {
                System.out.println("Major failure in ContactsLoader Thread. " + e.getMessage());

            } 
        

            return contacts;
    }
    
    
    @Override
    protected void done() {
        // whether we retrieved anything or not
        // we're done, so set the progress indicator accordingly
            setProgress(100);
            System.out.println("Thread wrapping up");
            resultsBox.append("\nCompleted Loading Contacts Details.  You can review"
                    + " the results on the Contacts Editor page.  Remember you can make "
                    + " modifications to individual records as well as create new records.");

              List<AddressObject> contacts = null;

              try {
                contacts = (List<AddressObject>) get();

        } catch (ExecutionException ex) {
            System.out.println("ContactsLoader Thread Execution Exception: " + ex.getMessage());
            ex.printStackTrace();
        } catch (InterruptedException ex) {
            System.out.println("ContactsLoader Thread Interrupted Exception: " + ex.getMessage());
            //ex.printStackTrace();
        }
        if (contacts.size() == 0) {
            resultsBox.append("Didn't retrieve anything from file in DONE() thread.");
        }
        
    }
    
    private ContactsPanel contactsPanel;
    private ContactsDao addressDao;
    private  List<AddressObject> contacts;
    private JTextArea resultsBox;
    private String groupName;
    private String csvString;
    private File source;


}

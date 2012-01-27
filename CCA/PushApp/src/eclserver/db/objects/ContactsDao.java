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
package eclserver.db.objects;

/**
 *
 * @author rbalsewich
 */
import java.sql.Statement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

import org.json.simple.JSONValue;
import org.json.simple.JSONObject;
import org.json.simple.JSONArray;


/**
 *
 * @author rbalsewich
 */
public class ContactsDao {
    
    /** Creates a new instance of ContactsDao */
    public ContactsDao(Connection connection) {
        this(connection, "ContactsRecords");
    }
    
    public ContactsDao(Connection connection, String addressListName){
       this.objectName = addressListName;
       
     try {
        System.out.println("Received connection from factory... building Addresses List. \n");
        dbConnection = connection;
        stmtGetListEntries = dbConnection.prepareStatement(strGetListEntries);
        stmtSaveNewRecord = dbConnection.prepareStatement(strSaveAddress, Statement.RETURN_GENERATED_KEYS);
        stmtUpdateExistingRecord = dbConnection.prepareStatement(strUpdateAddress);
        stmtGetAddress = dbConnection.prepareStatement(strGetAddress);
        stmtDeleteAddress = dbConnection.prepareStatement(strDeleteAddress);
        stmtNukeAddresses = dbConnection.prepareStatement(strNukeAddresses);
  
     } catch (SQLException ex){
         System.out.println("Exception creating AddressDAO:  " + ex.getSQLState() + ex.getMessage());
     } 
    }
    
       
    
    public int saveRecord(AddressObject record) {
        System.out.println("Saving record: " + record.getLastName() + "," + record.getFirstName());
        int id = -1;
        try {
            stmtSaveNewRecord.clearParameters();
            stmtSaveNewRecord.setString(1, record.getGroupName());
            stmtSaveNewRecord.setString(2, record.getLastName());
            stmtSaveNewRecord.setString(3, record.getFirstName());
            stmtSaveNewRecord.setString(4, record.getEmail());
            stmtSaveNewRecord.setString(5, record.getHomePhone());
            stmtSaveNewRecord.setString(6, record.getWorkPhone());
            stmtSaveNewRecord.setString(7, record.getMobilePhone());
            stmtSaveNewRecord.setString(8, record.getPin());
            stmtSaveNewRecord.setString(9, record.getAddress1());
            stmtSaveNewRecord.setString(10, record.getAddress2());
            stmtSaveNewRecord.setString(11, record.getCity());
            stmtSaveNewRecord.setString(12, record.getState());
            stmtSaveNewRecord.setString(13, record.getZip());
            stmtSaveNewRecord.setString(14, record.getCountry());
            stmtSaveNewRecord.setString(15, record.getTitle());
            stmtSaveNewRecord.setString(16, record.getCompany());
            int rowCount = stmtSaveNewRecord.executeUpdate();
            ResultSet results = stmtSaveNewRecord.getGeneratedKeys();
            if (results.next()) {
                id = results.getInt(1);
            }
            
        } catch(SQLException sqle) {
            System.out.println("AddressDAO Exception in Save Record: " + sqle.getMessage());
        }
        return id;
    }
    
    public boolean editRecord(AddressObject record) {
        boolean bEdited = false;
        try {
            stmtUpdateExistingRecord.clearParameters();
            
            stmtUpdateExistingRecord.setString(1, record.getGroupName());
            stmtUpdateExistingRecord.setString(2, record.getLastName());
            stmtUpdateExistingRecord.setString(3, record.getFirstName());
            stmtUpdateExistingRecord.setString(4, record.getEmail());
            stmtUpdateExistingRecord.setString(5, record.getHomePhone());
            stmtUpdateExistingRecord.setString(6, record.getWorkPhone());
            stmtUpdateExistingRecord.setString(7, record.getMobilePhone());
            stmtUpdateExistingRecord.setString(8, record.getPin());
            stmtUpdateExistingRecord.setString(9, record.getAddress1());
            stmtUpdateExistingRecord.setString(10, record.getAddress2());
            stmtUpdateExistingRecord.setString(11, record.getCity());
            stmtUpdateExistingRecord.setString(12, record.getState());
            stmtUpdateExistingRecord.setString(13, record.getZip());
            stmtUpdateExistingRecord.setString(14, record.getCountry());
            stmtUpdateExistingRecord.setString(15, record.getTitle());
            stmtUpdateExistingRecord.setString(16, record.getCompany());
            stmtUpdateExistingRecord.setInt(17, record.getId());
            
            stmtUpdateExistingRecord.executeUpdate();
            bEdited = true;
        } catch(SQLException sqle) {
            System.out.println("AddressDao Exception Update Record:" + sqle.getMessage());
         }
        return bEdited;
        
    }
    
    public boolean deleteRecord(int id) {
        boolean bDeleted = false;
        try {
            stmtDeleteAddress.clearParameters();
            stmtDeleteAddress.setInt(1, id);
            stmtDeleteAddress.executeUpdate();
            bDeleted = true;
        } catch (SQLException sqle) {
            System.out.println("SQLEXCEPTION in ContactsDao.deleteRecord " + sqle.getMessage());
        }
        
        return bDeleted;
    }
    
    public boolean nukeRecords(){
        boolean bDeleted = false;
        try {
            stmtNukeAddresses.executeUpdate();
            bDeleted = true;
        }catch (SQLException sqle){
            System.out.println("Error nuking addresses: " + sqle.getMessage());
            
        }
        return bDeleted;
    }
    
    public boolean deleteRecord(AddressObject record) {
        int id = record.getId();
        return deleteRecord(id);
    }
    
    public List<AddressObject> getListEntries() {
        List<AddressObject> listEntries = new ArrayList<AddressObject>();
        Statement queryStatement = null;
        ResultSet results = null;
        
        try {
            queryStatement = dbConnection.createStatement();
            results = queryStatement.executeQuery(strGetListEntries);
            while(results.next()) {
                int id = results.getInt(1);
                String gName = results.getString(2);
                String lName = results.getString(3);
                String fName = results.getString(4);
                String email = results.getString(5);
                String hPhone = results.getString(6);
                String wPhone = results.getString(7);
                String mPhone = results.getString(8);
                String dPin = results.getString(9);
                String a1 = results.getString(10);
                String a2 = results.getString(11);
                String city = results.getString(12);
                String state = results.getString(13);
                String zip = results.getString(14);
                String country = results.getString(15);
                String title = results.getString(16);
                String company = results.getString(17);
                
                AddressObject entry = new AddressObject(gName, lName, fName, email,
                                      hPhone, wPhone, mPhone, dPin, a1, a2, city, state,
                                       zip, country, title, company, id);
                listEntries.add(entry);
            }
            
        } catch (SQLException sqle) {
            System.out.println("Error getting List entires: " + sqle.getMessage());
           
            
        }
        
        return listEntries;
    }
    
    public AddressObject getAddress(int index) {
        AddressObject address = null;
        try {
            stmtGetAddress.clearParameters();
            stmtGetAddress.setInt(1, index);
            ResultSet result = stmtGetAddress.executeQuery();
            if (result.next()) {
                int id = result.getInt("ID");
                String groupName = result.getString("GROUPNAME");
                String lastName = result.getString("LASTNAME");
                String firstName = result.getString("FIRSTNAME");
                String email = result.getString("EMAIL");
                String homePhone = result.getString("HOMEPHONE");
                String workPhone = result.getString("WORKPHONE");
                 String mobilePhone = result.getString("MOBILEPHONE");
                 String pin = result.getString("DEVICEPIN");
                String add1 = result.getString("ADDRESS1");
                String add2 = result.getString("ADDRESS2");
                String city = result.getString("CITY");
                String state = result.getString("STATE");
                String zip = result.getString("ZIP");
                String country = result.getString("COUNTRY");
                String title = result.getString("TITLE");
                String company = result.getString("COMPANY");
                address = new AddressObject(groupName,lastName, firstName, email, 
                        homePhone, workPhone, mobilePhone, pin, add1, add2, city, state, zip,
                        country, title, company, id);
            }
        } catch(SQLException sqle) {
            System.out.println("SQLEXCEPTION in ContactsDao.getAddress " + sqle.getMessage());
        }
        
        return address;
    }
    
    public String getJSONString(String machineName, String confirmURL){
        

        JSONObject m1 = new JSONObject();
        m1.clear();
        JSONArray list1 = new JSONArray();
        int rW = 0;
        try {            
            stmtGetListEntries.clearParameters();
            ResultSet result = stmtGetListEntries.executeQuery();
            while (result.next()) {
                m1.put("GROUPNAME", result.getString("GROUPNAME"));
                m1.put("FIRSTNAME", result.getString("FIRSTNAME"));
                m1.put("LASTNAME", result.getString("LASTNAME"));
                m1.put("TITLE", result.getString("TITLE"));
                m1.put("COMPANY", result.getString("COMPANY"));
                m1.put("HOMEPHONE", result.getString("HOMEPHONE"));
                m1.put("WORKPHONE", result.getString("WORKPHONE"));
                m1.put("MOBILEPHONE", result.getString("MOBILEPHONE"));
                m1.put("PIN", result.getString("DEVICEPIN"));
                m1.put("ADDRESS1", result.getString("ADDRESS1"));
                m1.put("ADDRESS2", result.getString("ADDRESS2"));
                m1.put("CITY", result.getString("CITY"));
                m1.put("STATE", result.getString("STATE"));
                m1.put("ZIPCODE", result.getString("ZIP"));
                m1.put("COUNTRY", result.getString("COUNTRY"));
                
            //    System.out.println("database record " + rW);
                ++rW;
                
                list1.add(m1);       
            }
        } catch(SQLException sqle) {
            System.out.println("SQLEXCEPTION in ContactsDao.getJSONString " + sqle.getMessage());
        }
        System.out.println("objects in list1: " + list1.size() );
        
       // {"Source": [ {"machinename":"localhost" }],
       //  "Confirmation": [ {"url":"http://CI0000001380643/PushConfirmation/PUSHConfirmationHandler.ashx?MyMessage=ContactsAdded"}],
        
        String jsonString = "{\"Source\":[{\"machinename\":\""+ machineName + "\"}],";
        jsonString += "\"Confirmation\":[{\"url\":\"" + confirmURL + "\"}],";
        jsonString += "\"Contacts\":" + list1.toString() + "}";
        
        return jsonString;
    }
    
    
    private String objectName;
    private Connection dbConnection;
    private PreparedStatement stmtSaveNewRecord;
    private PreparedStatement stmtUpdateExistingRecord;
    private PreparedStatement stmtGetListEntries;
    private PreparedStatement stmtGetAddress;
    private PreparedStatement stmtDeleteAddress;
    private PreparedStatement stmtNukeAddresses;
    
       
    private static final String strGetAddress =
            "SELECT * FROM SAMPLE.CSV_PUSHCONTACTS " +
            "WHERE ID = ?";
    
    private static final String strSaveAddress =
        "INSERT INTO SAMPLE.CSV_PUSHCONTACTS " +
        "   (GROUPNAME, LASTNAME, FIRSTNAME, EMAIL, HOMEPHONE, WORKPHONE, " +
        "    MOBILEPHONE,  DEVICEPIN, ADDRESS1, ADDRESS2, CITY, STATE, ZIP, " +
        "     COUNTRY, TITLE, COMPANY) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    
    private static final String strGetListEntries =
            "SELECT ID, GROUPNAME, LASTNAME, FIRSTNAME, EMAIL, HOMEPHONE, " +
            " WORKPHONE, MOBILEPHONE, DEVICEPIN, ADDRESS1, ADDRESS2, CITY, STATE, " +
            " ZIP, COUNTRY, TITLE, COMPANY " +
            " FROM SAMPLE.CSV_PUSHCONTACTS "  +
            " ORDER BY LASTNAME ASC";
    
    private static final String strUpdateAddress =
            "UPDATE SAMPLE.CSV_PUSHCONTACTS " +
            "SET GROUPNAME = ?, " +
            "    LASTNAME = ?, " +
            "    FIRSTNAME = ?, " +
            "    EMAIL = ?, " +
            "    HOMEPHONE = ?, " +
            "    WORKPHONE = ?, " +
            "    MOBILEPHONE = ?, " +
            "    DEVICEPIN = ?, " +
            "    ADDRESS1 = ?, " +
            "    ADDRESS2 = ?, " +
            "    CITY = ?, " +
            "    STATE = ?, " +
            "    ZIP = ?, " +
            "    COUNTRY = ?, " +
            "    TITLE = ?, " +
            "    COMPANY = ? " +
            "WHERE ID = ?";
    
    private static final String strDeleteAddress =
            "DELETE FROM SAMPLE.CSV_PUSHCONTACTS " +
            "WHERE ID = ?";
    
    private static final String strNukeAddresses = "DELETE FROM SAMPLE.CSV_PUSHCONTACTS";
    
}
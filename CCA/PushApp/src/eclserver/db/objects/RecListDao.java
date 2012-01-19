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


public class RecListDao {
    
    
    /** Creates a new instance of BesListDao */
    public RecListDao(Connection connection) {
        this(connection, "RecipientsDao");
    }
    
    
    
    public RecListDao(Connection connection, String listName) {
        this.objectName = listName;
       
     try {
        System.out.println("Received connection from factory... building Recipient List. \n");
        dbConnection = connection;
        stmtGetRECListEntries = dbConnection.prepareStatement(strGetRECListEntries);
        stmtSaveNewRecord = dbConnection.prepareStatement(strSaveRecipient, Statement.RETURN_GENERATED_KEYS);
        stmtUpdateExistingRecord = dbConnection.prepareStatement(strUpdateREC);
        stmtGetREC = dbConnection.prepareStatement(strGetREC);
        stmtDeleteREC = dbConnection.prepareStatement(strDeleteREC);
        stmtNukeRecipients = dbConnection.prepareStatement(strNukeRecipients);

     
     } catch (SQLException ex){
         System.out.println("Exception creating RecListDAO:  " + ex);
     }
        
    }
    
    public int saveRecord(RecipientObject record) {
        System.out.println("Saving record: " + record.getRecEmail() + ":" + record.getUserBes());
        int id = -1;
        try {
            stmtSaveNewRecord.clearParameters();
            stmtSaveNewRecord.setString(1, record.getRecEmail());
            stmtSaveNewRecord.setString(2, record.getUserBes());
            stmtSaveNewRecord.setString(3, record.getSyncDate());
            int rowCount = stmtSaveNewRecord.executeUpdate();
            ResultSet results = stmtSaveNewRecord.getGeneratedKeys();
            if (results.next()) {
                id = results.getInt(1);
            }
            
        } catch(SQLException sqle) {
            sqle.printStackTrace();
            System.out.println("SQLException in RecDao.saverecord: " + sqle.getMessage());
        }
        return id;
    }
    
    public boolean editRecord(RecipientObject record) {
     System.out.println("Editing Record...");

        boolean bEdited = false;
        try {
            stmtUpdateExistingRecord.clearParameters();
            
            stmtUpdateExistingRecord.setString(1, record.getRecEmail());
            stmtUpdateExistingRecord.setString(2, record.getUserBes());
             stmtUpdateExistingRecord.setString(3, record.getSyncDate());
            stmtUpdateExistingRecord.setInt(4, record.getId());
            stmtUpdateExistingRecord.executeUpdate();
            bEdited = true;
        } catch(SQLException sqle) {
            sqle.printStackTrace();
        }
        return bEdited;
        
    }
    
    public boolean deleteRecord(int id) {
        System.out.println("Deleting Record id:" + id);
        boolean bDeleted = false;    
        try {
            stmtDeleteREC.clearParameters();
            stmtDeleteREC.setInt(1, id);
            stmtDeleteREC.executeUpdate();
            bDeleted = true;
        } catch (SQLException sqle) {
            sqle.printStackTrace();
        }
        
        return bDeleted;
    }
    
    public boolean deleteRecord(RecipientObject record) {
        int id = record.getId();
        return deleteRecord(id);
    }
    
    public boolean nukeRecords(){
        boolean bDeleted = false;
        try {
            stmtNukeRecipients.executeUpdate();
            bDeleted = true;
        }catch (SQLException sqle){
            System.out.println("Error nuking addresses: " + sqle.getMessage());
            sqle.printStackTrace();
        }
        return bDeleted;
    }
    
    public List<RecipientObject> getListEntries() {
        List<RecipientObject> listEntries = new ArrayList<RecipientObject>();
        Statement queryStatement = null;
        ResultSet results = null;
        
        try {
            System.out.println("Retrieving Recipients List...\n");
            queryStatement = dbConnection.createStatement();
            results = queryStatement.executeQuery(strGetRECListEntries);
            while(results.next()) {
                int id = results.getInt(1);
                String bEmail = results.getString(2);
                String bUserBes = results.getString(3);
                String bSyncDate = results.getString(3);

                System.out.println("Retrieving details for: " + bEmail + ":" + bUserBes);
                RecipientObject entry = new RecipientObject(bEmail, bUserBes, bSyncDate, id);
                listEntries.add(entry);
            }
            System.out.println("Completed Recipient List retrieval");
                    
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            
        }
        
        return listEntries;
    }
    
    public RecipientObject getREC(int index) {
        RecipientObject recObject = null;
        try {
            stmtGetREC.clearParameters();
            stmtGetREC.setInt(1, index);
            ResultSet result = stmtGetREC.executeQuery();
            if (result.next()) {
                String recEmail = result.getString("EMAIL");
                String recUserBes = result.getString("USERBES");
                 String recSyncDate = result.getString("SENTDATE");
                int id = result.getInt("ID");
                recObject = new RecipientObject(recEmail, recUserBes, recSyncDate, id);
            }
        } catch(SQLException sqle) {
            sqle.printStackTrace();
        }
        
        return recObject;
    }
    
    public static void main(String[] args) {
       // RecListDao db = new RecListDao();
       // System.out.println("Test Output");
       
    }
    
    private String objectName;
    private Connection dbConnection;
    private PreparedStatement stmtSaveNewRecord;
    private PreparedStatement stmtUpdateExistingRecord;
    private PreparedStatement stmtGetRECListEntries;
    private PreparedStatement stmtGetREC;
    private PreparedStatement stmtDeleteREC;
    private PreparedStatement stmtNukeRecipients;

    
   
    
    
    private static final String strGetREC =
            "SELECT * FROM SAMPLE.CSV_RECIPIENTS " +
            "WHERE ID = ?";
    
    private static final String strSaveRecipient =
            "INSERT INTO SAMPLE.CSV_RECIPIENTS " +
            "   (EMAIL, USERBES, SENTDATE) " +
            "VALUES (?, ?, ?)";
    
    
    private static final String strGetRECListEntries =
            "SELECT ID, EMAIL, USERBES, SENTDATE FROM SAMPLE.CSV_RECIPIENTS "  +
            "ORDER BY EMAIL ASC";
    
    private static final String strUpdateREC =
            "UPDATE SAMPLE.CSV_RECIPIENTS " +
            "SET EMAIL = ?, " +
            "    USERBES = ?, " +
            "    SENTDATE = ? " +
            "WHERE ID = ?";
    
    private static final String strDeleteREC =
            "DELETE FROM SAMPLE.CSV_RECIPIENTS " +
            "WHERE ID = ?";
    
    private static final String strNukeRecipients = "DELETE FROM SAMPLE.CSV_RECIPIENTS";

    
}

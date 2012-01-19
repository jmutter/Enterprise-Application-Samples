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

public class GroupsDao {
    
 public GroupsDao(Connection connection) {
        this(connection, "GroupsDao");
    }
    
    
    
    public GroupsDao(Connection connection, String besListName) {
        this.objectName = besListName;
       
     try {
        System.out.println("Received connection from factory... building Group Name. \n");
        dbConnection = connection;
        stmtGetListEntries = dbConnection.prepareStatement(strGetListEntries);
        stmtSaveNewRecord = dbConnection.prepareStatement(strSaveRecord, Statement.RETURN_GENERATED_KEYS);
        stmtUpdateExistingRecord = dbConnection.prepareStatement(strUpdateRecord);
        stmtGetRecord = dbConnection.prepareStatement(strGetRecord);
        stmtDeleteRecord = dbConnection.prepareStatement(strDeleteRecord);
     
     } catch (SQLException ex){
         System.out.println("Exception creating GroupsDao:  " + ex);
     }
        
    }
    
    public int saveRecord(GroupObject record) {
        System.out.println("Saving record: " + record.getGroupName());
        int id = -1;
        try {
            stmtSaveNewRecord.clearParameters();
            stmtSaveNewRecord.setString(1, record.getGroupName());
            int rowCount = stmtSaveNewRecord.executeUpdate();
            ResultSet results = stmtSaveNewRecord.getGeneratedKeys();
            if (results.next()) {
                id = results.getInt(1);
            }
            
        } catch(SQLException sqle) {
            sqle.printStackTrace();
        }
        return id;
    }
    
    public boolean editRecord(GroupObject record) {
     System.out.println("Editing Record...");

        boolean bEdited = false;
        try {
            stmtUpdateExistingRecord.clearParameters();
            
            stmtUpdateExistingRecord.setString(1, record.getGroupName());
            stmtUpdateExistingRecord.setInt(2, record.getId());
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
            stmtDeleteRecord.clearParameters();
            stmtDeleteRecord.setInt(1, id);
            stmtDeleteRecord.executeUpdate();
            bDeleted = true;
        } catch (SQLException sqle) {
            sqle.printStackTrace();
        }
        
        return bDeleted;
    }
    
    public boolean deleteRecord(GroupObject record) {
        int id = record.getId();
        return deleteRecord(id);
    }
    
    public List<GroupObject> getListEntries() {
        List<GroupObject> listEntries = new ArrayList<GroupObject>();
        Statement queryStatement = null;
        ResultSet results = null;
        
        try {
            System.out.println("Retrieving Groups List...\n");
            queryStatement = dbConnection.createStatement();
            results = queryStatement.executeQuery(strGetListEntries);
            while(results.next()) {
                int id = results.getInt(1);
                String bGroup = results.getString(2);
                System.out.println("Retrieving details for: " + bGroup);
                GroupObject entry = new GroupObject(bGroup, id);
                listEntries.add(entry);
            }
            System.out.println("Completed Groups retrieval");
                    
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            
        }
        
        return listEntries;
    }
    
    public GroupObject getBES(int index) {
        GroupObject groupObject = null;
        try {
            stmtGetRecord.clearParameters();
            stmtGetRecord.setInt(1, index);
            ResultSet result = stmtGetRecord.executeQuery();
            if (result.next()) {
                String groupName = result.getString("GROUPNAME");
                int id = result.getInt("ID");
                groupObject = new GroupObject(groupName, id);
            }
        } catch(SQLException sqle) {
            sqle.printStackTrace();
        }
        
        return groupObject;
    }
    
    public static void main(String[] args) {
       // BesListDao db = new BesListDao();
       // System.out.println("Test Output");
       
    }
    
    private String objectName;
    private Connection dbConnection;
    private PreparedStatement stmtSaveNewRecord;
    private PreparedStatement stmtUpdateExistingRecord;
    private PreparedStatement stmtGetListEntries;
    private PreparedStatement stmtGetRecord;
    private PreparedStatement stmtDeleteRecord;
     
    private static final String strGetRecord =
            "SELECT * FROM SAMPLE.GROUPS " +
            "WHERE ID = ?";
    
    private static final String strSaveRecord =
            "INSERT INTO SAMPLE.GROUPS " +
            "   (GROUPNAME) " +
            "VALUES (?)";
    
    
    private static final String strGetListEntries =
            "SELECT ID, GROUPNAME FROM SAMPLE.GROUPS "  +
            "ORDER BY GROUPNAME ASC";
    
    private static final String strUpdateRecord =
            "UPDATE SAMPLE.GROUPS " +
            "SET GROUPNAME = ? " +
            "WHERE ID = ?";
    
    private static final String strDeleteRecord =
            "DELETE FROM SAMPLE.GROUPS " +
            "WHERE ID = ?";
    
}
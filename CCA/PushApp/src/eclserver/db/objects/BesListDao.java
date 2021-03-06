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

import java.sql.Statement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;
/**
 *
 * @author rbalsewich
 */
public class BesListDao {
    
    /** Creates a new instance of BesListDao */
    public BesListDao(Connection connection) {
        this(connection, "BesListDao");
    }
    
    
    
    public BesListDao(Connection connection, String besListName) {
        this.objectName = besListName;
       
     try {
        System.out.println("Received connection from factory... building BES List. \n");
        dbConnection = connection;
        stmtGetBESListEntries = dbConnection.prepareStatement(strGetBESListEntries);
        stmtSaveNewRecord = dbConnection.prepareStatement(strSaveAddress, Statement.RETURN_GENERATED_KEYS);
        stmtUpdateExistingRecord = dbConnection.prepareStatement(strUpdateBES);
        stmtGetBES = dbConnection.prepareStatement(strGetBES);
        stmtDeleteBES = dbConnection.prepareStatement(strDeleteBES);
     
     } catch (SQLException ex){
         System.out.println("Exception creating BESListDAO:  " + ex);
     }
        
    }
    
    public int saveRecord(ServerObject record) {
        System.out.println("Saving record: " + record.getServerHost() + ":" + record.getServerPort());
        int id = -1;
        try {
            stmtSaveNewRecord.clearParameters();
            stmtSaveNewRecord.setString(1, record.getServerHost());
            stmtSaveNewRecord.setString(2, record.getServerPort());
            int rowCount = stmtSaveNewRecord.executeUpdate();
            ResultSet results = stmtSaveNewRecord.getGeneratedKeys();
            if (results.next()) {
                id = results.getInt(1);
            }
            
        } catch(SQLException sqle) {
            System.out.println("SQLEXCEPTION in BesListDao.saveRecord " + sqle.getMessage());
        }         
        
        return id;
    }
    
    public boolean editRecord(ServerObject record) {
     System.out.println("Editing Record...");

        boolean bEdited = false;
        try {
            stmtUpdateExistingRecord.clearParameters();
            
            stmtUpdateExistingRecord.setString(1, record.getServerHost());
            stmtUpdateExistingRecord.setString(2, record.getServerPort());
            stmtUpdateExistingRecord.setInt(3, record.getId());
            stmtUpdateExistingRecord.executeUpdate();
            bEdited = true;
        } catch(SQLException sqle) {
           System.out.println("SQLEXCEPTION in BesListDao.editRecord " + sqle.getMessage());
        }
        return bEdited;
        
    }
    
    public boolean deleteRecord(int id) {
        System.out.println("Deleting Record id:" + id);
        boolean bDeleted = false;    
        try {
            stmtDeleteBES.clearParameters();
            stmtDeleteBES.setInt(1, id);
            stmtDeleteBES.executeUpdate();
            bDeleted = true;
        } catch (SQLException sqle) {
            System.out.println("SQLEXCEPTION in BesListDao.deleteRecord " + sqle.getMessage());
        }
        
        return bDeleted;
    }
    
    public boolean deleteRecord(ServerObject record) {
        int id = record.getId();
        return deleteRecord(id);
    }
    
    public List<ServerObject> getListEntries() {
        List<ServerObject> listEntries = new ArrayList<ServerObject>();
        Statement queryStatement = null;
        ResultSet results = null;
        
        try {
            System.out.println("Retrieving BES Server List...\n");
            queryStatement = dbConnection.createStatement();
            results = queryStatement.executeQuery(strGetBESListEntries);
            while(results.next()) {
                int id = results.getInt(1);
                String bHost = results.getString(2);
                String bPort = results.getString(3);
                System.out.println("Retrieving details for: " + bHost + ":" + bPort);
                ServerObject entry = new ServerObject(bHost, bPort, id);
                listEntries.add(entry);
            }
            System.out.println("Completed BES List retrieval");
                    
        } catch (SQLException sqle) {
            System.out.println("SQLException in getListEntries: " + sqle.getMessage());
            
        } finally {
           try {
               if (!results.isClosed()){
                   results.close();
               }
               if (!queryStatement.isClosed()){
                   queryStatement.close();
               }
           } catch (Exception ex){
               System.out.println("Issue closing results and statements: " + ex.getMessage());
           }
            
        }
        
        return listEntries;
    }
    
    public ServerObject getBES(int index) {
        ServerObject serverObject = null;
        try {
            stmtGetBES.clearParameters();
            stmtGetBES.setInt(1, index);
            ResultSet result = stmtGetBES.executeQuery();
            if (result.next()) {
                String besHost = result.getString("BESHOST");
                String besPort = result.getString("BESPORT");
                int id = result.getInt("ID");
                serverObject = new ServerObject(besHost, besPort, id);
            }
        } catch(SQLException sqle) {
            System.out.println("SQLEXCEPTION in BesListDao.getBES " + sqle.getMessage());
        } 
        
        return serverObject;
    }
    
    public static void main(String[] args) {
       // BesListDao db = new BesListDao();
       // System.out.println("Test Output");
       
    }
    
    private String objectName;
    private Connection dbConnection;
    private PreparedStatement stmtSaveNewRecord;
    private PreparedStatement stmtUpdateExistingRecord;
    private PreparedStatement stmtGetBESListEntries;
    private PreparedStatement stmtGetBES;
    private PreparedStatement stmtDeleteBES;
    
   
    
    
    private static final String strGetBES =
            "SELECT * FROM SAMPLE.BESLIST " +
            "WHERE ID = ?";
    
    private static final String strSaveAddress =
            "INSERT INTO SAMPLE.BESLIST " +
            "   (BESHOST, BESPORT) " +
            "VALUES (?, ?)";
    
    
    private static final String strGetBESListEntries =
            "SELECT ID, BESHOST, BESPORT FROM SAMPLE.BESLIST "  +
            "ORDER BY BESHOST ASC";
    
    private static final String strUpdateBES =
            "UPDATE SAMPLE.BESLIST " +
            "SET BESHOST = ?, " +
            "    BESPORT = ? " +
            "WHERE ID = ?";
    
    private static final String strDeleteBES =
            "DELETE FROM SAMPLE.BESLIST " +
            "WHERE ID = ?";
    
}

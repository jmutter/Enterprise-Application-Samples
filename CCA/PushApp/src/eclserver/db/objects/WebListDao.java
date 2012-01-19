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
public class WebListDao {
    
    /** Creates a new instance of BesListDao */
    public WebListDao(Connection connection) {
        this(connection, "WebListDao");
    }
    
    
    
    public WebListDao(Connection connection, String webListName) {
        this.objectName = webListName;
       
     try {
        System.out.println("Received connection from factory... building Web List. \n");
        dbConnection = connection;
        stmtGetWEBListEntries = dbConnection.prepareStatement(strGetWEBListEntries);
        stmtSaveNewRecord = dbConnection.prepareStatement(strSaveAddress, Statement.RETURN_GENERATED_KEYS);
        stmtUpdateExistingRecord = dbConnection.prepareStatement(strUpdateWEB);
        stmtGetWEB = dbConnection.prepareStatement(strGetWEB);
        stmtDeleteWEB = dbConnection.prepareStatement(strDeleteWEB);
     
     } catch (SQLException ex){
         System.out.println("Exception creating WebListDAO:  " + ex);
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
            sqle.printStackTrace();
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
            sqle.printStackTrace();
        }
        return bEdited;
        
    }
    
    public boolean deleteRecord(int id) {
        System.out.println("Deleting Record id:" + id);
        boolean bDeleted = false;    
        try {
            stmtDeleteWEB.clearParameters();
            stmtDeleteWEB.setInt(1, id);
            stmtDeleteWEB.executeUpdate();
            bDeleted = true;
        } catch (SQLException sqle) {
            sqle.printStackTrace();
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
       //     System.out.println("Retrieving WEB Server List...\n");
            queryStatement = dbConnection.createStatement();
            results = queryStatement.executeQuery(strGetWEBListEntries);
            while(results.next()) {
                int id = results.getInt(1);
                String bHost = results.getString(2);
                String bPort = results.getString(3);
       //         System.out.println("Retrieving details for: " + bHost + ":" + bPort);
                ServerObject entry = new ServerObject(bHost, bPort, id);
                listEntries.add(entry);
            }
       //     System.out.println("Completed BES List retrieval");
                    
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            
        }
        
        return listEntries;
    }
    
    public ServerObject getWEB(int index) {
        ServerObject serverObject = null;
        try {
            stmtGetWEB.clearParameters();
            stmtGetWEB.setInt(1, index);
            ResultSet result = stmtGetWEB.executeQuery();
            if (result.next()) {
                String webHost = result.getString("WEBHOST");
                String webPort = result.getString("WEBPORT");
                int id = result.getInt("ID");
                serverObject = new ServerObject(webHost, webPort, id);
            }
        } catch(SQLException sqle) {
            sqle.printStackTrace();
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
    private PreparedStatement stmtGetWEBListEntries;
    private PreparedStatement stmtGetWEB;
    private PreparedStatement stmtDeleteWEB;
    
   
    
    
    private static final String strGetWEB =
            "SELECT * FROM SAMPLE.WEBLIST " +
            "WHERE ID = ?";
    
    private static final String strSaveAddress =
            "INSERT INTO SAMPLE.WEBLIST " +
            "   (WEBHOST, WEBPORT) " +
            "VALUES (?, ?)";
    
    
    private static final String strGetWEBListEntries =
            "SELECT ID, WEBHOST, WEBPORT FROM SAMPLE.WEBLIST "  +
            "ORDER BY WEBHOST ASC";
    
    private static final String strUpdateWEB =
            "UPDATE SAMPLE.WEBLIST " +
            "SET WEBHOST = ?, " +
            "    WEBPORT = ? " +
            "WHERE ID = ?";
    
    private static final String strDeleteWEB =
            "DELETE FROM SAMPLE.WEBLIST " +
            "WHERE ID = ?";
    
}

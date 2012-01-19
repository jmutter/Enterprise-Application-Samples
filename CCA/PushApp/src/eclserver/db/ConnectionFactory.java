/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package eclserver.db;

import java.io.File;
import java.io.InputStream;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Connection;
import java.sql.Statement;
import java.util.Properties;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

import java.util.HashMap;
import java.util.Enumeration;


/**
 *
 * @author rbalsewich
 */
public class ConnectionFactory {
    
    private Connection dbConnection;
    private Properties dbProperties;
    private boolean isConnected;
    private String dbName;
    private HashMap screenProps;
   
    public ConnectionFactory(){
        this("SamplesDatabase");
    }

    public ConnectionFactory(String sampleName){
        
        this.dbName = sampleName;

        setDBSystemDir();
        dbProperties = loadDBProperties();
        String driverName = dbProperties.getProperty("derby.driver"); 
        loadDatabaseDriver(driverName);
        
        if(!dbExists()) {
            createDatabase();
         }
   
        loadScreenProperties();
     
    }

     private String getHomeDir() {
        return System.getProperty("user.home");
     }
     
    private boolean dbExists() {
 
        boolean bExists = false;
        String dbLocation = getDatabaseLocation();
        File dbFileDir = new File(dbLocation);
        
        if (dbFileDir.exists()) {
            bExists = true;
            System.out.println("Database Exists.\n");
        }
        
        return bExists;
    } 
    
     private Properties loadDBProperties() {
        InputStream dbPropInputStream = null;
        dbPropInputStream = ConnectionFactory.class.getResourceAsStream("Configuration.properties");
        dbProperties = new Properties();
        try {
            dbProperties.load(dbPropInputStream);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        return dbProperties;
    }
       
     private void loadDatabaseDriver(String driverName) {
        // load Derby driver
        try {
            Class.forName(driverName);
        } catch (ClassNotFoundException ex) {
            ex.printStackTrace();
        }
        
    }
     
     private boolean createDatabase() {
        boolean bCreated = false;
        Connection dbConnection = null;
        
        String dbUrl = getDatabaseUrl();
        dbProperties.put("create", "true");
        
        try {
            dbConnection = DriverManager.getConnection(dbUrl, dbProperties);
            bCreated = createTables(dbConnection);
        } catch (SQLException ex) {
            System.out.println("SQLEXCEPTION CREATE DATABASE: " + ex.getMessage());
        }
        dbProperties.remove("create");
        return bCreated;
    }
     
     private boolean createTables(Connection dbConnection) {
        boolean bCreatedTables = false;
        Statement statement = null;
        try {
            statement = dbConnection.createStatement();
            statement.execute(strCreateBESLISTTable);
            statement.execute(strCreatePUSHSERVERTable);
            statement.execute(strCreateWEBLISTTable);
            statement.execute(strCreateGroupTable);
            statement.execute(strCreateCSVRECIPIENTSTable);
            statement.execute(strCreateCSVPUSHCONTACTSTable);
            statement.execute(strCreatePUSHCALLTable);
            statement.execute(strCreatePUSHNOTIFICATIONTable);
            bCreatedTables = true;
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        
        return bCreatedTables;
    }
     
     private void setDBSystemDir() {
        // decide on the db system directory
        String userHomeDir = System.getProperty("user.home", ".");
        System.out.println("Getting user home env...\n");
        String systemDir = userHomeDir + "/.sampledatabase";
        System.out.println("Setting env... " + systemDir);
        System.setProperty("derby.system.home", systemDir);

        // create the db system directory
        File fileSystemDir = new File(systemDir);
        fileSystemDir.mkdir();
    }
     
     
     private void loadScreenProperties(){
         System.out.println("Loading properties screen");
      
      screenProps = new HashMap();
      try {
          
          Properties props = new Properties();
          
          props.load(new FileInputStream("session.properties"));
          
          if (!props.isEmpty()){
              
              Enumeration k = props.keys();
              while(k.hasMoreElements()){
                  String key = (String) k.nextElement();
                  if(key.startsWith("screen.")){
                      screenProps.put(key, props.get(key));
                  }
              }
          }          
      }catch (Exception ex){
          System.out.println("Error building screen from properties: " + ex);
      }          
  }
     
     public HashMap getScreenProperties(){
         return this.screenProps;
     }
    
public String getDatabaseLocation() {
        String dbLocation = System.getProperty("derby.system.home") + "/" + dbName;
        return dbLocation;
}
    

public String getDatabaseUrl() {
        String dbUrl = dbProperties.getProperty("derby.url") + dbName;
        return dbUrl;
}


public void disconnect() {
    if(isConnected) {
        String dbUrl = getDatabaseUrl();
        dbProperties.put("shutdown", "true");
        try {
            DriverManager.getConnection(dbUrl, dbProperties);
        } catch (SQLException ex) {
        }
        isConnected = false;
    }
}

 public boolean connect() {
    String dbUrl = getDatabaseUrl();
    try {
        dbConnection = DriverManager.getConnection(dbUrl, dbProperties);
        isConnected = dbConnection != null;
    } catch (SQLException ex) {
        isConnected = false;
        System.out.println("Database is not connected: " + ex.getMessage());
    }
    return isConnected;
}
 
 
 
 public Connection getConnection(){
     
     return this.dbConnection;
 }
  
 
    
    public static void main(String[] args) {
        ConnectionFactory db = new ConnectionFactory();
        System.out.println(db.getDatabaseLocation());
        System.out.println(db.getDatabaseUrl());
        db.connect();
        db.disconnect();
    }

    
  public void saveProperties(String appPort, String webVD) {
    
    try {
        System.out.println("Saving Properties..");
        System.out.println("App Port: " + appPort);
        System.out.println("Web Virtual Directroy: " + webVD);
        dbProperties.setProperty("screen.config_AppPort", appPort);
        dbProperties.setProperty("screen.config_WebVD", webVD);
        dbProperties.store(new FileOutputStream("session.properties"), null);
    
        loadScreenProperties();
    
    }
    catch (Exception e ) {
        e.printStackTrace();
    }
}
    

    
     private static final String strCreateBESLISTTable = 
        "create table SAMPLE.BESLIST ("  + 
	"   ID       INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
        "   BESHOST     VARCHAR(50), " +
	"   BESPORT     INTEGER " +
        ")";

    
    private static final String strCreatePUSHSERVERTable = 
        "create table SAMPLE.PUSHSERVER ("  + 
	"   ID     INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
        "   PUSHHOST    VARCHAR(50), " +
	"   PUSHPORT     INTEGER " +
        ")";
    
    
    private static final String strCreateWEBLISTTable = 
        "create table SAMPLE.WEBLIST ("  + 
	"   ID     INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
        "   WEBHOST    VARCHAR(50), " +
	"   WEBPORT     INTEGER " +
        ")";
    
    
    private static final String strCreateCSVRECIPIENTSTable = 
        "create table SAMPLE.CSV_RECIPIENTS ("  + 
	"   ID     INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
        "   EMAIL    VARCHAR(50), " +
        "   USERBES    VARCHAR(255), " +
	"   SENTDATE     VARCHAR(50) " +
        ")";
    
    
    private static final String strCreateCSVPUSHCONTACTSTable = 
        "create table SAMPLE.CSV_PUSHCONTACTS ("  + 
	"   ID     INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
        "   GROUPNAME       VARCHAR(30), " +
        "   LASTNAME    VARCHAR(30), " +
        "   FIRSTNAME   VARCHAR(30), " +
        "   EMAIL       VARCHAR(35), " +
        "   HOMEPHONE   VARCHAR(20), " + 
        "   WORKPHONE   VARCHAR(20), " + 
        "   MOBILEPHONE VARCHAR(20), " + 
        "   DEVICEPIN   VARCHAR(15), " +
        "   ADDRESS1    VARCHAR(50), " +
        "   ADDRESS2    VARCHAR(50), " +
        "   CITY        VARCHAR(25), " +
        "   STATE       VARCHAR(25), " +
        "   ZIP         VARCHAR(10), " +
        "   COUNTRY     VARCHAR(25), " +
        "   TITLE       VARCHAR(30), " +
        "   COMPANY     VARCHAR(50) " +
        ")";
    
      
    private static final String strCreatePUSHCALLTable = 
        "create table SAMPLE.PUSHCALL ("  + 
	"   ID     INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
        "   ecBridgeNum     VARCHAR(30), " +
        "   ecAcceptURL     VARCHAR(255), " +
        "   ecDeclineURL    VARCHAR(255), " +
        "   ecDetails       VARCHAR(255), " +
        "   ecCallDateTime  VARCHAR(30), " +
        "   ecEmailAddress  VARCHAR(35) " +
        ")";
    
  
    private static final String strCreatePUSHNOTIFICATIONTable = 
        "create table SAMPLE.PUSHNOTIFICATION ("  + 
	"   ID     INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
        "   ecAcceptURL     VARCHAR(255), " +
        "   ecDetails  VARCHAR(255) " +
        ")";
    
    private static final String strCreateGroupTable = 
        "create table SAMPLE.GROUPS ("  + 
	"   ID     INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
        "   GROUPNAME  VARCHAR(100) " +
        ")";
    
    
}

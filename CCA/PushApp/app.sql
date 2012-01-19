create table "BESLIST"
(
	"ID" INT not null primary key
            GENERATED ALWAYS AS IDENTITY
            (START WITH 1, INCREMENT BY 1),  
        "BESHOST" VARCHAR(50),
	"BESPORT" INTEGER
);

create table "PUSHSERVER"
(
	"ID" INT not null primary key
            GENERATED ALWAYS AS IDENTITY
            (START WITH 1, INCREMENT BY 1),  
        "PUSHHOST" VARCHAR(50),
	"PUSHPORT" INTEGER
);

create table "WEBLIST"
(
        "ID" INT not null primary key
            GENERATED ALWAYS AS IDENTITY
            (START WITH 1, INCREMENT BY 1),    
        "WEBHOST" VARCHAR(50),
	"WEBPORT" INTEGER
);

create table "CSV_RECIPIENTS"
(
         "CID" INT not null primary key
            GENERATED ALWAYS AS IDENTITY
            (START WITH 1, INCREMENT BY 1),  	
        "EMAIL"         VARCHAR(50),
	"USERBES"	VARCHAR(100),
        "SENTDATE"	VARCHAR(50) 
);

create table "CSV_PUSHCONTACTS"
(
     "ID" INT not null primary key
            GENERATED ALWAYS AS IDENTITY
            (START WITH 1, INCREMENT BY 1), 
    "GROUP" VARCHAR(30),
    "LASTNAME" VARCHAR(30), 
    "FIRSTNAME" VARCHAR(30),
    "EMAIL" VARCHAR(35),
    "HOMEPHONE" VARCHAR(20), 
    "WORKPHONE" VARCHAR(20),
    "MOBILEPHONE" VARCHAR(20), 
    "DEVICEPIN" VARCHAR(15), 
    "ADDRESS1" VARCHAR(50),
    "ADDRESS2" VARCHAR(50),
    "CITY" VARCHAR(25),
    "STATE" VARCHAR(2),
    "ZIP" INTEGER,
    "COUNTRY" VARCHAR(5),
    "TITLE" VARCHAR(30),
    "COMPANY" VARCHAR(50)

);

create table "CSV_PUSHCALL"
(
        "ID" INT not null primary key
            GENERATED ALWAYS AS IDENTITY
            (START WITH 1, INCREMENT BY 1),            
          "ecBridgeNum" VARCHAR(30),
          "ecAcceptURL" VARCHAR(100),
          "ecDeclineURL" VARCHAR(100),
          "ecDetails" VARCHAR(150),
          "ecCallDateTime"  VARCHAR(30),
          "ecEmailAddress"  VARCHAR(35)

);

create table "CSV_PUSHNOTIFICATION"
(
	"ID" INT not null primary key
            GENERATED ALWAYS AS IDENTITY
            (START WITH 1, INCREMENT BY 1),  
        ecAcceptURL VARCHAR(100),         
        ecDetails VARCHAR(200)
);



/*
   private static final String strCreateBESLISTTable = 
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
        "create table SAMPLE.CSVRECIPIENTS ("  + 
	"   ID     INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
        "   EMAIL    VARCHAR(50), " +
        "   USERBES    VARCHAR(50), " +
	"   SENTDATE     VARCHAR(50) " +
        ")";
    
    
    private static final String strCreateCSVPUSHCONTACTSTable = 
        "create table SAMPLE.CSVPUSHCONTACTS ("  + 
	"   ID     INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
        "   GROUP       VARCHAR(30), " +
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
        "   STATE       VARCHAR(2), " +
        "   ZIP         INTEGER, " +
        "   COUNTRY     VARCHAR(5), " +
        "   TITLE       VARCHAR(30), " +
        "   COMPANY     VARCHAR(50) " +
        ")";
    
      
    private static final String strCreatePUSHCALLTable = 
        "create table SAMPLE.PUSHCALL ("  + 
	"   ID     INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
        "   ecBridgeNum     VARCHAR(30), " +
        "   ecAcceptURL     VARCHAR(100), " +
        "   ecDeclineURL    VARCHAR(100), " +
        "   ecDetails       VARCHAR(150), " +
        "   ecCallDateTime  VARCHAR(30), " +
        "   ecEmailAddress  VARCHAR(35) " +
        ")";
    
  
    private static final String strCreatePUSHNOTIFICATIONTable = 
        "create table SAMPLE.PUSHNOTIFICATION ("  + 
	"   ID     INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
        "   ecAcceptURL     VARCHAR(100), " +
        "   ecDetails  VARCHAR(200) " +
        ")";
    
    
*
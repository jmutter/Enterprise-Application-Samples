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

/*
 * NewJFrame.java
 *
 * Created on Oct 12, 2011, 12:22:15 AM
 */
package eclserver;

/**
 *
 * @author rbalsewich
 */



//import com.sun.xml.internal.ws.message.stream.StreamAttachment;
import java.io.File;
import java.util.Random;
import java.util.Vector;
import java.util.regex.Pattern;
import java.net.URL;
import java.util.List;
import javax.swing.ImageIcon;
import java.awt.Image;
import javax.swing.SwingUtilities;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.sql.Connection;
import java.util.HashMap;
import javax.swing.JProgressBar;
import javax.swing.JOptionPane;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.net.InetAddress;
import eclserver.db.objects.BesListDao;
import eclserver.db.objects.WebListDao;
import eclserver.db.objects.RecListDao;
import eclserver.db.objects.ContactsDao;
import eclserver.db.objects.GroupsDao;
import eclserver.db.ConnectionFactory;
import eclserver.db.objects.ServerObject;
import eclserver.db.objects.RecipientObject;
import eclserver.db.objects.AddressObject;
import eclserver.db.objects.GroupObject;

import eclserver.threads.RecipientBESMatch;
import eclserver.threads.ContactsLoader;
import eclserver.threads.RecipientsLoader;
import eclserver.threads.ContactsPush;
import eclserver.threads.EmergencyCallPush;
import eclserver.threads.EmergencyNotifyPush;
import java.rmi.UnknownHostException;



public class NewJFrame extends javax.swing.JFrame 
            implements ActionListener{

    private static final long serialVersionUID = -1833425591727608149L;
//    private static final Random _r = new Random(System.currentTimeMillis());
//    private static final boolean debug = false;
//    private static Vector errors = new Vector();
//    private static Vector quotationErrors = new Vector();
    public static final String CSV_PATTERN = "\"([^\"]+?)\",?|([^,]+),?|,";
//    private static Pattern csvRE;

    private ConnectionFactory dbFactory;
    private Connection dbConn;
    private BesListDao besListDao;
    private WebListDao webListDao;
    private RecListDao recListDao;
    private ContactsDao addressDao;
    private GroupsDao groupsDao;
    private WindowAdapter windowAdapter;
    private HashMap screenProperties;

    private RecipientsLoader recipientsLoader;
    private ContactsLoader contactsLoader;
    private RecipientBESMatch recipientBesMatcher;
    private ContactsPush contactsPusher;
    private EmergencyCallPush emergencyCallPusher;
    private EmergencyNotifyPush emergencyNotifyPusher;
    private ProgressListener listenerLoadingContacts;
    
    private String computerName;
    

    /** Creates new form NewJFrame */
    public NewJFrame() {

        this.setTitle("RIM Push Application Sample");

        initComponents();
        
         loadFrameIcon();
         
         windowAdapter = new WindowCloser();
         this.addWindowListener(windowAdapter);
    try {
        
         computerName=InetAddress.getLocalHost().getHostName();
        // System.out.println(computerName);
        
         dbFactory = new ConnectionFactory();  
        
        if(dbFactory.connect()){
            System.out.println("Connection Established...populating application.\n");
            dbConn = dbFactory.getConnection();
            System.out.println("Building BES Lists.\n");
            
            //DAO config panel:  BES LIST
            config_BESList.addActionListener(this);
            besListDao = new BesListDao(dbConn);              
            List<ServerObject> besEntries = besListDao.getListEntries();
//            System.out.println("Adding list entries from BES List DAO.\n");
            config_BESList.addListEntries(besEntries);
                   
            //DAO config panel:  WEB LIST
            config_WebList.addActionListener(this);
            webListDao = new WebListDao(dbConn);
            List<ServerObject> webEntries = webListDao.getListEntries();
 //           System.out.println("Adding list entries from Web List DAO.\n");
            config_WebList.addListEntries(webEntries);
            
            //DAO Contacts: Group Name
            groupListPanel.addActionListener(this);
            groupsDao = new GroupsDao(dbConn);
            List<GroupObject> groupEntries = groupsDao.getListEntries();
  //          System.out.println("Adding Group Names form Dao");
            groupListPanel.addListEntries(groupEntries);
            
            
            //DAO emergency call panel 
            recListDao = new RecListDao(dbConn);
            List<RecipientObject> recEntries = recListDao.getListEntries();
   //         System.out.println("Adding Recipients Names from Dao");
            recipientsPanel.setRecipientsListEntries(recEntries);
            recipientsPanel.addActionListener(this);
                           
           //DAO for Loaded Contacts - Contact Editor
 //           System.out.println("Adding Contacts panel from Dao");
            contactsPanel.addActionListener(this);
            addressDao = new ContactsDao(dbConn);
            List<AddressObject> entries = addressDao.getListEntries();
            contactsPanel.setContactsListEntries(entries);
            
            contactsPickerPanel.addActionListener(this);
            
            //Emergency Call threading
            emergencyCallPanel.addActionListener(this);
            
            emergencyNotificationPanel.addActionListener(this);
            
            //Properties File:  Screen Settings
            screenProperties = dbFactory.getScreenProperties();
            this.setupConfigScreen(screenProperties);
            
            System.out.println("Done with Appication Setup.\n");
            
            
        
        } else {
            JOptionPane.showMessageDialog(this, "Unable to connect to database.. exiting Application" );
            System.exit(1);
        }
      }catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Major issue in NewJFrame: " + ex.getMessage());
            System.out.println("MAIN EXCEPTION: " + ex.getMessage());
        }
        
    }

    
    /**
     * Load our own "address book" icon into our frame window.
     */
    private void loadFrameIcon() {
        URL imgUrl = null;
        ImageIcon imgIcon = null;
        
        imgUrl = NewJFrame.class.getResource("images/Burn.png");
        imgIcon = new ImageIcon(imgUrl);
        Image img = imgIcon.getImage();
        this.setIconImage(img);
        
    }  
    
    
    /** This method is called from within the constructor to
     * initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is
     * always regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jDialog1 = new javax.swing.JDialog();
        jPanel13 = new javax.swing.JPanel();
        jTabbedPane1 = new javax.swing.JTabbedPane();
        CONFIGPANEL = new javax.swing.JPanel();
        jPanel10 = new javax.swing.JPanel();
        jLabel18 = new javax.swing.JLabel();
        config_AppPort = new javax.swing.JTextField();
        config_BESList = new eclserver.panels.BesListPanel();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        jLabel4 = new javax.swing.JLabel();
        jPanel11 = new javax.swing.JPanel();
        jLabel9 = new javax.swing.JLabel();
        jLabel14 = new javax.swing.JLabel();
        config_WebVD = new javax.swing.JTextField();
        config_WebList = new eclserver.panels.WebListPanel();
        jLabel6 = new javax.swing.JLabel();
        jLabel7 = new javax.swing.JLabel();
        jLabel10 = new javax.swing.JLabel();
        config_btSave = new javax.swing.JButton();
        config_btReset = new javax.swing.JButton();
        RECIPIENTSEDITORPANEL = new javax.swing.JPanel();
        recipientsPanel = new eclserver.panels.RecipientsPanel();
        CONTACTSPANEL = new javax.swing.JPanel();
        jPanel16 = new javax.swing.JPanel();
        jLabel12 = new javax.swing.JLabel();
        groupListPanel = new eclserver.panels.GroupListPanel();
        jPanel32 = new javax.swing.JPanel();
        jScrollPane8 = new javax.swing.JScrollPane();
        contactsResultsArea = new javax.swing.JTextArea();
        btnNukeContacts = new javax.swing.JButton();
        btnPushContacts = new javax.swing.JButton();
        contactsPickerPanel = new eclserver.panels.contactsPickerPanel();
        jLabel5 = new javax.swing.JLabel();
        jLabel8 = new javax.swing.JLabel();
        btnLoadContacts = new javax.swing.JButton();
        btnCancelContacts = new javax.swing.JButton();
        jLabel21 = new javax.swing.JLabel();
        CONTACTSEDITORPANEL = new javax.swing.JPanel();
        jPanel14 = new javax.swing.JPanel();
        contactsPanel = new eclserver.panels.ContactsPanel();
        CALLPANEL = new javax.swing.JPanel();
        emergencyCallPanel = new eclserver.panels.EmergencyCallPanel();
        NOTIFYPANEL = new javax.swing.JPanel();
        emergencyNotificationPanel = new eclserver.panels.EmergencyNotificationPanel();
        MONITORPANEL = new javax.swing.JPanel();
        ADMINPANEL = new javax.swing.JPanel();
        jPanel21 = new javax.swing.JPanel();
        jLabel15 = new javax.swing.JLabel();
        jTextField8 = new javax.swing.JTextField();
        jButton5 = new javax.swing.JButton();
        jPanel26 = new javax.swing.JPanel();
        jLabel17 = new javax.swing.JLabel();
        jTextField10 = new javax.swing.JTextField();
        jButton6 = new javax.swing.JButton();
        jPanel27 = new javax.swing.JPanel();
        jLabel19 = new javax.swing.JLabel();
        jTextField12 = new javax.swing.JTextField();
        jButton7 = new javax.swing.JButton();
        jPanel28 = new javax.swing.JPanel();
        jLabel20 = new javax.swing.JLabel();
        jTextField13 = new javax.swing.JTextField();
        jButton8 = new javax.swing.JButton();
        recipientsPickerPanel1 = new eclserver.panels.recipientsPickerPanel();
        progressLoadingContacts = new javax.swing.JProgressBar();
        listenerLoadingContacts = new ProgressListener(progressLoadingContacts);

        javax.swing.GroupLayout jDialog1Layout = new javax.swing.GroupLayout(jDialog1.getContentPane());
        jDialog1.getContentPane().setLayout(jDialog1Layout);
        jDialog1Layout.setHorizontalGroup(
            jDialog1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 400, Short.MAX_VALUE)
        );
        jDialog1Layout.setVerticalGroup(
            jDialog1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 300, Short.MAX_VALUE)
        );

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);

        jPanel13.setBorder(new javax.swing.border.SoftBevelBorder(javax.swing.border.BevelBorder.RAISED));
        jPanel13.setMaximumSize(null);

        jTabbedPane1.setAutoscrolls(true);

        jPanel10.setBorder(javax.swing.BorderFactory.createTitledBorder("BlackBerry Enterprise Server"));

        jLabel18.setFont(new java.awt.Font("Tahoma", 0, 12));
        jLabel18.setText("Application Listening Port:");

        config_AppPort.setToolTipText("Enter App Push Listener Port:  e.g  1234");

        jLabel1.setFont(new java.awt.Font("Tahoma", 3, 11));
        jLabel1.setText("Enter your BES in list below. e.g.: localhost:8080");

        jLabel2.setText("If you have a centralized push server configured in your env");

        jLabel3.setText("you only need to list it once.");

        jLabel4.setFont(new java.awt.Font("Tahoma", 3, 11));
        jLabel4.setText("The Application Listening port is configured in the client code.");

        javax.swing.GroupLayout jPanel10Layout = new javax.swing.GroupLayout(jPanel10);
        jPanel10.setLayout(jPanel10Layout);
        jPanel10Layout.setHorizontalGroup(
            jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel10Layout.createSequentialGroup()
                .addGroup(jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel10Layout.createSequentialGroup()
                        .addContainerGap()
                        .addGroup(jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel1)
                            .addComponent(jLabel2)
                            .addComponent(jLabel3)
                            .addGroup(jPanel10Layout.createSequentialGroup()
                                .addComponent(jLabel18)
                                .addGap(18, 18, 18)
                                .addComponent(config_AppPort, javax.swing.GroupLayout.PREFERRED_SIZE, 147, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addComponent(jLabel4)))
                    .addGroup(jPanel10Layout.createSequentialGroup()
                        .addGap(34, 34, 34)
                        .addComponent(config_BESList, javax.swing.GroupLayout.PREFERRED_SIZE, 251, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addContainerGap(56, Short.MAX_VALUE))
        );
        jPanel10Layout.setVerticalGroup(
            jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel10Layout.createSequentialGroup()
                .addComponent(jLabel1)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel2)
                .addGap(3, 3, 3)
                .addComponent(jLabel3)
                .addGap(14, 14, 14)
                .addComponent(config_BESList, javax.swing.GroupLayout.PREFERRED_SIZE, 156, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jLabel4)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(config_AppPort, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel18, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addGap(33, 33, 33))
        );

        jPanel11.setBorder(javax.swing.BorderFactory.createTitledBorder("Web Server Configuration"));

        jLabel9.setText("List of Response Servers:");

        jLabel14.setFont(new java.awt.Font("Tahoma", 0, 12));
        jLabel14.setText("Web Server Virtual Directory:");

        config_WebVD.setToolTipText("enter Application and Callback handler \"e.g.: /pbdr/CallBack.ashx\"");

        jLabel6.setFont(new java.awt.Font("Tahoma", 3, 11));
        jLabel6.setText("The Virtual Directory must match for each server.*");

        jLabel7.setFont(new java.awt.Font("Tahoma", 3, 11));
        jLabel7.setText("If you want to track user responses, Response Server components");

        jLabel10.setFont(new java.awt.Font("Tahoma", 3, 11));
        jLabel10.setText("can be configured.  Additional server code must be in place if used.");

        javax.swing.GroupLayout jPanel11Layout = new javax.swing.GroupLayout(jPanel11);
        jPanel11.setLayout(jPanel11Layout);
        jPanel11Layout.setHorizontalGroup(
            jPanel11Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel11Layout.createSequentialGroup()
                .addGroup(jPanel11Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel11Layout.createSequentialGroup()
                        .addGap(16, 16, 16)
                        .addComponent(jLabel14)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(config_WebVD, javax.swing.GroupLayout.PREFERRED_SIZE, 139, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(jLabel7, javax.swing.GroupLayout.PREFERRED_SIZE, 388, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel10)
                    .addComponent(jLabel9)
                    .addGroup(jPanel11Layout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(jLabel6))
                    .addGroup(jPanel11Layout.createSequentialGroup()
                        .addGap(34, 34, 34)
                        .addComponent(config_WebList, javax.swing.GroupLayout.PREFERRED_SIZE, 262, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel11Layout.setVerticalGroup(
            jPanel11Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel11Layout.createSequentialGroup()
                .addComponent(jLabel7, javax.swing.GroupLayout.PREFERRED_SIZE, 14, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel10, javax.swing.GroupLayout.PREFERRED_SIZE, 14, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 16, Short.MAX_VALUE)
                .addComponent(jLabel9)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(config_WebList, javax.swing.GroupLayout.PREFERRED_SIZE, 153, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(jLabel6)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel11Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(config_WebVD, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel14))
                .addGap(30, 30, 30))
        );

        config_btSave.setMnemonic('S');
        config_btSave.setText("Save");
        config_btSave.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                config_btSaveActionPerformed(evt);
            }
        });

        config_btReset.setMnemonic('R');
        config_btReset.setText("Reset");
        config_btReset.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                config_btResetActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout CONFIGPANELLayout = new javax.swing.GroupLayout(CONFIGPANEL);
        CONFIGPANEL.setLayout(CONFIGPANELLayout);
        CONFIGPANELLayout.setHorizontalGroup(
            CONFIGPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(CONFIGPANELLayout.createSequentialGroup()
                .addGap(31, 31, 31)
                .addComponent(jPanel10, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(39, 39, 39)
                .addComponent(jPanel11, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(71, Short.MAX_VALUE))
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, CONFIGPANELLayout.createSequentialGroup()
                .addContainerGap(565, Short.MAX_VALUE)
                .addComponent(config_btSave, javax.swing.GroupLayout.PREFERRED_SIZE, 65, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(config_btReset, javax.swing.GroupLayout.PREFERRED_SIZE, 69, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(265, 265, 265))
        );
        CONFIGPANELLayout.setVerticalGroup(
            CONFIGPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(CONFIGPANELLayout.createSequentialGroup()
                .addGap(21, 21, 21)
                .addComponent(jPanel10, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(238, Short.MAX_VALUE))
            .addGroup(CONFIGPANELLayout.createSequentialGroup()
                .addGap(29, 29, 29)
                .addComponent(jPanel11, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(CONFIGPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(config_btReset, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(config_btSave, javax.swing.GroupLayout.PREFERRED_SIZE, 36, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(203, 203, 203))
        );

        jTabbedPane1.addTab("Configuration", CONFIGPANEL);

        javax.swing.GroupLayout RECIPIENTSEDITORPANELLayout = new javax.swing.GroupLayout(RECIPIENTSEDITORPANEL);
        RECIPIENTSEDITORPANEL.setLayout(RECIPIENTSEDITORPANELLayout);
        RECIPIENTSEDITORPANELLayout.setHorizontalGroup(
            RECIPIENTSEDITORPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(RECIPIENTSEDITORPANELLayout.createSequentialGroup()
                .addComponent(recipientsPanel, javax.swing.GroupLayout.PREFERRED_SIZE, 935, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(47, Short.MAX_VALUE))
        );
        RECIPIENTSEDITORPANELLayout.setVerticalGroup(
            RECIPIENTSEDITORPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(RECIPIENTSEDITORPANELLayout.createSequentialGroup()
                .addGap(22, 22, 22)
                .addComponent(recipientsPanel, javax.swing.GroupLayout.DEFAULT_SIZE, 587, Short.MAX_VALUE)
                .addContainerGap())
        );

        jTabbedPane1.addTab("Recipients Editor", RECIPIENTSEDITORPANEL);

        jPanel16.setBorder(javax.swing.BorderFactory.createTitledBorder("Contact Group"));

        jLabel12.setText("Add Contact Group:");

        javax.swing.GroupLayout jPanel16Layout = new javax.swing.GroupLayout(jPanel16);
        jPanel16.setLayout(jPanel16Layout);
        jPanel16Layout.setHorizontalGroup(
            jPanel16Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel16Layout.createSequentialGroup()
                .addGroup(jPanel16Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel12)
                    .addGroup(jPanel16Layout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(groupListPanel, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel16Layout.setVerticalGroup(
            jPanel16Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel16Layout.createSequentialGroup()
                .addComponent(jLabel12)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(groupListPanel, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        jPanel32.setBorder(javax.swing.BorderFactory.createTitledBorder("Results"));

        contactsResultsArea.setColumns(20);
        contactsResultsArea.setLineWrap(true);
        contactsResultsArea.setRows(5);
        jScrollPane8.setViewportView(contactsResultsArea);

        javax.swing.GroupLayout jPanel32Layout = new javax.swing.GroupLayout(jPanel32);
        jPanel32.setLayout(jPanel32Layout);
        jPanel32Layout.setHorizontalGroup(
            jPanel32Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel32Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jScrollPane8, javax.swing.GroupLayout.DEFAULT_SIZE, 843, Short.MAX_VALUE)
                .addContainerGap())
        );
        jPanel32Layout.setVerticalGroup(
            jPanel32Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel32Layout.createSequentialGroup()
                .addComponent(jScrollPane8, javax.swing.GroupLayout.DEFAULT_SIZE, 153, Short.MAX_VALUE)
                .addContainerGap())
        );

        btnNukeContacts.setText("Nuke Contacts");
        btnNukeContacts.setToolTipText("This will Nuke all records in Contacts Table");
        btnNukeContacts.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnNukeContactsActionPerformed(evt);
            }
        });

        btnPushContacts.setText("Push Contacts");
        btnPushContacts.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnPushContactsActionPerformed(evt);
            }
        });

        jLabel5.setText("Use this screen to assign a \"Group Name\" to the type of contacts you will be loading.");

        jLabel8.setText("The mobile application organizes the contact information according to group on the Main screen.  ");

        btnLoadContacts.setText("Load");
        btnLoadContacts.setToolTipText("Clicking this spawns thread to handle contacts stuff");
        btnLoadContacts.setEnabled(false);
        btnLoadContacts.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnLoadContactsActionPerformed(evt);
            }
        });

        btnCancelContacts.setText("Cancel");
        btnCancelContacts.setToolTipText("This will cancel thread");
        btnCancelContacts.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnCancelContactsActionPerformed(evt);
            }
        });

        jLabel21.setFont(new java.awt.Font("Tahoma", 3, 11));
        jLabel21.setText("Remember you can use the Contacts Editor to perform CRUD(s).");

        javax.swing.GroupLayout CONTACTSPANELLayout = new javax.swing.GroupLayout(CONTACTSPANEL);
        CONTACTSPANEL.setLayout(CONTACTSPANELLayout);
        CONTACTSPANELLayout.setHorizontalGroup(
            CONTACTSPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(CONTACTSPANELLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(CONTACTSPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jPanel32, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(CONTACTSPANELLayout.createSequentialGroup()
                        .addComponent(jPanel16, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(18, 18, 18)
                        .addGroup(CONTACTSPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                            .addComponent(contactsPickerPanel, javax.swing.GroupLayout.PREFERRED_SIZE, 449, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(CONTACTSPANELLayout.createSequentialGroup()
                                .addComponent(btnLoadContacts, javax.swing.GroupLayout.PREFERRED_SIZE, 80, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(18, 18, 18)
                                .addComponent(btnPushContacts, javax.swing.GroupLayout.PREFERRED_SIZE, 101, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(31, 31, 31)
                                .addComponent(btnCancelContacts, javax.swing.GroupLayout.PREFERRED_SIZE, 85, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(18, 18, 18)
                                .addComponent(btnNukeContacts))))
                    .addComponent(jLabel21)
                    .addComponent(jLabel5, javax.swing.GroupLayout.PREFERRED_SIZE, 434, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel8))
                .addContainerGap(93, Short.MAX_VALUE))
        );
        CONTACTSPANELLayout.setVerticalGroup(
            CONTACTSPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(CONTACTSPANELLayout.createSequentialGroup()
                .addGap(25, 25, 25)
                .addComponent(jLabel21)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel5)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel8)
                .addGroup(CONTACTSPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(CONTACTSPANELLayout.createSequentialGroup()
                        .addGap(49, 49, 49)
                        .addComponent(contactsPickerPanel, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(18, 18, 18)
                        .addGroup(CONTACTSPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(btnLoadContacts, javax.swing.GroupLayout.DEFAULT_SIZE, 56, Short.MAX_VALUE)
                            .addComponent(btnPushContacts, javax.swing.GroupLayout.DEFAULT_SIZE, 56, Short.MAX_VALUE)
                            .addComponent(btnCancelContacts, javax.swing.GroupLayout.DEFAULT_SIZE, 56, Short.MAX_VALUE)
                            .addComponent(btnNukeContacts, javax.swing.GroupLayout.PREFERRED_SIZE, 53, javax.swing.GroupLayout.PREFERRED_SIZE)))
                    .addGroup(CONTACTSPANELLayout.createSequentialGroup()
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(jPanel16, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel32, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(78, 78, 78))
        );

        jTabbedPane1.addTab("Contacts", CONTACTSPANEL);

        CONTACTSEDITORPANEL.setEnabled(false);

        javax.swing.GroupLayout jPanel14Layout = new javax.swing.GroupLayout(jPanel14);
        jPanel14.setLayout(jPanel14Layout);
        jPanel14Layout.setHorizontalGroup(
            jPanel14Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel14Layout.createSequentialGroup()
                .addComponent(contactsPanel, javax.swing.GroupLayout.DEFAULT_SIZE, 811, Short.MAX_VALUE)
                .addContainerGap())
        );
        jPanel14Layout.setVerticalGroup(
            jPanel14Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel14Layout.createSequentialGroup()
                .addComponent(contactsPanel, javax.swing.GroupLayout.PREFERRED_SIZE, 536, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(33, Short.MAX_VALUE))
        );

        javax.swing.GroupLayout CONTACTSEDITORPANELLayout = new javax.swing.GroupLayout(CONTACTSEDITORPANEL);
        CONTACTSEDITORPANEL.setLayout(CONTACTSEDITORPANELLayout);
        CONTACTSEDITORPANELLayout.setHorizontalGroup(
            CONTACTSEDITORPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(CONTACTSEDITORPANELLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jPanel14, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(151, Short.MAX_VALUE))
        );
        CONTACTSEDITORPANELLayout.setVerticalGroup(
            CONTACTSEDITORPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(CONTACTSEDITORPANELLayout.createSequentialGroup()
                .addGap(19, 19, 19)
                .addComponent(jPanel14, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        jTabbedPane1.addTab("Contacts Editor", CONTACTSEDITORPANEL);

        javax.swing.GroupLayout CALLPANELLayout = new javax.swing.GroupLayout(CALLPANEL);
        CALLPANEL.setLayout(CALLPANELLayout);
        CALLPANELLayout.setHorizontalGroup(
            CALLPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(CALLPANELLayout.createSequentialGroup()
                .addComponent(emergencyCallPanel, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        CALLPANELLayout.setVerticalGroup(
            CALLPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, CALLPANELLayout.createSequentialGroup()
                .addComponent(emergencyCallPanel, javax.swing.GroupLayout.PREFERRED_SIZE, 606, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        jTabbedPane1.addTab("Emergency Call", CALLPANEL);

        javax.swing.GroupLayout NOTIFYPANELLayout = new javax.swing.GroupLayout(NOTIFYPANEL);
        NOTIFYPANEL.setLayout(NOTIFYPANELLayout);
        NOTIFYPANELLayout.setHorizontalGroup(
            NOTIFYPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(NOTIFYPANELLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(emergencyNotificationPanel, javax.swing.GroupLayout.PREFERRED_SIZE, 932, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(40, Short.MAX_VALUE))
        );
        NOTIFYPANELLayout.setVerticalGroup(
            NOTIFYPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(NOTIFYPANELLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(emergencyNotificationPanel, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(94, Short.MAX_VALUE))
        );

        jTabbedPane1.addTab("Emergency Notification", NOTIFYPANEL);

        javax.swing.GroupLayout MONITORPANELLayout = new javax.swing.GroupLayout(MONITORPANEL);
        MONITORPANEL.setLayout(MONITORPANELLayout);
        MONITORPANELLayout.setHorizontalGroup(
            MONITORPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 982, Short.MAX_VALUE)
        );
        MONITORPANELLayout.setVerticalGroup(
            MONITORPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 599, Short.MAX_VALUE)
        );

        jTabbedPane1.addTab("Monitor", MONITORPANEL);

        jPanel21.setBorder(javax.swing.BorderFactory.createTitledBorder("Delete Group"));

        jLabel15.setText("Delete Group:");

        jTextField8.setText("Group Name");

        jButton5.setIcon(new javax.swing.ImageIcon(getClass().getResource("/eclserver/images/Bin_Full.png"))); // NOI18N
        jButton5.setToolTipText("Enter Group Name to delete");
        jButton5.setBorderPainted(false);
        jButton5.setContentAreaFilled(false);

        javax.swing.GroupLayout jPanel21Layout = new javax.swing.GroupLayout(jPanel21);
        jPanel21.setLayout(jPanel21Layout);
        jPanel21Layout.setHorizontalGroup(
            jPanel21Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel21Layout.createSequentialGroup()
                .addContainerGap(38, Short.MAX_VALUE)
                .addComponent(jLabel15)
                .addGap(18, 18, 18)
                .addComponent(jTextField8, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(4, 4, 4)
                .addComponent(jButton5, javax.swing.GroupLayout.PREFERRED_SIZE, 46, javax.swing.GroupLayout.PREFERRED_SIZE))
        );
        jPanel21Layout.setVerticalGroup(
            jPanel21Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel21Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel21Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel15)
                    .addComponent(jTextField8, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
            .addComponent(jButton5)
        );

        jPanel26.setBorder(javax.swing.BorderFactory.createTitledBorder("Delete URL"));

        jLabel17.setText("URL:");

        jTextField10.setText("http://");

        jButton6.setIcon(new javax.swing.ImageIcon(getClass().getResource("/eclserver/images/Delete.png"))); // NOI18N
        jButton6.setToolTipText("Enter URL(s) to delete from mobile application");
        jButton6.setBorderPainted(false);
        jButton6.setContentAreaFilled(false);

        javax.swing.GroupLayout jPanel26Layout = new javax.swing.GroupLayout(jPanel26);
        jPanel26.setLayout(jPanel26Layout);
        jPanel26Layout.setHorizontalGroup(
            jPanel26Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel26Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel17)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jTextField10, javax.swing.GroupLayout.PREFERRED_SIZE, 170, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jButton6, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel26Layout.setVerticalGroup(
            jPanel26Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel26Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(jPanel26Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jTextField10, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel17))
                .addGap(290, 290, 290))
            .addGroup(jPanel26Layout.createSequentialGroup()
                .addComponent(jButton6, javax.swing.GroupLayout.PREFERRED_SIZE, 36, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap())
        );

        jPanel27.setBorder(javax.swing.BorderFactory.createTitledBorder("Update Email Address"));

        jLabel19.setText("Email Address:");

        jTextField12.setToolTipText("test@email.com");

        jButton7.setIcon(new javax.swing.ImageIcon(getClass().getResource("/eclserver/images/Edit.png"))); // NOI18N
        jButton7.setToolTipText("Enter email address to update mobile app");
        jButton7.setBorderPainted(false);
        jButton7.setContentAreaFilled(false);

        javax.swing.GroupLayout jPanel27Layout = new javax.swing.GroupLayout(jPanel27);
        jPanel27.setLayout(jPanel27Layout);
        jPanel27Layout.setHorizontalGroup(
            jPanel27Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel27Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel19)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jTextField12, javax.swing.GroupLayout.DEFAULT_SIZE, 115, Short.MAX_VALUE)
                .addGap(36, 36, 36)
                .addComponent(jButton7, javax.swing.GroupLayout.PREFERRED_SIZE, 35, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap())
        );
        jPanel27Layout.setVerticalGroup(
            jPanel27Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel27Layout.createSequentialGroup()
                .addGap(10, 10, 10)
                .addGroup(jPanel27Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel19)
                    .addComponent(jTextField12, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
            .addComponent(jButton7, javax.swing.GroupLayout.PREFERRED_SIZE, 38, javax.swing.GroupLayout.PREFERRED_SIZE)
        );

        jPanel28.setBorder(javax.swing.BorderFactory.createTitledBorder("Disable Application"));

        jLabel20.setText("Email Address:");

        jTextField13.setText("test@email.com");

        jButton8.setIcon(new javax.swing.ImageIcon(getClass().getResource("/eclserver/images/Burn.png"))); // NOI18N
        jButton8.setToolTipText("This will nuke the application on all recipients devices!");
        jButton8.setBorderPainted(false);
        jButton8.setContentAreaFilled(false);

        javax.swing.GroupLayout jPanel28Layout = new javax.swing.GroupLayout(jPanel28);
        jPanel28.setLayout(jPanel28Layout);
        jPanel28Layout.setHorizontalGroup(
            jPanel28Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel28Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel20)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jTextField13, javax.swing.GroupLayout.PREFERRED_SIZE, 126, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(jButton8, javax.swing.GroupLayout.PREFERRED_SIZE, 34, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel28Layout.setVerticalGroup(
            jPanel28Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jButton8, 0, 0, Short.MAX_VALUE)
            .addGroup(jPanel28Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel28Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel20)
                    .addComponent(jTextField13, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
        );

        javax.swing.GroupLayout ADMINPANELLayout = new javax.swing.GroupLayout(ADMINPANEL);
        ADMINPANEL.setLayout(ADMINPANELLayout);
        ADMINPANELLayout.setHorizontalGroup(
            ADMINPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(ADMINPANELLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(ADMINPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(ADMINPANELLayout.createSequentialGroup()
                        .addComponent(jPanel21, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(18, 18, 18)
                        .addComponent(jPanel27, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addContainerGap(369, Short.MAX_VALUE))
                    .addGroup(ADMINPANELLayout.createSequentialGroup()
                        .addComponent(jPanel26, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(18, 18, 18)
                        .addComponent(jPanel28, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addGap(1012, 1012, 1012))))
            .addGroup(ADMINPANELLayout.createSequentialGroup()
                .addGap(22, 22, 22)
                .addComponent(recipientsPickerPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(546, Short.MAX_VALUE))
        );
        ADMINPANELLayout.setVerticalGroup(
            ADMINPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(ADMINPANELLayout.createSequentialGroup()
                .addGap(29, 29, 29)
                .addComponent(recipientsPickerPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(46, 46, 46)
                .addGroup(ADMINPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(jPanel21, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jPanel27, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(39, 39, 39)
                .addGroup(ADMINPANELLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jPanel26, javax.swing.GroupLayout.DEFAULT_SIZE, 76, Short.MAX_VALUE)
                    .addComponent(jPanel28, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addGap(480, 480, 480))
        );

        jTabbedPane1.addTab("Administration", ADMINPANEL);

        progressLoadingContacts.setEnabled(false);

        javax.swing.GroupLayout jPanel13Layout = new javax.swing.GroupLayout(jPanel13);
        jPanel13.setLayout(jPanel13Layout);
        jPanel13Layout.setHorizontalGroup(
            jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel13Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(progressLoadingContacts, javax.swing.GroupLayout.PREFERRED_SIZE, 367, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jTabbedPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 987, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel13Layout.setVerticalGroup(
            jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel13Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jTabbedPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 627, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 34, Short.MAX_VALUE)
                .addComponent(progressLoadingContacts, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(7, 7, 7))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jPanel13, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel13, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

private void config_btSaveActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_config_btSaveActionPerformed
// TODO add your handling code here:
    
    if(config_AppPort.getText().length() > 0) 
    {
        saveConfigScreen();
    } else {
        JOptionPane.showMessageDialog(this, "Check BES Settings");
    }
    
}//GEN-LAST:event_config_btSaveActionPerformed

private void config_btResetActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_config_btResetActionPerformed
// TODO add your handling code here:
            screenProperties = dbFactory.getScreenProperties();
            this.setupConfigScreen(screenProperties);
    
}//GEN-LAST:event_config_btResetActionPerformed

    private void btnLoadContactsActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnLoadContactsActionPerformed
        // TODO add your handling code here:

        if (groupListPanel.getSelectedIndex() > -1){
            if (contactsLoader != null && !contactsLoader.isDone()) {
                // cancel current contacts load to begin a new one
                // only want one contacts load at a time.
                contactsLoader.cancel(true);
                contactsLoader = null;
                progressLoadingContacts.setEnabled(false);
            }     

            String strFileLocation = contactsPickerPanel.getFileLocation(); 
            String groupName = groupListPanel.getSelectedListEntry().getGroupName();
            contactsResultsArea.append("Retrieving Contacts file at specified path :\n" + strFileLocation + "\n");

            if ((strFileLocation.length() > 0) && (groupName.length() > 0)) {
     
            try{

                progressLoadingContacts.setEnabled(true);
                File source = new File(strFileLocation);
                      
                contactsLoader = new ContactsLoader(addressDao, contactsPanel, contactsResultsArea, groupName, source);
                contactsLoader.addPropertyChangeListener(listenerLoadingContacts);
                progressLoadingContacts.setIndeterminate(true);

                // start the Load!
                contactsLoader.execute();
                // this event thread continues immediately here without blocking
                
         }catch (Exception ex){
             System.out.println("Error Load Contacts Action. " + ex.getMessage());
             contactsResultsArea.append("Excepection Load Contacts Starting thread.");
             contactsPickerPanel.showFields();
         }
        } else {
            System.out.println("Please verify:  GroupName selected = " + groupName + " FileLocation=" + strFileLocation);
            JOptionPane.showMessageDialog(this, "Please verify:  GroupName selected = " + groupName + " FileLocation=" + strFileLocation);
        } 
      } else {
            JOptionPane.showMessageDialog(this, "Please verify a GroupName is selected.");
      }
    }//GEN-LAST:event_btnLoadContactsActionPerformed

    private void btnCancelContactsActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnCancelContactsActionPerformed
        // TODO add your handling code here:
       try {
          
          progressLoadingContacts.setIndeterminate(false);
          progressLoadingContacts.setEnabled(false);
          btnLoadContacts.setEnabled(true);
          contactsPickerPanel.showFields();
           
           if (contactsLoader != null && !contactsLoader.isDone()) {
            // cancel current contactsLoader load to begin a new one
            // only want one contactsLoader load at a time.
            contactsLoader.cancel(true);
            contactsLoader = null;
            
            }     
          
          if (contactsPusher != null && !contactsPusher.isDone()) {
            // cancel current contactsPusher load to begin a new one
            // only want one contactsPusher load at a time.
            contactsPusher.cancel(true);
            contactsPusher = null;
            }
        
          
     }catch (Exception ex){
          System.out.println("Error canceling contacts thread: " + ex.getMessage());
          JOptionPane.showMessageDialog(this, "Threads have been nuked!" );
      }   
    }//GEN-LAST:event_btnCancelContactsActionPerformed

    private void btnNukeContactsActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnNukeContactsActionPerformed
        // TODO add your handling code here:
        boolean dDone = false;
         try {
         
             int result = JOptionPane.showOptionDialog(this, "Do you really want to nuke previously loaded contacts?", "Nuke Previous Contact Loads", JOptionPane.YES_NO_OPTION,JOptionPane.INFORMATION_MESSAGE, null,null,null);
             System.out.println("User selected " + result);
  
            if (result == 0){
              dDone = addressDao.nukeRecords();
              contactsPanel.removeAllEntries();
              btnLoadContacts.setEnabled(false);
              contactsPickerPanel.showFields();
              
              contactsPanel.clearPanel();
            }
            
       }catch (Exception ex) {
           System.out.println("Error canceling Nuke thread for Contacts: " + ex.getMessage());
           contactsResultsArea.append("Exception canceling thread");
       }  
      
      if(dDone){
         JOptionPane.showMessageDialog(this, "Goodbye Contacts Table, Nuked!" );
      }    
    }//GEN-LAST:event_btnNukeContactsActionPerformed

    private void btnPushContactsActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnPushContactsActionPerformed
        // TODO add your handling code here:
        if (threadsRunning()){
            JOptionPane.showMessageDialog(this, "There are threads still running.  "
                    + "Cancel those before attempting another Push." );
        
        } else {       
        if (contactsPusher != null && !contactsPusher.isDone()) {
            // cancel current contactsPusher load to begin a new one
            // only want one contactsPusher load at a time.
            
             
            contactsResultsArea.setText("");
            contactsPusher.cancel(true);
            contactsPusher = null;
            progressLoadingContacts.setEnabled(false);
        }     
         
           try{
                contactsResultsArea.setText("");
                System.out.println("Pushing Contacts initiated");
                progressLoadingContacts.setEnabled(true);

                String computername=InetAddress.getLocalHost().getHostName();
                System.out.println(" from HOST:  " + computername);
                
                List<ServerObject> webList = webListDao.getListEntries();
                
                String confURL = "";
                 if(webList.size() < 1 ){
                   confURL = "";  
                 } else {
                   confURL = "http://" + webList.get(0).getServerHost() + ":" + 
                        webList.get(0).getServerPort() + "" + config_WebVD.getText().toString();
                 }
                    System.out.println("This is the confirmation URL " + confURL);
  
                    contactsPusher = new ContactsPush(besListDao, addressDao, recListDao, recipientsPanel, contactsResultsArea, config_AppPort.getText(), computername, confURL);
                      
                    contactsPusher.addPropertyChangeListener(listenerLoadingContacts);
                    progressLoadingContacts.setIndeterminate(true);

                    // start the Load!
                    contactsPusher.execute();
                    // this event thread continues immediately here without blockin
           }catch (Exception ex){
             System.out.println("Error Load Contacts Action. " + ex.getMessage());
             contactsResultsArea.append("Excepection Starting thread.");
            // TODO:  ARE THERE ANY BUTTONS TO RESET?             
             
         }
        }
        
    }//GEN-LAST:event_btnPushContactsActionPerformed
   
  
  private void loadContacts(){
  //    System.out.println("Enabling Load button ");
      btnLoadContacts.setEnabled(true);
  
  }
  
  private void nukeRecipients(){
     boolean dDone = false;
          
      try{
          dDone = recListDao.nukeRecords();
       }catch (Exception ex) {
           System.out.println("Error clearing Recipients table: " + ex.getMessage());
           contactsResultsArea.append("Exception clearing Recipients table");
       }  
      
      if(dDone){
         JOptionPane.showMessageDialog(this, "Goodbye Receipients table, Nuked!" );
      }    
   

  }
  
  
  
  private void cancelRecipientsFile(){
    
      try {
          if (recipientsLoader != null && !recipientsLoader.isDone()) {
            // cancel current recipientsLoader load to begin a new one
            // only want one recipientsLoader load at a time.
            recipientsLoader.cancel(true);
            recipientsLoader = null;
            progressLoadingContacts.setEnabled(false);
            }          
          
          if (recipientBesMatcher != null && !recipientBesMatcher.isDone()) {
            // cancel current recipientBesMatcher load to begin a new one
            // only want one recipientBesMatcher load at a time.
            recipientBesMatcher.cancel(true);
            recipientBesMatcher = null;
            progressLoadingContacts.setEnabled(false);
            }
     }catch (Exception ex){
          System.out.println("Error canceling recipient thread: " + ex.getMessage());
          JOptionPane.showMessageDialog(this, "You nuked those threads!" );
      }
  }
  
  private void validateRecipients(){
  //    System.out.println("Validating recipients thread starting...");  
      try {
          if (recipientBesMatcher != null && !recipientBesMatcher.isDone()) {
            // cancel current recipientsLoader load to begin a new one
            // only want one recipientsLoader load at a time.
            recipientBesMatcher.cancel(true);
            recipientBesMatcher = null;
            progressLoadingContacts.setEnabled(false);
          }
             
             progressLoadingContacts.setEnabled(true);
             recipientBesMatcher = new RecipientBESMatch(recipientsPanel, recListDao, besListDao, config_AppPort.getText().toString());
                      
             recipientBesMatcher.addPropertyChangeListener(listenerLoadingContacts);
             progressLoadingContacts.setIndeterminate(true);

            // start the Load!
            recipientBesMatcher.execute();
            // this event thread continues immediately here without blocking

     }catch (Exception ex){
          System.out.println("Error canceling recipient thread: " + ex.getMessage());
          JOptionPane.showMessageDialog(this, "Error stopping thread." );
      }
      
  }
  
  
  private void readRecipientsFile() {
      
      if (recipientsLoader != null && !recipientsLoader.isDone()) {
            // cancel current recipientsLoader load to begin a new one
            // only want one recipientsLoader load at a time.
            recipientsLoader.cancel(true);
            recipientsLoader = null;
            progressLoadingContacts.setEnabled(false);
        }     
         
        String strFileLocation = recipientsPanel.getFileLocation();
        recipientsPanel.printToResults("Retrieving Contacts file at specified path :\n" + strFileLocation + "\n");
        
        if (strFileLocation.length() > 0) {
     
            try{
                progressLoadingContacts.setEnabled(true);
                File source = new File(strFileLocation);
                if (source.isFile() && source.getAbsolutePath().endsWith(".csv")) {
                  
                    recipientsLoader = new RecipientsLoader(recListDao, recipientsPanel, source);
                      
                     recipientsLoader.addPropertyChangeListener(listenerLoadingContacts);
                     progressLoadingContacts.setIndeterminate(true);

                    // start the Load!
                    recipientsLoader.execute();
                    // this event thread continues immediately here without blocking
                }
         }catch (Exception ex){
             System.out.println("Error Load Contacts Action. " + ex.getMessage());
             recipientsPanel.printToResults("Excepection Starting thread.");
             recipientsPanel.resetButtons();
         }
        } else {
            System.out.println("Please verify: FileLocation=" + strFileLocation);
            JOptionPane.showMessageDialog(this, "Please verify: FileLocation=" + strFileLocation);
        }     
  }
  
  private void sendCall() {
      
      if (emergencyCallPusher != null && !emergencyCallPusher.isDone()) {
            // cancel current recipientsLoader load to begin a new one
            // only want one recipientsLoader load at a time.
            emergencyCallPusher.cancel(true);
            emergencyCallPusher = null;
            progressLoadingContacts.setEnabled(false);
        }     
         
        String strFileLocation = recipientsPanel.getFileLocation();
        recipientsPanel.printToResults("Retrieving Contacts file at specified path :\n" + strFileLocation + "\n");
        
        if (strFileLocation.length() > 0) {
     
            try{
                progressLoadingContacts.setEnabled(true);
                List<ServerObject> webList = webListDao.getListEntries();
                String confURL = "";
                 if(webList.size() < 1 ){
                   confURL = "";  
                 } else {
                   confURL = "http://" + webList.get(0).getServerHost() + ":" + 
                        webList.get(0).getServerPort() + "" + config_WebVD.getText().toString();
                 }
                    System.out.println("This is the confirmation URL " + confURL);
                  
                    emergencyCallPusher = new EmergencyCallPush(besListDao, recListDao, 
                            emergencyCallPanel, recipientsPanel, config_AppPort.getText(), computerName, confURL);
                      
                     emergencyCallPusher.addPropertyChangeListener(listenerLoadingContacts);
                     progressLoadingContacts.setIndeterminate(true);

                    // start the Load!
                    emergencyCallPusher.execute();
                    // this event thread continues immediately here without blocking
              
         }catch (Exception ex){
             System.out.println("Error Sending Emergency Call Action. " + ex.getMessage());
             recipientsPanel.printToResults("Excepection Starting thread.");
             recipientsPanel.resetButtons();
         }
        } else {
            System.out.println("Please verify: FileLocation=" + strFileLocation);
            JOptionPane.showMessageDialog(this, "Please verify: FileLocation=" + strFileLocation);
        }     
  }
  
  
  private void sendNotification(){
      if (emergencyNotifyPusher != null && !emergencyNotifyPusher.isDone()) {
                // cancel current contacts load to begin a new one
                // only want one contacts load at a time.
                emergencyNotifyPusher.cancel(true);
                emergencyNotifyPusher = null;
                progressLoadingContacts.setEnabled(false);
            }  
      
       String notifyDetails = emergencyNotificationPanel.getNotifyDetails();
      
       if (notifyDetails.length() > 0) {
        
           emergencyNotificationPanel.printToResults("Sending emergency notification:\n" + notifyDetails);
            
           try{
                progressLoadingContacts.setEnabled(true);
               
                List<ServerObject> webList = webListDao.getListEntries();
                String confURL = "";
                 if(webList.size() < 1 ){
                   confURL = "";  
                 } else {
                   confURL = "http://" + webList.get(0).getServerHost() + ":" + 
                        webList.get(0).getServerPort() + "" + config_WebVD.getText();
                 }
                    System.out.println("This is the confirmation URL " + confURL);
                    emergencyNotifyPusher = new EmergencyNotifyPush(besListDao, recListDao, 
                            emergencyNotificationPanel, recipientsPanel, config_AppPort.getText(), computerName, confURL);
                      
                     emergencyNotifyPusher.addPropertyChangeListener(listenerLoadingContacts);
                     progressLoadingContacts.setIndeterminate(true);

                    // start the Load!
                    emergencyNotifyPusher.execute();
                    // this event thread continues immediately here without blocking
                
         }catch (Exception ex){
             System.out.println("Error Sending Notification Action. " + ex.getMessage());
             emergencyNotificationPanel.printToResults("Excepection Starting thread.");
             emergencyNotificationPanel.resetButtons();
         }
        } else {
            System.out.println("Please verify Notification Details length.\n");
            JOptionPane.showMessageDialog(this, "Notification Details must have something.");
        }   
      
      
      
  }

 

 private void ensureEventThread() {
    if(SwingUtilities.isEventDispatchThread()) {
      return;
    }
    throw new RuntimeException("EXCEPTION:  RuntimeException in ensureEventThread()");
  }

 
    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(NewJFrame.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(NewJFrame.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(NewJFrame.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(NewJFrame.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {

            public void run() {
                new NewJFrame().setVisible(true);
            }
        });
    }
    
    
     public void actionPerformed(ActionEvent e) {
        String actionCommand = e.getActionCommand();
       // System.out.println("ActionEvent: " + actionCommand);
        if (actionCommand.equalsIgnoreCase("DELETE_ADDRESS")) {
            deleteAddress();
        } else if (actionCommand.equalsIgnoreCase("SAVE_ADDRESS")) {
            saveAddress();
        } else if (actionCommand.equalsIgnoreCase("SAVE_WEB")) {
            saveWeb();
        } else if (actionCommand.equalsIgnoreCase("DELETE_WEB")) {
            deleteWeb();
        } else if (actionCommand.equalsIgnoreCase("LOAD_RECIPIENTS")){
            readRecipientsFile();
        } else if (actionCommand.equalsIgnoreCase("CHECK_RECIPIENTS")){
            validateRecipients();
        } else if (actionCommand.equalsIgnoreCase("CANCEL_RECIPIENTS")){
            cancelRecipientsFile();
        } else if (actionCommand.equalsIgnoreCase("NUKE_RECIPIENTS")){
            nukeRecipients();
        } else if (actionCommand.equalsIgnoreCase("SAVE_RECIPIENT")){
            saveRecipient();
        } else if (actionCommand.equalsIgnoreCase("DELETE_RECIPIENT")){
            deleteRecipient();
        } else if (actionCommand.equalsIgnoreCase("DELETE_CONTACT")){
            deleteContact();
        } else if (actionCommand.equalsIgnoreCase("SAVE_CONTACT")) {
            saveContact();
        } else if (actionCommand.equalsIgnoreCase("LOAD_CONTACTS")){
            loadContacts();
        } else if (actionCommand.equalsIgnoreCase("SAVE_GROUP")){
            saveGroup();
        } else if (actionCommand.equalsIgnoreCase("DELETE_GROUP")){
            deleteGroup();
        } else if (actionCommand.equalsIgnoreCase("SEND_NOTIFICATION")){
            sendNotification();
        } else if (actionCommand.equalsIgnoreCase("SEND_CALL")) {
            sendCall();
        }
            
            
    }

     
      private void saveAddress() {
          //This function tests to see if BES ADDRESS PROVIDED IS REACHABLE.
         try {
           
            String[] address = config_BESList.getServerPort().split(":");
            if (address.length == 2){
               
                int timeOut = 3000; // I recommend 3 seconds at least
                boolean status = InetAddress.getByName(address[0]).isReachable(timeOut);
                
                if (status) {
                
                    ServerObject so = new ServerObject(address[0], address[1]);
                    int id = besListDao.saveRecord(so);

                    ServerObject entry = new ServerObject(address[0], address[1], id);
                    config_BESList.addListEntry(entry);
                    config_BESList.setServerPort("");
                } else {
                    JOptionPane.showMessageDialog(this, "Your Machine can't ping"
                            + " this BES ADDESS so push won't work.");                    
                }             
            } else {
                JOptionPane.showMessageDialog(this, "Value must be host name : port.  e.g. local:8080");
            }
            
            
        } catch (UnknownHostException une){
             JOptionPane.showMessageDialog(this, "Saving Failed Check to make sure "
                     + "host is reachable: " + une.getMessage());
        }catch (Exception ex){
             JOptionPane.showMessageDialog(this, "Saving Failed: " + ex.getMessage());
         }
         
      }
      
   
       private void deleteAddress() {
            
        try{
            int id = config_BESList.getSelectedEntry();

            if (id != -1) {
                ServerObject sle = config_BESList.getSelectedListEntry();
                System.out.println("Deleting sleID: " + sle.getId());
                besListDao.deleteRecord(sle.getId());

                config_BESList.deleteSelectedEntry();

            } else {
                JOptionPane.showMessageDialog(this, "Select a list item to delete.");
            }
       
        }catch (Exception ex){
             JOptionPane.showMessageDialog(this, "Delete Failed: " + ex.getMessage());
         }
        
    }
     
       private void saveWeb() {
           
         try {  
           String[] address = config_WebList.getWebPort().split(":");
            if (address.length == 2){
                
                ServerObject so = new ServerObject(address[0], address[1]);
                
                int id = webListDao.saveRecord(so);

                ServerObject entry = new ServerObject(address[0], address[1], id);
                config_WebList.addListEntry(entry);
                config_WebList.setWebPort("");


            } else {
                JOptionPane.showMessageDialog(this, "Value must be host name : port.  e.g. local:8080");
            }
            
         } catch (Exception ex){
             System.out.println("Error Saving Web Address " + ex.getMessage());
         }
       }
    
       private void deleteWeb() {
        int id = config_WebList.getSelectedEntry();
        
        if (id != -1) {
            ServerObject sle = config_WebList.getSelectedListEntry();
            System.out.println("Deleting sleID: " + sle.getId());
            webListDao.deleteRecord(sle.getId());
            
            config_WebList.deleteSelectedEntry();
           
        } else {
            JOptionPane.showMessageDialog(this, "Select a list item to delete.");
        }
       
    }
       
        private void deleteContact() {
            
        try{
             AddressObject sle = contactsPanel.getSelectedListEntry();
             System.out.println("Deleting sleID: " + sle.getId());
                addressDao.deleteRecord(sle.getId());
                
                contactsPanel.removeListEntry();
                contactsPanel.resetButtons();
                contactsPanel.clearPanel();

        }catch (Exception ex){
             JOptionPane.showMessageDialog(this, "Delete Failed: " + ex.getMessage());
         }
        
    }
        
        private void saveContact() {
            
        try{
            AddressObject ao = contactsPanel.getPanelEntry();
          //  System.out.println("Checling ao: " + ao.getId());
            
            if(ao.getId() < 1) {
                     System.out.println("Saving record");
                     int id = addressDao.saveRecord(contactsPanel.getPanelEntry());
                     AddressObject adObj = new AddressObject(ao.getGroupName(),
                             ao.getLastName(), ao.getFirstName(), ao.getEmail(),
                             ao.getHomePhone(), ao.getWorkPhone(), ao.getMobilePhone(),
                             ao.getPin(), ao.getAddress1(), ao.getAddress2(), 
                             ao.getCity(), ao.getState(), ao.getZip(),
                             ao.getCountry(), ao.getTitle(), ao.getCompany(), id);
                     contactsPanel.addContactsListEntry(adObj);
            }else{
             //   System.out.println("Editing record.");
             //   System.out.println("contactsPanel.getPanelEntry " + contactsPanel.getPanelEntry().getId());
                addressDao.editRecord(ao);
                System.out.println("Updating: " + ao.getId() + " list number: " + contactsPanel.getListSelection());
                contactsPanel.updateListEntry(ao, contactsPanel.getListSelection());
            }
                     
            contactsPanel.resetButtons();
            contactsPanel.clearPanel();

        }catch (Exception ex){
             JOptionPane.showMessageDialog(this, "Saving Contact Failed: " + ex.getMessage());
         }
        
    }
        
        
        private void deleteRecipient() {
            
        try{
             RecipientObject sle = recipientsPanel.getSelectedListEntry();
             System.out.println("Deleting sleID: " + sle.getId());
                recListDao.deleteRecord(sle.getId());
                
                recipientsPanel.removeListEntry();
                recipientsPanel.resetButtons();
                recipientsPanel.clearPanel();

        }catch (Exception ex){
             JOptionPane.showMessageDialog(this, "Saving Failed: " + ex.getMessage());
         }
        
    }
        
        private void saveRecipient() {
            
        try{
        //    System.out.println("saveRec ");
            RecipientObject ro = recipientsPanel.getPanelEntry();
         //   System.out.println("Checling ro: " + ro.getId() + " email: " + ro.getRecEmail() + " bes: " + ro.getUserBes());
            
            if(ro.getId() < 1) {
              //       System.out.println("Saving record");
                     int id = recListDao.saveRecord(recipientsPanel.getPanelEntry());
                     RecipientObject recObj = new RecipientObject(ro.getRecEmail(),
                             ro.getUserBes(), "N", "none", id);
                     recipientsPanel.addRecipientsListEntry(recObj);
            }else{
             //   System.out.println("Editing record.");
            //    System.out.println("recipientsPanel.getPanelEntry " + recipientsPanel.getPanelEntry().getId());
                recListDao.editRecord(ro);
            //    System.out.println("Updating: " + ro.getId() + " record: " + recipientsPanel.getListSelection());
                recipientsPanel.updateListEntry(ro, recipientsPanel.getListSelection());
            }
                     
            recipientsPanel.resetButtons();

        }catch (Exception ex){
             JOptionPane.showMessageDialog(this, "Saving Failed: " + ex.getMessage());
         }
        
    }
              
        
        private void saveGroup() {
            String address = groupListPanel.getGroupName();
            if (address.length() > 1){
               GroupObject go = new GroupObject(address);
                
                int id = groupsDao.saveRecord(go);

                GroupObject entry = new GroupObject(address, id);
                groupListPanel.addListEntry(entry);
                groupListPanel.setGroupName(null);


            } else {
                JOptionPane.showMessageDialog(this, "Value must be more than 1");
            }
            
        }
    
       private void deleteGroup() {
        int id = groupListPanel.getSelectedEntry();
        
        if (id != -1) {
            GroupObject sle = groupListPanel.getSelectedListEntry();
            System.out.println("Deleting sleID: " + sle.getId());
            groupsDao.deleteRecord(sle.getId());
            
            groupListPanel.deleteSelectedEntry();
           
        } else {
            JOptionPane.showMessageDialog(this, "Select a list item to delete.");
        }
       
    }
        
       
       public void setupConfigScreen(HashMap props){
           
           try {
               config_AppPort.setText((String)props.get("screen.config_AppPort"));
               config_WebVD.setText((String)props.get("screen.config_WebVD"));
               
           } catch (Exception ex){
               System.out.println("Error Setting Screen with properties hash: " + ex.getMessage());
           }
           
           
           
       }
       
       public void saveConfigScreen(){
    //       System.out.println("SaveConfigScreen() called");
           try {
              //String appPort, String webVD
               dbFactory.saveProperties(config_AppPort.getText(), config_WebVD.getText() );
              
           } catch (Exception ex){
               System.out.println("Error Setting Screen with properties hash: " + ex.getMessage());
           }
           
           
           
       }
       
       private boolean threadsRunning(){
           
           boolean vRun = false;
           
           if ((recipientsLoader!= null && !recipientsLoader.isDone()) ||
                   (contactsLoader!= null && !contactsLoader.isDone()) ||
                   (recipientBesMatcher!= null && !recipientBesMatcher.isDone()) ||
                   (contactsPusher!= null && !contactsPusher.isDone()) ||
                   (emergencyCallPusher!= null && !emergencyCallPusher.isDone()) ||
                   (emergencyNotifyPusher!= null && !emergencyNotifyPusher.isDone())){
               
               vRun = true;
           }
           
           return vRun;
           
       }
       
      

    
    
    
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JPanel ADMINPANEL;
    private javax.swing.JPanel CALLPANEL;
    private javax.swing.JPanel CONFIGPANEL;
    private javax.swing.JPanel CONTACTSEDITORPANEL;
    private javax.swing.JPanel CONTACTSPANEL;
    private javax.swing.JPanel MONITORPANEL;
    private javax.swing.JPanel NOTIFYPANEL;
    private javax.swing.JPanel RECIPIENTSEDITORPANEL;
    private javax.swing.JButton btnCancelContacts;
    private javax.swing.JButton btnLoadContacts;
    private javax.swing.JButton btnNukeContacts;
    private javax.swing.JButton btnPushContacts;
    private javax.swing.JTextField config_AppPort;
    private eclserver.panels.BesListPanel config_BESList;
    private eclserver.panels.WebListPanel config_WebList;
    private javax.swing.JTextField config_WebVD;
    private javax.swing.JButton config_btReset;
    private javax.swing.JButton config_btSave;
    private eclserver.panels.ContactsPanel contactsPanel;
    private eclserver.panels.contactsPickerPanel contactsPickerPanel;
    private javax.swing.JTextArea contactsResultsArea;
    private eclserver.panels.EmergencyCallPanel emergencyCallPanel;
    private eclserver.panels.EmergencyNotificationPanel emergencyNotificationPanel;
    private eclserver.panels.GroupListPanel groupListPanel;
    private javax.swing.JButton jButton5;
    private javax.swing.JButton jButton6;
    private javax.swing.JButton jButton7;
    private javax.swing.JButton jButton8;
    private javax.swing.JDialog jDialog1;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
    private javax.swing.JLabel jLabel12;
    private javax.swing.JLabel jLabel14;
    private javax.swing.JLabel jLabel15;
    private javax.swing.JLabel jLabel17;
    private javax.swing.JLabel jLabel18;
    private javax.swing.JLabel jLabel19;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel20;
    private javax.swing.JLabel jLabel21;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel10;
    private javax.swing.JPanel jPanel11;
    private javax.swing.JPanel jPanel13;
    private javax.swing.JPanel jPanel14;
    private javax.swing.JPanel jPanel16;
    private javax.swing.JPanel jPanel21;
    private javax.swing.JPanel jPanel26;
    private javax.swing.JPanel jPanel27;
    private javax.swing.JPanel jPanel28;
    private javax.swing.JPanel jPanel32;
    private javax.swing.JScrollPane jScrollPane8;
    private javax.swing.JTabbedPane jTabbedPane1;
    private javax.swing.JTextField jTextField10;
    private javax.swing.JTextField jTextField12;
    private javax.swing.JTextField jTextField13;
    private javax.swing.JTextField jTextField8;
    private javax.swing.JProgressBar progressLoadingContacts;
    private eclserver.panels.RecipientsPanel recipientsPanel;
    private eclserver.panels.recipientsPickerPanel recipientsPickerPanel1;
    // End of variables declaration//GEN-END:variables

   
    
    
    
class WindowCloser extends WindowAdapter {
        public void windowClosing(WindowEvent e) {
            
            System.out.println("Shutting down application.\n Saving data...");
            saveConfigScreen();
            dbFactory.disconnect();
        }
    
    }

/**
     * ProgressListener listens to "progress" property
     * changes in the SwingWorkers that search and load
     * images.
     */
    class ProgressListener implements PropertyChangeListener {
        // prevent creation without providing a progress bar
        private ProgressListener() {}
        
        ProgressListener(JProgressBar progressBar) {
            this.progressBar = progressBar;
            this.progressBar.setValue(0);
        }
        
        public void propertyChange(PropertyChangeEvent evt) {
            String strPropertyName = evt.getPropertyName();
            if ("progress".equals(strPropertyName)) {
                progressBar.setIndeterminate(false);
                int progress = (Integer)evt.getNewValue();
                progressBar.setValue(progress);
            }
        }
        
        private JProgressBar progressBar;
    }
}

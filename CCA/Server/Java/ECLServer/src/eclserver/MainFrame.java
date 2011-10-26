package eclserver;

/**********************************************           
**        
**       
** Copyright 2011 Research In Motion Limited.
**
** Licensed under the Apache License, Version 2.0 (the "License");
** you may not use this file except in compliance with the License.
** You may obtain a copy of the License at
*
** http://www.apache.org/licenses/LICENSE-2.0
*
** Unless required by applicable law or agreed to in writing, software
** distributed under the License is distributed on an "AS IS" BASIS,
** WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
** See the License for the specific language governing permissions and
** limitations under the License.
**   
**    JFrame
**        Panel 1 (Configuration)
**				B1: Load Default
*				Panel 2 (MDS)
**						Label1:  Address   txtMDSAddress
**        				Label2:  Port		txtMDSPort
**        		Panel 3 (Device)
**						Label 3:  PIN		txtDevicePin
**						Label 4:  Port	    txtDevicePort
**
**        Panel 4 (Push Content)
*				Panel 5 (New Contact)
*					Label5:  ID   txtCID
*					Label6: Phone  txtCPhone
*					Label7:  Name   txtCName
*					Label8:  Email  txtCEmail
*					Label9:  PIN   txtCPIN
*					Label10:  Address  txtCAddress
**				  B2:  Randomize
**				  B3:  Add Contact
**
*				Panel 6 (JSON String)
*				    TextArea:  txtJSON
*					B4:  Send Push
*					B5:  Reset
*
*		  		Panel 7 (Load CSV File)
*					L11:  File Location  txtCVSPath
*					L12:  Json Group	 txtJSONGroup
*				   B6:  Load File
*
*				Panel 8 (Emergency Meeting)
*					Calendar:   
*					L13:  Meeting Time   txtMTime
*					L14:  Description    txtMDesc
*					L15:  Bridge Number  txtMNumber
*			      B7:  Send Meeting
**	          
*
***********************************************/     

import java.awt.Color;
import java.awt.Font;
import java.io.DataInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Random;
import java.util.Vector;
import java.util.regex.Pattern;

import java.io.File;
import java.io.FileWriter;
import java.util.Scanner;
import java.util.Vector;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.swing.BorderFactory;
import javax.swing.DefaultComboBoxModel;
import javax.swing.JComboBox;
import javax.swing.JPanel;
import javax.swing.JTextPane;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;



public class MainFrame extends javax.swing.JFrame {

    /**
     * Randomly generated.
     */
	private static final long serialVersionUID = -1833425591727608149L;
	private static final Random _r = new Random(System.currentTimeMillis());
	
	/**
	 * Static values to generate contacts from.
	 */
	private final String[] mNames = new String[] {"Bradley Wyro", "Joseph Venditti", "Paul Turner", "Ricardo Totte", "Mark Tiegs", "Matthew Taylor", "Calvin Tan", "Greg Stark", "Blake Smith", "Milosz Sikora", "Lou Sicoli", "Jake Romphf", "Eric Reyes", "Chadwick Price", "Andrew Paterson", "Morgan Parker", "Paul Morley", "John McMullen", "Jeff McDowell", "Michael Mason", "Dustin Malik", "Marcelo Ludovice", "James Lambier", "Gordon Koslowski", "Sergei Klimov", "Kyle Kivimaki", "Alex Kinsella", "Justin Jones", "Marc Gervais", "Hitoshi Hishikura", "Greg Hislop", "Elliot Fung", "Luiz Fischer", "Ahmed Farrakha", "Bill Farmer", "Ian Dundas", "Fernanda Contrucci Terra", "Rodrigo Chies", "Mike Chepesky", "Trevor Cameron", "Marco Cacciacarro", "Stephen Burke", "Carsten Bergmann", "Kevin Beatty", "Westlee Barichak ", "Hisham Athas", "Enrico Antonucci"};
    private final String[] fNames = new String[] {"Meredith Wagler", "Catharina Van Denhoff", "Angela Van Daele", "Karla Tetzel", "Sarah Symonds", "Leesa Steiner", "Carol Silva", "Sheena Raj", "Ninaa Persad", "Lisa Perry", "Julie Palmer", "Tamara Moona", "Tanya McPherson", "Tina McAuley", "Annie Mathew", "Marcia Maria Marques", "Denise Marshall", "Christina Lucey", "Jayne Lord", "Nicole Lavigne", "Christine Kwan", "Trudy Koen", "Christa Johnston", "Mika Ilvonen", "Rachel Grimard", "Sylwia Glowik", "Rose George", "Krista Hunter", "Caitlin Howlett", "Alida Droogendyk", "Fernanda De Oliveira Santos", "Jeanette deBoer", "Sherisse Da Silva", "Lindsay Cournoyer", "Tetyana Chuchkevych", "Natalie Carruthers", "Megan Ball", "Andrea Aime", "Megan Acheson"};
    private final String[] cities = new String[] {"2200 University Ave. E., Waterloo, ON", "2300 University Ave. E., Waterloo, ON", "141 Weber St. S., Waterloo, ON", "619 Kumpf Dr., Waterloo, ON", "300 Hagey Blvd., Waterloo, ON", "460 Phillip St., Waterloo, ON", "195 Columbia St. W., Waterloo, ON", "440 Phillip St., Waterloo, ON", "450 Phillip St., Waterloo, ON", "419 Phillip St. W., Waterloo, ON", "415 Phillip St., Waterloo, ON", "176 Columbia St. W., Waterloo, ON", "455 Phillip St., Waterloo, ON", "451 Phillip St., Waterloo, ON", "180 Columbia St. W., Waterloo, ON", "170 Columbia St. W., Waterloo, ON", "156 Columbia St. W., Waterloo, ON", "305 Phillip St., Waterloo, ON", "185 Columbia St. W., Waterloo, ON", "295 Phillip St., Waterloo, ON", "175 Columbia St. W., Waterloo, ON"};

    
    private static final boolean debug = false;
    private static Vector errors = new Vector();
    private static Vector quotationErrors = new Vector();
    public static final String CSV_PATTERN = "\"([^\"]+?)\",?|([^,]+),?|,";
    private static Pattern csvRE;
    
    private static String strMeetingDate = "";
    /**
     * On launch.
     */
	public MainFrame() {
		this.setTitle("BES Push Server");
        
		csvRE = Pattern.compile(CSV_PATTERN);
		
		initComponents();
        
        jButton2MouseClicked(null); //Generate a random contact.
    }

	/**
	 * Reset MDS configuration to Simulator defaults.
	 * @param evt
	 */
    private void jButton1MouseClicked(java.awt.event.MouseEvent evt) {
        txtMDSAddress.setText("localhost");
        txtMDSPort.setText("28080");
        txtDevicePIN.setText("2100000A");
        txtDevicePort.setText("233");
    }

    /**
     * Generate a random contact.
     * @param evt
     */
    private void jButton2MouseClicked(java.awt.event.MouseEvent evt) {
    	//ID = Random integer.
        txtCID.setText(String.valueOf(Math.abs(_r.nextInt())));
        
        //Pick a random gender and name from the associated names list.
        String name = "";
        if(_r.nextBoolean()) {
            radCMale.setSelected(true);
            name = mNames[_r.nextInt(mNames.length)];
        } else {
            radCFemale.setSelected(true);
            name = fNames[_r.nextInt(fNames.length)];
        }
        txtCName.setText(name);
        
        //Phone number is generated by picking 2 random integers.
        String phone = "(519) 555-01";
        phone = phone + _r.nextInt(10);
        phone = phone + _r.nextInt(10);
        txtCPhone.setText(phone);
        
        //Generate a random email.
        String email = "userXYZ@rim.com";
        email = email.replace("X", String.valueOf(_r.nextInt(10)));
        email = email.replace("Y", String.valueOf(_r.nextInt(10)));
        email = email.replace("Z", String.valueOf(_r.nextInt(10)));
        txtCEmail.setText(email);
        
        //Generated device PIN is statically set to: 2100000A. This is the default Simulator PIN.
        String pin = "2100000A";
        txtCPIN.setText(pin);
        
        //Pick a random location from our list.
        txtCAddress.setText(cities[_r.nextInt(cities.length)]);
    }

    /**
     * Add the current contact to our JSON String.
     * @param evt
     */
    private void jButton3MouseClicked(java.awt.event.MouseEvent evt) {
        String text = "{\"id\":\"[0]\",\"sex\":\"[1]\",\"name\":\"[2]\",\"tele\":\"[3]\",\"email\":\"[4]\",\"pin\":\"[5]\",\"addr\":\"[6]\"}";
        text = text.replace("[0]", txtCID.getText());
        text = text.replace("[1]", radCMale.isSelected() ? "male" : "female");
        text = text.replace("[2]", txtCName.getText());
        text = text.replace("[3]", txtCPhone.getText());
        text = text.replace("[4]", txtCEmail.getText());
        text = text.replace("[5]", txtCPIN.getText());
        text = text.replace("[6]", txtCAddress.getText());
        
        String json = txtJSON.getText();
        json = json.substring(0, json.length() - 2) + text + "]}";
        json = json.replace("}{", "},{");
        txtJSON.setText(json);
    }

    /**
     * Generate a URL based on our MDS and Device configuration.
     * @return
     * @throws MalformedURLException
     */
    private URL getPushURL() throws MalformedURLException {
        String pin = txtDevicePIN.getText();
        String port = txtDevicePort.getText();
        return new URL("http", txtMDSAddress.getText(), Integer.valueOf(txtMDSPort.getText()).intValue(), "/push?DESTINATION=" + pin + "&PORT=" + port + "&REQUESTURI=/");
    }
    
    /**
     * Push the content.
     * @param evt
     */
    private void jButton4MouseClicked(java.awt.event.MouseEvent evt) {
        String data = txtJSON.getText();
        String pushId = "pushID:" + _r.nextInt();

        HttpURLConnection conn = null;
        OutputStream out = null;
        InputStream ins = null;

        try {
            URL url = getPushURL();
            System.out.println(url.toString());

            conn = (HttpURLConnection)url.openConnection();
            conn.setDoInput(true);
            conn.setDoOutput(true);
            conn.setRequestMethod("POST");
            conn.setRequestProperty("X-RIM-PUSH-ID", pushId);
            conn.setRequestProperty("X-RIM-Push-Reliability-Mode", "TRANSPORT");

            out = conn.getOutputStream();
            out.write(data.getBytes());

            int contentLength = conn.getContentLength();
            if (contentLength > 0) {
                byte[] someArray = new byte[contentLength];
                ins = conn.getInputStream();
                DataInputStream dins = new DataInputStream(ins);
                dins.readFully(someArray);
                System.out.println(new String(someArray));
            }
        } catch (IOException e) {
            System.err.println(e);
        } finally {
            if(ins != null) {
                try {
                	ins.close();
                } catch (Exception ex) {
                }
                ins = null;
            }

            if (out != null) {
                try {
                    out.close();
                } catch (Exception ex) {
                }
                out = null;
            }

            if (conn != null) {
                conn.disconnect();
                conn = null;
            }
        }
    }

    /**
     * Reset our JSON String.
     * @param evt
     */
    private void jButton5MouseClicked(java.awt.event.MouseEvent evt) {
        txtJSON.setText("{\"contact\":[]}");
    }

    
    
    
    /**
     * Add the current read file and convert to our JSON String.
     * @param evt
     */
    private void jButton6MouseClicked(java.awt.event.MouseEvent evt) {
        
   //C:\Inetpub\wwwroot\WorkFlowDemo\blackberry.csv
    	
    	txtJSON.setText("");
    	
        if (txtCSVPath.getText().length() > 0 && txtJSONGroup.getText().length() > 0) {
          
        	File source = new File(txtCSVPath.getText());
            	if (source.isFile() && source.getAbsolutePath().endsWith(".csv")) {
                        File target = new File(source.getAbsolutePath().replace(".csv", ".json"));
                        txtJSON.setText(convert(txtJSONGroup.getText(), source, target, true));
                    } else {
                    	txtJSON.setText("Not a valid csv file extension");
                    }
                   
        } else {
        	txtJSON.setText("Please check that a valid path + csv file and JSON Group are defined ");
        }
     
    }
    
    public static String convert(String group, File source, File target, boolean _useHeadings) {

        FileWriter writer = null;
        String jsonStr = null;
        try {
            boolean useHeadings = _useHeadings;
            String[] headings = null;
            String headingsStr = null;
            int numHeadings = 0;
            int numColumns;
            writer = new FileWriter(target);
            int lineNumber = 0;
            //start json:
            writer.write("[\n");
            jsonStr = "{\"" + group + "\":[";
            
            Scanner scanner = new Scanner(source);
            if (useHeadings && scanner.hasNextLine()) {
                lineNumber++;
                headingsStr = scanner.nextLine();
                headings = headingsStr.split(",");
                numHeadings = headings.length;

                if (debug) {
                    System.out.println("Number of headings: " + numHeadings);
                    for (int i = 0; i < numHeadings; i++) {
                        System.out.println("Heading " + i + ": " + headings[i]);
                    }
                }
            }
            System.out.println("Starting csv run..." + System.currentTimeMillis());

            while (scanner.hasNextLine()) {
                lineNumber++;
                String line = scanner.nextLine();
                String[] fields = parse(line, lineNumber);

                numColumns = fields.length;
                if (useHeadings) {
                    //output using headings
                    writer.write("{\n");
                    jsonStr += "{\n";
                    //Check the data is good and column headings count match the data:
                    if (numHeadings == numColumns) {
                        if (debug) {
                            System.out.println("Handling csv line " + lineNumber);
                        }
                        for (int i = 0; i < numColumns; i++) {
                            if (i < numColumns - 1) {
                                writer.write("     \"" + headings[i] + "\":" + " \"" + fields[i] + "\",\n");
                                jsonStr += "     \"" + headings[i] + "\":" + " \"" + fields[i] + "\",\n";
                            } else {
                                writer.write("     \"" + headings[i] + "\":" + " \"" + fields[i] + "\"\n");
                                jsonStr += "     \"" + headings[i] + "\":" + " \"" + fields[i] + "\"\n";
                            }
                        }
                    } else {
		                        //this messy block is for handling bad data with column count mismatches:
		                        if (debug) {
		                            errors.addElement(lineNumber);
		                            System.out.println("Handling csv line " + lineNumber + " Field count mismatch, expected " + numHeadings + " but found " + numColumns);
		                        }
		                        writer.write("     \"Parse warning\":" + " \"Field count mismatch, expected: " + numHeadings + " but found " + numColumns + "\",\n");
		
		                        if (numHeadings > numColumns) {
		                            String[] tempFields = new String[numHeadings];
		                            for (int i = 0; i < numHeadings; i++) {
		                                if (i < numColumns) {
		                                    tempFields[i] = fields[i];
		                                } else {
		                                    tempFields[i] = "Unknown (Parse Error)";
		                                }
		                            }
		                            for (int i = 0; i < numHeadings; i++) {
		                                if (i < numHeadings - 1) {
		                                    writer.write("     \"" + headings[i] + "\":" + " \"" + tempFields[i] + "\",\n");
		                                    jsonStr += "     \"" + headings[i] + "\":" + " \"" + tempFields[i] + "\",\n";
		                                } else {
		                                    writer.write("     \"" + headings[i] + "\":" + " \"" + tempFields[i] + "\"\n");
		                                    jsonStr += "     \"" + headings[i] + "\":" + " \"" + tempFields[i] + "\"\n";
		                                }
		                            }
		                        } else if (numHeadings < numColumns) {
		                            String[] tempHeader = new String[numColumns];
		                            for (int i = 0; i < numColumns; i++) {
		                                if (i < numHeadings) {
		                                    tempHeader[i] = headings[i];
		                                } else {
		                                    tempHeader[i] = "Unknown (Parse Error)";
		                                }
		                            }
		                            for (int i = 0; i < numColumns; i++) {
		                                if (i < numColumns - 1) {
		                                    writer.write("     \"" + tempHeader[i] + "\":" + " \"" + fields[i] + "\",\n");
		                                    jsonStr += "     \"" + tempHeader[i] + "\":" + " \"" + fields[i] + "\",\n";
		                                } else {
		                                    writer.write("     \"" + tempHeader[i] + "\":" + " \"" + fields[i] + "\"\n");
		                                    jsonStr += "     \"" + tempHeader[i] + "\":" + " \"" + fields[i] + "\"\n";
		                                }
		                            }
		                        }
                    }
                    writer.write("}");
                    jsonStr += "},\n";
                } else {
                    //output straight data
                    writer.write("[\n");
                    jsonStr += "[";
                    for (int i = 0; i < (numColumns - 1); i++) {
                        if (i < numColumns) {
                            writer.write("\"" + fields[i] + "\",\n");
                            jsonStr += "\"" + fields[i] + "\",\n";
                        } else {
                            writer.write("\"" + fields[i] + "\"\n");
                            jsonStr += "\"" + fields[i] + "\"\n";
                        }
                    }
                    writer.write("]\n");
                    jsonStr += "]}";
                }
            }
            //end json
            writer.write("]\n");
            
         //   if (jsonStr.endsWith(",")){
         //   	jsonStr = "it ends with comma";
         //   }
            jsonStr += "]\n";
            writer.close();
                        
            System.out.println("Finished..." + System.currentTimeMillis());
            if (debug) {
                int numErrors = errors.size();
                System.out.println("Found " + numErrors + " errors");
                for (int i = 0; i < numErrors; i++) {
                    System.out.println("Error at line: " + errors.elementAt(i).toString());//(int) errors.elementAt(i).intValue());
                }
                int numQuotationErrors = quotationErrors.size();
                for(int i = 0; i < numQuotationErrors; i++) {
                    System.out.println("Unclosed quotation at line: " + quotationErrors.elementAt(i).toString());
                }
            }

        } catch (IOException ex) {
            Logger.getLogger(MainFrame.class.getName()).log(Level.SEVERE, null, ex);
        }
        return jsonStr;
    }

    public static String[] parse(String line, int lineNumber) {
        Vector fields = new Vector();
        Matcher m = csvRE.matcher(line);
        while (m.find()) {
            String match = m.group();
            if (match == null) {
                break;
            }
            if (match.endsWith(",")) {  // trim trailing ,
                match = match.substring(0, match.length() - 1);
            }
            if (match.startsWith("\"")) {
                if(!match.endsWith("\"")){
                   quotationErrors.add(lineNumber); 
                }
                match = match.substring(1, match.length() - 1);
            }
            if (match.length() == 0) {
                match = null;
            }
            fields.add(match);
        }
        String[] fieldArray = new String[fields.size()];
        fields.copyInto(fieldArray);
        return fieldArray;
    }
    
    /***************************************************************
    *  Send Emegerncy Meeting.
    * @param evt
    *
    ****************************************************************/
    private void jButton7MouseClicked(java.awt.event.MouseEvent evt) {
        
        String data = txtJSON.getText();
        String pushId = "pushID:" + _r.nextInt();

        HttpURLConnection conn = null;
        OutputStream out = null;
        InputStream ins = null;

        try {
            URL url = getPushURL();
            System.out.println(url.toString());

            conn = (HttpURLConnection)url.openConnection();
            conn.setDoInput(true);
            conn.setDoOutput(true);
            conn.setRequestMethod("POST");
            conn.setRequestProperty("X-RIM-PUSH-ID", pushId);
            conn.setRequestProperty("X-RIM-Push-Reliability-Mode", "TRANSPORT");

            out = conn.getOutputStream();
            out.write(data.getBytes());

            int contentLength = conn.getContentLength();
            if (contentLength > 0) {
                byte[] someArray = new byte[contentLength];
                ins = conn.getInputStream();
                DataInputStream dins = new DataInputStream(ins);
                dins.readFully(someArray);
                System.out.println(new String(someArray));
            }
        } catch (IOException e) {
            System.err.println(e);
        } finally {
            if(ins != null) {
                try {
                	ins.close();
                } catch (Exception ex) {
                }
                ins = null;
            }

            if (out != null) {
                try {
                    out.close();
                } catch (Exception ex) {
                }
                out = null;
            }

            if (conn != null) {
                conn.disconnect();
                conn = null;
            }
        }     
   }
    
    /**
     * Our main entry point.
     * @param args
     */
    public static void main(String args[]) {
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new MainFrame().setVisible(true);
            }
        });
    }

    /**
     * GUI Object declarations.
     */
    private javax.swing.ButtonGroup buttonGroup1;
    private javax.swing.JButton jButton1;
    private javax.swing.JButton jButton2;
    private javax.swing.JButton jButton3;
    private javax.swing.JButton jButton4;
    private javax.swing.JButton jButton5;
    //new stuff
    private javax.swing.JButton jButton6;
    private javax.swing.JButton jButton7;

    
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
    // new stuff
    private javax.swing.JLabel jLabel11;
    private javax.swing.JLabel jLabel12;
    private javax.swing.JLabel jLabel13;
    private javax.swing.JLabel jLabel14;
    private javax.swing.JLabel jLabel15;

    
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JPanel jPanel4;
    private javax.swing.JPanel jPanel5;
    private javax.swing.JPanel jPanel6;
    //new stuff
    private javax.swing.JPanel jPanel7;
    private javax.swing.JPanel jPanel8;
    
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JRadioButton radCFemale;
    private javax.swing.JRadioButton radCMale;
    private javax.swing.JTextField txtCAddress;
    private javax.swing.JTextField txtCEmail;
    private javax.swing.JTextField txtCID;
    private javax.swing.JTextField txtCName;
    private javax.swing.JTextField txtCPIN;
    private javax.swing.JTextField txtCPhone;
    private javax.swing.JTextField txtDevicePIN;
    private javax.swing.JTextField txtDevicePort;
    private javax.swing.JTextArea txtJSON;
    private javax.swing.JTextField txtMDSAddress;
    private javax.swing.JTextField txtMDSPort;
    //new stuff
    private javax.swing.JTextField txtCSVPath;
    private javax.swing.JTextField txtJSONGroup;
    private javax.swing.JLabel txtCHeaders;
    
    private Cal calMeeting;
    private javax.swing.JTextField txtMTime;
    private javax.swing.JTextField txtMDesc;
    private javax.swing.JTextField txtMNumber;
    private javax.swing.JComboBox cHour;
    private javax.swing.JComboBox cMinute;
    private javax.swing.JComboBox cTOD;
    
    
    /**
	 * Generated with NetBeans.
	 */
    private void initComponents() {

        buttonGroup1 = new javax.swing.ButtonGroup();
        jPanel1 = new javax.swing.JPanel();
        jPanel2 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        txtMDSAddress = new javax.swing.JTextField();
        txtMDSPort = new javax.swing.JTextField();
        jPanel3 = new javax.swing.JPanel();
        jLabel3 = new javax.swing.JLabel();
        txtDevicePIN = new javax.swing.JTextField();
        jLabel4 = new javax.swing.JLabel();
        txtDevicePort = new javax.swing.JTextField();
        jButton1 = new javax.swing.JButton();
        jPanel4 = new javax.swing.JPanel();
        jPanel5 = new javax.swing.JPanel();
        jLabel5 = new javax.swing.JLabel();
        
        //new stuff
        jPanel7 = new javax.swing.JPanel();
        jLabel11 = new javax.swing.JLabel();
        jLabel12 = new javax.swing.JLabel();
        jButton6 = new javax.swing.JButton();
        txtCSVPath = new javax.swing.JTextField();
        txtJSONGroup = new javax.swing.JTextField();
        txtCHeaders = new javax.swing.JLabel();

        jPanel8 = new javax.swing.JPanel();
        calMeeting = new Cal();
        jLabel13 = new javax.swing.JLabel();
        jLabel14 = new javax.swing.JLabel();
        jLabel15 = new javax.swing.JLabel();
        txtMTime = new javax.swing.JTextField();
        txtMDesc = new javax.swing.JTextField();
        txtMNumber = new javax.swing.JTextField();
        jButton7 = new javax.swing.JButton();
        
        txtCID = new javax.swing.JTextField();
        radCMale = new javax.swing.JRadioButton();
        radCFemale = new javax.swing.JRadioButton();
        jLabel7 = new javax.swing.JLabel();
        txtCName = new javax.swing.JTextField();
        jLabel6 = new javax.swing.JLabel();
        txtCPhone = new javax.swing.JTextField();
        jLabel8 = new javax.swing.JLabel();
        txtCEmail = new javax.swing.JTextField();
        jLabel9 = new javax.swing.JLabel();
        txtCPIN = new javax.swing.JTextField();
        jLabel10 = new javax.swing.JLabel();
        txtCAddress = new javax.swing.JTextField();
        jButton3 = new javax.swing.JButton();
        jButton2 = new javax.swing.JButton();
        jPanel6 = new javax.swing.JPanel();
        jScrollPane1 = new javax.swing.JScrollPane();
        txtJSON = new javax.swing.JTextArea();
        jButton4 = new javax.swing.JButton();
        jButton5 = new javax.swing.JButton();
       

        cHour = new JComboBox();
        cHour.setModel(new DefaultComboBoxModel(new Object[] { "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12" }));
        cHour.setDoubleBuffered(false);
        cHour.setBorder(null);
        
        cMinute = new JComboBox();
        cMinute.setModel(new DefaultComboBoxModel(new Object[] { "00", "15", "30", "45" }));
        cMinute.setDoubleBuffered(false);
        cMinute.setBorder(null);
        
        cTOD = new JComboBox();
        cTOD.setModel(new DefaultComboBoxModel(new Object[] { "AM", "PM" }));
        cTOD.setDoubleBuffered(false);
        cTOD.setBorder(null);
        
        
        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);

        jPanel1.setBorder(javax.swing.BorderFactory.createTitledBorder("Configuration"));

        jPanel2.setBorder(javax.swing.BorderFactory.createTitledBorder("MDS"));

        jLabel1.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
        jLabel1.setText("Address");

        jLabel2.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
        jLabel2.setText("Port");

        txtMDSAddress.setText("localhost");

        txtMDSPort.setText("28080");

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel2)
                    .addComponent(jLabel1))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(txtMDSPort, javax.swing.GroupLayout.DEFAULT_SIZE, 136, Short.MAX_VALUE)
                    .addComponent(txtMDSAddress, javax.swing.GroupLayout.DEFAULT_SIZE, 136, Short.MAX_VALUE))
                .addContainerGap())
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel1)
                    .addComponent(txtMDSAddress, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(txtMDSPort, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel2))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        jPanel3.setBorder(javax.swing.BorderFactory.createTitledBorder("Device"));

        jLabel3.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
        jLabel3.setText("PIN");

        txtDevicePIN.setText("2100000A");

        jLabel4.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
        jLabel4.setText("Port");

        txtDevicePort.setText("233");

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel4)
                    .addComponent(jLabel3))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(txtDevicePIN, javax.swing.GroupLayout.DEFAULT_SIZE, 136, Short.MAX_VALUE)
                    .addComponent(txtDevicePort, javax.swing.GroupLayout.DEFAULT_SIZE, 136, Short.MAX_VALUE))
                .addContainerGap())
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel3)
                    .addComponent(txtDevicePIN, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel4)
                    .addComponent(txtDevicePort, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
        );

        jButton1.setText("Load Default");
        jButton1.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                jButton1MouseClicked(evt);
            }
        });

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                  //  .addComponent(jButton1)
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                        .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addContainerGap())
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
             //   .addComponent(jButton1)
             //   .addGap(2, 2, 2)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap())
        );

        jPanel4.setBorder(javax.swing.BorderFactory.createTitledBorder("Push Content"));

        
        //new stuff
        jPanel7.setBorder(javax.swing.BorderFactory.createTitledBorder("Load CSV File"));
       
            
        txtCHeaders.setBackground(Color.LIGHT_GRAY);
        txtCHeaders.setBorder(BorderFactory.createTitledBorder(new LineBorder(Color.black, 1, false), "Contact Headers", TitledBorder.LEADING,
				TitledBorder.DEFAULT_POSITION, new Font("Dialog", Font.BOLD, 10), new Color(51, 51, 51)));
        txtCHeaders.setText("LastName-FirstName-Email-HomePhone-WorkPhone-MobilePhone-DevicePIN-Address1-Address2-City-State-ZipCode-Country-JobTitle-Company");
               
        jLabel11.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        jLabel11.setText("File Location:  ");
        jLabel12.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        jLabel12.setText("JSON Group:  ");
        
        txtCSVPath.setText("");
        txtJSONGroup.setText("");
        jButton6.setText("Load File");
        jButton6.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                jButton6MouseClicked(evt);
            }
        });
        
         
        javax.swing.GroupLayout jPanel7Layout = new javax.swing.GroupLayout(jPanel7);
        jPanel7.setLayout(jPanel7Layout);
        jPanel7Layout.setHorizontalGroup(
        		jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel7Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                	.addComponent(txtCHeaders, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    
                	.addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel7Layout.createSequentialGroup()
                                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)               
                                		.addComponent(jLabel12)
                                		.addComponent(jLabel11))
                                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                                		.addComponent(txtJSONGroup)
                                		.addComponent(txtCSVPath))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)))
              
                .addComponent(jButton6)
                .addContainerGap())
        );
        jPanel7Layout.setVerticalGroup(
        		jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel7Layout.createSequentialGroup()
                    .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                        .addComponent(txtCHeaders))
                                   .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                		   	.addComponent(jLabel11)
                                		   	.addComponent(txtCSVPath, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(txtJSONGroup)
                    .addComponent(jLabel12))
                .addComponent(jButton6))              
        );
        

      //new stuff
        jPanel8.setBorder(javax.swing.BorderFactory.createTitledBorder("Emergency Meeting"));
   
        	jLabel13.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
        	jLabel13.setText("Meeting Time:  ");
        	jLabel14.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
        	jLabel14.setText("Description:  ");
        	jLabel15.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
        	jLabel15.setText("Bridge Number:  ");
        
        	txtMTime.setText("");
        	txtMDesc.setText("");
        	txtMNumber.setText("");
        
	        jButton7.setText("Send Meeting");
	        jButton7.addMouseListener(new java.awt.event.MouseAdapter() {
	            public void mouseClicked(java.awt.event.MouseEvent evt) {
	                jButton7MouseClicked(evt);
	            }
	        });
	             
         
        javax.swing.GroupLayout jPanel8Layout = new javax.swing.GroupLayout(jPanel8);
        jPanel8.setLayout(jPanel8Layout);
        jPanel8Layout.setHorizontalGroup(
        		jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
        			.addGroup(jPanel8Layout.createSequentialGroup()
        					.addContainerGap()
        					.addGroup(jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)                    
        							.addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel8Layout.createSequentialGroup()
        													.addComponent(calMeeting))
                .addGroup(jPanel8Layout.createSequentialGroup()
                		.addGroup(jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)               
                        		.addComponent(jLabel13)
                        		.addComponent(jLabel14)
                        		.addComponent(jLabel15))
                        .addGroup(jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                                .addGroup(jPanel8Layout.createSequentialGroup()
                                	.addComponent(cHour)
                                	.addComponent(cMinute)
                                	.addComponent(cTOD))
                        	.addComponent(txtMDesc)
                        	.addComponent(txtMNumber)
                        		 .addGap(18, 18, 18)
                        		 .addComponent(jButton7))
                .addContainerGap())))
        );
        
        jPanel8Layout.setVerticalGroup(
        		jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel8Layout.createSequentialGroup()
         		   .addGroup(jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)      
         				   .addComponent(calMeeting))
                    .addGroup(jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                               .addComponent(jLabel13, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                      		   .addComponent(cHour)
                            		   .addComponent(cMinute)
                            		   .addComponent(cTOD))
                            .addGroup(jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                               .addComponent(jLabel14, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                               .addComponent(txtMDesc, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            	.addComponent(txtMNumber)
                            	.addComponent(jLabel15))
                            	.addComponent(jButton7))                
        );
        
        
        
        
        jPanel5.setBorder(javax.swing.BorderFactory.createTitledBorder("New Contact"));
        
	        txtCID.setText("");
	        txtCName.setText("");
	        txtCPhone.setText("");
	        txtCEmail.setText("");
	        txtCPIN.setText("");
	        txtCAddress.setText("");
        
	        buttonGroup1.add(radCMale);
	        radCMale.setText("Male");
	        buttonGroup1.add(radCFemale);
	        radCFemale.setText("Female");

	        jLabel5.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
	        jLabel5.setText("ID");
	        jLabel6.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
	        jLabel6.setText("Phone");
	        jLabel7.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
	        jLabel7.setText("Name");
	        jLabel8.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
	        jLabel8.setText("Email");
	        jLabel9.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
	        jLabel9.setText("PIN");
	        jLabel10.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
	        jLabel10.setText("Address");


	        jButton3.setText("Add Contact");
	        jButton3.addMouseListener(new java.awt.event.MouseAdapter() {
	            public void mouseClicked(java.awt.event.MouseEvent evt) {
	                jButton3MouseClicked(evt);
	            }
	        });
	
	        jButton2.setText("Randomize");
	        jButton2.addMouseListener(new java.awt.event.MouseAdapter() {
	            public void mouseClicked(java.awt.event.MouseEvent evt) {
	                jButton2MouseClicked(evt);
	            }
	        });

        javax.swing.GroupLayout jPanel5Layout = new javax.swing.GroupLayout(jPanel5);
        jPanel5.setLayout(jPanel5Layout);
        jPanel5Layout.setHorizontalGroup(
            jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel5Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(jLabel5, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jLabel7, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jLabel9, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jLabel6, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel5Layout.createSequentialGroup()
                        .addGroup(jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                            .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel5Layout.createSequentialGroup()
                                .addGroup(jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(txtCPhone, javax.swing.GroupLayout.PREFERRED_SIZE, 90, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(txtCPIN, javax.swing.GroupLayout.PREFERRED_SIZE, 90, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addGap(18, 18, 18)
                                .addGroup(jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                    .addComponent(jLabel8, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                    .addComponent(jLabel10, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(txtCAddress, javax.swing.GroupLayout.DEFAULT_SIZE, 196, Short.MAX_VALUE)
                                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel5Layout.createSequentialGroup()
                                        .addComponent(jButton2)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addComponent(jButton3))
                                    .addComponent(txtCEmail, javax.swing.GroupLayout.DEFAULT_SIZE, 196, Short.MAX_VALUE)))
                            .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel5Layout.createSequentialGroup()
                                .addComponent(txtCName, javax.swing.GroupLayout.PREFERRED_SIZE, 181, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(radCMale)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(radCFemale)))
                        .addContainerGap())
                    .addGroup(jPanel5Layout.createSequentialGroup()
                        .addComponent(txtCID, javax.swing.GroupLayout.DEFAULT_SIZE, 347, Short.MAX_VALUE)
                        .addContainerGap())))
        );
        jPanel5Layout.setVerticalGroup(
            jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel5Layout.createSequentialGroup()
                .addGroup(jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel5)
                    .addComponent(txtCID, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(radCFemale)
                    .addComponent(radCMale)
                    .addComponent(jLabel7)
                    .addComponent(txtCName, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel6)
                    .addComponent(txtCPhone, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel8)
                    .addComponent(txtCEmail, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel10)
                    .addComponent(jLabel9)
                    .addComponent(txtCPIN, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(txtCAddress, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jButton3)
                    .addComponent(jButton2)))
        );

        jPanel6.setBorder(javax.swing.BorderFactory.createTitledBorder("JSON String"));

        txtJSON.setColumns(20);
        txtJSON.setRows(5);
        txtJSON.setLineWrap(true);
        txtJSON.setWrapStyleWord(false);
        txtJSON.setText("{\"contact\":[]}");
        jScrollPane1.setViewportView(txtJSON);

        jButton4.setText("Send Push");
        jButton4.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                jButton4MouseClicked(evt);
            }
        });

        jButton5.setText("Reset");
        jButton5.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                jButton5MouseClicked(evt);
            }
        });

        javax.swing.GroupLayout jPanel6Layout = new javax.swing.GroupLayout(jPanel6);
        jPanel6.setLayout(jPanel6Layout);
        jPanel6Layout.setHorizontalGroup(
            jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel6Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 381, Short.MAX_VALUE)
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel6Layout.createSequentialGroup()
                        .addComponent(jButton5)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jButton4)))
                .addContainerGap())
        );
        jPanel6Layout.setVerticalGroup(
            jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel6Layout.createSequentialGroup()
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jButton4)
                    .addComponent(jButton5)))
        );

        javax.swing.GroupLayout jPanel4Layout = new javax.swing.GroupLayout(jPanel4);
        jPanel4.setLayout(jPanel4Layout);
        jPanel4Layout.setHorizontalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel4Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(jPanel7, javax.swing.GroupLayout.Alignment.LEADING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jPanel6, javax.swing.GroupLayout.Alignment.LEADING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jPanel8, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addContainerGap())
        );
        jPanel4Layout.setVerticalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel4Layout.createSequentialGroup()
                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
            		.addComponent(jPanel7, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
            			.addComponent(jPanel8, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                        .addComponent(jPanel6, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)

            			.addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                    .addComponent(jPanel4, javax.swing.GroupLayout.Alignment.LEADING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jPanel1, javax.swing.GroupLayout.Alignment.LEADING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel4, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        pack();
    }
 
}

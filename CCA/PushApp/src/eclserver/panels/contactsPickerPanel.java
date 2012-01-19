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
package eclserver.panels;

/**
 *
 * @author rbalsewich
 */
import java.io.*;
import javax.swing.*;

import javax.swing.JOptionPane;
import javax.swing.event.EventListenerList;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;



public class contactsPickerPanel extends javax.swing.JPanel {

    
    protected String strFileLocation;
    
    /** Creates new form recipientsPickerPanel */
    public contactsPickerPanel() {
        
        listeners = new EventListenerList();

        initComponents();
    }

    /** This method is called from within the constructor to
     * initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is
     * always regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        lrp_bgRB = new javax.swing.ButtonGroup();
        rbLoadContactCSV = new javax.swing.JRadioButton();
        rbContactAD = new javax.swing.JRadioButton();
        txtContactsFileLocation = new javax.swing.JTextField();
        openContactsPicker = new javax.swing.JButton();
        txtActiveDirectoryField = new javax.swing.JTextField();
        imageSpinner = new javax.swing.JLabel();

        setBorder(javax.swing.BorderFactory.createTitledBorder("Load Contacts List"));

        lrp_bgRB.add(rbLoadContactCSV);
        rbLoadContactCSV.setText("CSV File");
        rbLoadContactCSV.setToolTipText("Load recipients from CSV file...");
        rbLoadContactCSV.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                rbLoadContactCSVActionPerformed(evt);
            }
        });

        lrp_bgRB.add(rbContactAD);
        rbContactAD.setText("Active Directory");
        rbContactAD.setToolTipText("Load recipients from Active Directory (Not Implemented)");
        rbContactAD.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                rbContactADActionPerformed(evt);
            }
        });

        txtContactsFileLocation.setToolTipText("Enter file location for recipients csv file...");
        txtContactsFileLocation.setEnabled(false);

        openContactsPicker.setIcon(new javax.swing.ImageIcon(getClass().getResource("/eclserver/images/folder_customer_48.png"))); // NOI18N
        openContactsPicker.setToolTipText("Open File Chooser");
        openContactsPicker.setBorderPainted(false);
        openContactsPicker.setContentAreaFilled(false);
        openContactsPicker.setEnabled(false);
        openContactsPicker.setSelected(true);
        openContactsPicker.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                openContactsPickerActionPerformed(evt);
            }
        });

        txtActiveDirectoryField.setToolTipText("Enter Active Directory Details");
        txtActiveDirectoryField.setEnabled(false);

        imageSpinner.setIcon(new javax.swing.ImageIcon(getClass().getResource("/eclserver/images/spinner.gif"))); // NOI18N
        imageSpinner.setDisabledIcon(new javax.swing.ImageIcon(getClass().getResource("/eclserver/images/nospinner.gif"))); // NOI18N
        imageSpinner.setEnabled(false);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(this);
        this.setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(rbContactAD)
                    .addComponent(rbLoadContactCSV))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(txtContactsFileLocation, javax.swing.GroupLayout.PREFERRED_SIZE, 188, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(txtActiveDirectoryField, javax.swing.GroupLayout.PREFERRED_SIZE, 187, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(layout.createSequentialGroup()
                        .addGap(10, 10, 10)
                        .addComponent(imageSpinner))
                    .addComponent(openContactsPicker, javax.swing.GroupLayout.PREFERRED_SIZE, 67, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap())
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addComponent(openContactsPicker, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGap(5, 5, 5)
                .addComponent(imageSpinner))
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(rbLoadContactCSV)
                    .addComponent(txtContactsFileLocation, javax.swing.GroupLayout.PREFERRED_SIZE, 32, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(5, 5, 5)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(rbContactAD)
                    .addComponent(txtActiveDirectoryField, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(22, Short.MAX_VALUE))
        );
    }// </editor-fold>//GEN-END:initComponents

private void rbLoadContactCSVActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_rbLoadContactCSVActionPerformed
// TODO add your handling code here:   
    txtContactsFileLocation.setEnabled(true);
    openContactsPicker.setEnabled(true);
}//GEN-LAST:event_rbLoadContactCSVActionPerformed

private void openContactsPickerActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_openContactsPickerActionPerformed
// TODO add your handling code here:

    JFileChooser fc = new JFileChooser();
    int returnVal = fc.showOpenDialog(fc);
         
    if(returnVal == JFileChooser.APPROVE_OPTION){
        File file = fc.getSelectedFile();
        //this is where the real application would open the file.
        // log.append("Opening: " + file.getAbsolutePath() + file.getName() + "." + newline);
        
        if (file.getAbsolutePath().endsWith("csv")){
            System.out.println("Selected CSV file of contacts details.");
            txtContactsFileLocation.setText(file.getAbsolutePath());
            strFileLocation = file.getAbsolutePath();    
            
            
            int result = JOptionPane.showOptionDialog(this, "Do you want to load this CSV file?", "Load CSV File", JOptionPane.YES_NO_OPTION,JOptionPane.INFORMATION_MESSAGE, null,null,null);
    
      //       System.out.println("User selected " + result);
  
            if (result == 0){

                  ActionEvent callLoad = new ActionEvent(new Object[] { "Load Contacts" }, 1, "LOAD_CONTACTS" );
                  txtContactsFileLocation.setEnabled(false);
                  openContactsPicker.setEnabled(false);
                  fireActionEvent(callLoad);
            } else {
                System.out.println("Canceled Load of Contacts File.");
            }
     } else {
            JOptionPane.showMessageDialog(this, "Please choose CSV file. ");
        }   
    } else {
       
        JOptionPane.showMessageDialog(this, "Please choose CSV file. ");

    }
    
}//GEN-LAST:event_openContactsPickerActionPerformed

private void rbContactADActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_rbContactADActionPerformed
// TODO add your handling code here:
    txtContactsFileLocation.setText("");
    txtContactsFileLocation.setEnabled(false);
    openContactsPicker.setEnabled(false);
}//GEN-LAST:event_rbContactADActionPerformed


public String getFileLocation(){
    
    if (this.strFileLocation != null){
        return this.strFileLocation;
    } else {
        return "Please set File Location";
    }
}

public void showImageSpinner(){   
    imageSpinner.setEnabled(true);
}

public void hideImageSpinner(){
    imageSpinner.setEnabled(false);
}

public void showFields(){
    txtContactsFileLocation.setText("");
    txtContactsFileLocation.setEnabled(true);
    openContactsPicker.setEnabled(true);
}


 private void fireActionEvent(ActionEvent evt) {
        ActionListener[] listenerList = listeners.getListeners(ActionListener.class);

        for (int i = listenerList.length-1; i>=0; --i) {
            listenerList[i].actionPerformed(evt);
        }
        
    }
    
    
    public void addActionListener(ActionListener listener) {
        listeners.add(ActionListener.class, listener);
    }
    
    public void removeActionListener(ActionListener listener) {
        if (listeners != null) {
            listeners.remove(ActionListener.class, listener);
        }
    }

  EventListenerList listeners;

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JLabel imageSpinner;
    private javax.swing.ButtonGroup lrp_bgRB;
    private javax.swing.JButton openContactsPicker;
    private javax.swing.JRadioButton rbContactAD;
    private javax.swing.JRadioButton rbLoadContactCSV;
    private javax.swing.JTextField txtActiveDirectoryField;
    private javax.swing.JTextField txtContactsFileLocation;
    // End of variables declaration//GEN-END:variables
}
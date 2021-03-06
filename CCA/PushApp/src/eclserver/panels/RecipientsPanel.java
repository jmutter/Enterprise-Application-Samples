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



import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import javax.swing.event.EventListenerList;
import javax.swing.JList;
import java.util.List;
import javax.swing.JOptionPane;

import eclserver.db.objects.RecipientObject;

/**
 *
 * @author rbalsewich
 */
public class RecipientsPanel extends javax.swing.JPanel 
                    implements ActionListener {

    /** Creates new form RecipientsPanel */
    public RecipientsPanel() {
                
        listeners = new EventListenerList();
        initComponents();
        
        recipientsPickerPanel.addActionListener(this);
        recipientPanel.setEditable(false);
        recipientPanel.setEnabled(false);
        recipientPanel.clear();
           
    }

    /** This method is called from within the constructor to
     * initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is
     * always regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        recipientsList = new eclserver.panels.RecipientsListPanel();
        recipientPanel = new eclserver.panels.RecipientPanel();
        jPanel33 = new javax.swing.JPanel();
        jScrollPane9 = new javax.swing.JScrollPane();
        recipientsResultsArea = new javax.swing.JTextArea();
        recipientsPickerPanel = new eclserver.panels.recipientsPickerPanel();
        jLabel22 = new javax.swing.JLabel();
        jLabel23 = new javax.swing.JLabel();
        jLabel13 = new javax.swing.JLabel();
        jLabel24 = new javax.swing.JLabel();
        btnNewRecord = new javax.swing.JButton();
        btnDeleteRecord = new javax.swing.JButton();
        btnSaveRecord = new javax.swing.JButton();
        btnCancelRecord = new javax.swing.JButton();
        btnLoadRecipients = new javax.swing.JButton();
        btnCheckRecipients = new javax.swing.JButton();
        btnCancelContacts = new javax.swing.JButton();
        btnNukeRecipients = new javax.swing.JButton();

        setMaximumSize(new java.awt.Dimension(900, 600));
        setPreferredSize(new java.awt.Dimension(900, 578));

        recipientsList.addListSelectionListener(new javax.swing.event.ListSelectionListener() {
            public void valueChanged(javax.swing.event.ListSelectionEvent evt) {
                recipientsListValueChanged(evt);
            }
        });

        jPanel33.setBorder(javax.swing.BorderFactory.createTitledBorder("Results"));

        recipientsResultsArea.setColumns(20);
        recipientsResultsArea.setLineWrap(true);
        recipientsResultsArea.setRows(5);
        jScrollPane9.setViewportView(recipientsResultsArea);

        javax.swing.GroupLayout jPanel33Layout = new javax.swing.GroupLayout(jPanel33);
        jPanel33.setLayout(jPanel33Layout);
        jPanel33Layout.setHorizontalGroup(
            jPanel33Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel33Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jScrollPane9, javax.swing.GroupLayout.DEFAULT_SIZE, 861, Short.MAX_VALUE)
                .addContainerGap())
        );
        jPanel33Layout.setVerticalGroup(
            jPanel33Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane9, javax.swing.GroupLayout.PREFERRED_SIZE, 156, javax.swing.GroupLayout.PREFERRED_SIZE)
        );

        jLabel22.setFont(new java.awt.Font("Tahoma", 3, 11));
        jLabel22.setText("YOU MUST FIRST USE THE CONFIGURATION TAB BEFORE LOADING FILES.");

        jLabel23.setFont(new java.awt.Font("Tahoma", 3, 11));
        jLabel23.setText("Remember you can use the Recipients Editor to perform CRUD(s).");

        jLabel13.setText("Use this screen to create, read, update, delete Recipients for your Push.");

        jLabel24.setText("During loading of files, application will validate ");

        btnNewRecord.setIcon(new javax.swing.ImageIcon(getClass().getResource("/eclserver/images/action_add.png"))); // NOI18N
        btnNewRecord.setToolTipText("Add new recipient");
        btnNewRecord.setActionCommand("ADD_RECIPIENT");
        btnNewRecord.setBorderPainted(false);
        btnNewRecord.setContentAreaFilled(false);
        btnNewRecord.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnNewRecordActionPerformed(evt);
            }
        });

        btnDeleteRecord.setIcon(new javax.swing.ImageIcon(getClass().getResource("/eclserver/images/action_delete.png"))); // NOI18N
        btnDeleteRecord.setActionCommand("DELETE_RECIPIENT");
        btnDeleteRecord.setBorderPainted(false);
        btnDeleteRecord.setContentAreaFilled(false);
        btnDeleteRecord.setEnabled(false);
        btnDeleteRecord.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnDeleteRecordActionPerformed(evt);
            }
        });

        btnSaveRecord.setIcon(new javax.swing.ImageIcon(getClass().getResource("/eclserver/images/action_save.png"))); // NOI18N
        btnSaveRecord.setToolTipText("Click to save changes");
        btnSaveRecord.setActionCommand("SAVE_RECIPIENT");
        btnSaveRecord.setBorderPainted(false);
        btnSaveRecord.setContentAreaFilled(false);
        btnSaveRecord.setEnabled(false);
        btnSaveRecord.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnSaveRecordActionPerformed(evt);
            }
        });

        btnCancelRecord.setIcon(new javax.swing.ImageIcon(getClass().getResource("/eclserver/images/action_cancel.png"))); // NOI18N
        btnCancelRecord.setToolTipText("Click to cancel changes");
        btnCancelRecord.setActionCommand("CANCEL_RECIPIENT");
        btnCancelRecord.setBorderPainted(false);
        btnCancelRecord.setContentAreaFilled(false);
        btnCancelRecord.setMargin(new java.awt.Insets(2, 14, 2, 5));
        btnCancelRecord.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnCancelRecordActionPerformed(evt);
            }
        });

        btnLoadRecipients.setText("Load");
        btnLoadRecipients.setToolTipText("Clicking this spawns thread to handle contacts stuff");
        btnLoadRecipients.setActionCommand("LOAD_RECIPIENTS");
        btnLoadRecipients.setEnabled(false);
        btnLoadRecipients.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnLoadRecipientsActionPerformed(evt);
            }
        });

        btnCheckRecipients.setText("Check Recipients");
        btnCheckRecipients.setActionCommand("CHECK_RECIPIENTS");
        btnCheckRecipients.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnCheckRecipientsActionPerformed(evt);
            }
        });

        btnCancelContacts.setText("Cancel");
        btnCancelContacts.setToolTipText("This will cancel thread");
        btnCancelContacts.setActionCommand("CANCEL_RECIPIENTS");
        btnCancelContacts.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnCancelContactsActionPerformed(evt);
            }
        });

        btnNukeRecipients.setText("Nuke Recipients");
        btnNukeRecipients.setToolTipText("This will Nuke all records in Contacts Table");
        btnNukeRecipients.setActionCommand("NUKE_RECIPIENTS");
        btnNukeRecipients.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnNukeRecipientsActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(this);
        this.setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(layout.createSequentialGroup()
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(recipientsPickerPanel, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                                    .addComponent(jLabel22)
                                    .addGap(39, 39, 39))
                                .addGroup(layout.createSequentialGroup()
                                    .addComponent(jLabel23)
                                    .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 64, javax.swing.GroupLayout.PREFERRED_SIZE))))
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(layout.createSequentialGroup()
                                .addGap(107, 107, 107)
                                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addGroup(layout.createSequentialGroup()
                                        .addGap(28, 28, 28)
                                        .addComponent(btnNewRecord)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addComponent(btnDeleteRecord)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addComponent(btnSaveRecord)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addComponent(btnCancelRecord))
                                    .addComponent(recipientPanel, javax.swing.GroupLayout.PREFERRED_SIZE, 379, javax.swing.GroupLayout.PREFERRED_SIZE)))
                            .addGroup(layout.createSequentialGroup()
                                .addGap(17, 17, 17)
                                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addGroup(layout.createSequentialGroup()
                                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                            .addComponent(btnLoadRecipients, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                            .addComponent(btnCancelContacts, javax.swing.GroupLayout.PREFERRED_SIZE, 89, javax.swing.GroupLayout.PREFERRED_SIZE))
                                        .addGap(18, 18, 18)
                                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(btnNukeRecipients)
                                            .addComponent(btnCheckRecipients)))
                                    .addComponent(jLabel24)
                                    .addComponent(jLabel13, javax.swing.GroupLayout.PREFERRED_SIZE, 434, javax.swing.GroupLayout.PREFERRED_SIZE)))))
                    .addComponent(recipientsList, javax.swing.GroupLayout.PREFERRED_SIZE, 533, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jPanel33, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap())
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(layout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(jLabel22)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jLabel23)
                        .addGap(6, 6, 6)
                        .addComponent(recipientsPickerPanel, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                        .addGap(23, 23, 23)
                        .addComponent(jLabel13)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jLabel24)
                        .addGap(6, 6, 6)
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(btnLoadRecipients, javax.swing.GroupLayout.PREFERRED_SIZE, 49, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(btnCheckRecipients, javax.swing.GroupLayout.DEFAULT_SIZE, 56, Short.MAX_VALUE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(btnCancelContacts, javax.swing.GroupLayout.PREFERRED_SIZE, 42, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(btnNukeRecipients, javax.swing.GroupLayout.DEFAULT_SIZE, 48, Short.MAX_VALUE))
                        .addGap(15, 15, 15)))
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(layout.createSequentialGroup()
                        .addComponent(recipientPanel, javax.swing.GroupLayout.PREFERRED_SIZE, 128, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 8, Short.MAX_VALUE)
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(btnNewRecord)
                            .addComponent(btnSaveRecord)
                            .addComponent(btnDeleteRecord)
                            .addComponent(btnCancelRecord)))
                    .addComponent(recipientsList, javax.swing.GroupLayout.PREFERRED_SIZE, 169, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jPanel33, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(24, 24, 24))
        );
    }// </editor-fold>//GEN-END:initComponents

private void contactsListValueChanged(javax.swing.event.ListSelectionEvent evt) {//GEN-FIRST:event_contactsListValueChanged
// TODO add your handling code here:

    if (evt.getValueIsAdjusting() == false) {
        
        JList entryList = (JList) evt.getSource();
       // System.out.println("List item selected: " + entryList.getSelectedIndex());
        selectedEntry = entryList.getSelectedIndex();
        int selList = recipientsList.setSelectedIndex(selectedEntry);
      //  System.out.println("getting selList " + selList);
            
        if (recipientsList.getSelectedIndex() == -1) {
            //No selection, disable fire button.
                //recipientActionPanel.btnDeleteContact.setEnabled(false);
              this.btnDeleteRecord.setEnabled(false);

            } else {
            //Selection, enable the fire button.\
            //    System.out.println("Clicked "  + recipientsList.getSelectedListEntry().getId() + 
             //           " Email: " + recipientsList.getSelectedListEntry().getRecEmail()); 
                
                recipientPanel.setRecipient(recipientsList.getSelectedListEntry());
                recipientPanel.setRecUserBes(recipientsList.getSelectedListEntry().getUserBes());
                recipientPanel.setEditable(true);
                btnDeleteRecord.setEnabled(true);
                btnSaveRecord.setEnabled(true);
                btnNewRecord.setEnabled(false);
                
            }
        }



}//GEN-LAST:event_contactsListValueChanged

    private void btnNewRecordActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnNewRecordActionPerformed
        // TODO add your handling code here:
        
        recipientPanel.setEnabled(true);
        recipientPanel.setEditable(true);
        btnSaveRecord.setEnabled(true);
        btnNewRecord.setEnabled(false);
        
        
    }//GEN-LAST:event_btnNewRecordActionPerformed

    private void btnDeleteRecordActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnDeleteRecordActionPerformed
        // TODO add your handling code here:
        
         try{
            int id = recipientsList.getSelectedIndex();

            if (id != -1) {
                fireActionEvent(evt);
            } else {
                JOptionPane.showMessageDialog(this, "Select a list item to delete.");
            }
       
        }catch (Exception ex){
             JOptionPane.showMessageDialog(this, "Delete Failed: " + ex.getMessage());
         }
    }//GEN-LAST:event_btnDeleteRecordActionPerformed

    private void btnSaveRecordActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnSaveRecordActionPerformed
        // TODO add your handling code here:
        // TODO:  ADD VALID EMAIL CHECK BEFORE SAVE
        
      try{
    //    System.out.println("Validating required fields... length = " + recipientPanel.getRecEmail().length());
        
       if (recipientPanel.getRecEmail().length() > 0 ) {
            fireActionEvent(evt);
        } else {
           JOptionPane.showMessageDialog(this, "Email is required.");
        }
    }catch (Exception ex){
        System.out.println("Error Saving Recipient:" + ex.getMessage());
    }
    }//GEN-LAST:event_btnSaveRecordActionPerformed

    private void btnCancelRecordActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnCancelRecordActionPerformed
        // TODO add your handling code here:
        
    try{
        resetButtons();
        clearPanel();
                
    }catch (Exception ex){
             JOptionPane.showMessageDialog(this, "Clear Failed: " + ex.getMessage());
         }
    }//GEN-LAST:event_btnCancelRecordActionPerformed

    private void recipientsListValueChanged(javax.swing.event.ListSelectionEvent evt) {//GEN-FIRST:event_recipientsListValueChanged
        // TODO add your handling code here:
        
        if (evt.getValueIsAdjusting() == false) {
        
        JList entryList = (JList) evt.getSource();
       // System.out.println("List item selected: " + entryList.getSelectedIndex());
        selectedEntry = entryList.getSelectedIndex();
        int selList = recipientsList.setSelectedIndex(selectedEntry);
  //      System.out.println("getting selList " + selList);
            
        if (recipientsList.getSelectedIndex() == -1) {
            //No selection, disable fire button.
                btnDeleteRecord.setEnabled(false);

            } else {
            //Selection, enable the fire button.\
                System.out.println("Clicked "  + recipientsList.getSelectedListEntry().getId() + 
                        " Email: " + recipientsList.getSelectedListEntry().getRecEmail()); 
                
                recipientPanel.setRecipient(recipientsList.getSelectedListEntry());
                recipientPanel.setEditable(true);
                btnDeleteRecord.setEnabled(true);
                btnSaveRecord.setEnabled(true);
                btnNewRecord.setEnabled(false);
                
            }
        }
    }//GEN-LAST:event_recipientsListValueChanged

    private void btnNukeRecipientsActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnNukeRecipientsActionPerformed
        // TODO add your handling code here:
       
        boolean dDone = false;
         try {
         
             int result = JOptionPane.showOptionDialog(this, "Do you really want to nuke "
                     + "previously loaded recipients?", "Nuke Previous Recipient Loads", 
                     JOptionPane.YES_NO_OPTION,JOptionPane.INFORMATION_MESSAGE, null,null,null);
    //         System.out.println("User selected " + result);
  
            if (result == 0){
              fireActionEvent(evt);
              recipientsList.deleteAllEntries();
              btnLoadRecipients.setEnabled(false);
              recipientsPickerPanel.showFields();
              
              recipientPanel.clear();
            }
            
       }catch (Exception ex) {
           System.out.println("Error canceling Load thread for Contacts: " + ex.getMessage());
           recipientsResultsArea.append("Exception canceling thread");
       }  
      
      if(dDone){
         JOptionPane.showMessageDialog(this, "Well there are no more contacts in table." );
      }    
    }//GEN-LAST:event_btnNukeRecipientsActionPerformed

    private void btnLoadRecipientsActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnLoadRecipientsActionPerformed
        // TODO add your handling code here:
        
        File source = new File(getFileLocation());
                if (source.isFile() && source.getAbsolutePath().endsWith(".csv")) {
        
                    if (recipientsPickerPanel.getFileLocation().length() > 0){       
                        fireActionEvent(evt);
                    } else {
                        System.out.println("Seems file location is < 0 . Check file was chosen.");
                    }
                } else {
                   JOptionPane.showMessageDialog(this, "Please verify a CSV file was selected.");

                }
    }//GEN-LAST:event_btnLoadRecipientsActionPerformed

    private void btnCancelContactsActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnCancelContactsActionPerformed
        // TODO add your handling code here:
        
         try {
                btnLoadRecipients.setEnabled(true);
                recipientsPickerPanel.showFields();
                
                fireActionEvent(evt);
                
       }catch (Exception ex) {
           System.out.println("Error canceling Load thread for Contacts: " + ex.getMessage());
           recipientsResultsArea.append("Exception canceling thread");
       }  
    }//GEN-LAST:event_btnCancelContactsActionPerformed

    private void btnCheckRecipientsActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnCheckRecipientsActionPerformed
        // TODO add your handling code here:
         try {
               
                fireActionEvent(evt);
                
       }catch (Exception ex) {
           System.out.println("Error firing event to check recipients: " + ex.getMessage());
           recipientsResultsArea.append("Exception canceling thread");
       }  
        
    }//GEN-LAST:event_btnCheckRecipientsActionPerformed




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

    public void setRecipientsListEntries(List<RecipientObject> objects){
        recipientsList.addListEntries(objects);
    }
    
    public RecipientObject getSelectedListEntry(){
        return recipientsList.getSelectedListEntry();
    }
    
    public void addRecipientsListEntry(RecipientObject object){
        recipientsList.addListEntry(object);
    }
    
    public RecipientObject getPanelEntry(){
        return recipientPanel.getRecipient();
    }
    
    public void removeListEntry(){
        recipientsList.deleteSelectedEntry();
    }
    
    public void removeAllEntries(){
        recipientsList.deleteAllEntries();
    }
            
    
    public void updateListEntry(RecipientObject obj, int value) {
        recipientsList.updateIndexEntryAt(obj, value);
    }
    
    public void clearPanel(){
        recipientPanel.clear();
    }
    
    public void resetButtons(){
        btnNewRecord.setEnabled(true);
        btnSaveRecord.setEnabled(false);
        btnDeleteRecord.setEnabled(false);
        recipientPanel.setEnabled(false);
        recipientPanel.setEditable(false);
        
        recipientPanel.clear();
     
        
    }
    
    public void setListSelection(int value){
        this.selectedEntry = value;
    } 
    
    public int getListSelection(){
        return selectedEntry;
    }

   public String getFileLocation(){
       return recipientsPickerPanel.getFileLocation();
   }
   
   public void printToResults(String value){
       recipientsResultsArea.append(value + "\n");
   }
   
   @Override
   public void actionPerformed(ActionEvent e) {
        String actionCommand = e.getActionCommand();
  //      System.out.println("ActionEvent: " + actionCommand);
        if (actionCommand.equalsIgnoreCase("LOAD_RECIPIENTS")){
        //    System.out.println("LOAD_RECIPIENTS CALLBACK.");
              loadRecipients();
        } else if (actionCommand.equalsIgnoreCase("RELOAD_RECS")){
              recipientsList.deleteAllEntries(); 
        }   
    }
   
   public void loadRecipients(){
   //   System.out.println("Enabling Load button ");
      btnLoadRecipients.setEnabled(true);
  
  }
    
   public void validateRecipients(){
    //   System.out.println("Enabling validation button");
       btnCheckRecipients.setEnabled(true);
   }

 //CUSTOM VARIABLES
    EventListenerList listeners;
    
    private int selectedEntry = -1;



    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton btnCancelContacts;
    private javax.swing.JButton btnCancelRecord;
    private javax.swing.JButton btnCheckRecipients;
    private javax.swing.JButton btnDeleteRecord;
    private javax.swing.JButton btnLoadRecipients;
    private javax.swing.JButton btnNewRecord;
    private javax.swing.JButton btnNukeRecipients;
    private javax.swing.JButton btnSaveRecord;
    private javax.swing.JLabel jLabel13;
    private javax.swing.JLabel jLabel22;
    private javax.swing.JLabel jLabel23;
    private javax.swing.JLabel jLabel24;
    private javax.swing.JPanel jPanel33;
    private javax.swing.JScrollPane jScrollPane9;
    private eclserver.panels.RecipientPanel recipientPanel;
    private eclserver.panels.RecipientsListPanel recipientsList;
    private eclserver.panels.recipientsPickerPanel recipientsPickerPanel;
    private javax.swing.JTextArea recipientsResultsArea;
    // End of variables declaration//GEN-END:variables






}

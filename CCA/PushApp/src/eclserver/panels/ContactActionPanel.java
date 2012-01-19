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

import javax.swing.event.EventListenerList;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

/**
 *
 * @author  rbalsewich
 */
public class ContactActionPanel extends javax.swing.JPanel  {
    
    /**
     * Creates new form AddressActionPanel
     */
    public ContactActionPanel() {
        initComponents();
        listeners = new EventListenerList();
    }
    
    /** This method is called from within the constructor to
     * initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is
     * always regenerated by the Form Editor.
     */
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        btnNewRecord = new javax.swing.JButton();
        btnDeleteRecord = new javax.swing.JButton();
        btnSaveRecord = new javax.swing.JButton();
        btnCancelRecord = new javax.swing.JButton();

        setLayout(new java.awt.GridLayout(1, 0));

        btnNewRecord.setIcon(new javax.swing.ImageIcon(getClass().getResource("/eclserver/images/action_add.png"))); // NOI18N
        btnNewRecord.setToolTipText("Add to list");
        btnNewRecord.setActionCommand("NEW_CONTACT");
        btnNewRecord.setBorderPainted(false);
        btnNewRecord.setContentAreaFilled(false);
        btnNewRecord.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                newRecordActionPerformed(evt);
            }
        });
        add(btnNewRecord);

        btnDeleteRecord.setIcon(new javax.swing.ImageIcon(getClass().getResource("/eclserver/images/action_delete.png"))); // NOI18N
        btnDeleteRecord.setToolTipText("Delete from List");
        btnDeleteRecord.setActionCommand("DELETE_CONTACT");
        btnDeleteRecord.setBorderPainted(false);
        btnDeleteRecord.setContentAreaFilled(false);
        btnDeleteRecord.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                deleteRecordActionPerformed(evt);
            }
        });
        add(btnDeleteRecord);

        btnSaveRecord.setIcon(new javax.swing.ImageIcon(getClass().getResource("/eclserver/images/action_save.png"))); // NOI18N
        btnSaveRecord.setToolTipText("Save data");
        btnSaveRecord.setActionCommand("SAVE_CONTACT");
        btnSaveRecord.setBorderPainted(false);
        btnSaveRecord.setContentAreaFilled(false);
        btnSaveRecord.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                saveRecordActionPerformed(evt);
            }
        });
        add(btnSaveRecord);

        btnCancelRecord.setIcon(new javax.swing.ImageIcon(getClass().getResource("/eclserver/images/action_cancel.png"))); // NOI18N
        btnCancelRecord.setActionCommand("CANCEL_CONTACT");
        btnCancelRecord.setBorderPainted(false);
        btnCancelRecord.setContentAreaFilled(false);
        btnCancelRecord.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cancelRecordActionPerformed(evt);
            }
        });
        add(btnCancelRecord);
    }// </editor-fold>//GEN-END:initComponents

    private void cancelRecordActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cancelRecordActionPerformed
        fireActionEvent(evt);
    }//GEN-LAST:event_cancelRecordActionPerformed

    private void saveRecordActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_saveRecordActionPerformed
        fireActionEvent(evt);
    }//GEN-LAST:event_saveRecordActionPerformed

    private void deleteRecordActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_deleteRecordActionPerformed
        fireActionEvent(evt);
    }//GEN-LAST:event_deleteRecordActionPerformed

    private void newRecordActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_newRecordActionPerformed
        fireActionEvent(evt);
    }//GEN-LAST:event_newRecordActionPerformed

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
    private javax.swing.JButton btnCancelRecord;
    private javax.swing.JButton btnDeleteRecord;
    private javax.swing.JButton btnNewRecord;
    private javax.swing.JButton btnSaveRecord;
    // End of variables declaration//GEN-END:variables
    
}
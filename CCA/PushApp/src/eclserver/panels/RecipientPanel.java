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

import eclserver.db.objects.RecipientObject;

/**
 *
 * @author  rbalsewich
 */
public class RecipientPanel extends javax.swing.JPanel {
    
    /** Creates new form RecipientPanel */
    public RecipientPanel() {
        initComponents();
        recipient = new RecipientObject();
    }
    
    /** This method is called from within the constructor to
     * initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is
     * always regenerated by the Form Editor.
     */
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        lblRecEmail = new javax.swing.JLabel();
        txtRecEmail = new javax.swing.JTextField();
        lblBesServer = new javax.swing.JLabel();
        txtRecUserBes = new javax.swing.JTextField();

        lblRecEmail.setForeground(new java.awt.Color(255, 0, 0));
        lblRecEmail.setText("Email:");

        txtRecEmail.setPreferredSize(new java.awt.Dimension(125, 22));

        lblBesServer.setText("BES Server:");

        txtRecUserBes.setPreferredSize(new java.awt.Dimension(100, 21));

        org.jdesktop.layout.GroupLayout layout = new org.jdesktop.layout.GroupLayout(this);
        this.setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(layout.createSequentialGroup()
                .add(20, 20, 20)
                .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.TRAILING)
                    .add(lblBesServer)
                    .add(lblRecEmail))
                .addPreferredGap(org.jdesktop.layout.LayoutStyle.UNRELATED)
                .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING, false)
                    .add(txtRecUserBes, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .add(txtRecEmail, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, 256, Short.MAX_VALUE))
                .addContainerGap(63, Short.MAX_VALUE))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(layout.createSequentialGroup()
                .add(34, 34, 34)
                .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.BASELINE)
                    .add(txtRecEmail, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 36, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                    .add(lblRecEmail))
                .add(18, 18, 18)
                .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.BASELINE)
                    .add(lblBesServer)
                    .add(txtRecUserBes, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 39, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE))
                .addContainerGap())
        );
    }// </editor-fold>//GEN-END:initComponents
    
    void setRecUserBes(String value) {
        recipient.setUserBes(value);
        txtRecUserBes.setText(value);
    }
    
    String getRecUserBes() {
        String value = txtRecUserBes.getText();
        recipient.setUserBes(value);
        return value;
    }
 
    void setRecEmail(String value) {
        recipient.setRecEmail(value);
        txtRecEmail.setText(value);
    }
    
    String getRecEmail() {
        String value = txtRecEmail.getText();
        recipient.setRecEmail(value);
        return value;
    }
    
    
    
    
    public void setId(int id) {
        recipient.setId(id);
        this.id = id;
    }
    
    public int getId() {
        int id1 = this.id;
        recipient.setId(id);
        return id1;
    }
    
    public void setRecipient(RecipientObject recipient) {
        if (recipient != null) {
            setRecEmail(recipient.getRecEmail());
            setRecUserBes(recipient.getUserBes());
            setId(recipient.getId());
        }
    }
    
    public RecipientObject getRecipient() {
        RecipientObject rObj = new RecipientObject(getRecEmail(),getRecUserBes(), "N", null, getId());
        return rObj;
    }
    
    
    
    public void clear() {
        txtRecUserBes.setText(null);
        txtRecEmail.setText(null);
        id = -1;
        recipient = new RecipientObject();
    }
    
    public void setEditable(boolean bEditable) {
        txtRecEmail.setEditable(bEditable);
        txtRecUserBes.setEditable(bEditable);
        isEditable = bEditable;
    }
    
    public boolean isEditable() {
        return isEditable;
    }
    
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JLabel lblBesServer;
    private javax.swing.JLabel lblRecEmail;
    private javax.swing.JTextField txtRecEmail;
    private javax.swing.JTextField txtRecUserBes;
    // End of variables declaration//GEN-END:variables
    
    private int id;
    private boolean isEditable;
    private RecipientObject recipient;
    
}

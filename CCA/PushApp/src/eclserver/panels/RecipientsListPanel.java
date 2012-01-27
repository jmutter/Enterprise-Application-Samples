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
import eclserver.renderers.RecipientsListRenderer;
import java.util.List;
import javax.swing.DefaultListModel;
import javax.swing.event.ListSelectionListener;

/**
 *
 * @author  rbalsewich
 */
public class RecipientsListPanel extends javax.swing.JPanel {
    
    /** Creates new form RecipientsListPanel */
    public RecipientsListPanel() {
        renderer = new RecipientsListRenderer();
        model = new DefaultListModel();
        initComponents();
        
        
    }
    
    /** This method is called from within the constructor to
     * initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is
     * always regenerated by the Form Editor.
     */
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        scrollPane = new javax.swing.JScrollPane();
        recList = new javax.swing.JList();

        setLayout(new javax.swing.BoxLayout(this, javax.swing.BoxLayout.Y_AXIS));

        scrollPane.setVerticalScrollBarPolicy(javax.swing.ScrollPaneConstants.VERTICAL_SCROLLBAR_ALWAYS);

        recList.setModel(model);
        recList.setSelectionMode(javax.swing.ListSelectionModel.SINGLE_SELECTION);
        recList.setCellRenderer(renderer);
        scrollPane.setViewportView(recList);

        add(scrollPane);
    }// </editor-fold>//GEN-END:initComponents
    
    public void addListEntry(RecipientObject entry) {
        model.addElement(entry);
        
    }
    
    public void addListEntries(List<RecipientObject> list) {
        for(RecipientObject entry: list) { 
            addListEntry(entry);
        }
    }
    
    public int getSelectedIndex() {
        return recList.getSelectedIndex();
    }
    
    public int setSelectedIndex(int index) {
        assert(index >= -1);
        DefaultListModel model = (DefaultListModel)recList.getModel();
        int size = model.getSize();
        if (index < size) {
            recList.setSelectedIndex(index);
        } else {
            recList.setSelectedIndex(size-1);
            index = size -1;
        }
        return index;
    }
    
    public RecipientObject getSelectedListEntry() {
        RecipientObject entry = (RecipientObject)recList.getSelectedValue();
        return entry;
    }
    
    public int deleteSelectedEntry() {
        int selectedIndex = recList.getSelectedIndex();
        if (selectedIndex >= 0) {
            DefaultListModel model = (DefaultListModel)recList.getModel();
            model.remove(selectedIndex);
        }
        return selectedIndex;
    }
    
    public void deleteAllEntries(){
        
         try {   
            model.clear();
         } catch (Exception ex){
             System.out.println("Error clearing Recipients List Panel: " + ex.getMessage());
         }
    }
            
    
    public int updateIndexEntryAt(RecipientObject obj, int index){
        
        if (index >= 0) {
            DefaultListModel model = (DefaultListModel)recList.getModel();
            model.setElementAt(obj, index);
        }
        return index;
        
    }
    
    
    public void addListSelectionListener(ListSelectionListener listener) {
        recList.addListSelectionListener(listener);
    }
    
    public void removeListSelectionListener(ListSelectionListener listener) {
        recList.removeListSelectionListener(listener);
    }
    
    public int getSelectedEntry(){
     return this.selectedEntry;
    }
    
    public void setSelectedEntry(int value){
        this.selectedEntry = value;
    }
    
    private int selectedEntry = -1;    
    
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JList recList;
    private javax.swing.JScrollPane scrollPane;
    // End of variables declaration//GEN-END:variables
    
    private RecipientsListRenderer renderer;
    private DefaultListModel model;
}

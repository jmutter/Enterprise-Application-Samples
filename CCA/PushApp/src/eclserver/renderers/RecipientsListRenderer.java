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
package eclserver.renderers;

/**
 *
 * @author rbalsewich
 */

import java.awt.Component;
import javax.swing.JList;
import javax.swing.DefaultListCellRenderer;

import eclserver.db.objects.RecipientObject;


public class RecipientsListRenderer extends DefaultListCellRenderer {
    
    /**
     * Creates a new instance of ListEntryRenderer
     */
    public RecipientsListRenderer()   {
    }

    @Override
    public Component getListCellRendererComponent(JList list, Object value, 
            int index, boolean isSelected, boolean cellHasFocus) {
        super.getListCellRendererComponent(list, value, index, isSelected, cellHasFocus);
        
        RecipientObject entry = (RecipientObject) value;
        this.setText(entry.getRecListObject());
        return this;
    }
    
}

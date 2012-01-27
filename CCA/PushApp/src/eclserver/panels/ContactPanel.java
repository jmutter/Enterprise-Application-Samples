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


import eclserver.db.objects.AddressObject;

/**
 *
 * @author  rbalsewich
 */
public class ContactPanel extends javax.swing.JPanel {
    
    /** Creates new form AddressPanel */
    public ContactPanel() {
        initComponents();
        address = new AddressObject();
    }
    
    /** This method is called from within the constructor to
     * initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is
     * always regenerated by the Form Editor.
     */
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {
        java.awt.GridBagConstraints gridBagConstraints;

        lblAddress1 = new javax.swing.JLabel();
        txtAddress1 = new javax.swing.JTextField();
        lblAddress2 = new javax.swing.JLabel();
        txtAddress2 = new javax.swing.JTextField();
        lblCity = new javax.swing.JLabel();
        txtCity = new javax.swing.JTextField();
        txtState = new javax.swing.JTextField();
        txtPostalCode = new javax.swing.JTextField();
        lblState = new javax.swing.JLabel();
        lblPostalCode = new javax.swing.JLabel();
        lblLastName = new javax.swing.JLabel();
        txtLastName = new javax.swing.JTextField();
        lblFirstName = new javax.swing.JLabel();
        txtFirstName = new javax.swing.JTextField();
        lblCompanyName = new javax.swing.JLabel();
        txtCompany = new javax.swing.JTextField();
        lblHomePhone = new javax.swing.JLabel();
        txtHomePhone = new javax.swing.JTextField();
        lblEmail = new javax.swing.JLabel();
        txtEmail = new javax.swing.JTextField();
        lblCountry = new javax.swing.JLabel();
        txtCountry = new javax.swing.JTextField();
        lblPin = new javax.swing.JLabel();
        lblGroupName = new javax.swing.JLabel();
        txtGroupName = new javax.swing.JTextField();
        lblTitle = new javax.swing.JLabel();
        txtTitle = new javax.swing.JTextField();
        lblWorkPhone = new javax.swing.JLabel();
        txtWorkPhone = new javax.swing.JTextField();
        lblMobilePhone = new javax.swing.JLabel();
        txtMobilePhone = new javax.swing.JTextField();
        txtPin = new javax.swing.JTextField();

        setLayout(new java.awt.GridBagLayout());

        lblAddress1.setText("Address 1:");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 5;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(lblAddress1, gridBagConstraints);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 5;
        gridBagConstraints.gridwidth = 3;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipady = 2;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(txtAddress1, gridBagConstraints);

        lblAddress2.setText("Address 2:");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 4;
        gridBagConstraints.gridy = 5;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(lblAddress2, gridBagConstraints);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 5;
        gridBagConstraints.gridy = 5;
        gridBagConstraints.gridwidth = 3;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipady = 2;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(txtAddress2, gridBagConstraints);

        lblCity.setText("City:");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 6;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(lblCity, gridBagConstraints);

        txtCity.setMinimumSize(new java.awt.Dimension(100, 21));
        txtCity.setPreferredSize(new java.awt.Dimension(100, 21));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 6;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipady = 5;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(txtCity, gridBagConstraints);

        txtState.setMinimumSize(new java.awt.Dimension(30, 21));
        txtState.setPreferredSize(new java.awt.Dimension(30, 21));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 4;
        gridBagConstraints.gridy = 6;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipady = 5;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(txtState, gridBagConstraints);

        txtPostalCode.setMinimumSize(new java.awt.Dimension(80, 21));
        txtPostalCode.setPreferredSize(new java.awt.Dimension(80, 21));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 4;
        gridBagConstraints.gridy = 7;
        gridBagConstraints.ipady = 4;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(txtPostalCode, gridBagConstraints);

        lblState.setText("State:");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 3;
        gridBagConstraints.gridy = 6;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(lblState, gridBagConstraints);

        lblPostalCode.setText("ZIP Code:");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 3;
        gridBagConstraints.gridy = 7;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(lblPostalCode, gridBagConstraints);

        lblLastName.setForeground(new java.awt.Color(255, 0, 0));
        lblLastName.setText("Last Name:");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 1;
        add(lblLastName, gridBagConstraints);

        txtLastName.setMinimumSize(new java.awt.Dimension(100, 21));
        txtLastName.setPreferredSize(new java.awt.Dimension(100, 21));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipady = 8;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(txtLastName, gridBagConstraints);

        lblFirstName.setForeground(new java.awt.Color(255, 0, 0));
        lblFirstName.setText("First Name:");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 3;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(lblFirstName, gridBagConstraints);

        txtFirstName.setMinimumSize(new java.awt.Dimension(80, 21));
        txtFirstName.setPreferredSize(new java.awt.Dimension(80, 21));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 4;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.gridwidth = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipady = 6;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(txtFirstName, gridBagConstraints);

        lblCompanyName.setText("Company:");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 7;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(lblCompanyName, gridBagConstraints);

        txtCompany.setMinimumSize(new java.awt.Dimension(80, 21));
        txtCompany.setPreferredSize(new java.awt.Dimension(80, 21));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 8;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipady = 6;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(txtCompany, gridBagConstraints);

        lblHomePhone.setText("Home #:");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 3;
        gridBagConstraints.gridy = 3;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(lblHomePhone, gridBagConstraints);

        txtHomePhone.setPreferredSize(new java.awt.Dimension(100, 21));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 4;
        gridBagConstraints.gridy = 3;
        gridBagConstraints.gridwidth = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipady = 5;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(txtHomePhone, gridBagConstraints);

        lblEmail.setForeground(new java.awt.Color(255, 0, 0));
        lblEmail.setText("Email:");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 2;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(lblEmail, gridBagConstraints);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 2;
        gridBagConstraints.gridwidth = 3;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipady = 3;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(txtEmail, gridBagConstraints);

        lblCountry.setText("Country:");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 7;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(lblCountry, gridBagConstraints);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 7;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipady = 2;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(txtCountry, gridBagConstraints);

        lblPin.setText("Device Pin");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 7;
        gridBagConstraints.gridy = 4;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(lblPin, gridBagConstraints);

        lblGroupName.setForeground(new java.awt.Color(255, 0, 0));
        lblGroupName.setText("Group Name:");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        add(lblGroupName, gridBagConstraints);

        txtGroupName.setPreferredSize(new java.awt.Dimension(100, 21));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.gridwidth = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipady = 6;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(txtGroupName, gridBagConstraints);

        lblTitle.setText("Title:");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 7;
        gridBagConstraints.gridy = 2;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(lblTitle, gridBagConstraints);

        txtTitle.setPreferredSize(new java.awt.Dimension(80, 21));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 8;
        gridBagConstraints.gridy = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipadx = 3;
        gridBagConstraints.ipady = 7;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(txtTitle, gridBagConstraints);

        lblWorkPhone.setText("Work #:");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 3;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(lblWorkPhone, gridBagConstraints);

        txtWorkPhone.setPreferredSize(new java.awt.Dimension(100, 21));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 3;
        gridBagConstraints.gridwidth = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipady = 6;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(txtWorkPhone, gridBagConstraints);

        lblMobilePhone.setText("Mobile #:");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 7;
        gridBagConstraints.gridy = 3;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(lblMobilePhone, gridBagConstraints);

        txtMobilePhone.setMinimumSize(new java.awt.Dimension(100, 21));
        txtMobilePhone.setPreferredSize(new java.awt.Dimension(100, 21));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 8;
        gridBagConstraints.gridy = 3;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipady = 5;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(txtMobilePhone, gridBagConstraints);

        txtPin.setPreferredSize(new java.awt.Dimension(100, 21));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 8;
        gridBagConstraints.gridy = 4;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipady = 5;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(5, 5, 5, 5);
        add(txtPin, gridBagConstraints);
    }// </editor-fold>//GEN-END:initComponents
    
    void setGroupName(String groupName) {
        address.setGroupName(groupName);
        txtGroupName.setText(groupName);
    }
    
    String getGroupName() {
        String groupName = txtGroupName.getText();
        address.setGroupName(groupName);
        return groupName;
    }
 
    void setLastName(String lastName) {
        address.setLastName(lastName);
        txtLastName.setText(lastName);
    }
    
    String getLastName() {
        String lastName = txtLastName.getText();
        address.setLastName(lastName);
        return lastName;
    }
    
    void setFirstName(String firstName) {
        address.setFirstName(firstName);
        txtFirstName.setText(firstName);
        
    }
    
    String getFirstName() {
        String firstName = txtFirstName.getText();
        address.setFirstName(firstName);
        return firstName;
    }
    
     void setHomePhone(String phone) {
        address.setHomePhone(phone);
        txtHomePhone.setText(phone);
    }
    
    String getHomePhone() {
        String phone = txtHomePhone.getText();
        address.setHomePhone(phone);
        return phone;
    }
     void setWorkPhone(String phone) {
        address.setWorkPhone(phone);
        txtWorkPhone.setText(phone);
    }
    
    String getWorkPhone() {
        String phone = txtWorkPhone.getText();
        address.setWorkPhone(phone);
        return phone;
    }
    
    void setMobilePhone(String phone) {
        address.setMobilePhone(phone);
        txtMobilePhone.setText(phone);
    }
    
    String getMobilePhone() {
        String phone = txtMobilePhone.getText();
        address.setMobilePhone(phone);
        return phone;
    }
    
    void setEmail(String email) {
        address.setEmail(email);
        txtEmail.setText(email);
    }
    
    String getEmail() {
        String email = txtEmail.getText();
        address.setEmail(email);
        return email;
    }
    
    void setAddress1(String address1) {
        address.setAddress1(address1);
        txtAddress1.setText(address1);
    }
    
    String getAddress1() {
        String address1 = txtAddress1.getText();
        address.setAddress1(address1);
        return address1;
    }
    
    void setAddress2(String address2) {
        address.setAddress2(address2);
        txtAddress2.setText(address2);
    }
    
    String getAddress2() {
        String address2 = txtAddress2.getText();
        address.setAddress2(address2);
        return address2;
    }
    
    void setCity(String city) {
        address.setCity(city);
        txtCity.setText(city);
    }
    
    String getCity() {
        String city = txtCity.getText();
        address.setCity(city);
        return city;
    }
 
    void setState(String state) {
        address.setState(state);
        txtState.setText(state);
    }
    
    String getState() {
        String state = txtState.getText();
        address.setState(state);
        return state;
    }
    
    void setZip(String postalCode) {
        address.setZip(postalCode);
        txtPostalCode.setText(postalCode);
    }
    
    String getZip() {
        String postalCode = txtPostalCode.getText();
        address.setZip(postalCode);
        return postalCode;
    }
    
    
    void setCountry(String country) {
        address.setCountry(country);
        txtCountry.setText(country);
    }
    
    String getCountry() {
        String country = txtCountry.getText();
        address.setCountry(country);
        return country;
    }
    
    void setTitle(String title) {
        address.setCountry(title);
        txtTitle.setText(title);
    }
    
    String getTitle() {
        String title = txtTitle.getText();
        address.setTitle(title);
        return title;
    }
    void setCompany(String company) {
        address.setCompany(company);
        txtCompany.setText(company);
    }
    
    String getCompany() {
        String company = txtCompany.getText();
        address.setCompany(company);
        return company;
    }
    
     void setPin(String pin) {
        address.setPin(pin);
        txtPin.setText(pin);
    }
    
    String getPin() {
        String pin = txtPin.getText();
        address.setPin(pin);
        return pin;
    }
    
    void setId(int id) {
        address.setId(id);
        this.id = id;
    }
    
    int getId() {
        int id1 = this.id;
        address.setId(id);
        return id1;
    }

    
    public void setAddress(AddressObject address) {
        if (address != null) {
            setGroupName(address.getGroupName());
            setLastName(address.getLastName());
            setFirstName(address.getFirstName());
            setEmail(address.getEmail());
            setHomePhone(address.getHomePhone());
            setWorkPhone(address.getWorkPhone());
            setMobilePhone(address.getMobilePhone());
            setAddress1(address.getAddress1());
            setAddress2(address.getAddress2());
            setCity(address.getCity());
            setState(address.getState());
            setZip(address.getZip());
            setCountry(address.getCountry());
            setTitle(address.getTitle());
            setCompany(address.getCompany());
            setPin(address.getPin());
            setId(address.getId());
        }
    }
    
    public AddressObject getAddress() {
        getGroupName();
        getLastName();
        getFirstName();
        getEmail();
        getHomePhone();
        getWorkPhone();
        getMobilePhone();       
        getAddress1();
        getAddress2();
        getCity();
        getState();
        getZip();
        getCountry();
        getTitle();
        getCompany();
        getPin();
        getId();
        return address;
    }
    
    
    
    public void clear() {
        txtGroupName.setText(null);
        txtLastName.setText(null);
        txtCompany.setText(null);
        txtFirstName.setText(null);
        txtHomePhone.setText(null);
        txtWorkPhone.setText(null);
        txtMobilePhone.setText(null);
        txtEmail.setText(null);
        txtAddress1.setText(null);
        txtAddress2.setText(null);
        txtCity.setText(null);
        txtState.setText(null);
        txtPostalCode.setText(null);
        txtCountry.setText(null);
        txtPin.setText(null);
        txtTitle.setText(null);
        txtCompany.setText(null);
        id = -1;
        address = new AddressObject();
    }
    
    public void setEditable(boolean bEditable) {
        txtGroupName.setEditable(bEditable);
        txtFirstName.setEditable(bEditable);
        txtLastName.setEditable(bEditable);
        txtCompany.setEditable(bEditable);
        txtTitle.setEditable(bEditable);
        txtAddress1.setEditable(bEditable);
        txtAddress2.setEditable(bEditable);
        txtCity.setEditable(bEditable);
        txtState.setEditable(bEditable);
        txtPostalCode.setEditable(bEditable);
        txtCountry.setEditable(bEditable);
        txtHomePhone.setEditable(bEditable);
        txtWorkPhone.setEditable(bEditable);
        txtMobilePhone.setEditable(bEditable);
        txtEmail.setEditable(bEditable);
        txtPin.setEditable(bEditable);
        isEditable = bEditable;
    }
    
    public boolean isEditable() {
        return isEditable;
    }
    
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JLabel lblAddress1;
    private javax.swing.JLabel lblAddress2;
    private javax.swing.JLabel lblCity;
    private javax.swing.JLabel lblCompanyName;
    private javax.swing.JLabel lblCountry;
    private javax.swing.JLabel lblEmail;
    private javax.swing.JLabel lblFirstName;
    private javax.swing.JLabel lblGroupName;
    private javax.swing.JLabel lblHomePhone;
    private javax.swing.JLabel lblLastName;
    private javax.swing.JLabel lblMobilePhone;
    private javax.swing.JLabel lblPin;
    private javax.swing.JLabel lblPostalCode;
    private javax.swing.JLabel lblState;
    private javax.swing.JLabel lblTitle;
    private javax.swing.JLabel lblWorkPhone;
    private javax.swing.JTextField txtAddress1;
    private javax.swing.JTextField txtAddress2;
    private javax.swing.JTextField txtCity;
    private javax.swing.JTextField txtCompany;
    private javax.swing.JTextField txtCountry;
    private javax.swing.JTextField txtEmail;
    private javax.swing.JTextField txtFirstName;
    private javax.swing.JTextField txtGroupName;
    private javax.swing.JTextField txtHomePhone;
    private javax.swing.JTextField txtLastName;
    private javax.swing.JTextField txtMobilePhone;
    private javax.swing.JTextField txtPin;
    private javax.swing.JTextField txtPostalCode;
    private javax.swing.JTextField txtState;
    private javax.swing.JTextField txtTitle;
    private javax.swing.JTextField txtWorkPhone;
    // End of variables declaration//GEN-END:variables
    
    private int id;
    private boolean isEditable;
    private AddressObject address;
    
}

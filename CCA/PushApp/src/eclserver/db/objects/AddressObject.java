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
package eclserver.db.objects;

/**
 *
 * @author rbalsewich
 */


public class AddressObject {
    
    /**
     * Creates a new instance of AddressObject
     */
    public AddressObject() {
    }
    
    
    public AddressObject(String groupName, String lastName, String firstName, String email){
        this(groupName, lastName, firstName, email, null, null, 
                null, null, null, null, null, null, null, 
                null, null, null);
    
        
    }
               
    public AddressObject(String groupName, String lastName, String firstName, String email, 
            String homePhone, String workPhone, String mobilePhone, String pin,
                String address1, String address2, String city, String state,
                String zip, String country, String title, String company){
         
        this(groupName, lastName, firstName, email, homePhone, workPhone,
                mobilePhone, pin, address1, address2, city, state,
                zip, country, title, company,  -1);
        
    }
    
   
    public AddressObject(String groupName, String lastName, String firstName, String email, 
            String homePhone, String workPhone, String mobilePhone, String pin,
                String address1, String address2, String city, String state,
                String zip, String country, String title, String company, int id) {
         
        this.groupName = groupName;
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
        this.homePhone = homePhone;
        this.workPhone = workPhone;
        this.mobilePhone  = mobilePhone;
        this.pin = pin;
        this.address1 = address1;
        this.address2 = address2;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.country = country;
        this.title = title;
        this.company = company;
        this.id = id;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }
    
    public String getGroupName() {
        return groupName;
    }

    public void setHomePhone(String homePhone) {
        this.homePhone = homePhone;
    }
    
    public String getHomePhone() {
        return homePhone;

    }

    public void setWorkPhone(String workPhone) {
        this.workPhone = workPhone;
    }
    
    public String getWorkPhone() {
        return workPhone;
    }

    public void setMobilePhone(String mobilePhone) {
        this.mobilePhone = mobilePhone;
    }
    
    public String getMobilePhone() {
        return mobilePhone;
    }
    
    public void setEmail(String email) {
        this.email = email;
        
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
    public int getId() {
        return id;
    }
    
    public void setPin(String pin){
        this.pin = pin;
    }
    
    public String getPin(){
        return pin;
    }
    
    public void setAddress1(String address1){
        this.address1 = address1;
    }
    
    public String getAddress1(){
        return address1;
    }
    
     public void setAddress2(String address2){
        this.address2 = address2;
    }
    
    public String getAddress2(){
        return address2;
    }
    
    public void setCity(String city){
        this.city = city;
    }
    
    public String getCity(){
        return city;
    }
    
     public void setState(String state){
        this.state = state;
    }
    
    public String getState(){
        return state;
    }
      
    public void setZip(String zip){
        this.zip = zip;
    }
    
    public String getZip(){
        return zip;
    }
    
     public void setCountry(String country){
        this.country = country;
    }
    
    public String getCountry(){
        return country;
    }
    
    
     public void setTitle(String title){
        this.title = title;
    }
    
    public String getTitle(){
        return title;
    }
    
    
     public void setCompany(String company){
        this.company = company;
    }
    
    public String getCompany(){
        return company;
    }
    
    public String getAddressListObject(){
        
        String value = "(group):  " + groupName + "     (name):  " + lastName + ", " + firstName + 
                "     (email):  " + email + "     (title):  " + title + "     (company):  " + company +
                "     (h#):  " + homePhone + "      (w#):  " + workPhone + 
                "     (c#):  " + mobilePhone + "     (pin):  " + pin + "     (a):  " + address1 +
                "  " + address2 + "   " + city + "  " + state + "    " + zip +
                "     " + country;
        
         return value;
    }
    
   @Override    
    public int hashCode() {
        int value = 1;
        value = value*PRIMENO + (groupName == null ? 0 : groupName.hashCode());
        value = value*PRIMENO + (lastName == null ? 0 : lastName.hashCode());
        value = value*PRIMENO + (firstName == null ? 0 : firstName.hashCode());
        value = value*PRIMENO + (email == null ? 0 : email.hashCode());
            value = value*PRIMENO + (homePhone == null ? 0 : homePhone.hashCode());
            value = value*PRIMENO + (workPhone == null ? 0 : workPhone.hashCode());
            value = value*PRIMENO + (mobilePhone == null ? 0 : mobilePhone.hashCode());
            value = value*PRIMENO + (pin == null ? 0 : pin.hashCode());     
        value = value*PRIMENO + (address1 == null ? 0 : address1.hashCode());
        value = value*PRIMENO + (address2 == null ? 0 : address2.hashCode());
        value = value*PRIMENO + (city == null ? 0 : city.hashCode());
        value = value*PRIMENO + (state == null ? 0 : state.hashCode());
        value = value*PRIMENO + (zip == null ? 0 : zip.hashCode());
        value = value*PRIMENO + (country == null ? 0 : country.hashCode());
        value = value*PRIMENO + (title == null ? 0 : title.hashCode());
        value = value*PRIMENO + (company == null ? 0 : company.hashCode());

        // don't use the id since this is generated by db
        
        return value;
    }
    
   @Override
    public boolean equals(Object other) {
        boolean bEqual = false;
        if (this == other) {
            bEqual = true;
        } else if (other instanceof AddressObject) {
            AddressObject thatAddress = (AddressObject) other;
            if ((groupName == null ? thatAddress.groupName == null : groupName.equalsIgnoreCase(thatAddress.groupName)) &&
                    (lastName == null ? thatAddress.lastName == null : lastName.equalsIgnoreCase(thatAddress.lastName)) && 
                    (firstName == null ? thatAddress.firstName == null : firstName.equalsIgnoreCase(thatAddress.firstName)) && 
                    (email == null ? thatAddress.email == null : email.equalsIgnoreCase(thatAddress.email)) &&
                    (homePhone == null ? thatAddress.homePhone == null : homePhone.equalsIgnoreCase(thatAddress.homePhone)) &&
                    (workPhone == null ? thatAddress.workPhone == null : workPhone.equalsIgnoreCase(thatAddress.workPhone)) &&
                    (mobilePhone == null ? thatAddress.mobilePhone == null : mobilePhone.equalsIgnoreCase(thatAddress.mobilePhone)) &&
                    (pin == null ? thatAddress.pin == null : pin.equalsIgnoreCase(thatAddress.pin)) &&
                    (address1 == null ? thatAddress.address1 == null : address1.equalsIgnoreCase(thatAddress.address1)) &&
                    (address2 == null ? thatAddress.address2 == null : address2.equalsIgnoreCase(thatAddress.address2)) &&
                    (city == null ? thatAddress.city == null : city.equalsIgnoreCase(thatAddress.city)) &&
                    (state == null ? thatAddress.state == null : state.equalsIgnoreCase(thatAddress.state)) &&
                    (zip == null ? thatAddress.zip == null : zip.equalsIgnoreCase(thatAddress.zip)) &&
                    (country == null ? thatAddress.country == null : country.equalsIgnoreCase(thatAddress.country)) &&
                    (title == null ? thatAddress.title == null : title.equalsIgnoreCase(thatAddress.title)) &&
                    (company == null ? thatAddress.company == null : company.equalsIgnoreCase(thatAddress.company))) {
                // don't use id in determining equality
                
                bEqual = true;
            }
        }
        
        return bEqual;
    }
   
    private String groupName;
    private String lastName;
    private String firstName;
    private String email;
    private String homePhone;
    private String workPhone;
    private String mobilePhone;
    private String pin;
    private String address1;
    private String address2;
    private String city;
    private String state;
    private String zip;
    private String country;
    private String title;
    private String company;
    private int id;
    
    private static final int PRIMENO = 37;
    
}

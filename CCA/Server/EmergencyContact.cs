using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ECLServerASP
{
    public class EmergencyContact        
    {
        public string ecLName, ecFName, ecEmail, ecHomePhone, ecWorkPhone, ecMobilePhone, ecPin, 
            ecAddress1, ecAddress2, ecCity, ecState, ecZip, ecCountry, ecTitle, ecCompany;

        //Default constructor
        public EmergencyContact()
        {            
            ecLName = null;
            ecFName = null;
            ecEmail = null;
            ecHomePhone = null;
            ecWorkPhone = null;
            ecMobilePhone = null;
            ecPin = null;
            ecAddress1 = null;
            ecAddress2 = null;
            ecCity = null;
            ecState = null;
            ecZip = null;
            ecCountry = null;
            ecTitle = null;
            ecCompany = null;            
        }
    }
}

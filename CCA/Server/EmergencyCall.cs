using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ECLServerASP
{
    public class EmergencyCall
    {
        public string ecEmailAddr, ecBridgeNum, ecAcceptURL, ecDeclineURL, ecDetails, ecCallDateTime;

        //Default constructor
        public EmergencyCall()
        {
            ecEmailAddr = null;
            ecBridgeNum = null;
            ecAcceptURL = null;
            ecDeclineURL = null;
            ecDetails = null;
            ecCallDateTime = null;
        }
    }
}

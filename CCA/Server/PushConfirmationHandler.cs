using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.IO;

public class PUSHConfirmationHandler : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        string strResponseData = "Complete";
        string ValueToSearchFor = " confirmationdata:";      
        const string quote = "\"";
        string OutputText = "";
        
        StreamWriter tw = new StreamWriter("c:\\inetpub\\wwwroot\\Pushconfirmation\\Responses.txt", true);
        string DataReceived = context.Request.QueryString["MyMessage"];
        string DataToTest = DataReceived.ToLower();
        int ConfirmationPos = DataToTest.IndexOf(ValueToSearchFor, 0);
        if (ConfirmationPos < 0)
        {
            OutputText = quote + "Invalid Data Received" + "->" + DataReceived + quote;
        }
        else
        {
            OutputText = DataReceived.Substring(ConfirmationPos + ValueToSearchFor.Length);
        }
        string OutputLine = DateTime.Now + "," + OutputText;
        tw.WriteLine(OutputLine);
        tw.Close();
        context.Response.ContentType = "text/plain";
        context.Response.Write(strResponseData);
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}
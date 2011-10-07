using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net;
using System.IO;
using System.Collections;
using System.Web.Script.Serialization;

namespace ECLServerASP
{
    public partial class _Default : System.Web.UI.Page
    {
        //Array lists to hold the contents of the input files in memory
        ArrayList empArray = new ArrayList();
        ArrayList emerArray = new ArrayList();
        ArrayList emailArray = new ArrayList();
                
        private void sendData(string sendData, string destEmail)        
        {
            string result = null;            
            
            string httpURL = "http://" + txtServer.Text
                                + ":" + txtMDSPort.Text
                                + "/push?DESTINATION=" + destEmail //"simulator@pushme.com"
                                + "&PORT=" + "3333"
                                + "&REQUESTURI=/";            
            try
            {
                HttpWebRequest HttpWReq = (HttpWebRequest)WebRequest.Create(httpURL);
                HttpWReq.Method = ("POST");
                HttpWReq.Headers.Add("ContentType", "text/plain");
                byte[] data = System.Text.ASCIIEncoding.UTF8.GetBytes(sendData);
                HttpWReq.ContentLength = data.Length;
                Stream requestStream = HttpWReq.GetRequestStream();
                requestStream.Write(data, 0, data.Length);
                HttpWebResponse HttpWRes = (HttpWebResponse)HttpWReq.GetResponse();
                if (HttpWRes.StatusCode == HttpStatusCode.OK)
                {
                    result = "HttpStatusCode - Success " + " Size: " + data.Length;
                }
                else
                {
                    result = HttpWRes.StatusCode + " : " + HttpWRes.StatusDescription;
                }
                lstStatus.Items.Add(DateTime.Now + " -- HTTP Post Result: " + result);
                requestStream.Close();
                HttpWRes.Close();
            }
            catch (Exception ex)
            {
                logError("sendData()", ex.Message);
                lstStatus.Items.Add(DateTime.Now + " -- Exception Occurred, check ECLServerErrorLog.txt");                
            }
        }

        /// <summary>
        /// creates the JSON for the "Emergency Notification" payload
        /// </summary>
        /// <param name="obj">an object containig the data to be converted JSON</param>
        /// <returns>string containg json</returns>
        private string createJSONEmerNoti(object obj)
        {
            try
            {
                //file to test json
                TextWriter tw = new StreamWriter("C:\\temp\\jsonOutputEmerNoti.txt",true);
                
                string jsonBody = string.Empty;

                EmergencyNoti emerObjNoti = (EmergencyNoti)obj;                
                
                //long myDateTime = DateTime.Now.ToUniversalTime().Ticks / TimeSpan.TicksPerMillisecond;
                //DateTime apptTime = new DateTime(Convert.ToInt32(drpListYear.Text), Convert.ToInt32(drpListMonth.Text), Convert.ToInt32(drpListDay.Text), Convert.ToInt32(drpListHour.Text), Convert.ToInt32(drpListMin.Text), 0);
                //long apptTimeInMs = apptTime.ToUniversalTime().Ticks / TimeSpan.TicksPerMillisecond;
                
                jsonBody +=
                    "{" + @"""EmergencyNotification""" + ":[" +
                    @"{" + @"""details""" + ":" + @"""" + emerObjNoti.ecAcceptURL + @"""" +                                        
                    "," + @"""accepturl""" + ":" + @"""" + emerObjNoti.ecAcceptURL + @"""";
                jsonBody += "}]}";

                //writing data into file for testing
                Console.WriteLine(jsonBody);
                tw.WriteLine(jsonBody);
                tw.Close();

                //return json to calling function
                return jsonBody;               
            }
            catch (Exception ex)
            {
                logError("createJSONEmer()", ex.Message);
                lstStatus.Items.Add(DateTime.Now + " -- Exception Occurred, check ECLServerErrorLog.txt");                
                return null;
            }
        }

        private string createJSONEmerCall(object obj)
        {
            try
            {
                //file to test json
                TextWriter tw = new StreamWriter("C:\\temp\\jsonOutputEmerCall.txt", true);

                string jsonBody = string.Empty;

                EmergencyCall emerObj = (EmergencyCall)obj;                

                jsonBody +=
                    "{" + @"""EmergencyCall""" + ":[" +
                    @"{" + @"""datetime""" + ":" + @"""" + emerObj.ecCallDateTime + @"""" +
                    "," + @"""details""" + ":" + @"""" + emerObj.ecDetails + @"""" +
                    "," + @"""phonenumber""" + ":" + @"""" + emerObj.ecBridgeNum + @"""" +
                    "," + @"""accepturl""" + ":" + @"""" + emerObj.ecAcceptURL + @"""" +
                    "," + @"""declineurl""" + ":" + @"""" + emerObj.ecDeclineURL + @"""";
                jsonBody += "}]}";

                //writing data into file for testing
                Console.WriteLine(jsonBody);
                tw.WriteLine(jsonBody);
                tw.Close();

                //return json to calling function
                return jsonBody;
            }
            catch (Exception ex)
            {
                logError("createJSONEmer()", ex.Message);
                lstStatus.Items.Add(DateTime.Now + " -- Exception Occurred, check ECLServerErrorLog.txt");
                return null;
            }
        }

        
        /// <summary>
        /// creates the JSON for the "Emergency" ECL
        /// </summary>
        /// <param name="objArray">ArrayList containg EmployeeInfo to be converted to JSON</param>        
        /// <returns>string, containing JSON</returns>
        private string createJSONContact(ArrayList objArray) 
        {
            try
            {
                //file to test json
                TextWriter tw = new StreamWriter("C:\\temp\\jsonOutputContact.txt");
                string jsonBody = string.Empty;

                jsonBody = "{" + @"""Contact""" + ":[";
                int empArrayCount = empArray.Count;

                for (int i = 0; i < empArrayCount; i++)
                {
                    EmergencyContact empObj = (EmergencyContact)empArray[i];
                    jsonBody +=
                      @"{" + @"""lastname""" + ":" + @"""" + empObj.ecLName + @"""" +
                        "," + @"""firstname""" + ":" + @"""" + empObj.ecFName + @"""" +
                        "," + @"""email""" + ":" + @"""" + empObj.ecEmail + @"""" +
                        "," + @"""homephone""" + ":" + @"""" + empObj.ecHomePhone + @"""" +
                        "," + @"""workphone""" + ":" + @"""" + empObj.ecWorkPhone + @"""" +
                        "," + @"""mobilephone""" + ":" + @"""" + empObj.ecMobilePhone + @"""" +
                        "," + @"""pin""" + ":" + @"""" + empObj.ecPin + @"""" +
                        "," + @"""address""" + ":" + @"""" + empObj.ecAddress1 + @"""" +
                        "," + @"""address2""" + ":" + @"""" + empObj.ecAddress2 + @"""" +
                        "," + @"""city""" + ":" + @"""" + empObj.ecCity + @"""" +
                        "," + @"""state""" + ":" + @"""" + empObj.ecState + @"""" +
                        "," + @"""zipcode""" + ":" + @"""" + empObj.ecZip + @"""" +
                        "," + @"""country""" + ":" + @"""" + empObj.ecCountry + @"""" +
                        "," + @"""title""" + ":" + @"""" + empObj.ecTitle + @"""" +
                        "," + @"""company""" + ":" + @"""" + empObj.ecCompany + @"""";
                    //calcualtion done to append comma as long as we're at end of JSON
                    if ((empArrayCount - i) > 1)
                    {
                        jsonBody += "},";
                    }
                }
                jsonBody += "}]}";

                //writing data into file for testing
                Console.WriteLine(jsonBody);
                tw.WriteLine(jsonBody);
                tw.Close();

                //return json to calling function
                return jsonBody;
            }
            catch (Exception ex)
            {
                logError("createJSONContact()", ex.Message);
                lstStatus.Items.Add(DateTime.Now + " -- Exception Occurred, check ECLServerErrorLog.txt");                
                return null;
            }
        }
       

        /// <summary>
        /// readFile reads the contents of a comma delimted local file, parses it, loads the 
        /// contents of the file into memory 
        /// </summary>
        /// <param name="path">the location of the file being read</param>
        /// <returns>list structure containg contents of the file</returns>
        private List<string[]> readFile(string path)
        //private List<string[]> readFile()
        {
            //create a list structure to hold the data read from file
            List<string[]> parsedData = new List<string[]>();            

            try
            {                
                using (StreamReader readFile = new StreamReader(path))
                {
                    string line;
                    string[] row;

                    while ((line = readFile.ReadLine()) != null)
                    {
                        row = line.Split(',');
                        parsedData.Add(row);
                    }
                    return parsedData;
                }
            }
            catch (Exception ex)
            {
                logError("createJSONContact()", ex.Message);
                lstStatus.Items.Add(DateTime.Now + " -- Exception Occurred, check ECLServerErrorLog.txt");                
                return null;
            }
        }


        /// <summary>
        /// Calls readFile, loads contents of ECL Contact file into memory, 
        /// then processes each element of the file.        
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void btnContactECL_Click(object sender, EventArgs e)
        {
            try
            {
                if (txtContactSrc.Text.Trim() != string.Empty)
                {
                    //list structures contaiing contents of data file to be inputted &
                    //recipient emails
                    List<string[]> data = readFile(txtContactSrc.Text);
                    List<string[]> emails = readFile(txtContactRecip.Text);

                    if (data != null && emails != null)
                    {
                        foreach (string[] dataIn in data)
                        {
                            EmergencyContact empObj = new EmergencyContact();
                            empObj.ecFName = dataIn[0].ToString();                            
                            empObj.ecLName = dataIn[1].ToString();
                            empObj.ecTitle = dataIn[2].ToString();
                            empObj.ecCompany = dataIn[3].ToString();
                            empObj.ecEmail = dataIn[4].ToString();
                            empObj.ecPin = dataIn[5].ToString();
                            empObj.ecWorkPhone = dataIn[6].ToString();
                            empObj.ecMobilePhone = dataIn[7].ToString();
                            empObj.ecHomePhone = dataIn[8].ToString();                            
                            empObj.ecAddress1 = dataIn[9].ToString();
                            empObj.ecAddress2 = dataIn[10].ToString();
                            empObj.ecCity = dataIn[11].ToString();
                            empObj.ecState = dataIn[12].ToString();
                            empObj.ecZip = dataIn[13].ToString();
                            empObj.ecCountry = dataIn[14].ToString();                            
                            empArray.Add(empObj);
                        }


                        string dataToSend = createJSONContact(empArray);
                        
                        foreach (string[] emailIn in emails)
                        {
                            sendData(dataToSend, emailIn[0].ToString());
                            //EmailRecip emailObj = new EmailRecip();
                            //emailObj.emailAddrRecip = emailIn[0].ToString();
                            //emailArray.Add(emailObj);
                        }

                        ////loop through each email from the file, load them into an arraylist
                        ////NOTE: This step can be combined
                        //foreach (string[] emailIn in emails)
                        //{
                        //    EmailRecip emailObj = new EmailRecip();
                        //    emailObj.emailAddrRecip = emailIn[0].ToString();
                        //    emailArray.Add(emailObj);
                        //}
                        
                        

                        ////Loop through email array and senddata to each contact in list
                        ////NOTE: This step can be combined with above
                        //if (dataToSend != null)
                        //{
                        //    int emailArrayCount = emailArray.Count;
                        //    for (int i = 0; i < emailArrayCount; i++)
                        //    {
                        //        sendData(dataToSend, txtContactRecip.Text);
                        //    }
                        //}
                    }
                }
                else
                {
                    lstStatus.Items.Add(DateTime.Now + " -- No source file selected");
                }
            }
            catch (Exception ex)
            {
                logError("btnContactECL_Click()", ex.Message);
                lstStatus.Items.Add(DateTime.Now + " -- Exception Occurred, check ECLServerErrorLog.txt");                
            }
        }

        /// <summary>
        /// Calls readFile, loads contents of ECL Emergency file into memory, 
        /// then processes each element of the file.    
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void btnEmerECL_Click(object sender, EventArgs e)
        {
            try
            {
                if (txtEmerSrc.Text.Trim() != string.Empty)
                {
                    List<string[]> data = readFile(txtEmerSrc.Text);
                    List<string[]> emails = readFile(txtEmerRecp.Text);

                    if (data != null && emails != null)
                    {
                        foreach (string[] dataIn in data)
                        {
                            EmergencyCall emerObj = new EmergencyCall();
                            emerObj.ecEmailAddr = dataIn[0].ToString();
                            emerObj.ecBridgeNum = txtBridge.Text;
                            emerObj.ecDetails = txtMtgDesc.Text;
                            emerObj.ecAcceptURL = "http://" + txtServer.Text+ "/ECLServer/ECLServer.ashx?email=" + emerObj.ecEmailAddr + "&response=accept";
                            emerObj.ecDeclineURL = "http://" + txtServer.Text + "/ECLServer/ECLServer.ashx?email=" + emerObj.ecEmailAddr + "&response=decline";

                            //long myDateTime = DateTime.Now.ToUniversalTime().Ticks / TimeSpan.TicksPerMillisecond;
                            DateTime apptTime = new DateTime(Convert.ToInt32(drpListYear.Text), Convert.ToInt32(drpListMonth.Text), Convert.ToInt32(drpListDay.Text), Convert.ToInt32(drpListHour.Text), Convert.ToInt32(drpListMin.Text), 0);
                            long apptTimeInMs = apptTime.ToUniversalTime().Ticks / TimeSpan.TicksPerMillisecond;

                            emerObj.ecCallDateTime = apptTimeInMs.ToString();                                
                            emerArray.Add(emerObj);
                        }


                        //********************************************
                        //loop through each email from the file, load them into an arraylist
                        //NOTE: This step can be combined
                        //foreach (string[] emailIn in emails)
                        //{
                        //    //EmailRecip emailObj = new EmailRecip();
                        //    //emailObj.emailAddrRecip = emailIn[0].ToString();
                        //    //emailArray.Add(emailObj);
                        //}

                        //string dataToSend = createJSONEmerCall(emerArray[i]);

                        for (int i = 0; i < emerArray.Count; i++)
                        {
                            string dataToSend = createJSONEmerCall(emerArray[i]);

                            if (dataToSend != null)
                            {
                                foreach (string[] emailIn in emails)
                                {
                                    sendData(dataToSend, emailIn[0].ToString());
                                }    
                            }                            
                        }                        

                        //Loop through email array and senddata to each contact in list
                        //NOTE: This step can be combined with above
                        //if (dataToSend != null)
                        //{
                        //    foreach (string[] emailIn in emails)
                        //    {
                        //        sendData(dataToSend, emailIn[0].ToString());
                        //        //EmailRecip emailObj = new EmailRecip();
                        //        //emailObj.emailAddrRecip = emailIn[0].ToString();
                        //        //emailArray.Add(emailObj);
                        //    }
                            
                        //    //int emailArrayCount = emailArray.Count;
                        //    //for (int i = 0; i < emailArrayCount; i++)
                        //    //{
                             
                        //    //}
                        //}

                        //********************************************


                        //for (int i = 0; i < emerArray.Count; i++)
                        //{
                        //    string dataToSend = createJSONEmerCall(emerArray[i]);

                        //    if (dataToSend != null)
                        //    {
                        //        sendData(dataToSend, txtEmerRecp.Text);
                        //    }
                        //}                        
                    }
                }
                else
                {                    
                    lstStatus.Items.Add(DateTime.Now + " -- No source file selected");
                }
            }
            catch (Exception ex)
            {
                logError("btnEmerECL_Click()", ex.Message);
                lstStatus.Items.Add(DateTime.Now + " -- Exception Occurred, check ECLServerErrorLog.txt");                
            }
        }

        private void logError(string method, string message)
        {
            try
            {
                TextWriter tw = new StreamWriter("C:\\temp\\ECLServerErrorLog.txt", true);
                tw.WriteLine(DateTime.Now + " Exception in " + method + " : " + message);
                tw.Close();
            }
            catch (Exception ex)
            {
                lstStatus.Items.Add(DateTime.Now + " -- Exception: " + ex.Message);
            }
        }

        protected void Page_Load(object sender, EventArgs e)
        {

        }
    } 

    
    //public class PUSHConfirmationHandler : IHttpHandler
    //{
    //    public void ProcessRequest(HttpContext context)
    //    {
    //        string strResponseData = "Complete";
    //        string ValueToSearchFor = " confirmationdata:";
    //        const string quote = "\"";
    //        string OutputText = "";

    //        StreamWriter tw = new StreamWriter("c:\\inetpub\\wwwroot\\Pushconfirmation\\Responses.txt", true);
    //        string DataReceived = context.Request.QueryString["MyMessage"];
    //        string DataToTest = DataReceived.ToLower();
    //        int ConfirmationPos = DataToTest.IndexOf(ValueToSearchFor, 0);
    //        if (ConfirmationPos < 0)
    //        {
    //            OutputText = quote + "Invalid Data Received" + "->" + DataReceived + quote;
    //        }
    //        else
    //        {
    //            OutputText = DataReceived.Substring(ConfirmationPos + ValueToSearchFor.Length);
    //        }
    //        string OutputLine = DateTime.Now + "," + OutputText;
    //        tw.WriteLine(OutputLine);
    //        tw.Close();
    //        context.Response.ContentType = "text/plain";
    //        context.Response.Write(strResponseData);
    //    }

    //    public bool IsReusable
    //    {
    //        get
    //        {
    //            return false;
    //        }
    //    }
    //}
    
}

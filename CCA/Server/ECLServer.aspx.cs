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
                
        //private void sendData(string sendData, string destEmail)
        private void sendData(string sendData)
        {
            string result = null;            
            
            string httpURL = "http://" + "localhost"
                                + ":" + txtMDSPort.Text
                                + "/push?DESTINATION=" + "simulator@pushme.com"
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
                lstStatus.Items.Add(DateTime.Now + " -- Exception: " + ex.Message);                
            }
        }

        /// <summary>
        /// creates the JSON for the "Emergency" ECL
        /// </summary>
        /// <param name="obj">an object containig the data to be converted JSON</param>
        /// <returns>string containg json</returns>
        private string createJSONEmer(object obj)
        {
            try
            {
                //file to test json
                TextWriter tw = new StreamWriter("C:\\temp\\jsonOutputEmer.txt",true);
                
                string jsonBody = string.Empty;

                EmergencyInfo emerObj = (EmergencyInfo)obj;

                jsonBody +=
                    "{" + @"""Emergency""" + ":[" +
                    @"{" + @"""datetime""" + ":" + @"""" + emerObj.ecCallDateTime + @"""" +
                    "," + @"""details""" + ":" + @"""" + emerObj.ecDetails + @"""" +
                    "," + @"""conferencenumber""" + ":" + @"""" + emerObj.ecBridgeNum + @"""" +
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
                lstStatus.Items.Add(DateTime.Now + " -- Exception: " + ex.Message);
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
                    EmployeeInfo empObj = (EmployeeInfo)empArray[i];
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
                lstStatus.Items.Add(DateTime.Now + " -- Exception: " + ex.Message);
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
                lstStatus.Items.Add(DateTime.Now + " -- Exception: " + ex.Message);
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
                    List<string[]> data = readFile(txtContactSrc.Text);
                    if (data != null)
                    {
                        foreach (string[] dataIn in data)
                        {
                            EmployeeInfo empObj = new EmployeeInfo();
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

                        if (dataToSend != null)
                        {
                            sendData(dataToSend);
                        }
                    }
                }
                else
                {
                    lstStatus.Items.Add(DateTime.Now + " -- No source file selected");
                }
            }
            catch (Exception ex)
            {
                lstStatus.Items.Add(DateTime.Now + " -- Exception: " + ex.Message);
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
                    if (data != null)
                    {
                        foreach (string[] dataIn in data)
                        {
                            EmergencyInfo emerObj = new EmergencyInfo();
                            emerObj.ecEmailAddr = dataIn[0].ToString();
                            emerObj.ecBridgeNum = txtBridge.Text;
                            emerObj.ecDetails = txtMtgDesc.Text;
                            emerObj.ecAcceptURL = "http://localhost/ECLServer/ECLServer.ashx?email=" + emerObj.ecEmailAddr + "&response=accept";
                            emerObj.ecDeclineURL = "http://localhost/ECLServer/ECLServer.ashx?email=" + emerObj.ecEmailAddr + "&response=decline";
                            emerObj.ecCallDateTime = drpListMonth.Text + "/" + drpListDay.Text + "/" + drpListYear.Text + " " + drpListHour.Text + ":" + drpListMin.Text + " " + drpListAmPm.Text;                                                        
                            emerArray.Add(emerObj);
                        }

                        for (int i = 0; i < emerArray.Count; i++)
                        {
                            string dataToSend = createJSONEmer(emerArray[i]);

                            if (dataToSend != null)
                            {
                                sendData(dataToSend);
                            }
                        }                        
                    }
                }
                else
                {                    
                    lstStatus.Items.Add(DateTime.Now + " -- No source file selected");
                }
            }
            catch (Exception ex)
            {
                lstStatus.Items.Add(DateTime.Now + " -- Exception: " + ex.Message);
            }
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

<%@ WebHandler Language="C#" Class="Contacts" %>

using System;
using System.Web;

public class Contacts: IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        string filename = context.Server.MapPath("~/contacts.txt");
        System.IO.FileInfo fileInfo = new System.IO.FileInfo(filename);
    
       try
        {
            if (fileInfo.Exists)
            {
               context.Response.WriteFile(filename);
            }
            else
            {
                context.Response.Write("No file found");
            }
        }
        catch (Exception ex)
        {
            context.Response.Write("Exception: " + ex.Message);
        }


}
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}
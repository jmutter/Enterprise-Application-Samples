<%@ WebHandler Language="C#" Class="Documents" %>

using System;
using System.Web;

public class Documents: IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "application/json";
        string filename = context.Server.MapPath("~/docs2.txt");
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
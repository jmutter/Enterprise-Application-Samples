<%@ WebHandler Language="C#" Class="Documents" %>

using System;
using System.Web;
using System.IO;

public class Documents: IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "application/json";
     //   string filename = context.Server.MapPath("~/docs.txt");
     //   System.IO.FileInfo fileInfo = new System.IO.FileInfo(filename);

        string currPath = HttpContext.Current.Server.MapPath("~/");
        string sFileLoc = "";
        string sFolder = "";
        string[] aDirList;
        DirectoryInfo localDir;


        try
        {
            //if (context.Request.IsLocal)
            //{
                localDir = new DirectoryInfo(currPath);
           // }
            //else
            //{

                //localDir = new DirectoryInfo(@"~/docs");
           // }

        //    context.Response.Write(@"local dir: " + localDir);

            FileSystemInfo[] dirs = localDir.GetDirectories("*docs*");
          //  context.Response.Write("Number of directories with a p: " + dirs.Length);

            string json = "[";
            foreach (DirectoryInfo diNext in dirs)
            {
            
                FileInfo[] files = diNext.GetFiles();

                foreach (FileInfo fiNext in files)
                {
                    if (!(fiNext.Name.ToLower().IndexOf("thumbs.db") > -1))
                    {
                        string modFullName = fiNext.FullName;
                        modFullName.Replace("\\", "\\\\");

                        json = json + "\n{\"filename\":\"" + fiNext.Name + "\",\n\"url\":\"" + modFullName.Replace("\\", "\\\\") + "\"},";
                        //context.Response.Write(json);
                    }
                }
            }
         

            if (json.EndsWith(","))
            {
                json = json.Substring(0, json.Length - 1);
                json = json + "]";
                context.Response.Write(json);

            }
            else
            {
                json = json + "]";
                context.Response.Write(json);
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
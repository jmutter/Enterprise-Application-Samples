<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ECLServer.aspx.cs" Inherits="ECLServerASP._Default" %>

<%@ Register assembly="AjaxControlToolkit" namespace="AjaxControlToolkit" tagprefix="asp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>ECL Server</title>
    <style type="text/css">
        .style1
        {
            text-align: center;
        }
        #form1
        {
            text-align: center;
            width: 1038px;
        }
    </style>
</head>
<body bgcolor="#cccccc">
    <form id="form1" runat="server">
    <asp:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
    </asp:ToolkitScriptManager>    
        <font size="7" style="text-align: center"> ECL Server<br />
        Admin Utility </font>        
    <div>
        <br />
        <br />
        <asp:TabContainer ID="TabContainer1" runat="server" Height="400px" 
            Width="420px" BackColor="Gray" ActiveTabIndex="1">
            <asp:TabPanel ID="TabPanel1" runat="server" HeaderText="Contact List">
                <ContentTemplate>                                                                                                                                                                                                 
                    </br>
                    <!-- <b>Select ECL to send</b>
                    </br>
                    <asp:DropDownList ID="drpDwnECLContact" runat="server" Width="100">
                        <asp:ListItem value="" text="Not Implemented" />
                    </asp:DropDownList>-->
                    <b>Recipient File</b>
                    </br>
                    <asp:TextBox ID="txtContactRecip" runat="server"></asp:TextBox>                    
                    </br>
                    </br>                    
                    <b>Source file of ECL (.csv)</b>
                    </br>
                    <asp:TextBox ID="txtContactSrc" runat="server" ReadOnly="False"></asp:TextBox>
                    </br>
                    </br>                    
                    <asp:Button ID="btnContactECL" runat="server" OnClick="btnContactECL_Click" 
                        Text="Send ECL" />                    
                </ContentTemplate>
            </asp:TabPanel>
            
            <asp:TabPanel ID="TabPanel2" runat="server" HeaderText="Emergency Call" BorderColor="Silver">
                <ContentTemplate>
                    </br>
                    <!--<b>Select ECL to send</b>
                    </br>
                    <asp:DropDownList ID="drpDwnECLEmer" runat="server" Width="100">
                        <asp:ListItem value="" text="Not Implemented" />
                    </asp:DropDownList>-->
                    <b>Recipient File</b>
                    </br>
                    <asp:TextBox ID="txtEmerRecp" runat="server"></asp:TextBox>                    
                    </br>
                    </br>                    
                    <b>Source file of ECL (.csv)</b>
                    </br>
                    <asp:TextBox ID="txtEmerSrc" runat="server" ReadOnly="False"></asp:TextBox>
                    </br>
                    </br>
                    <b>Date of Meeting</b>
                    </br>
                    <asp:DropDownList ID="drpListMonth" runat="server">                    
                        <asp:ListItem value="01" text="January" />
                        <asp:ListItem value="02" text="February" />
                        <asp:ListItem value="03" text="March" />
                        <asp:ListItem value="04" text="April" />
                        <asp:ListItem value="05" text="May" />
                        <asp:ListItem value="06" text="June" />
                        <asp:ListItem value="07" text="July" />
                        <asp:ListItem value="08" text="August" />
                        <asp:ListItem value="09" text="September" />
                        <asp:ListItem value="10" text="October" />
                        <asp:ListItem value="11" text="November" />
                        <asp:ListItem value="12" text="December" />
                    </asp:DropDownList>
                    <asp:DropDownList ID="drpListDay" runat="server">                    
                        <asp:ListItem value="01" text="1" />
                        <asp:ListItem value="02" text="2" />
                        <asp:ListItem value="03" text="3" />
                        <asp:ListItem value="04" text="4" />
                        <asp:ListItem value="05" text="5" />
                        <asp:ListItem value="06" text="6" />
                        <asp:ListItem value="07" text="7" />
                        <asp:ListItem value="08" text="8" />
                        <asp:ListItem value="09" text="9" />
                        <asp:ListItem value="10" text="10" />
                        <asp:ListItem value="11" text="11" />
                        <asp:ListItem value="12" text="12" />
                        <asp:ListItem value="13" text="13" />
                        <asp:ListItem value="14" text="14" />
                        <asp:ListItem value="15" text="15" />
                        <asp:ListItem value="16" text="16" />
                        <asp:ListItem value="17" text="17" />
                        <asp:ListItem value="18" text="18" />
                        <asp:ListItem value="19" text="19" />
                        <asp:ListItem value="20" text="20" />
                        <asp:ListItem value="21" text="21" />
                        <asp:ListItem value="22" text="22" />
                        <asp:ListItem value="23" text="23" />
                        <asp:ListItem value="24" text="24" />
                        <asp:ListItem value="25" text="25" />
                        <asp:ListItem value="26" text="26" />
                        <asp:ListItem value="27" text="27" />
                        <asp:ListItem value="28" text="28" />
                        <asp:ListItem value="29" text="29" />
                        <asp:ListItem value="30" text="30" />
                        <asp:ListItem value="31" text="31" />
                    </asp:DropDownList>
                    <asp:DropDownList ID="drpListYear" runat="server">                    
                        <asp:ListItem value="2011" text="2011" />
                        <asp:ListItem value="2012" text="2012" />                        
                    </asp:DropDownList>
                    </br>
                    </br>
                    <b>Time of Meeting</b>
                    </br>
                    <asp:DropDownList ID="drpListHour" runat="server">                    
                        <asp:ListItem value="01" text="01" />
                        <asp:ListItem value="02" text="02" />
                        <asp:ListItem value="03" text="03" />
                        <asp:ListItem value="04" text="04" />
                        <asp:ListItem value="05" text="05" />
                        <asp:ListItem value="06" text="06" />
                        <asp:ListItem value="07" text="07" />
                        <asp:ListItem value="08" text="08" />
                        <asp:ListItem value="09" text="09" />
                        <asp:ListItem value="10" text="10" />
                        <asp:ListItem value="11" text="11" />
                        <asp:ListItem value="12" text="12" />
                    </asp:DropDownList>
                    <asp:DropDownList ID="drpListMin" runat="server">                    
                        <asp:ListItem value="00" text="00" />
                        <asp:ListItem value="15" text="15" />
                        <asp:ListItem value="30" text="30" />
                        <asp:ListItem value="45" text="45" />
                    </asp:DropDownList>
                    <asp:DropDownList ID="drpListAmPm" runat="server">                    
                        <asp:ListItem value="am" text="AM" />
                        <asp:ListItem value="pm" text="PM" />                        
                    </asp:DropDownList>
                    </br>
                    </br>
                    <b>Description of Meeting</b>
                    </br>
                    <asp:TextBox ID="txtMtgDesc" TextMode="MultiLine" runat="server"></asp:TextBox>                    
                    </br>
                    </br>
                    <b>Bridge Number</b>                    
                    </br>                    
                    <asp:TextBox ID="txtBridge" runat="server"></asp:TextBox>
                    </br>
                    </br>
                    <asp:Button ID="btnEmerECL" runat="server" OnClick="btnEmerECL_Click" 
                        Text="Emergency Call" />                    
                </br>
                </ContentTemplate>
            </asp:TabPanel>
            
            <asp:TabPanel ID="TabPanel3" runat="server" HeaderText="Emergency Notification" BorderColor="Silver">
                <ContentTemplate>
                    <asp:Button ID="btnEmerNoti" runat="server" OnClick="btnEmerECL_Click" 
                        Text="Emergency Notification" />
                </ContentTemplate>
            </asp:TabPanel>
            
            <asp:TabPanel ID="TabPanel4" runat="server" HeaderText="ECL Config" BackColor="#CCCCCC">
                <ContentTemplate>
                <br/>
                <br/>
                <br/>
                <b>MDS Listening Port </b>
                    <br/>
                    <asp:TextBox ID="txtMDSPort" runat="server"></asp:TextBox>                    
                    <br/>
                    <br/>
                <b>Hosting Server</b>
                    <br/>
                    <asp:TextBox ID="txtServer" runat="server"></asp:TextBox>                    
                </ContentTemplate>
            </asp:TabPanel>
        </asp:TabContainer>
    </div>
    
    </br>
    </br>
    <b>Logging</b>
    </br>
    <asp:ListBox ID="lstStatus" runat="server" Width="500"></asp:ListBox>
    <asp:SqlDataSource ID="SqlDataSource1" runat="server">
        
    </asp:SqlDataSource>
    </form>
    
</body>
</html>

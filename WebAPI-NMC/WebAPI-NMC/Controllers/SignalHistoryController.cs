using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI_NMC.Models;

namespace WebAPI_NMC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SignalHistoryController : ControllerBase
    {
        [HttpPost("{id1}")]
        public IActionResult GetSignalHistory(string id1)
        {
            NMCServiceReference.NMCLinkPortalSoapClient signalHistory = new NMCServiceReference.NMCLinkPortalSoapClient(NMCServiceReference.NMCLinkPortalSoapClient.EndpointConfiguration.NMCLinkPortalSoap);

            string reqType = "G";
            //string secUser = "afatestapiuser";//temp development
            string secUser = "afacapiuser";//production
            string passWord = "qwert!4rfs";
            string csNo = id1;
            //string csNo = "C780070";
            string start_date = DateTime.Now.AddMonths(-6).ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff"); //go back 6 months
            string end_date = DateTime.Now.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff");
            string xmldata = "<NMCNexusDocument xmlns=\"http://www.nmccentral.com/webservices/nmcmapi\">" +
            "<SignalHistory>" +
            "<SignalHistory_Request>" +
            "    <data_element>SignalHistory</data_element>" +
            "    <start_date>" + start_date + "</start_date>" +
            "    <end_date>" + end_date + "</end_date>" +
            "</SignalHistory_Request>" +
            "</SignalHistory>" +
            "</NMCNexusDocument>";

            var data = signalHistory.ProcessDataAsync(reqType, secUser, passWord, csNo, xmldata);
            var textResult = data.Result;

            XmlDocument xDoc = new XmlDocument();
            xDoc.LoadXml(textResult);

            var callingUrl = Request.Headers["Referer"].ToString();
            var isLocal = Url.IsLocalUrl(callingUrl);
            if (callingUrl == "http://localhost:4200/")
            {
                xDoc.Save("assets/GetSignalHistoryTest.xml");
            }

            XDocument xml = XDocument.Parse(textResult);
            var soapResponse = xml.Descendants().Where(x => x.Name.LocalName == "SignalHistory_Response").Select(x
                => new SignalHistory()
                {
                    sig_acct = (string)x.Element(x.Name.Namespace + "sig_acct"),
                    sig_date = (DateTime)x.Element(x.Name.Namespace + "sig_date"),
                    sig_code = (string)x.Element(x.Name.Namespace + "sig_code"),
                    sig_zone = (string)x.Element(x.Name.Namespace + "sig_zone"),
                    @event = (string)x.Element(x.Name.Namespace + "event"),
                    err_msg = (string)x.Element(x.Name.Namespace + "err_msg")
                }).ToList();

            return Ok(soapResponse);
        }
    }
}

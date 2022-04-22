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
    public class EventCodeController : ControllerBase
    {
        [HttpPost("{id1}")]
        public IActionResult GetEventCode(string id1)
        {
            NMCServiceReference.NMCLinkPortalSoapClient eventCode = new NMCServiceReference.NMCLinkPortalSoapClient(NMCServiceReference.NMCLinkPortalSoapClient.EndpointConfiguration.NMCLinkPortalSoap);

            string reqType = "G";
            string secUser = "afatestapiuser";
            string passWord = "qwert!4rfs";
            string csNo = id1;
            //string csNo = "C780070";
            //string site_no = "C780070";
            //int c = Int16.Parse("C");
            string xmldata = "<NMCNexusDocument xmlns=\"http://www.nmccentral.com/webservices/nmcmapi\">" +
            "<GetEventCode>" +
            "<GetEventCode_Request>" +
            "    <data_element>GetEventCode</data_element>" +
            //"<site_no>"+ site_no + "</site_no>" +
            "</GetEventCode_Request>" +
            "</GetEventCode>" +
            "</NMCNexusDocument>";

            var data = eventCode.ProcessDataAsync(reqType, secUser, passWord, csNo, xmldata);
            var textResult = data.Result;

            XmlDocument xDoc = new XmlDocument();
            xDoc.LoadXml(textResult);
            //xDoc.Save("assets/GetEventCodeTest.xml");

            XDocument xml = XDocument.Parse(textResult);
            var soapResponse = xml.Descendants().Where(x => x.Name.LocalName == "GetEventCode_Response").Select(x => new EventCode()
            {
                event_id = (string)x.Element(x.Name.Namespace + "event_id"),
                descr = (string)x.Element(x.Name.Namespace + "descr"),
                response_code = (string)x.Element(x.Name.Namespace + "response_code"),
                priority = (string)x.Element(x.Name.Namespace + "priority")
            }).ToList();

            return Ok(soapResponse);
        }
    }
}

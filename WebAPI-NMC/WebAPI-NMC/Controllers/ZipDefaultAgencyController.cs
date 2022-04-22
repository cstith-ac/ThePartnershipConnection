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
    public class ZipDefaultAgencyController : ControllerBase
    {
        [HttpPost("{id1}")]
        public IActionResult GetDefaultAgency(string id1)
        {
            NMCServiceReference.NMCLinkPortalSoapClient zipDefaultAgency = new NMCServiceReference.NMCLinkPortalSoapClient(NMCServiceReference.NMCLinkPortalSoapClient.EndpointConfiguration.NMCLinkPortalSoap);

            string reqType = "G";
            string secUser = "afatestapiuser";
            string passWord = "qwert!4rfs";
            string csNo = id1;
            //string csNo = "C780070";
            string site_no = "C780070";
            //int c = Int16.Parse("C");
            string xmldata = "<NMCNexusDocument xmlns=\"http://www.nmccentral.com/webservices/nmcmapi\">" +
            "<GetZipDefaultAgency>" +
            "<GetZipDefaultAgency_Request>" +
            "    <data_element>GetZipDefaultAgency</data_element>" +
            //"<site_no>"+ site_no + "</site_no>" +
            "</GetZipDefaultAgency_Request>" +
            "</GetZipDefaultAgency>" +
            "</NMCNexusDocument>";

            var data = zipDefaultAgency.ProcessDataAsync(reqType, secUser, passWord, csNo, xmldata);
            var textResult = data.Result;

            XmlDocument xDoc = new XmlDocument();
            xDoc.LoadXml(textResult);
            //xDoc.Save("assets/GetZipDefaultAgencyTest.xml");

            XDocument xml = XDocument.Parse(textResult);
            var soapResponse = xml.Descendants().Where(x => x.Name.LocalName == "GetZipDefaultAgency_Response").Select(x => new ZipDefaultAgency()
            {
                
                err_msg = (string)x.Element(x.Name.Namespace + "err_msg")
            }).ToList();

            return Ok(textResult);
        }
    }
}

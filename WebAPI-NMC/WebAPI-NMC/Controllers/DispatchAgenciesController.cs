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
    public class DispatchAgenciesController : ControllerBase
    {
        [HttpPost("{id1}")]
        public IActionResult GetDispatchAgencies(string id1)
        {
            NMCServiceReference.NMCLinkPortalSoapClient dispatchAgencies = new NMCServiceReference.NMCLinkPortalSoapClient(NMCServiceReference.NMCLinkPortalSoapClient.EndpointConfiguration.NMCLinkPortalSoap);

            string reqType = "G";
            //string secUser = "afatestapiuser";//temp development
            string secUser = "afacapiuser";//production
            string passWord = "qwert!4rfs";
            string csNo = id1;
            //string csNo = "C780070";
            string xmldata = "<NMCNexusDocument xmlns=\"http://www.nmccentral.com/webservices/nmcmapi\">" +
            "<GetDispatchAgencies>" +
            "<GetDispatchAgencies_Request>" +
            "    <data_element>GetDispatchAgencies</data_element>" +
            //"    <change_date>2008-01-01T8:00:00.0000000-08:00</change_date>" +
            "</GetDispatchAgencies_Request>" +
            "</GetDispatchAgencies>" +
            "</NMCNexusDocument>";

            var data = dispatchAgencies.ProcessDataAsync(reqType, secUser, passWord, csNo, xmldata);
            var textResult = data.Result;

            XmlDocument xDoc = new XmlDocument();
            xDoc.LoadXml(textResult);
            //xDoc.Save("assets/GetDispatchAgenciesTest.xml");

            XDocument xml = XDocument.Parse(textResult);
            var soapResponse = xml.Descendants().Where(x => x.Name.LocalName == "GetDispatchAgencies_Response").Select(x => new DispatchAgencies()
            {
                agency_no = (int?)x.Element(x.Name.Namespace + "agency_no"),
                agencytype_id = (string)x.Element(x.Name.Namespace + "agency_id"),
                agency_name = (string)x.Element(x.Name.Namespace + "agency_name"),
                agency_addr1 = (string)x.Element(x.Name.Namespace + "agency_addr1"),
                agency_addr2 = (string)x.Element(x.Name.Namespace + "agency_addr2"),
                zip_code = (string)x.Element(x.Name.Namespace + "zip_code"),
                phone1 = (string)x.Element(x.Name.Namespace + "phone1"),
                phone2 = (string)x.Element(x.Name.Namespace + "phone2"),
                change_date = (DateTime?)x.Element(x.Name.Namespace + "change_date"),
                err_msg = (string)x.Element(x.Name.Namespace + "err_msg")
            }).ToList();

            return Ok(soapResponse);
        }
    }
}

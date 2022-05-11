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
    public class AccountAgencyController : ControllerBase
    {
        [HttpPost("{id1}")]
        public IActionResult GetAccountAgency(string id1)
        {
            NMCServiceReference.NMCLinkPortalSoapClient accountAgency = new NMCServiceReference.NMCLinkPortalSoapClient(NMCServiceReference.NMCLinkPortalSoapClient.EndpointConfiguration.NMCLinkPortalSoap);

            string reqType = "G";
            //string secUser = "afatestapiuser";//temp development
            string secUser = "afacapiuser";//production
            string passWord = "qwert!4rfs";
            string csNo = id1;
            //string csNo = "C780070";
            string xmldata = "<NMCNexusDocument xmlns=\"http://www.nmccentral.com/webservices/nmcmapi\">" +
            "<GetAccountAgency>" +
            "<GetAccountAgency_Request>" +
            "    <data_element>GetAccountAgency</data_element>" +
            "</GetAccountAgency_Request>" +
            "</GetAccountAgency>" +
            "</NMCNexusDocument>";

            var data = accountAgency.ProcessDataAsync(reqType, secUser, passWord, csNo, xmldata);
            var textResult = data.Result;

            XmlDocument xDoc = new XmlDocument();
            xDoc.LoadXml(textResult);
            //xDoc.Save("assets/GetAccountAgencyTest.xml");

            XDocument xml = XDocument.Parse(textResult);
            var soapResponse = xml.Descendants().Where(x => x.Name.LocalName == "GetAccountAgency_Response").Select(x => new AccountAgency()
            {
                agency_no = (int)x.Element(x.Name.Namespace + "agency_no"),
                agencytype_id = (string)x.Element(x.Name.Namespace + "agencytype_id"),
                agency_name = (string)x.Element(x.Name.Namespace + "agency_name"),
                phone1 = (string)x.Element(x.Name.Namespace + "phone1"),
                permit_no = (string)x.Element(x.Name.Namespace + "permit_no"),
                permtype_id = (string)x.Element(x.Name.Namespace + "permtype_id"),
                effective_date = (DateTime?)x.Element(x.Name.Namespace + "effective_date"),
                permstat_id = (string)x.Element(x.Name.Namespace + "permstat_id"),
                descr = (string)x.Element(x.Name.Namespace + "descr"),
                expire_date = (DateTime?)x.Element(x.Name.Namespace + "expire_date"),
                err_msg = (string)x.Element(x.Name.Namespace + "err_msg")
            }).ToList();

            return Ok(soapResponse);
        }
    }
}

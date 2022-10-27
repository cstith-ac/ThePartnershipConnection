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
    public class AccountContactsController : ControllerBase
    {
        [HttpPost("{id1}")]
        public IActionResult GetAccountContacts(string id1)
        {
            NMCServiceReference.NMCLinkPortalSoapClient accountContacts = new NMCServiceReference.NMCLinkPortalSoapClient(NMCServiceReference.NMCLinkPortalSoapClient.EndpointConfiguration.NMCLinkPortalSoap);

            string reqType = "G";
            //string secUser = "afatestapiuser";//temp development
            string secUser = "afacapiuser";//production
            string passWord = "qwert!4rfs";
            string csNo = id1;
            //string csNo = "C780070";
            string xmldata = "<NMCNexusDocument xmlns=\"http://www.nmccentral.com/webservices/nmcmapi\">" +
            "<GetAccountContacts>" +
            "<GetAccountContacts_Request>" +
            "    <data_element>GetAccountContacts</data_element>" +
            "</GetAccountContacts_Request>" +
            "</GetAccountContacts>" +
            "</NMCNexusDocument>";

            var data = accountContacts.ProcessDataAsync(reqType, secUser, passWord, csNo, xmldata);
            var textResult = data.Result;

            XmlDocument xDoc = new XmlDocument();
            xDoc.LoadXml(textResult);
            //xDoc.Save("assets/GetAccountContactsTest.xml");

            XDocument xml = XDocument.Parse(textResult);
            var soapResponse = xml.Descendants().Where(x => x.Name.LocalName == "GetAccountContacts_Response").Select(x 
                => new AccountContacts()
            {
                last_name = (string)x.Element(x.Name.Namespace + "last_name"),
                first_name = (string)x.Element(x.Name.Namespace + "first_name"),
                ctactype_id = (string)x.Element(x.Name.Namespace + "ctactype_id"),
                cs_seqno = (int?)x.Element(x.Name.Namespace + "cs_seqno"),
                auth_id = (string)x.Element(x.Name.Namespace + "auth_id"),
                relation_id = (string)x.Element(x.Name.Namespace + "relation_id"),//No errors, value not returned
                pin = (string)x.Element(x.Name.Namespace + "pin"),//No errors, value not returned
                has_key_flag = (string)x.Element(x.Name.Namespace + "has_key_flag"),
                phone1 = (string)x.Element(x.Name.Namespace + "phone1"),
                phonetype1 = (string)x.Element(x.Name.Namespace + "phonetype1"),
                phone1_seqno = (int?)x.Element(x.Name.Namespace + "phone1_seqno"),
                phone2 = (string)x.Element(x.Name.Namespace + "phone2"),//No errors, value not returned
                phonetype2 = (string)x.Element(x.Name.Namespace + "phonetype2"),//No errors, value not returned
                phone2_seqno = (int?)x.Element(x.Name.Namespace + "phone2_seqno"),//500 System.ArgumentNullException thrown
                phone3 = (string)x.Element(x.Name.Namespace + "phone3"),//no errors, value not returned
                phonetype3 = (string)x.Element(x.Name.Namespace + "phonetype3"),//no errors, value not returned
                phone3_seqno = (int?)x.Element(x.Name.Namespace + "phone3_seqno"),//500 System.ArgumentNullException thrown
                phone4 = (string)x.Element(x.Name.Namespace + "phone4"),//no errors, value not returned
                phonetype4 = (string)x.Element(x.Name.Namespace + "phonetype4"),//no errors, value not returned
                phone4_seqno = (int?)x.Element(x.Name.Namespace + "phone4_seqno"),//500 System.ArgumentNullException thrown
                email_address = (string)x.Element(x.Name.Namespace + "email_address"),//no errors, value not returned
                ctaclink_no = (int?)x.Element(x.Name.Namespace + "ctaclink_no"),
                contact_no = (int?)x.Element(x.Name.Namespace + "contact_no"),
                //contltype_no = (string)x.Element(x.Name.Namespace + "contltype_no"),//no errors, value not returned
                user_id = (int?)x.Element(x.Name.Namespace + "user_id"),//500 System.ArgumentNNullException thrown
                err_msg = (string)x.Element(x.Name.Namespace + "err_msg")
                }).ToList();

            return Ok(soapResponse);
        }
    }
}

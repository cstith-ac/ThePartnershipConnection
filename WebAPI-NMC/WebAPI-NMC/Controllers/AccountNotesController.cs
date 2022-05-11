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
    public class AccountNotesController : ControllerBase
    {
        [HttpPost("{id1}")]
        public IActionResult GetAccountNotes(string id1)
        {
            NMCServiceReference.NMCLinkPortalSoapClient accountNotes = new NMCServiceReference.NMCLinkPortalSoapClient(NMCServiceReference.NMCLinkPortalSoapClient.EndpointConfiguration.NMCLinkPortalSoap);

            string reqType = "G";
            //string secUser = "afatestapiuser";//temp development
            string secUser = "afacapiuser";//production
            string passWord = "qwert!4rfs";
            string csNo = id1;
            //string csNo = "C780070";
            string xmldata = "<NMCNexusDocument xmlns=\"http://www.nmccentral.com/webservices/nmcmapi\">" +
            "<GetAccountNotes>" +
            "<GetAccountNotes_Request>" +
            "    <data_element>GetAccountNotes</data_element>" +
            "</GetAccountNotes_Request>" +
            "</GetAccountNotes>" +
            "</NMCNexusDocument>";

            var data = accountNotes.ProcessDataAsync(reqType, secUser, passWord, csNo, xmldata);
            var textResult = data.Result;

            XmlDocument xDoc = new XmlDocument();
            xDoc.LoadXml(textResult);
            //xDoc.Save("assets/GetAccountNotesTest.xml");

            XDocument xml = XDocument.Parse(textResult);
            var soapResponse = xml.Descendants().Where(x => x.Name.LocalName == "GetAccountNotes_Response").Select(x => new AccountNotes()
            {
                site_no = (int?)x.Element(x.Name.Namespace + "site_no"),
                seqno = (int?)x.Element(x.Name.Namespace + "seqno"),
                //start_date = (DateTime?)x.Element(x.Name.Namespace + "start_date"),
                //end_date = (DateTime?)x.Element(x.Name.Namespace + "end_date"),
                text_type = (int?)x.Element(x.Name.Namespace + "text_type"),
                change_user = (int?)x.Element(x.Name.Namespace + "change_user"),
                //change_date = (DateTime?)x.Element(x.Name.Namespace + "change_date"),
                color = (string)x.Element(x.Name.Namespace + "color"),
                err_msg = (string)x.Element(x.Name.Namespace + "err_msg")
            }).ToList();

            return Ok(soapResponse);
        }
    }
}

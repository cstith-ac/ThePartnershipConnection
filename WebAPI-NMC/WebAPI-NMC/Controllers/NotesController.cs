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
    public class NotesController : ControllerBase
    {
        [HttpPost("{id1}")]
        public IActionResult GetNote(string id1)
        {
            NMCServiceReference.NMCLinkPortalSoapClient note = new NMCServiceReference.NMCLinkPortalSoapClient(NMCServiceReference.NMCLinkPortalSoapClient.EndpointConfiguration.NMCLinkPortalSoap);

            string reqType = "G";
            //string secUser = "afatestapiuser";//temp development
            string secUser = "afacapiuser";//production
            string passWord = "qwert!4rfs";
            string csNo = id1;
            //string csNo = "C780070";
            string site_no = "C780070";
            //int c = Int16.Parse("C");
            string xmldata = "<NMCNexusDocument xmlns=\"http://www.nmccentral.com/webservices/nmcmapi\">" +
            "<GetNotes>" +
            "<GetNotes_Request>" +
            "    <data_element>GetSiteNote</data_element>" +
            //"<site_no>"+ site_no + "</site_no>" +
            "</GetNotes_Request>" +
            "</GetNotes>" +
            "</NMCNexusDocument>";

            var data = note.ProcessDataAsync(reqType, secUser, passWord, csNo, xmldata);
            var textResult = data.Result;

            XmlDocument xDoc = new XmlDocument();
            xDoc.LoadXml(textResult);
            //xDoc.Save("assets/GetNotesTest2.xml");

            //XDocument xml = XDocument.Parse(textResult);
            //var soapResponse = xml.Descendants().Where(x => x.Name.LocalName == "GetNotes_Response").Select(x => new Note()
            //{
            //    site_no = (int?)x.Element(x.Name.Namespace + "site_no"),
            //    seqno = (int?)x.Element(x.Name.Namespace + "seqno"),
            //    start_date = (DateTime?)x.Element(x.Name.Namespace + "start_date"),
            //    end_date = (DateTime?)x.Element(x.Name.Namespace + "end_date"),
            //    text_type = (int?)x.Element(x.Name.Namespace + "text_type"),
            //    change_user = (int?)x.Element(x.Name.Namespace + "change_user"),
            //    change_date = (DateTime?)x.Element(x.Name.Namespace + "change_date"),
            //    color = (string)x.Element(x.Name.Namespace + "color"),
            //    err_msg = (string)x.Element(x.Name.Namespace + "err_msg")
            //}).ToList();

            //return Ok(soapResponse);
            return Ok(textResult);
        }
        
    }
}

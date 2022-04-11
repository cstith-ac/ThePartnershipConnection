using System.IO;
using System.Linq;
using System.Net;
using System.Xml;
using System.Xml.Linq;
using Microsoft.AspNetCore.Mvc;
using WebAPI_CMS.Models;

namespace WebAPI_CMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SiteSystemNumbersController : ControllerBase
    {
        public HttpWebRequest CreateSOAPRequest()
        {
            //Make Web Request
            HttpWebRequest Req = (HttpWebRequest)WebRequest.Create(@"https://css.protectionone.com/masinterface_prod_v2.2/site.asmx");
            //SOAPAction
            Req.Headers.Add(@"SOAPAction:http://tempuri.org/GetSiteNumber");
            //Content_type
            Req.ContentType = "text/xml;charset=\"utf-8\"";
            Req.Accept = "text/xml";
            //HTTP method
            Req.Method = "POST";

            return Req;
        }

        [HttpPost("{id1}")]
        public IActionResult GetTest(string id1)
        {
            HttpWebRequest request = CreateSOAPRequest();

            XmlDocument SOAPReqBody = new XmlDocument();

            var Id = "DLRAPI208018INT";
            var KeyCode = "INT208018DLRAPI";
            var Company_id = "CMS";
            //var s_Cs_no = "7714067"; //this value is the alarm account number
            //var servco_no = "221016"; //this value is in the afa-servco-list-010522.xlsx document. As of 03/21/2022, the servco_no is no longer a required param

            //SOAP Body Request
            SOAPReqBody.LoadXml("<?xml version=\"1.0\" encoding=\"utf-8\"?> \n" +
            "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"> \n" +
            "<soap:Body>" +
            "<GetSiteNumber xmlns=\"http://tempuri.org/\"> \n" +
            "  <obj> \n" +
            "    <Id>" + Id + "</Id> \n" +
            "    <KeyCode>" + KeyCode + "</KeyCode> \n" +
            "    <Company_id>" + Company_id + "</Company_id> \n" +
            "    <s_Cs_no>" + id1 + "</s_Cs_no> \n" +
            //"    <servco_no>" + servco_no + "</servco_no> \n" +
            "  </obj> \n" +
            "</GetSiteNumber> \n" +
            "</soap:Body>" +
            "</soap:Envelope>");

            using (Stream stream = request.GetRequestStream())
            {
                SOAPReqBody.Save(stream);
            }

            //Getting response from request
            using (WebResponse Serviceres = request.GetResponse())
            {
                using (StreamReader rd = new StreamReader(Serviceres.GetResponseStream()))
                {
                    //SOAPReqBody.LoadXml("<SiteNumber></SiteNumber>");
                    //reading stream
                    var ServiceResult = rd.ReadToEnd();

                    XmlDocument xDoc = new XmlDocument();
                    xDoc.LoadXml(ServiceResult);
                    //xDoc.Save("assets/SiteSystemNumbersTest.xml");

                    XDocument xml = XDocument.Parse(ServiceResult);
                    var soapResponse = xml.Descendants().Where(x => x.Name.LocalName == "SiteNumber").Select(x => new SiteSystemNumbers()
                    {
                        cs_no = (string)x.Element(x.Name.Namespace + "cs_no"),
                        system_no = (string)x.Element(x.Name.Namespace + "system_no"),
                        site_no = (string)x.Element(x.Name.Namespace + "site_no")
                    }).ToList();

                    return Ok(soapResponse);
                }
            }
        }
    }
}

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
    public class SiteGeneralDispatchController : ControllerBase
    {
        public HttpWebRequest CreateSOAPRequest()
        {
            //Make Web Request
            HttpWebRequest Req = (HttpWebRequest)WebRequest.Create(@"https://css.protectionone.com/masinterface_prod_v2.2/site.asmx");
            //SOAPAction
            Req.Headers.Add(@"SOAPAction:http://tempuri.org/GetGenDispatch");
            //Content_type
            Req.ContentType = "text/xml;charset=\"utf-8\"";
            Req.Accept = "text/xml";
            //HTTP method
            Req.Method = "POST";

            return Req;
        }

        [HttpPost]
        public IActionResult GetGeneralDispatch()
        {
            HttpWebRequest request = CreateSOAPRequest();

            XmlDocument SOAPReqBody = new XmlDocument();

            var Id = "DLRAPI208018INT";
            var Key_Code = "INT208018DLRAPI";
            var Company_Id = "CMS";
            var site_no = "900919881";

            //SOAP Body Request
            SOAPReqBody.LoadXml("<?xml version=\"1.0\" encoding=\"utf-8\"?> \n" +
            "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"> \n" +
            "<soap:Body>" +
            "<GetGenDispatch xmlns=\"http://tempuri.org/\"> \n" +
            "  <obj> \n" +
            "    <Id>" + Id + "</Id> \n" +
            "    <Key_Code>" + Key_Code + "</Key_Code> \n" +
            "    <Company_Id>" + Company_Id + "</Company_Id> \n" +
            "    <site_no>" + site_no + "</site_no> \n" +
            "  </obj> \n" +
            "</GetGenDispatch> \n" +
            "</soap:Body>" +
            "</soap:Envelope>");

            using (Stream stream = request.GetRequestStream())
            {
                SOAPReqBody.Save(stream);
            }
            //Getting response from request
            using (WebResponse ServiceRes = request.GetResponse())
            {
                using (StreamReader rd = new StreamReader(ServiceRes.GetResponseStream()))
                {
                    //reading stream
                    var ServiceResult = rd.ReadToEnd();

                    XmlDocument xDoc = new XmlDocument();
                    xDoc.LoadXml(ServiceResult);
                    //xDoc.Save("assets/SiteGeneralDispatchTest.xml");

                    XDocument xml = XDocument.Parse(ServiceResult);
                    var soapResponse = xml.Descendants().Where(x => x.Name.LocalName == "SiteGeneralDispatchInstructions").Select(x => new SiteGeneralDispatch()
                    {
                        site_no = (string)x.Element(x.Name.Namespace + "site_no"),
                        expire_date = (string)x.Element(x.Name.Namespace + "expire_date"),
                        effective_date = (string)x.Element(x.Name.Namespace + "effective_date"),
                        change_user = (string)x.Element(x.Name.Namespace + "change_user"),
                        change_date = (string)x.Element(x.Name.Namespace + "change_date"),
                        change_type = (string)x.Element(x.Name.Namespace + "change_type"),
                        change_no = (string)x.Element(x.Name.Namespace + "change_no"),
                        disptype_id = (string)x.Element(x.Name.Namespace + "disptype_id"),
                        calllist_no = (string)x.Element(x.Name.Namespace + "calllist_no"),
                        display_code1 = (string)x.Element(x.Name.Namespace + "display_code1"),
                        display_code2 = (string)x.Element(x.Name.Namespace + "display_code2"),
                        display_code3 = (string)x.Element(x.Name.Namespace + "display_code3"),
                        display_code4 = (string)x.Element(x.Name.Namespace + "display_code4"),
                        display_code5 = (string)x.Element(x.Name.Namespace + "display_code5"),
                        display_code6 = (string)x.Element(x.Name.Namespace + "display_code6"),
                        display_code7 = (string)x.Element(x.Name.Namespace + "display_code7"),
                        display_code8 = (string)x.Element(x.Name.Namespace + "display_code8"),
                        display_code9 = (string)x.Element(x.Name.Namespace + "display_code9"),
                        display_code10 = (string)x.Element(x.Name.Namespace + "display_code10"),
                        display_code11 = (string)x.Element(x.Name.Namespace + "display_code11"),
                        display_code12 = (string)x.Element(x.Name.Namespace + "display_code12"),
                        req_type = (string)x.Element(x.Name.Namespace + "req_type"),
                        old_expire_date = (string)x.Element(x.Name.Namespace + "old_expire_date"),
                        sort_date = (string)x.Element(x.Name.Namespace + "sort_date"),
                        instructions = (string)x.Element(x.Name.Namespace + "instructions"),
                        simple_text = (string)x.Element(x.Name.Namespace + "simple_text")
                    }).ToList();

                    return Ok(soapResponse);
                }
            }
        }
    }
}

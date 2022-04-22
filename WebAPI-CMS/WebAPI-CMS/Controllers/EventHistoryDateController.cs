using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI_CMS.Models;

namespace WebAPI_CMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventHistoryDateController : ControllerBase
    {
        public HttpWebRequest CreateSOAPRequest()
        {
            //Make Web Request
            HttpWebRequest Req = (HttpWebRequest)WebRequest.Create(@"https://css.protectionone.com/masinterface_prod_v2.2/interfacemas.asmx");
            //SOAPAction
            Req.Headers.Add(@"SOAPAction:http://tempuri.org/GetEventHistoryDate");
            //Content_type
            Req.ContentType = "text/xml;charset=\"utf-8\"";
            Req.Accept = "text/xml";
            //HTTP method
            Req.Method = "POST";

            return Req;
        }

        [HttpPost("{id1}")]
        public IActionResult GetEventHistoryDate(string id1)
        {
            HttpWebRequest request = CreateSOAPRequest();

            XmlDocument SOAPReqBody = new XmlDocument();

            var Id = "DLRAPI208018INT";
            var KeyCode = "INT208018DLRAPI";
            var company_id = "CMS";
            //var StartDate = "2022-01-06T20:03:10.337Z";
            //var StartDate = "2022-03-28T00:03:10.337Z"; //today
            //var EndDate = "2022-03-28T23:03:10.337Z"; //today
            string StartDate = DateTime.Now.AddMonths(-6).ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff"); //go back 6 months
            string EndDate = DateTime.Now.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff");
            //var site_no = "900919881";
            //var site_no = "300895702"; //this needs to use the site_no from 
            var site_no = id1;

            //SOAP Body Request
            SOAPReqBody.LoadXml("<?xml version=\"1.0\" encoding=\"utf-8\"?> \n" +
            "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"> \n" +
            "<soap:Body>" +
            "<GetEventHistoryDate xmlns=\"http://tempuri.org/\"> \n" +
            "  <EventhistoryDate> \n" +
            "    <Id>" + Id + "</Id> \n" +
            "    <KeyCode>" + KeyCode + "</KeyCode> \n" +
            "    <company_id>" + company_id + "</company_id> \n" +
            "    <StartDate>" + StartDate + "</StartDate> \n" +
            "    <EndDate>" + EndDate + "</EndDate> \n" +
            "    <site_no>" + site_no + "</site_no> \n" +
            "  </EventhistoryDate> \n" +
            "</GetEventHistoryDate> \n" +
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
                    //xDoc.Save("assets/EventHistoryDateTest.xml");

                    XDocument xml = XDocument.Parse(ServiceResult);
                    var soapResponse = xml.Descendants().Where(x => x.Name.LocalName == "EventHistory").Select(x => new EventHistoryDate()
                    {
                        CS_Number = (string)x.Element(x.Name.Namespace + "CS_Number"),
                        Event_Date = (string)x.Element(x.Name.Namespace + "Event_Date"),
                        Seqno = (string)x.Element(x.Name.Namespace + "Seqno"),
                        CS_Event_No = (string)x.Element(x.Name.Namespace + "CS_Event_No"),
                        Event_Id = (string)x.Element(x.Name.Namespace + "Event_Id"),
                        Event_Class = (string)x.Element(x.Name.Namespace + "Event_Class"),
                        Event = (string)x.Element(x.Name.Namespace + "Event"),
                        Event_Rpt = (string)x.Element(x.Name.Namespace + "Event_Rpt"),
                        Zone_Id = (string)x.Element(x.Name.Namespace + "Zone_Id"),
                        User_Id = (string)x.Element(x.Name.Namespace + "User_Id"),
                        UserName = (string)x.Element(x.Name.Namespace + "UserName"),
                        Operator = (string)x.Element(x.Name.Namespace + "Operator"),
                        Additional_Info = (string)x.Element(x.Name.Namespace + "Additional_Info"),
                        Scheduled_Date = (string)x.Element(x.Name.Namespace + "Scheduled_Date"),
                        Comment = (string)x.Element(x.Name.Namespace + "Comment"),
                        Alarm_Incident_No = (string)x.Element(x.Name.Namespace + "Alarm_Incident_No"),
                        Operator_Dispatch_Id = (string)x.Element(x.Name.Namespace + "Operator_Dispatch_Id"),
                        Pascom = (string)x.Element(x.Name.Namespace + "Pascom"),
                        Server_Id = (string)x.Element(x.Name.Namespace + "Server_Id"),
                        Site_name = (string)x.Element(x.Name.Namespace + "Site_name"),
                        Udf1 = (string)x.Element(x.Name.Namespace + "Udf1"),
                        Udf2 = (string)x.Element(x.Name.Namespace + "Udf2"),
                        Udf3 = (string)x.Element(x.Name.Namespace + "Udf3"),
                        Udf4 = (string)x.Element(x.Name.Namespace + "Udf4"),
                        Phone = (string)x.Element(x.Name.Namespace + "Phone"),
                        Zone_Comment = (string)x.Element(x.Name.Namespace + "Zone_Comment")
                    }).ToList();

                    return Ok(soapResponse);

                    //return new ContentResult
                    //{
                    //    Content = ServiceResult,
                    //    ContentType = "application/xml",
                    //    StatusCode = 200
                    //};
                }
            }
        }
    }
}

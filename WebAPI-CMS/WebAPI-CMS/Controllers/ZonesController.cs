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
    public class ZonesController : ControllerBase
    {
        public HttpWebRequest CreateSOAPRequest()
        {
            //Make Web Request
            HttpWebRequest Req = (HttpWebRequest)WebRequest.Create(@"https://css.protectionone.com/masinterface_prod_v2.2/zones.asmx");
            //SOAPAction
            Req.Headers.Add(@"SOAPAction:http://tempuri.org/GetZoneList");
            //Content_type
            Req.ContentType = "text/xml;charset=\"utf-8\"";
            Req.Accept = "text/xml";
            //HTTP method
            Req.Method = "POST";

            return Req;
        }

        [HttpPost("{id1}")]
        public IActionResult GetZoneList(string id1)
        {
            HttpWebRequest request = CreateSOAPRequest();

            XmlDocument SOAPReqBody = new XmlDocument();

            var Id = "DLRAPI208018INT";
            var KeyCode = "INT208018DLRAPI";
            var Company_id = "CMS";
            //var s_system_no = "900919881"; Get this value from SiteSystemNumbers result
            var Zone_type = "A";

            //SOAP Body Request
            SOAPReqBody.LoadXml("<?xml version=\"1.0\" encoding=\"utf-8\"?> \n" +
            "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"> \n" +
            "<soap:Body>" +
            "<GetZoneList xmlns=\"http://tempuri.org/\"> \n" +
            "  <obj> \n" +
            "    <Id>" + Id + "</Id> \n" +
            "    <KeyCode>" + KeyCode + "</KeyCode> \n" +
            "    <Company_id>" + Company_id + "</Company_id> \n" +
            //"    <s_system_no>" + s_system_no + "</s_system_no> \n" +
            "    <s_system_no>" + id1 + "</s_system_no> \n" +
            "    <Zone_type>" + Zone_type + "</Zone_type> \n" +
            "  </obj> \n" +
            "</GetZoneList> \n" +
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
                    //xDoc.Save("assets/ZonesTest.xml");

                    XDocument xml = XDocument.Parse(ServiceResult);
                    var soapResponse = xml.Descendants().Where(x => x.Name.LocalName == "ZoneList").Select(x => new Zones()
                    {
                        system_no = (string)x.Element(x.Name.Namespace + "system_no"),
                        zone_id = (string)x.Element(x.Name.Namespace + "zone_id"),
                        old_zone_id = (string)x.Element(x.Name.Namespace + "old_zone_id"),
                        zonestate_descr = (string)x.Element(x.Name.Namespace + "zonestate_descr"),
                        zonestate_id = (string)x.Element(x.Name.Namespace + "zonestate_id"),
                        old_zonestate_id = (string)x.Element(x.Name.Namespace + "old_zonestate_id"),
                        servtype_id = (string)x.Element(x.Name.Namespace + "servtype_id"),
                        event_descr = (string)x.Element(x.Name.Namespace + "event_descr"),
                        event_id = (string)x.Element(x.Name.Namespace + "event_id"),
                        equiploc_id = (string)x.Element(x.Name.Namespace + "equiploc_id"),
                        comment50s = (string)x.Element(x.Name.Namespace + "comment50s"),
                        restore_reqd_flag2 = (string)x.Element(x.Name.Namespace + "restore_reqd_flag2"),
                        restore_reqd_flag21 = (string)x.Element(x.Name.Namespace + "restore_reqd_flag21"),
                        arm_disarm = (string)x.Element(x.Name.Namespace + "arm_disarm"),
                        alarm_state_flag = (string)x.Element(x.Name.Namespace + "alarm_state_flag"),
                        trouble_state_flag = (string)x.Element(x.Name.Namespace + "trouble_state_flag"),
                        bypass_state_flag = (string)x.Element(x.Name.Namespace + "bypass_state_flag"),
                        trip_count = (string)x.Element(x.Name.Namespace + "trip_count"),
                        equiptype_descr = (string)x.Element(x.Name.Namespace + "equiptype_descr"),
                        equiptype_id = (string)x.Element(x.Name.Namespace + "equiptype_id"),
                        status_change_date = (string)x.Element(x.Name.Namespace + "status_change_date"),
                        alarmgrp_no = (string)x.Element(x.Name.Namespace + "alarmgrp_no"),
                        alarmgrp_descr = (string)x.Element(x.Name.Namespace + "alarmgrp_descr"),
                        sched_no = (string)x.Element(x.Name.Namespace + "sched_no"),
                        req_type = (string)x.Element(x.Name.Namespace + "req_type")
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

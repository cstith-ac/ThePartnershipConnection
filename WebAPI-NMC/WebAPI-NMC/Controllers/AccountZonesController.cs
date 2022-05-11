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
    public class AccountZonesController : ControllerBase
    {
        [HttpPost("{id1}")]
        public IActionResult GetAccountZones(string id1)
        {
            NMCServiceReference.NMCLinkPortalSoapClient accountZones = new NMCServiceReference.NMCLinkPortalSoapClient(NMCServiceReference.NMCLinkPortalSoapClient.EndpointConfiguration.NMCLinkPortalSoap);

            string reqType = "G";
            //string secUser = "afatestapiuser";//temp development
            string secUser = "afacapiuser";//production
            string passWord = "qwert!4rfs";
            string csNo = id1;
            string xmldata = "<NMCNexusDocument xmlns=\"http://www.nmccentral.com/webservices/nmcmapi\">" +
            "<GetAccountZones>" +
            "<GetAccountZones_Request>" +
            "    <data_element>GetAccountZones</data_element>" +
            "</GetAccountZones_Request>" +
            "</GetAccountZones>" +
            "</NMCNexusDocument>";

            var data = accountZones.ProcessDataAsync(reqType, secUser, passWord, csNo, xmldata);
            var textResult = data.Result;

            XmlDocument xDoc = new XmlDocument();
            xDoc.LoadXml(textResult);
            //xDoc.Save("assets/GetAccountZonesTest.xml");

            XDocument xml = XDocument.Parse(textResult);
            var soapResponse = xml.Descendants().Where(x => x.Name.LocalName == "GetAccountZones_Response").Select(x => new AccountZones()
            {
                zone_id = (string)x.Element(x.Name.Namespace + "zone_id"),
                alarmgrp_no = (int?)x.Element(x.Name.Namespace + "alarmgrp_no"),
                equiploc_id = (string)x.Element(x.Name.Namespace + "equiploc_id"),
                restore_reqd_flag = (string)x.Element(x.Name.Namespace + "restore_reqd_flag"),
                arm_disarm = (string)x.Element(x.Name.Namespace + "arm_disarm"),
                alarm_state_flag = (string)x.Element(x.Name.Namespace + "alarm_state_flag"),
                //trouble_state_flag = (DateTime)x.Element(x.Name.Namespace + "trouble_state_flag"),
                bypass_state_flag = (string)x.Element(x.Name.Namespace + "bypass_state_flag"),
                trip_count = (int?)x.Element(x.Name.Namespace + "trip_count"),
                comment = (string)x.Element(x.Name.Namespace + "comment"),
                equiptype_id = (string)x.Element(x.Name.Namespace + "equiptype_id"),
                camera_zone_id = (string)x.Element(x.Name.Namespace + "camera_zone_id"),
                default_flag = (string)x.Element(x.Name.Namespace + "default_flag"),
                disable_flag = (string)x.Element(x.Name.Namespace + "disable_flag"),
                zonestate_id = (string)x.Element(x.Name.Namespace + "zonestate_id"),
                event_id = (string)x.Element(x.Name.Namespace + "event_id"),
                pr_comment = (string)x.Element(x.Name.Namespace + "pr_comment")
            }).ToList();

            return Ok(soapResponse);
        }
    }
}

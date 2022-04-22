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
    public class AccountInfoController : ControllerBase
    {
        [HttpPost("{id1}")]
        public IActionResult GetAccountInfo(string id1)
        {
            NMCServiceReference.NMCLinkPortalSoapClient accountInfo = new NMCServiceReference.NMCLinkPortalSoapClient(NMCServiceReference.NMCLinkPortalSoapClient.EndpointConfiguration.NMCLinkPortalSoap);

            string reqType = "G";
            string secUser = "afatestapiuser";
            string passWord = "qwert!4rfs";
            string csNo = id1;
            //string csNo = "C780070";
            string xmldata = "<NMCNexusDocument xmlns=\"http://www.nmccentral.com/webservices/nmcmapi\">" +
            "<GetAccountInfo>" +
            "<GetAccountInfo_Request>" +
            "    <data_element>GetAccountInfo</data_element>" +
            "</GetAccountInfo_Request>" +
            "</GetAccountInfo>" +
            "</NMCNexusDocument>";

            var data = accountInfo.ProcessDataAsync(reqType, secUser, passWord, csNo, xmldata);
            var textResult = data.Result;

            XmlDocument xDoc = new XmlDocument();
            xDoc.LoadXml(textResult);
            xDoc.Save("assets/GetAccountInfoTest.xml");

            XDocument xml = XDocument.Parse(textResult);
            var soapResponse = xml.Descendants().Where(x => x.Name.LocalName == "GetAccountInfo_Response").Select(x
                => new AccountInfo()
                {
                    site_name = (string)x.Element(x.Name.Namespace + "site_name"),
                    site_addr1 = (string)x.Element(x.Name.Namespace + "site_addr1"),
                    street_no = (string)x.Element(x.Name.Namespace + "street_no"),
                    street_name = (string)x.Element(x.Name.Namespace + "street_name"),
                    sitestat_id = (string)x.Element(x.Name.Namespace + "sitestat_id"),
                    //street_id = (string)x.Element(x.Name.Namespace + "street_id"),
                    county_name = (string)x.Element(x.Name.Namespace + "county_name"),
                    timezone_no = (int?)x.Element(x.Name.Namespace + "timezone_no"),
                    site_addr2 = (string)x.Element(x.Name.Namespace + "site_addr2"),
                    city_name = (string)x.Element(x.Name.Namespace + "city_name"),
                    state_id = (string)x.Element(x.Name.Namespace + "state_id"),
                    zip_code = (string)x.Element(x.Name.Namespace + "zip_code"),
                    country_name = (string)x.Element(x.Name.Namespace + "country_name"),
                    phone1 = (string)x.Element(x.Name.Namespace + "phone1"),
                    ext1 = (string)x.Element(x.Name.Namespace + "ext1"),
                    phone2 = (string)x.Element(x.Name.Namespace + "phone2"),
                    ext2 = (string)x.Element(x.Name.Namespace + "ext2"),
                    cross_street = (string)x.Element(x.Name.Namespace + "cross_street"),
                    codeword1 = (string)x.Element(x.Name.Namespace + "codeword1"),
                    codeword2 = (string)x.Element(x.Name.Namespace + "codeword2"),
                    mapbook_id = (string)x.Element(x.Name.Namespace + "mapbook_id"),
                    map_page = (string)x.Element(x.Name.Namespace + "map_page"),
                    map_coord = (string)x.Element(x.Name.Namespace + "map_coord"),
                    orig_install_date = (DateTime?)x.Element(x.Name.Namespace + "orig_install_date"),
                    cs_no = (string)x.Element(x.Name.Namespace + "cs_no"),
                    //systype_id = (string)x.Element(x.Name.Namespace + "systype_id"),
                    //sitetype_id = (string)x.Element(x.Name.Namespace + "sitetype_id"),
                    panel_phone = (string)x.Element(x.Name.Namespace + "panel_phone"),
                    download_phone = (string)x.Element(x.Name.Namespace + "download_phone"),
                    receiver_phone = (string)x.Element(x.Name.Namespace + "receiver_phone"),
                    backup_phone = (string)x.Element(x.Name.Namespace + "backup_phone"),
                    panel_location = (string)x.Element(x.Name.Namespace + "panel_location"),
                    panel_id = (string)x.Element(x.Name.Namespace + "panel_id"),
                    timezone_descr = (string)x.Element(x.Name.Namespace + "timezone_descr"),
                    mapbook_descr = (string)x.Element(x.Name.Namespace + "mapbook_descr"),
                    opt_2 = (string)x.Element(x.Name.Namespace + "opt_2"),
                    opt_3 = (string)x.Element(x.Name.Namespace + "opt_3"),
                    opt_4 = (string)x.Element(x.Name.Namespace + "opt_4"),
                    opt_5 = (string)x.Element(x.Name.Namespace + "opt_5"),
                    opt_6 = (string)x.Element(x.Name.Namespace + "opt_6"),
                    opt_7 = (string)x.Element(x.Name.Namespace + "opt_7"),
                    permit_no = (string)x.Element(x.Name.Namespace + "permit_no"),
                    ontest_expire_date = (DateTime?)x.Element(x.Name.Namespace + "ontest_expire_date"),
                    last_ani = (string)x.Element(x.Name.Namespace + "last_ani"),
                    last_ani_date = (string)x.Element(x.Name.Namespace + "last_ani_date"),
                    ooscat_id = (string)x.Element(x.Name.Namespace + "ooscat_id"),
                    err_msg = (string)x.Element(x.Name.Namespace + "err_msg")
                }).ToList();

            return Ok(soapResponse);
        }
    }
}

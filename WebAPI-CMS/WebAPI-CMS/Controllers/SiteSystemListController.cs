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
    public class SiteSystemListController : ControllerBase
    {
        public HttpWebRequest CreateSOAPRequest()
        {
            //Make Web Request
            HttpWebRequest Req = (HttpWebRequest)WebRequest.Create(@"https://css.protectionone.com/masinterface_prod_v2.2/site.asmx");
            //SOAPAction
            Req.Headers.Add(@"SOAPAction:http://tempuri.org/GetSiteSystemList");
            //Content_type
            Req.ContentType = "text/xml;charset=\"utf-8\"";
            Req.Accept = "text/xml";
            //HTTP method
            Req.Method = "POST";

            return Req;
        }

        [HttpPost]
        public IActionResult GetSiteSystemList()
        {
            HttpWebRequest request = CreateSOAPRequest();

            XmlDocument SOAPReqBody = new XmlDocument();

            var Id = "DLRAPI208018INT";
            var KeyCode = "INT208018DLRAPI";
            var Company_id = "CMS";
            var SiteStat_id = "A";

            //SOAP Body Request
            SOAPReqBody.LoadXml("<?xml version=\"1.0\" encoding=\"utf-8\"?> \n" +
            "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"> \n" +
            "<soap:Body>" +
            "<GetSiteSystemList xmlns=\"http://tempuri.org/\"> \n" +
            "  <obj> \n" +
            "    <Id>" + Id + "</Id> \n" +
            "    <KeyCode>" + KeyCode + "</KeyCode> \n" +
            "    <Company_id>" + Company_id + "</Company_id> \n" +
            "    <SiteStat_id>" + SiteStat_id + "</SiteStat_id> \n" +
            "  </obj> \n" +
            "</GetSiteSystemList> \n" +
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
                    //xDoc.Save("assets/SiteSystemListTest.xml");

                    XDocument xml = XDocument.Parse(ServiceResult);
                    var soapResponse = xml.Descendants().Where(x => x.Name.LocalName == "SiteDetail").Select(x => new SiteSystemList()
                    {
                        //ID = (int)x.Element(x.Name.Namespace + "ID"),
                        //LoadDate = (DateTime)x.Element(x.Name.Namespace + "LoadDate"),
                        site_no = (string)x.Element(x.Name.Namespace + "site_no"),
                        system_no = (string)x.Element(x.Name.Namespace + "system_no"),
                        site_name = (string)x.Element(x.Name.Namespace + "site_name"),
                        site_addr1 = (string)x.Element(x.Name.Namespace + "site_addr1"),
                        street_no = (string)x.Element(x.Name.Namespace + "street_no"),
                        street_name = (string)x.Element(x.Name.Namespace + "street_name"),
                        sort_key = (string)x.Element(x.Name.Namespace + "sort_key"),
                        co_no = (string)x.Element(x.Name.Namespace + "co_no"),
                        branch_no = (string)x.Element(x.Name.Namespace + "branch_no"),
                        sitetype_id = (string)x.Element(x.Name.Namespace + "sitetype_id"),
                        sitestat_id = (string)x.Element(x.Name.Namespace + "sitestat_id"),
                        country_name = (string)x.Element(x.Name.Namespace + "country_name"),
                        timezone_no = (string)x.Element(x.Name.Namespace + "timezone_no"),
                        geocode_id = (string)x.Element(x.Name.Namespace + "geocode_id"),
                        taxauth_no = (string)x.Element(x.Name.Namespace + "taxauth_no"),
                        geo_ovr_flag = (string)x.Element(x.Name.Namespace + "geo_ovr_flag"),
                        local_flag = (string)x.Element(x.Name.Namespace + "local_flag"),
                        ext_warr_flag = (string)x.Element(x.Name.Namespace + "ext_warr_flag"),
                        owner_occupy_flag = (string)x.Element(x.Name.Namespace + "owner_occupy_flag"),
                        change_date = (string)x.Element(x.Name.Namespace + "change_date"),
                        change_user = (string)x.Element(x.Name.Namespace + "change_user"),
                        change_no = (string)x.Element(x.Name.Namespace + "change_no"),
                        site_addr2 = (string)x.Element(x.Name.Namespace + "site_addr2"),
                        city_name = (string)x.Element(x.Name.Namespace + "city_name"),
                        state_id = (string)x.Element(x.Name.Namespace + "state_id"),
                        zip_code = (string)x.Element(x.Name.Namespace + "zip_code"),
                        county_name = (string)x.Element(x.Name.Namespace + "county_name"),
                        phone1 = (string)x.Element(x.Name.Namespace + "phone1"),
                        ext1 = (string)x.Element(x.Name.Namespace + "ext1"),
                        phone2 = (string)x.Element(x.Name.Namespace + "phone2"),
                        ext2 = (string)x.Element(x.Name.Namespace + "ext2"),
                        cross_street = (string)x.Element(x.Name.Namespace + "cross_street"),
                        servarea_id = (string)x.Element(x.Name.Namespace + "servarea_id"),
                        dst_no = (string)x.Element(x.Name.Namespace + "dst_no"),
                        grdpart_no = (string)x.Element(x.Name.Namespace + "grdpart_no"),
                        servpart_no = (string)x.Element(x.Name.Namespace + "servpart_no"),
                        cspart_no = (string)x.Element(x.Name.Namespace + "cspart_no"),
                        sitebstat_id = (string)x.Element(x.Name.Namespace + "sitebstat_id"),
                        aq_no = (string)x.Element(x.Name.Namespace + "aq_no"),
                        mktsrc_id = (string)x.Element(x.Name.Namespace + "mktsrc_id"),
                        ulcode_id = (string)x.Element(x.Name.Namespace + "ulcode_id"),
                        compet_id = (string)x.Element(x.Name.Namespace + "compet_id"),
                        sales_emp_no = (string)x.Element(x.Name.Namespace + "sales_emp_no"),
                        codeword1 = (string)x.Element(x.Name.Namespace + "codeword1"),
                        mapbook_id = (string)x.Element(x.Name.Namespace + "mapbook_id"),
                        map_page = (string)x.Element(x.Name.Namespace + "map_page"),
                        map_coord = (string)x.Element(x.Name.Namespace + "map_coord"),
                        orig_install_date = (string)x.Element(x.Name.Namespace + "orig_install_date"),
                        lead_no = (string)x.Element(x.Name.Namespace + "lead_no"),
                        subdivision = (string)x.Element(x.Name.Namespace + "subdivision"),
                        owner_no = (string)x.Element(x.Name.Namespace + "owner_no"),
                        udf1 = (string)x.Element(x.Name.Namespace + "udf1"),
                        udf2 = (string)x.Element(x.Name.Namespace + "udf2"),
                        udf3 = (string)x.Element(x.Name.Namespace + "udf3"),
                        udf4 = (string)x.Element(x.Name.Namespace + "udf4"),
                        terr_id = (string)x.Element(x.Name.Namespace + "terr_id"),
                        sic_id = (string)x.Element(x.Name.Namespace + "sic_id"),
                        occ_id = (string)x.Element(x.Name.Namespace + "occ_id"),
                        phone1_rev = (string)x.Element(x.Name.Namespace + "phone1_rev"),
                        phone2_rev = (string)x.Element(x.Name.Namespace + "phone2_rev"),
                        prospect_no = (string)x.Element(x.Name.Namespace + "prospect_no"),
                        corpacct_id = (string)x.Element(x.Name.Namespace + "corpacct_id"),
                        siteloc_id = (string)x.Element(x.Name.Namespace + "siteloc_id"),
                        install_servco_no = (string)x.Element(x.Name.Namespace + "install_servco_no"),
                        servco_no = (string)x.Element(x.Name.Namespace + "servco_no"),
                        corpacct_servco_no = (string)x.Element(x.Name.Namespace + "corpacct_servco_no"),
                        key_no = (string)x.Element(x.Name.Namespace + "key_no"),
                        service_comment = (string)x.Element(x.Name.Namespace + "service_comment"),
                        attention = (string)x.Element(x.Name.Namespace + "attention"),
                        recur_costctr_id = (string)x.Element(x.Name.Namespace + "recur_costctr_id"),
                        install_costctr_id = (string)x.Element(x.Name.Namespace + "install_costctr_id"),
                        service_costctr_id = (string)x.Element(x.Name.Namespace + "service_costctr_id"),
                        other_costctr_id = (string)x.Element(x.Name.Namespace + "other_costctr_id"),
                        in_city_flag = (string)x.Element(x.Name.Namespace + "in_city_flag"),
                        route_id = (string)x.Element(x.Name.Namespace + "route_id"),
                        position = (string)x.Element(x.Name.Namespace + "position"),
                        patrol_servarea_id = (string)x.Element(x.Name.Namespace + "patrol_servarea_id"),
                        patrol_servplan_id = (string)x.Element(x.Name.Namespace + "patrol_servplan_id"),
                        zipdef_no = (string)x.Element(x.Name.Namespace + "zipdef_no"),
                        service_emp_no = (string)x.Element(x.Name.Namespace + "service_emp_no"),
                        longitude = (string)x.Element(x.Name.Namespace + "longitude"),
                        latitude = (string)x.Element(x.Name.Namespace + "latitude"),
                        telco_lease_line = (string)x.Element(x.Name.Namespace + "telco_lease_line"),
                        cf_acdType = (string)x.Element(x.Name.Namespace + "cf_acdType"),
                        cs_no = (string)x.Element(x.Name.Namespace + "cs_no"),
                        ooscat_id = (string)x.Element(x.Name.Namespace + "ooscat_id"),
                        oos_start_date = (string)x.Element(x.Name.Namespace + "oos_start_date"),
                        systype_id = (string)x.Element(x.Name.Namespace + "systype_id"),
                        descr = (string)x.Element(x.Name.Namespace + "descr")
                    }).ToList();

                    return Ok(soapResponse);
                }
            }
        }
    }
}

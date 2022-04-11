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
    public class ContactListController : ControllerBase
    {
        public HttpWebRequest CreateSOAPRequest()
        {
            //Make Web Request
            HttpWebRequest Req = (HttpWebRequest)WebRequest.Create(@"https://css.protectionone.com/masinterface_prod_v2.2/contacts.asmx");
            //SOAPAction
            Req.Headers.Add(@"SOAPAction:http://tempuri.org/GetContactList");
            //Content_type
            Req.ContentType = "text/xml;charset=\"utf-8\"";
            Req.Accept = "text/xml";
            //HTTP method
            Req.Method = "POST";

            return Req;
        }

        [HttpPost("{id1}")]
        public IActionResult GetContactList(string id1)
        {
            HttpWebRequest request = CreateSOAPRequest();

            XmlDocument SOAPReqBody = new XmlDocument();

            var Id = "DLRAPI208018INT";
            var KeyCode = "INT208018DLRAPI";
            var Company_id = "CMS";
            //var site_no = "900919881"; Get this value from SiteSystemNumbers result

            //SOAP Body Request
            SOAPReqBody.LoadXml("<?xml version=\"1.0\" encoding=\"utf-8\"?> \n" +
            "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"> \n" +
            "<soap:Body>" +
            "<GetContactList xmlns=\"http://tempuri.org/\"> \n" +
            "  <obj> \n" +
            "    <Id>" + Id + "</Id> \n" +
            "    <KeyCode>" + KeyCode + "</KeyCode> \n" +
            "    <Company_id>" + Company_id + "</Company_id> \n" +
            //"    <site_no>" + site_no + "</site_no> \n" +
            "    <site_no>" + id1 + "</site_no> \n" +
            "  </obj> \n" +
            "</GetContactList> \n" +
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
                    //xDoc.Save("assets/ContactListTest.xml");

                    XDocument xml = XDocument.Parse(ServiceResult);
                    var soapResponse = xml.Descendants().Where(x => x.Name.LocalName == "ContactList").Select(x => new ContactList()
                    {
                        ctaclink_no = (string)x.Element(x.Name.Namespace + "ctaclink_no"),
                        contact_no = (string)x.Element(x.Name.Namespace + "contact_no"),
                        has_key_flag = (string)x.Element(x.Name.Namespace + "has_key_flag"),
                        contract_signer_flag = (string)x.Element(x.Name.Namespace + "contract_signer_flag"),
                        cust_no = (string)x.Element(x.Name.Namespace + "cust_no"),
                        site_no = (string)x.Element(x.Name.Namespace + "site_no"),
                        prospect_no = (string)x.Element(x.Name.Namespace + "prospect_no"),
                        ctactype_id = (string)x.Element(x.Name.Namespace + "ctactype_id"),
                        name = (string)x.Element(x.Name.Namespace + "name"),
                        cs_seqno = (string)x.Element(x.Name.Namespace + "cs_seqno"),
                        auth_id = (string)x.Element(x.Name.Namespace + "auth_id"),
                        relation_id = (string)x.Element(x.Name.Namespace + "relation_id"),
                        pin = (string)x.Element(x.Name.Namespace + "pin"),
                        contact_type_desc = (string)x.Element(x.Name.Namespace + "contact_type_desc"),
                        title = (string)x.Element(x.Name.Namespace + "title"),
                        phone_type_list = (string)x.Element(x.Name.Namespace + "phone_type_list"),
                        dispatch_instruct = (string)x.Element(x.Name.Namespace + "dispatch_instruct"),
                        servco_no = (string)x.Element(x.Name.Namespace + "servco_no"),
                        prefix = (string)x.Element(x.Name.Namespace + "prefix"),
                        suffix = (string)x.Element(x.Name.Namespace + "suffix"),
                        middle_initial = (string)x.Element(x.Name.Namespace + "middle_initial"),
                        user_id = (string)x.Element(x.Name.Namespace + "user_id"),
                        system_no = (string)x.Element(x.Name.Namespace + "system_no"),
                        start_date = (string)x.Element(x.Name.Namespace + "start_date"),
                        end_date = (string)x.Element(x.Name.Namespace + "end_date"),
                        req_type = (string)x.Element(x.Name.Namespace + "req_type"),
                        phn1 = (string)x.Element(x.Name.Namespace + "phn1"),
                        ext1 = (string)x.Element(x.Name.Namespace + "ext1"),
                        seqno1 = (string)x.Element(x.Name.Namespace + "seqno1"),
                        phn2 = (string)x.Element(x.Name.Namespace + "phn2"),
                        ext2 = (string)x.Element(x.Name.Namespace + "ext2"),
                        seqno2 = (string)x.Element(x.Name.Namespace + "seqno2"),
                        phn3 = (string)x.Element(x.Name.Namespace + "phn3"),
                        ext3 = (string)x.Element(x.Name.Namespace + "ext3"),
                        seqno3 = (string)x.Element(x.Name.Namespace + "seqno3"),
                        phn4 = (string)x.Element(x.Name.Namespace + "phn4"),
                        ext4 = (string)x.Element(x.Name.Namespace + "ext4"),
                        seqno4 = (string)x.Element(x.Name.Namespace + "seqno4"),
                        email_address = (string)x.Element(x.Name.Namespace + "email_address"),
                        change_user = (string)x.Element(x.Name.Namespace + "change_user"),
                        change_date = (string)x.Element(x.Name.Namespace + "change_date"),
                        cs_no = (string)x.Element(x.Name.Namespace + "cs_no")
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

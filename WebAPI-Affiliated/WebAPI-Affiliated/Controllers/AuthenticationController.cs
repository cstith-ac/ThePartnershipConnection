using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RestSharp;
using WebAPI_Affiliated.Models;

namespace WebAPI_Affiliated.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        [HttpPost]
        public IActionResult GetToken([FromForm] Login login)
        {
            var url = "https://sb.alertmessage.com/token";
            var apiGrant_type = "password";
            var apiUsername = "AlarmConnectionsAPI";
            var apiPassword = "qWW%!t#WQxo7";
            var apiClient_id = "affiliated-report";

            var client = new RestClient(url);
            var request = new RestRequest(Method.POST);

            request.AddParameter("grant_type", apiGrant_type);
            request.AddParameter("username", apiUsername);
            request.AddParameter("password", apiPassword);
            request.AddParameter("client_id", apiClient_id);

            IRestResponse response = client.Execute(request);

            //return Ok(response.Content);
            return Ok(JsonConvert.DeserializeObject<Authentication>(response.Content));

            //var url = "https://sb.alertmessage.com/token";

            //var client = new RestClient(url);

            //var request = new RestRequest();

            //var body = new Login { grant_type = "password", username = "AlarmConnectionsAPI", password = "qWW%!t#WQxo7", client_id = "affiliated-report" };

            //request.AddHeader("Content-Type","multipart/form-data");

            //request.AddJsonBody(body);

            //var response = client.Post(request);

            //return Ok(response.StatusCode);

            //var httpRequest  = (HttpWebRequest)WebRequest.Create(url);
            //httpRequest.Method = "POST";

            //httpRequest.ContentType = "multipart/form-data";
            ////Req.ContentType = "application/x-www-form-urlencoded";

            //var user = new Login()
            //{
            //    grant_type = "password",
            //    username = "AlarmConnectionsAPI",
            //    password = "qWW%!t#WQxo7",
            //    client_id = "affiliated-report"
            //};

            //using (var streamWriter = new StreamWriter(httpRequest.GetRequestStream()))
            //{
            //    streamWriter.Write(user);
            //}
            //var httpResponse = (HttpWebResponse)httpRequest.GetResponse();
            //using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            //{
            //    var result = streamReader.ReadToEnd();
            //}

            //return Ok(new Authentication());
        }
    }
}

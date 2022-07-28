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

            var result = JsonConvert.DeserializeObject<Authentication>(response.Content);

            Authentication authentication = new Authentication
            {
                access_token = result.access_token,
                expires_in = result.expires_in,
                token_type = result.token_type,
                scope = result.scope,
                refresh_token = result.refresh_token
            };

            Global.access_token = result.access_token;
            //var access_token = result.access_token;

            var expires_in = result.expires_in;

            var token_type = result.token_type;

            var scope = result.scope;

            var refresh_token = result.refresh_token;

            return Ok(JsonConvert.DeserializeObject<Authentication>(response.Content));
        }
    }
}

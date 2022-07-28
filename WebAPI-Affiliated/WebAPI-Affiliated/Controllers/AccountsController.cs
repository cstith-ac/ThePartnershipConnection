using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RestSharp;
using WebAPI_Affiliated.Models;

namespace WebAPI_Affiliated.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult> GetAccounts()
        {
            var url = "https://sb.alertmessage.com/";

           // var access_token = "732013ad8a3c83d89e8fa64fa39cbe2accd05ad9";

            var client = new RestClient(url);

            var request = new RestRequest("acct", Method.GET);

            //Authentication access_token = new Authentication();

            request.AddHeader("Authorization", "Bearer " + Global.access_token);

            request.AddHeader("Content-Type", "application/json");

            request.AddHeader("Accept", "application/json");

            var response = await client.ExecuteAsync<Accounts>(request);

            var eventResponse = JsonConvert.DeserializeObject<EventResponse>(response.Content);

            return Ok(eventResponse);
        }
    }
}

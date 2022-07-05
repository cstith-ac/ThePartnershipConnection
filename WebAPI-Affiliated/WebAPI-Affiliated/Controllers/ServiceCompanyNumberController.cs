using System;
using System.Collections.Generic;
using System.Linq;
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
    public class ServiceCompanyNumberController : ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<ActionResult> GetServiceCompanyNumber(string id)
        {
            var url = "https://sb.alertmessage.com/";

            var access_token = "9351c72ce0d54461cc1c5b41e4ee6b671fc57ff7";

            var client = new RestClient(url);

            var request = new RestRequest("acct/" + id + "/servco");

            request.AddHeader("Authorization", "Bearer " + access_token);

            request.AddHeader("Content-Type", "application/json");

            request.AddHeader("Accept", "application/json");

            var response = await client.ExecuteAsync<ServiceCompanyNumber>(request);

            var eventResponse = JsonConvert.DeserializeObject<ServiceCompanyNumber>(response.Content);

            return Ok(eventResponse);
        }
    }
}

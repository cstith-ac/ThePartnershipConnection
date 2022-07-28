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
    public class EventsController : ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<ActionResult> GetRecentHistory(string id)
        {
            var url = "https://sb.alertmessage.com/";

            //var access_token = "c807dbfcef99ab6ff486eecb2ffd7a07d864cfd6";

            var client = new RestClient(url);

            var request = new RestRequest("report/recent/" + id, Method.GET);

            //request.AddHeader("Authorization", "Bearer " + access_token);
            request.AddHeader("Authorization", "Bearer " + Global.access_token);

            request.AddHeader("Content-Type", "application/json");

            request.AddHeader("Accept", "application/json");

            var response = await client.ExecuteAsync<Events>(request);

            var eventResponse = JsonConvert.DeserializeObject<EventResponse3>(response.Content);

            return Ok(eventResponse);
        }
    }
}

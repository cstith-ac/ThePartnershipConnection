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
    public class SignalTypesController : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult> GetSignalTypes()
        {
            var url = "https://sb.alertmessage.com/";

            var access_token = "0b1f099c94a6dd285735ac97c9d841a54cedb916";

            var client = new RestClient(url);

            var request = new RestRequest("report/signal_types", Method.GET);

            request.AddHeader("Authorization", "Bearer " + access_token);

            request.AddHeader("Content-Type", "application/json");

            request.AddHeader("Accept", "application/json");

            var response = await client.ExecuteAsync<SignalTypes>(request);

            var eventResponse = JsonConvert.DeserializeObject<EventResponse4>(response.Content);

            return Ok(eventResponse);
        }

    }
}

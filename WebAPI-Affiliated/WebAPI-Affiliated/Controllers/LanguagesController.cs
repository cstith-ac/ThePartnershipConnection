using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
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
    public class LanguagesController : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult> GetLanguages()
        {
            //try
            //{
            //    var url = "https://sb.alertmessage.com/";

            //    var access_token = "5463c6495cf070b2171253c71db8da16460df76a";

            //    var client = new RestClient(url);

            //    var request = new RestRequest("acct/languages");

            //    request.AddHeader("Authorization", "Bearer " + access_token);

            //    request.AddHeader("Content-Type", "application/json");

            //    request.AddHeader("Accept", "application/json");

            //    var response = await client.ExecuteAsync<Languages>(request);

            //    //if (response.StatusCode)
            //    //{

            //    //}

            //    var eventResponse = JsonConvert.DeserializeObject<EventResponse6>(response.Content);

            //    return Ok(eventResponse);
            //}
            //catch (Exception e)
            //{
            //    throw;
            //}
            var url = "https://sb.alertmessage.com/";

            var access_token = "9351c72ce0d54461cc1c5b41e4ee6b671fc57ff7";

            var client = new RestClient(url);

            var request = new RestRequest("acct/languages");

            request.AddHeader("Authorization", "Bearer " + access_token);

            request.AddHeader("Content-Type", "application/json");

            request.AddHeader("Accept", "application/json");

            var response = await client.ExecuteAsync<Languages>(request);

            var eventResponse = JsonConvert.DeserializeObject<EventResponse6>(response.Content);

            return Ok(eventResponse);
        }
    }
}

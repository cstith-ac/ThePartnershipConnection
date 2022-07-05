using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text.Json;
using RestSharp;
using WebAPI_Affiliated.Models;

namespace WebAPI_Affiliated.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<ActionResult> GetAccountById(string id, string json)
        {
            var url = "https://sb.alertmessage.com/acct/" + id;

            var access_token = "0b1f099c94a6dd285735ac97c9d841a54cedb916";

            var client = new RestClient(url);

            var request = new RestRequest("acct/"+ id, Method.GET);

            request.AddHeader("Authorization", "Bearer " + access_token);

            request.AddHeader("Content-Type", "application/json");

            request.AddHeader("Accept", "application/json");

            var response = await client.ExecuteAsync<Account>(request);

            var eventResponse = JsonConvert.DeserializeObject<EventResponse2>(response.Content);
            //var eventResponse = System.Text.Json.JsonSerializer.Deserialize<Account>(response.Content, new JsonSerializerOptions() { PropertyNameCaseInsensitive = true});

            return Ok(eventResponse);
        }

        //public Account DeserializeUsingGenericSystemTextJson(string json)
        //{
        //    var account = System.Text.Json.JsonSerializer.Deserialize<Account>(json, new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
        //    return account;
        //}
    }
}

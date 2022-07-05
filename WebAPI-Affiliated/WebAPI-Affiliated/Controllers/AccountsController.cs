using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
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
    public class AccountsController : ControllerBase
    {
        //private readonly RestClient _client;

        //public AccountsController()
        //{
        //    _client = new RestClient("https://sb.alertmessage.com/acct");
        //}

        [HttpGet]
        public async Task<ActionResult> GetAccounts()
        {
            var url = "https://sb.alertmessage.com/";

            var access_token = "0b1f099c94a6dd285735ac97c9d841a54cedb916";

            var client = new RestClient(url);

            //var request = new RestRequest("acct", Method.GET, DataFormat.Json);
            var request = new RestRequest("acct", Method.GET);

            request.AddHeader("Authorization", "Bearer " + access_token);

            request.AddHeader("Content-Type", "application/json");

            request.AddHeader("Accept", "application/json");

            //IRestResponse response = client.Execute(request);

            var response = await client.ExecuteAsync<Accounts>(request);

            var eventResponse = JsonConvert.DeserializeObject<EventResponse>(response.Content);

            //var response = client.Get(request);

            //return Ok(response);
            return Ok(eventResponse);
            //return Ok(JsonConvert.DeserializeObject<Accounts>(response.Content));
        }

        //[HttpGet]
        //public async Task<IActionResult> GetUserList()
        //{
        //    var request = new RestRequest("acct");
        //    var response = await _client.ExecuteGetAsync(request);
        //    if (!response.IsSuccessful)
        //    {
        //        //Logic for handling unsuccessful response
        //    }
        //    var userList = System.Text.Json.JsonSerializer.Deserialize<Accounts>(response.Content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        //    return Ok(userList);
        //}
    }
}

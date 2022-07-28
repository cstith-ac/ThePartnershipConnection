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
    public class ContactListsController : ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<ActionResult> GetContactLists(string id)
        {
            var url = "https://sb.alertmessage.com/";

            //var access_token = "0c0c292a91a98bf2a0982e97f4fc6a52fdeed967";

            var client = new RestClient(url);

            var request = new RestRequest("acct/" + id + "/contacts/lists");

            //request.AddHeader("Authorization", "Bearer " + access_token);
            request.AddHeader("Authorization", "Bearer " + Global.access_token);

            request.AddHeader("Content-Type", "application/json");

            request.AddHeader("Accept", "application/json");

            var response = await client.ExecuteAsync<ContactLists>(request);

            var eventResponse = JsonConvert.DeserializeObject<EventResponse5>(response.Content);

            return Ok(eventResponse);
        }
    }
}

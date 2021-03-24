using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using WebAPI.Models;


namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListRecurringItemsController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public ListRecurringItemsController(
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager,
            IOptions<ApplicationSettings> appSettings)
        {
            _userManager = userManager;
            connectionString = configuration.GetConnectionString("TPC_DevDatabase");
            _appSettings = appSettings.Value;
        }

        [HttpGet]
        [Authorize]
        public async Task<Object> GetListRecurringItems()
        {
            var systems = new List<ListRecurringItems>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                var customerSystemId = new SqlParameter("@CustomerSystemID", 1);
                var result = await db.GetListRecurringItems.FromSqlRaw("EXECUTE [dbo].[ListRecurringItems] @CustomerSystemID", customerSystemId).ToListAsync();
                List<ListRecurringItems> Lst = result.Select(s => new ListRecurringItems
                {
                    ItemCode = s.ItemCode,
                    ItemName = s.ItemName,
                    ExistsOnSystem = s.ExistsOnSystem
                }).ToList();

                return Lst;
            }
        }

        //[HttpGet("{id}")]
        //[Authorize]
        //public ListRecurringItems GetListRecurringItems(int id)
        //{
        //    return db.GetListRecurringItems.FromSqlRaw("EXEC dbo.ListRecurringItems @CustomerSystemID={0}", id).ToListAsync().Result.FirstOrDefault();
        //}
    }
}

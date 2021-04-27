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
    public class ListMaterialItemsController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public ListMaterialItemsController(
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
        public async Task<Object> GetListMaterialItems()
        {
            var list = new List<ListMaterialItems>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var result = await db.GetListMaterialItems.FromSqlRaw("EXECUTE [dbo].[ListMaterialItems]").ToListAsync();
                List<ListMaterialItems> Lst = result.Select(s => new ListMaterialItems
                {
                    item_id = s.item_id,
                    ItemCode = s.ItemCode,
                    ItemName = s.ItemName,
                    DefaultCost = s.DefaultCost
                }).ToList();

                return Lst;
            }
        }
    }
}

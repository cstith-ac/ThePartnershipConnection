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
    public class ListPartnerContactsController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public ListPartnerContactsController(
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
        public async Task<Object> GetListPartnerContacts()
        {
            var list = new List<ListPartnerContacts>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var result = await db.GetListPartnerContacts.FromSqlRaw("Execute [dbo].[ListPartnerContacts]").ToListAsync();
                List<ListPartnerContacts> Lst = result.Select(s => new ListPartnerContacts
                {
                    PartnerCode = s.PartnerCode,
                    PartnerName = s.PartnerName,
                    SedonaContactEmail = s.SedonaContactEmail,
                    TPCLoginExists = s.TPCLoginExists,
                    RMAssigned = s.RMAssigned,
                    LastLoginOn = s.LastLoginOn
                }).ToList();

                return Lst;
            }
        }
    }
}

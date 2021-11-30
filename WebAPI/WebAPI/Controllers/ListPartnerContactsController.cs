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

        [HttpPost]
        [Authorize]
        public async Task<Object> GetListPartnerContacts(ListPartnerContacts listPartnerContacts)
        {
            var list = new List<ListPartnerContacts>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                var primaryOnlyParam = new SqlParameter("@PrimaryOnly", "Y");
                var rmFilterParam = new SqlParameter("@RMFilter", 1);
                var usStateIDParam = new SqlParameter("@USStateID", 1);

                var result = await db.GetListPartnerContacts.FromSqlRaw("Execute [dbo].[ListPartnerContacts] @PrimaryOnly, @RMFilter, @USStateID", primaryOnlyParam, rmFilterParam, usStateIDParam).ToListAsync();
                List<ListPartnerContacts> Lst = result.Select(s => new ListPartnerContacts
                {
                    PartnerCode = s.PartnerCode,
                    PartnerName = s.PartnerName,
                    SedonaContactEmail = s.SedonaContactEmail,
                    TPCLoginExists = s.TPCLoginExists,
                    RMAssigned = s.RMAssigned,
                    RMID = s.RMID,
                    LastLoginOn = s.LastLoginOn,
                    Role = s.Role,
                    PrimaryContact = s.PrimaryContact,
                    USState = s.USState
                }).ToList();

                return Lst;
            }
        }

        [HttpGet("{id1}/{id2}/{id3}")]
        [Authorize]
        public async Task<Object> GetListPartnerContactsByID(string id1, int id2, int id3)
        {
            return await db.GetListPartnerContacts.FromSqlRaw("EXECUTE [dbo].[ListPartnerContacts] @PrimaryOnly={0}, @RMFilter={1}, @USStateID={2}", id1, id2, id3).ToListAsync();
        }
    }
}

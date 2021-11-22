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
    public class RMListforTPCController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public RMListforTPCController(
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
        public async Task<Object> GetRMListforTPCs()
        {
            var list = new List<RMListforTPC>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                var result = await db.GetRMListforTPCs.FromSqlRaw("exec dbo.RMListforTPC").ToListAsync();

                List<RMListforTPC> Lst = result.Select(s => new RMListforTPC
                {
                    RMAssigned = s.RMAssigned,
                    RMID = s.RMID
                }).ToList();

                return Lst;
            }
        }
    }
}

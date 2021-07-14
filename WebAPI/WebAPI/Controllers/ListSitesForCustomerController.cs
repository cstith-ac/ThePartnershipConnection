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
    public class ListSitesForCustomerController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public ListSitesForCustomerController(
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager,
            IOptions<ApplicationSettings> appSettings)
        {
            _userManager = userManager;
            connectionString = configuration.GetConnectionString("TPC_DevDatabase");
            _appSettings = appSettings.Value;
        }

        //[HttpGet]
        //[Authorize]
        //public ListSitesForCustomer GetAllListSitesForCustomers()
        //{
        //    return db.GetListSitesForCustomers.FromSqlRaw("EXEC dbo.ListSitesForCustomer").ToListAsync().Result.FirstOrDefault();
        //}

        [HttpGet("{id}")]
        [Authorize]
        public async Task<Object> GetListSitesForCustomers(int id)
        {
            //return db.GetListSitesForCustomers.FromSqlRaw("EXEC dbo.ListSitesForCustomer @CustomerID={0}", id).ToListAsync().Result.FirstOrDefault();
            return await db.GetListSitesForCustomers.FromSqlRaw("EXEC dbo.ListSitesForCustomer @CustomerID={0}", id).ToListAsync();
        }
    }
}

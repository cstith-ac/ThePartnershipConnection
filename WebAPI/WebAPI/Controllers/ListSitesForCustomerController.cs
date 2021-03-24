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

        [HttpGet("{id}")]
        [Authorize]
        public ListSitesForCustomer GetListSitesForCustomers(int id)
        {
            return db.GetListSitesForCustomers.FromSqlRaw("EXEC dbo.ListSitesForCustomer @CustomerID={0}", id).ToListAsync().Result.FirstOrDefault();
        }

        //[HttpGet]
        //[Authorize]
        //public async Task<Object> GetListSitesForCustomers()
        //{
        //    var customers = new List<ListSitesForCustomer>();

        //    await using (SqlConnection connection = new SqlConnection(connectionString))
        //    {
        //        connection.Open();

        //        var customerID = new SqlParameter("@CustomerId", 107746);
        //        var result = await db.GetListSitesForCustomers.FromSqlRaw("EXECUTE [dbo].[ListSitesForCustomer] @CustomerID", customerID).ToListAsync();
        //        List<ListSitesForCustomer> Lst = result.Select(s => new ListSitesForCustomer
        //        {
        //            Customer_Site_id = s.Customer_Site_id,
        //            SiteName = s.SiteName,
        //            SiteStatus = s.SiteStatus,
        //            Address_1 = s.Address_1,
        //            Address_2 = s.Address_2,
        //            City = s.City,
        //            State = s.State,
        //            ZipCode = s.ZipCode
        //        }).ToList();

        //        return Lst;
        //    }
        //}
    }
}

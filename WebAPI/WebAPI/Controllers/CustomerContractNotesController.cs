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
    public class CustomerContractNotesController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public CustomerContractNotesController(
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
        public async Task<Object> GetCustomerContractNotes()
        {
            var customers = new List<CustomerContractNotes>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var user = await _userManager.FindByIdAsync(userId);
                var c = user.AfauserLink;
                var getUserCode = await db.CustomerAccessList.FromSqlRaw("select * from dbo.CustomerAccessList where usercode = '" + c + "' and SlotNumber = 0").ToListAsync();
                var customerID = new SqlParameter("@CustomerId", getUserCode[0].CustomerId);
                var result = await db.GetCustomerContractNotes.FromSqlRaw("EXECUTE [dbo].[CustomerContractNotes] @CustomerID", customerID).ToListAsync();
                List<CustomerContractNotes> Lst = result.Select(s => new CustomerContractNotes
                {
                    Customer_Notes_Id = s.Customer_Notes_Id,
                    BusinessName = s.BusinessName,
                    SiteStatus = s.SiteStatus,
                    Site_Number = s.Site_Number,
                    Address_1 = s.Address_1,
                    Notes = s.Notes,
                    NotePreview = s.NotePreview
                }).ToList();
                return Lst;
            }
        }

        [HttpGet("{id}")]
        public CustomerContractNotes GetCustomerContractNotesByID(int id)
        {
            return db.GetCustomerContractNotes.FromSqlRaw("EXEC dbo.CustomerContractNotes @CustomerId={0}", id).ToListAsync().Result.FirstOrDefault();
        }
    }
}

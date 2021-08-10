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
    public class CancelQueueListController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public CancelQueueListController(
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
        public async Task<Object> GetCancelQueueLists()
        {
            var customers = new List<CancelQueueList>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var user = await _userManager.FindByIdAsync(userId);
                var c = user.UserName;
                var result = await db.GetCancelQueueLists.FromSqlRaw("EXEC dbo.CancelQueueList @EmailAddress = '" + c + "'").ToListAsync();

                List<CancelQueueList> Lst = result.Select(s => new CancelQueueList
                {
                    Cancel_Queue_Id = s.Cancel_Queue_Id,
                    Customer_Number = s.Customer_Number,
                    Customer_Name = s.Customer_Name,
                    SiteCount = s.SiteCount,
                    Full_Cancel = s.Full_Cancel,
                    RMR_Reason_Code = s.RMR_Reason_Code,
                    Notice_Date = s.Notice_Date,
                    Effective_Date = s.Effective_Date,
                    CancelledRMR = s.CancelledRMR,
                    Balance_Of_Contract = s.Balance_Of_Contract,
                    Reference = s.Reference,
                    Memo = s.Memo,
                    Address_1 = s.Address_1,
                    Address_2 = s.Address_2,
                    City = s.City,
                    State = s.State,
                    ZipCode = s.ZipCode,
                    E_Mail = s.E_Mail,
                    PrimaryPhone = s.PrimaryPhone,
                    AlternatePhone = s.AlternatePhone
                }).ToList();

                return Lst;
            }
        }
    }
}

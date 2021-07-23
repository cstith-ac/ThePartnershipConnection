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
    public class TPCCollectionsCallToActionButtonController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public TPCCollectionsCallToActionButtonController(
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
        public async Task<object> GetTPCCollectionsCallToActionButtons()
        {
            var lists = new List<TPCCollectionsCallToActionButton>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var user = await _userManager.FindByIdAsync(userId);
                var c = user.UserName;
                var result = await db.GetTPCCollectionsCallToActionButtons.FromSqlRaw("EXECUTE dbo.TPCCollectionsCallToActionButton @EmailAddress = '" + c + "' ").ToListAsync();

                List<TPCCollectionsCallToActionButton> Lst = result.Select(s => new TPCCollectionsCallToActionButton
                {
                    Customer_Id = s.Customer_Id,
                    RowNum = s.RowNum,
                    Customer_Number = s.Customer_Number,
                    Customer_Name = s.Customer_Name,
                    Customer_Since = s.Customer_Since,
                    TotalRMR = s.TotalRMR,
                    CollectionQueue = s.CollectionQueue,
                    Bal_Current = s.Bal_Current,
                    Bucket_1 = s.Bucket_1,
                    Bucket_2 = s.Bucket_2,
                    Bucket_3 = s.Bucket_3,
                    Bucket_4 = s.Bucket_4,
                    Bucket_5 = s.Bucket_5,
                    TotalBalance = s.TotalBalance,
                    EmailAddress = s.EmailAddress,
                    PhoneContact = s.PhoneContact,
                    AddressOnFile = s.AddressOnFile,
                    UsesAutoPay = s.UsesAutoPay
                }).ToList();

                return Lst;
            }
        }
    }
}

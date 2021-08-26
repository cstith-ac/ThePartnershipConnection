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
    public class TPCPartnerAgingReportController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public TPCPartnerAgingReportController(
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
        public async Task<Object> GetTPCPartnerAgingReports()
        {
            var customers = new List<TPCPartnerAgingReport>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var user = await _userManager.FindByIdAsync(userId);
                var c = user.UserName;

                var result = await db.GetTPCPartnerAgingReports.FromSqlRaw("EXECUTE dbo.TPCPartnerAgingReport @UserEmail = '" + c + "'").ToListAsync();

                List<TPCPartnerAgingReport> Lst = result.Select(s => new TPCPartnerAgingReport
                {
                    PartnerCode = s.PartnerCode,
                    Customer_Number = s.Customer_Number,
                    SortCust = s.SortCust,
                    Customer_Name = s.Customer_Name,
                    ActiveRMR = s.ActiveRMR,
                    CollectionQueue = s.CollectionQueue,
                    FilterCategory = s.FilterCategory,
                    CustomerSince = s.CustomerSince,
                    LastPay = s.LastPay,
                    LastPayAmount = s.LastPayAmount,
                    PendingCancellation = s.PendingCancellation,
                    Customer_Id = s.Customer_Id,
                    Bucket_1 = s.Bucket_1,
                    Bucket_2 = s.Bucket_2,
                    Bucket_3 = s.Bucket_3,
                    Bucket_4 = s.Bucket_4,
                    Bucket_5 = s.Bucket_5,
                    Bal_Current = s.Bal_Current,
                    AvailableCredit = s.AvailableCredit,
                    AvailableCash = s.AvailableCash,
                    TotalDue = s.TotalDue,
                    PastDue = s.PastDue,
                    GuaranteeStatus = s.GuaranteeStatus,
                    Address_1 = s.Address_1,
                    Address_2 = s.Address_2,
                    Address_3 = s.Address_3,
                    City = s.City,
                    State = s.State,
                    ZipCode = s.ZipCode,
                    EmailAddress = s.EmailAddress,
                    PrimaryPhone = s.PrimaryPhone,
                    AlternatePhone = s.AlternatePhone,
                    CommercialAccount = s.CommercialAccount
                }).ToList();

                return Lst;
            }
        }
    }
}

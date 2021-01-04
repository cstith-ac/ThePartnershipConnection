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
    public class CustomerCareDashboardInfoController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public CustomerCareDashboardInfoController(
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
        public async Task<Object> GetCustomerCareDashboardInfo()
        {
            var customers = new List<CustomerCareDashboardInfo>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var user = await _userManager.FindByIdAsync(userId);
                var c = user.AfauserLink;
                var getUserCode = await db.CustomerAccessList.FromSqlRaw("select * from dbo.CustomerAccessList where usercode = '" + c + "' and SlotNumber = 0").ToListAsync();
                var customerID = new SqlParameter("@CustomerId", getUserCode[0].CustomerId);
                var result = await db.GetCustomerCareDashboardInfos.FromSqlRaw("EXECUTE [dbo].[CustomerCareDashboardInfo] @CustomerID", customerID).ToListAsync();
                List<CustomerCareDashboardInfo> Lst = result.Select(s => new CustomerCareDashboardInfo
                {
                    CustomerNumber = s.CustomerNumber,
                    CustomerName = s.CustomerName,
                    SpecialFlag = s.SpecialFlag,
                    PartnerID = s.PartnerID,
                    PartnerName = s.PartnerName,
                    SiteCount = s.SiteCount,
                    SystemCount = s.SystemCount,
                    TotalRMR = s.TotalRMR,
                    NoEmail = s.NoEmail,
                    EmailAddress = s.EmailAddress,
                    HasAutoPayment = s.HasAutoPayment,
                    AutoPayType = s.AutoPayType,
                    LastFourDigits = s.LastFourDigits,
                    CCExpires = s.CCExpires,
                    Prompt0 = s.Prompt0,
                    Prompt1 = s.Prompt1,
                    Prompt2 = s.Prompt2,
                    Prompt3 = s.Prompt3,
                    Prompt4 = s.Prompt4,
                    Prompt5 = s.Prompt5,
                    Prompt6 = s.Prompt6,
                    Prompt7 = s.Prompt7,
                    Prompt8 = s.Prompt8,
                    Prompt9 = s.Prompt9,
                    CustomerRating = s.CustomerRating,
                    CustomerRatingValue = s.CustomerRatingValue,
                    DashboardStyle = s.DashboardStyle,
                    LastServiceTicketID = s.LastServiceTicketID,
                    LastVisitInfo = s.LastVisitInfo,
                    ServicedBy = s.ServicedBy,
                    InvoicesArePrinted = s.InvoicesArePrinted,
                    InvoicesAreEmailed = s.InvoicesAreEmailed,
                    PH1 = s.PH1,
                    PH2 = s.PH2,
                    PH3 = s.PH3,
                    TicketsLastSixMonths = s.TicketsLastSixMonths,
                    GuaranteeStatus = s.GuaranteeStatus,
                    CriticalMessage = s.CriticalMessage,
                    LastNote = s.LastNote,
                    PartnerKeyWords = s.PartnerKeyWords,
                    BillFrequency = s.BillFrequency,
                    NextCycleOn = s.NextCycleOn,
                    HasSeparateSiteAddress = s.HasSeparateSiteAddress,
                    AlternateServiceCompanyActive = s.AlternateServiceCompanyActive,
                    AutoPaymentMessage = s.AutoPaymentMessage
                }).ToList();
                return Lst;
            }
        }
    }
}

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
    public class PartnerLandingPageController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public PartnerLandingPageController(
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
        public async Task<object> GetPartnerLandingPages()
        {
            var lists = new List<PartnerLandingPage>();

            await using(SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var user = await _userManager.FindByIdAsync(userId);
                var c = user.UserName;
                var result = await db.GetPartnerLandingPages.FromSqlRaw("EXECUTE dbo.PartnerLandingPage @UserEmail = '" + c + "'").ToListAsync();

                List<PartnerLandingPage> Lst = result.Select(s => new PartnerLandingPage
                {
                    Over30Count = s.Over30Count,
                    Over30Value = s.Over30Value,
                    Over60Count = s.Over60Count,
                    Over60Value = s.Over60Value,
                    Over90Count = s.Over90Count,
                    Over90Value = s.Over90Value,
                    Over120Count = s.Over120Count,
                    Over120Value = s.Over120Value,
                    InvoicesInProcess = s.InvoicesInProcess,
                    InvoicesInProcessValue = s.InvoicesInProcessValue,
                    InvoicesOnHold = s.InvoicesOnHold,
                    InvoicesOnHoldValue = s.InvoicesOnHoldValue,
                    InvoicesApproved30days = s.InvoicesApproved30days,
                    InvoicesApproved30daysValue = s.InvoicesApproved30daysValue,
                    InvoicesPaid30days = s.InvoicesPaid30days,
                    InvoicesPaid30daysValue = s.InvoicesPaid30daysValue,
                    PendingProspects = s.PendingProspects,
                    OldestProspect = s.OldestProspect,
                    PendingCancels = s.PendingCancels,
                    RMRCancels = s.RMRCancels,
                    PendingCancels7days = s.PendingCancels7days,
                    HighRMRCancelPerson = s.HighRMRCancelPerson,
                    HighRMRCancelValue = s.HighRMRCancelValue,
                    ServiceTicketsPending = s.ServiceTicketsPending,
                    OldestInProgress = s.OldestInProgress,
                    ATTCount = s.ATTCount,
                    VerizonCount = s.VerizonCount,
                    SprintCount = s.SprintCount,
                    TMobileCount = s.TMobileCount,
                    UnknownCount = s.UnknownCount,
                    UpgradesLastMonth = s.UpgradesLastMonth,
                    LifeTimeUpgrades = s.LifeTimeUpgrades,
                    ProgressPercent = s.ProgressPercent,
                    AttritionLastMonth = s.AttritionLastMonth,
                    AttritionLast6Months = s.AttritionLast6Months,
                    AttritionLast12Months = s.AttritionLast12Months
                }).ToList();

                return Lst;
            }
        }
    }
}

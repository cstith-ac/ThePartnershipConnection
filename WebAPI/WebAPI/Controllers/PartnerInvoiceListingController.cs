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
    public class PartnerInvoiceListingController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public PartnerInvoiceListingController(
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
        public async Task<Object> GetPartnerInvoiceListings()
        {
            var customers = new List<PartnerInvoiceListing>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var user = await _userManager.FindByIdAsync(userId);
                var c = user.UserName;
                var f = 0;

                //var result = await db.GetPartnerInvoiceListings.FromSqlRaw("EXEC dbo.PartnerInvoiceListing @EmailAddress = '" + c + "'  @Filter = 0").ToListAsync();
                var result = await db.GetPartnerInvoiceListings.FromSqlRaw("EXEC dbo.PartnerInvoiceListing @EmailAddress = '" + c + "', @Filter = '" + f + "' ").ToListAsync();

                List<PartnerInvoiceListing> Lst = result.Select(s => new PartnerInvoiceListing
                {
                    TicketID = s.TicketID,
                    IncentiveID = s.IncentiveID,
                    VendorInvoiceNumber = s.VendorInvoiceNumber,
                    InvoiceAmount = s.InvoiceAmount,
                    InvoiceDate = s.InvoiceDate,
                    ApprovedAmount = s.ApprovedAmount,
                    DateEntered = s.DateEntered,
                    TicketNumber = s.TicketNumber,
                    Customer_Number = s.Customer_Number,
                    Customer_Name = s.Customer_Name,
                    Problem_Code = s.Problem_Code,
                    ResolvedNotClosed = s.ResolvedNotClosed,
                    Determination = s.Determination,
                    DeterminedOn = s.DeterminedOn,
                    HeldReason = s.HeldReason,
                    APInvoiceNumber = s.APInvoiceNumber,
                    APInvoiceAmount = s.APInvoiceAmount,
                    CheckNumber = s.CheckNumber,
                    CheckDate = s.CheckDate,
                    AmountPaid = s.AmountPaid,
                    CreditAmount = s.CreditAmount,
                    CreditDate = s.CreditDate,
                    RelevantMemo = s.RelevantMemo,
                    RelevantComment = s.RelevantComment,
                    ReportOrder = s.ReportOrder,
                    Address_1 = s.Address_1,
                    Address_2 = s.Address_2,
                    Address_3 = s.Address_3,
                    City = s.City,
                    State = s.State,
                    ZipCode = s.ZipCode,
                    CSAccount = s.CSAccount
                }).ToList();

                return Lst;
            }
        }
    }
}

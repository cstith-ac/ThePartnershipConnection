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
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using WebAPI.Models;
using WebAPI.Repository;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartnerInvoiceListingXController : ControllerBase
    {
        private ILogger _logger;
        private IPartnerInvoiceListingXRepository _repository;
        TPC_DevContext db = new TPC_DevContext();

        public PartnerInvoiceListingXController(
            ILogger<PartnerInvoiceListingXController> logger, IPartnerInvoiceListingXRepository repository)
        {
            _logger = logger;
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        //private readonly UserManager<ApplicationUser> _userManager;
        //string connectionString = "";
        //private readonly ApplicationSettings _appSettings;
        //TPC_DevContext db = new TPC_DevContext();

        //public PartnerInvoiceListingXController(
        //    IConfiguration configuration,
        //    UserManager<ApplicationUser> userManager,
        //    IOptions<ApplicationSettings> appSettings)
        //{
        //    _userManager = userManager;
        //    connectionString = configuration.GetConnectionString("TPC_DevDatabase");
        //    _appSettings = appSettings.Value;
        //}

        [HttpPost]
        //[HttpGet]
        //[HttpGet("{id1}/{id2}/{id3}/{id4}/{id5}")]
        [Authorize]
        //public async Task<Object> GetCancelQueueListXs(string id1, int id2, DateTime id3, DateTime id4, string id5)
        //{
        //    return await db.GetPartnerInvoiceListingXs.FromSqlRaw("EXECUTE dbo.PartnerInvoiceListingX @EmailAddress = {0}, @Filter = {1}, @StartDate = {2}, @EndDate = {3}, @AliasEmail = {4}", id1, id2, id3, id4, id5).ToListAsync();
        //}
        //[Authorize]
        //public async Task<Object> GetPartnerInvoiceListingX(PartnerInvoiceListingX partnerInvoiceListingX)
        //{
        //    string StoredProcedure = "exec dbo.PartnerInvoiceListingX " +
        //        "@EmailAddress = '" + partnerInvoiceListingX.EmailAddress + "'," +
        //        "@Filter= '" + partnerInvoiceListingX.Filter + "'," +
        //        //"@StartDate= '" + string.IsNullOrEmpty(partnerInvoiceListingX.StartDate) + "'," +
        //        "@StartDate= '" + string.IsNullOrEmpty(partnerInvoiceListingX.StartDate) + "'," +
        //        "@EndDate= '" + string.IsNullOrEmpty(partnerInvoiceListingX.EndDate) + "'," +
        //        "@AliasEmail= '" + partnerInvoiceListingX.AliasEmail + "'";

        //    return await db.GetPartnerInvoiceListingXs.FromSqlRaw(StoredProcedure).ToListAsync();
        //}


        public async Task<IActionResult> GetPartnerInvoiceListingXs([FromBody] PartnerInvoiceListingX partnerInvoiceListingX)
        {
            //var result = await db.GetPartnerInvoiceListingXs.FromSqlRaw("exec dbo.PartnerInvoiceListingX " +
            //        "@EmailAddress = '" + partnerInvoiceListingX.EmailAddress + "'," +
            //        "@Filter = '" + partnerInvoiceListingX.Filter + "'," +
            //        //"@StartDate= '" + string.IsNullOrEmpty(partnerInvoiceListingX.StartDate) + "'," +
            //        "@StartDate = '" + partnerInvoiceListingX.StartDate + "'," +
            //        "@EndDate = '" + partnerInvoiceListingX.EndDate + "'," +
            //        "@AliasEmail = '" + partnerInvoiceListingX.AliasEmail + "'").ToListAsync();

            //List<PartnerInvoiceListingX> Lst = result.Select(s => new PartnerInvoiceListingX
            //{
            //    TicketID = s.TicketID,
            //    IncentiveID = s.IncentiveID,
            //    VendorInvoiceNumber = s.VendorInvoiceNumber,
            //    InvoiceAmount = s.InvoiceAmount,
            //    InvoiceDate = s.InvoiceDate,
            //    ApprovedAmount = s.ApprovedAmount,
            //    DateEntered = s.DateEntered,
            //    TicketNumber = s.TicketNumber,
            //    Customer_Number = s.Customer_Number,
            //    Customer_Name = s.Customer_Name,
            //    Problem_Code = s.Problem_Code,
            //    ResolvedNotClosed = s.ResolvedNotClosed,
            //    Determination = s.Determination,
            //    DeterminedOn = s.DeterminedOn,
            //    HeldReason = s.HeldReason,
            //    APInvoiceNumber = s.APInvoiceNumber,
            //    APInvoiceAmount = s.APInvoiceAmount,
            //    CheckNumber = s.CheckNumber,
            //    CheckDate = s.CheckDate,
            //    AmountPaid = s.AmountPaid,
            //    CreditAmount = s.CreditAmount,
            //    CreditDate = s.CreditDate,
            //    RelevantMemo = s.RelevantMemo,
            //    RelevantComment = s.RelevantComment,
            //    ReportOrder = s.ReportOrder,
            //    Address_1 = s.Address_1,
            //    Address_2 = s.Address_2,
            //    Address_3 = s.Address_3,
            //    City = s.City,
            //    State = s.State,
            //    ZipCode = s.ZipCode,
            //    CSAccount = s.CSAccount
            //}).ToList();

            //return Lst;
            return Ok(await _repository.GetPartnerInvoiceListingXResult(partnerInvoiceListingX));
        }

        //public async Task<Object> GetPartnerInvoiceListingXs([FromBody] PartnerInvoiceListingX partnerInvoiceListingX)
        //{
        //    var customers = new List<PartnerInvoiceListingX>();

        //    await using (SqlConnection connection = new SqlConnection(connectionString))
        //    {
        //        connection.Open();

        //        string userId = User.Claims.First(c => c.Type == "UserID").Value;
        //        var user = await _userManager.FindByIdAsync(userId);
        //        var c = user.UserName;
        //        var f = 0;
        //        var startDate = "2021-04-23";
        //        var endDate = "2021-04-23";

        //        var result = await db.GetPartnerInvoiceListingXs.FromSqlRaw("EXEC dbo.PartnerInvoiceListingX " +
        //            "@EmailAddress = '" + c + "', " +
        //            "@Filter = '" + f + "', " +
        //            "@StartDate = '" + startDate + "', " +
        //            "@EndDate = '" + endDate + "', " +
        //            "@AliasEmail = {0} "
        //            ).ToListAsync();

        //        List<PartnerInvoiceListingX> Lst = result.Select(s => new PartnerInvoiceListingX
        //        {
        //            TicketID = s.TicketID,
        //            IncentiveID = s.IncentiveID,
        //            VendorInvoiceNumber = s.VendorInvoiceNumber,
        //            InvoiceAmount = s.InvoiceAmount,
        //            InvoiceDate = s.InvoiceDate,
        //            ApprovedAmount = s.ApprovedAmount,
        //            DateEntered = s.DateEntered,
        //            TicketNumber = s.TicketNumber,
        //            Customer_Number = s.Customer_Number,
        //            Customer_Name = s.Customer_Name,
        //            Problem_Code = s.Problem_Code,
        //            ResolvedNotClosed = s.ResolvedNotClosed,
        //            Determination = s.Determination,
        //            DeterminedOn = s.DeterminedOn,
        //            HeldReason = s.HeldReason,
        //            APInvoiceNumber = s.APInvoiceNumber,
        //            APInvoiceAmount = s.APInvoiceAmount,
        //            CheckNumber = s.CheckNumber,
        //            CheckDate = s.CheckDate,
        //            AmountPaid = s.AmountPaid,
        //            CreditAmount = s.CreditAmount,
        //            CreditDate = s.CreditDate,
        //            RelevantMemo = s.RelevantMemo,
        //            RelevantComment = s.RelevantComment,
        //            ReportOrder = s.ReportOrder,
        //            Address_1 = s.Address_1,
        //            Address_2 = s.Address_2,
        //            Address_3 = s.Address_3,
        //            City = s.City,
        //            State = s.State,
        //            ZipCode = s.ZipCode,
        //            CSAccount = s.CSAccount
        //        }).ToList();

        //        return Lst;
        //    }
        //}
    }
}

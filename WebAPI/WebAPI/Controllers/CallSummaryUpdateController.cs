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
    public class CallSummaryUpdateController : ControllerBase
    {
        private ILogger _logger;
        private ICallSummaryUpdateRepository _repository;

        public CallSummaryUpdateController(
            ILogger<CallSummaryUpdateController> logger, ICallSummaryUpdateRepository repository)
        {
            _logger = logger;
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> InsertCallSummaryUpdateResult([FromBody] CallSummaryUpdate callSummaryUpdate)
        {
            return Ok(await _repository.InsertCallSummaryUpdateResult(callSummaryUpdate));
        }

        //private readonly UserManager<ApplicationUser> _userManager;
        //string connectionString = "";
        //private readonly ApplicationSettings _appSettings;
        //TPC_DevContext db = new TPC_DevContext();

        //public CallSummaryUpdateController(
        //    IConfiguration configuration,
        //    UserManager<ApplicationUser> userManager,
        //    IOptions<ApplicationSettings> appSettings)
        //{
        //    _userManager = userManager;
        //    connectionString = configuration.GetConnectionString("TPC_DevDatabase");
        //    _appSettings = appSettings.Value;
        //}


        //[HttpPost]
        //[Authorize]
        //public async Task<IActionResult> InsertCallSummaryUpdateResult()
        //{
        //    var updates = new List<CallSummaryUpdate>();

        //    await using (SqlConnection connection = new SqlConnection(connectionString))
        //    {
        //        connection.Open();

        //        await db.GetCallSummaryUpdates.FromSql("EXECUTE [dbo].[CallSummaryUpdate] @TicketNumber, @SedonaUser, @CustomerSiteID, @CustomerSystemID, @ProblemID, @ResolutionID, @NextStepID, @CustomerComments, @TechNotes, @CustomerOnCall, @CustomerCallBackPhone").ToListAsync();
        //    }
        //}
    }
}

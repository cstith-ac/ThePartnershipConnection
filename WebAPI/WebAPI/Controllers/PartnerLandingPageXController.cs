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

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartnerLandingPageXController : ControllerBase
    {
        private readonly ILogger<PartnerLandingPageXController> _logger;
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public PartnerLandingPageXController(
            ILogger<PartnerLandingPageXController> logger,
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager,
            IOptions<ApplicationSettings> appSettings)
        {
            _logger = logger;
            _userManager = userManager;
            connectionString = configuration.GetConnectionString("TPC_DevDatabase");
            _appSettings = appSettings.Value;
        }

        [HttpGet("{id1}/{id2}")]
        [Authorize]
        public async Task<Object> GetPartnerLandingPageXResult(string id1, string id2)
        {
            //var result = await db.GetPartnerLandingPageXResult.FromSqlRaw("EXECUTE dbo.PartnersssLandingPageX @UserEmail = {0}, @AliasEmail = {1}", id1, id2).ToListAsync();

            //if (result == null)
            //{
            //    _logger.LogInformation($"The stored proc was not found!");
            //    return StatusCode(StatusCodes.Status500InternalServerError);
            //}

            //return Ok(result);

            //_logger.LogInformation("Information: The GET method is invoked");

            //try
            //{
            //    int count = Convert.ToInt32("randomstringtogeneratorerror");
            //}
            //catch (Exception ex)
            //{
            //    _logger.LogError("Exception: An error occured with the message: " + ex.Message);
            //}

            //_logger.LogInformation($"The user with {id1} or {id2} was not found!");
            //var item = db.GetPartnerLandingPageXResult.Find(id1, id2);
            //if(item == null)
            //{
            //    _logger.LogError("Log: ",id1,id2);
            //    return NotFound();
            //}

            //var iteration = 1;

            //_logger.LogDebug($"Debug {iteration}");
            //_logger.LogInformation($"Information {iteration}");
            //_logger.LogWarning($"Warning {iteration}");
            //_logger.LogError($"Error {iteration}");
            //_logger.LogCritical($"Critical {iteration}");

            //try
            //{
            //    throw new NotImplementedException();
            //}
            //catch (Exception ex)
            //{
            //    _logger.LogError(ex, ex.Message);
            //}

            return await db.GetPartnerLandingPageXResult.FromSqlRaw("EXECUTE dbo.PartnerLandingPageX @UserEmail = {0}, @AliasEmail = {1}", id1, id2).ToListAsync();
        }
    }
}

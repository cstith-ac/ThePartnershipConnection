using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using WebAPI_CMS.Models;

namespace WebAPI_CMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CentralStationDataCMSController : ControllerBase
    {
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        CMSContext db = new CMSContext();

        public CentralStationDataCMSController(
            IConfiguration configuration,
            IOptions<ApplicationSettings> appSettings)
        {
            connectionString = configuration.GetConnectionString("AFA_Database");
            _appSettings = appSettings.Value;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CentralStationDataCMS>>> GetCentralStationDataCMS()
        {
            return await db.GetCentralStationDataCMSs.ToListAsync();
        }
    }
}

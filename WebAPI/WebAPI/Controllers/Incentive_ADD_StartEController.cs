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
    public class Incentive_ADD_StartEController : ControllerBase
    {
        private ILogger _logger;
        private IIncentive_ADD_StartERepository _repository;

        public Incentive_ADD_StartEController(
            ILogger<Incentive_ADD_StartEController> logger, IIncentive_ADD_StartERepository repository)
        {
            _logger = logger;
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpPost]
        public async Task<IActionResult> InsertIncentive_ADD_StartEResult([FromBody] Incentive_ADD_StartE jobIDAdded)
        {
            return Ok(await _repository.InsertInsentive_ADD_StartEResult(jobIDAdded));
        }
    }
}

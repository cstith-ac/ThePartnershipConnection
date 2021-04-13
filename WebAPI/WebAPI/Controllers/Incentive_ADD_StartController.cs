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
    public class Incentive_ADD_StartController : ControllerBase
    {
        private ILogger _logger;
        private IIncentive_ADD_StartRepository _repository;

        public Incentive_ADD_StartController(
            ILogger<Incentive_ADD_StartController> logger, IIncentive_ADD_StartRepository repository)
        {
            _logger = logger;
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpPost]
        public async Task<IActionResult> InsertIncentive_ADD_StartResult([FromBody] Incentive_ADD_Start jobIDAdded)
        {
            return Ok(await _repository.InsertIncentive_ADD_StartResult(jobIDAdded));
        }
    }
}

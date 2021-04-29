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
    public class Incentive_Add_FinishController : ControllerBase
    {
        private ILogger _logger;
        private IIncentive_Add_FinishRepository _repository;

        public Incentive_Add_FinishController(
            ILogger<Incentive_Add_FinishController> logger,
            IIncentive_Add_FinishRepository repository)
        {
            _logger = logger;
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpPost]
        public async Task<IActionResult> InsertIncentive_Add_FinishResult([FromBody] Incentive_Add_Finish incentive_Add_Finish)
        {
            return Ok(await _repository.InsertIncentive_Add_FinishResult(incentive_Add_Finish));
        }
    }
}

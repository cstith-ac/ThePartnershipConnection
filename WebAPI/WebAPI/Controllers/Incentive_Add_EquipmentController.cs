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
    public class Incentive_Add_EquipmentController : ControllerBase
    {
        private ILogger _logger;
        private IIncentive_Add_EquipmentRepository _repository;

        public Incentive_Add_EquipmentController(
            ILogger<Incentive_Add_EquipmentController> logger, IIncentive_Add_EquipmentRepository repository)
        {
            _logger = logger;
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpPost]
        public async Task<IActionResult> InsertIncentive_Add_EquipmentResult([FromBody] Incentive_Add_Equipment incentive_Add_Equipment)
        {
            return Ok(await _repository.InsertIncentive_Add_EquipmentResult(incentive_Add_Equipment));
        }
    }
}

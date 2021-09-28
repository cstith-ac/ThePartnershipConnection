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
    public class PermissionDeleteController : ControllerBase
    {
        private ILogger _logger;
        private IPermissionDeleteRepository _repository;

        public PermissionDeleteController(
            ILogger<PermissionDeleteController> logger, IPermissionDeleteRepository repository)
        {
            _logger = logger;
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpPost]
        public async Task<IActionResult> InsertPermissionDeleteResult([FromBody] PermissionDelete permissionDelete)
        {
            return Ok(await _repository.InsertPermissionDeleteResult(permissionDelete));
        }
    }
}

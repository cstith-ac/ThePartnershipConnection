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
    public class PartnerAddNoteController : ControllerBase
    {
        private ILogger _logger;
        private IPartnerAddNoteRepository _repository;

        public PartnerAddNoteController(
            ILogger<PartnerAddNoteController> logger,
            IPartnerAddNoteRepository repository)
        {
            _logger = logger;
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpPost]
        public async Task<IActionResult> InsertPartnerAddNotes([FromBody] PartnerAddNote partnerAddNote)
        {
            return Ok(await _repository.InsertPartnerAddNotes(partnerAddNote));
        }
    }
}

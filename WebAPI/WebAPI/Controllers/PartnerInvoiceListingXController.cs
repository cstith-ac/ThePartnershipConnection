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

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> GetPartnerInvoiceListingXs([FromBody] PartnerInvoiceListingX partnerInvoiceListingX)
        {
            return Ok(await _repository.GetPartnerInvoiceListingXResult(partnerInvoiceListingX));
        }
    }
}

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
using Microsoft.Extensions.Options;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegionRelationshipContactsController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();
        private readonly TPC_DevContext _context;

        public RegionRelationshipContactsController(
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager,
            IOptions<ApplicationSettings> appSettings,
            TPC_DevContext context)
        {
            _userManager = userManager;
            connectionString = configuration.GetConnectionString("TPC_DevDatabase");
            _appSettings = appSettings.Value;
            _context = context;
        }

        // GET: api/RegionRelationshipContacts
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<RegionRelationshipContacts>>> GetRegionRelationshipContacts()
        {
            return await db.GetRegionRelationshipContacts.ToListAsync();
        }

        // GET: api/RegionRelationshipContacts/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<RegionRelationshipContacts>> GetRegionRelationshipContact(int id)
        {
            var contacts = await _context.GetRegionRelationshipContacts.FindAsync(id);

            if (contacts == null)
            {
                return NotFound();
            }

            return contacts;
        }

        // PUT: api/RegionRelationshipContacts/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutRegionRelationshipContacts(int id, RegionRelationshipContacts regionRelationshipContacts)
        {
            if (id != regionRelationshipContacts.Id)
            {
                return BadRequest();
            }

            _context.Entry(regionRelationshipContacts).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RegionRelationshipContactsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/RegionRelationshipContacts
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<RegionRelationshipContacts>> PostRegionRelationshipContacts(RegionRelationshipContacts regionRelationshipContacts)
        {
            _context.GetRegionRelationshipContacts.Add(regionRelationshipContacts);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRegionRelationshipContacts", new { id = regionRelationshipContacts.Id }, regionRelationshipContacts);
        }

        //public async Task<ActionResult> PostRegionRelationshipContacts([FromBody] RegionRelationshipContacts model)
        //{
        //    return Ok(await db.GetRegionRelationshipContacts(model));
        //}

        // DELETE: api/RegionRelationshipContacts/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<RegionRelationshipContacts>> DeleteRegionRelationshipContacts(int id)
        {
            var contacts = await _context.GetRegionRelationshipContacts.FindAsync(id);
            if (contacts == null)
            {
                return NotFound();
            }

            _context.GetRegionRelationshipContacts.Remove(contacts);
            await _context.SaveChangesAsync();

            return contacts;
        }

        private bool RegionRelationshipContactsExists(int id)
        {
            return _context.GetRegionRelationshipContacts.Any(e => e.Id == id);
        }
    }
}

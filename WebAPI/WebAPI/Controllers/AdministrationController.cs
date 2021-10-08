using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdministrationController : ControllerBase
    {
        private UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public AdministrationController(
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ApplicationUser>> GetUser(int id)
        {
            var user = await _context.ApplicationUsers.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUserFromAdmin(int id, ApplicationUser model)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == model.Id);

            user.UserName = model.UserName;
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Email = model.Email;
            user.PhoneNumber = model.PhoneNumber;
            user.AltEmail = model.AltEmail;
            user.CellPhoneNumber1 = model.CellPhoneNumber1;
            user.AfaEmployee = model.AfaEmployee;
            user.AfaRole = model.AfaRole;
            user.PasswordHash = model.PasswordHash;
            user.RemoveSplash = model.RemoveSplash;

            var result = await _userManager.UpdateAsync(user);
            _context.Users.Update(user);
            _context.SaveChanges();

            //return Ok(result);
            return Ok(new
            {
                user.UserName,
                user.FirstName,
                user.LastName,
                user.Email,
                user.PhoneNumber,
                user.AltEmail,
                user.CellPhoneNumber1,
                user.AfaEmployee,
                user.AfaRole,
                user.PasswordHash
            });
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody]ResetPassword resetPassword)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var user = await _userManager.FindByEmailAsync(resetPassword.Email);
            if (user == null)
                return BadRequest("Invalid Request");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var resetPassResult = await _userManager.ResetPasswordAsync(user, token, resetPassword.Password);

            if (!resetPassResult.Succeeded)
            {
                var errors = resetPassResult.Errors.Select(e => e.Description);

                return BadRequest(new { Errors = errors });
            }
            
            return Ok(resetPassResult);
        }

        // DELETE 
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserFromAdmin(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if(user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}

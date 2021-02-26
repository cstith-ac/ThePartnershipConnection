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
    public class UserProfileController : ControllerBase
    {
        private UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public UserProfileController(
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }
        [HttpGet]
        [Authorize]
        //GET : /api/UserProfile
        public async Task<Object> GetUserProfile()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;//retrieve user details...username, email, firstname, etc.
            var user = await _userManager.FindByIdAsync(userId);
            return new
            {
                user.Id,
                user.UserName,
                user.FirstName,
                user.LastName,
                user.Email,
                user.PhoneNumber,
                user.AltEmail,
                user.CellPhoneNumber1,
                user.AfauserLink,
                user.AfaEmployee,
                user.AfaRole
            };
        }

        //[HttpPut("{id}")]
        //[Authorize]
        //// PUT: /api/UserProfile/5
        //public async Task<IActionResult> UpdateUserProfile(int id, ApplicationUser user)
        //{
        //    if (id != user.Id)
        //    {
        //        return BadRequest();
        //    }

        //    //_context.Entry(user).State = EntityState.Modified;
        //    _context.Users.Update(user);
        //    await _context.SaveChangesAsync();
        //    //try
        //    //{
        //    //    await _context.SaveChangesAsync();
        //    //}
        //    //catch (DbUpdateConcurrencyException)
        //    //{
        //    //    if (!UserExists(id))
        //    //    {
        //    //        return NotFound();
        //    //    }
        //    //    else
        //    //    {
        //    //        throw;
        //    //    }
        //    //}
        //    return NoContent();
        //}

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser(int id,ApplicationUser model)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == model.Id);

            user.UserName = model.UserName;
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Email = model.Email;
            user.PhoneNumber = model.PhoneNumber;
            user.AltEmail = model.AltEmail;
            user.CellPhoneNumber1 = model.CellPhoneNumber1;

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
                user.CellPhoneNumber1
            });
        }

        private bool UserExists(int id)
        {
            return _context.ApplicationUsers.Any(e => e.Id == id);
        }
    }
}

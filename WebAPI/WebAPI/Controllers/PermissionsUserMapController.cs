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
    public class PermissionsUserMapController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public PermissionsUserMapController(
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager,
            IOptions<ApplicationSettings> appSettings)
        {
            _userManager = userManager;
            connectionString = configuration.GetConnectionString("TPC_DevDatabase");
            _appSettings = appSettings.Value;
        }

        //[HttpGet]
        //[Authorize]
        //public async Task<Object> GetPermissionsUserMaps()
        //{
        //    var customers = new List<PermissionsUserMap>();

        //    await using (SqlConnection connection = new SqlConnection(connectionString))
        //    {
        //        connection.Open();

        //        string userId = User.Claims.First(c => c.Type == "UserID").Value;
        //        var user = await _userManager.FindByIdAsync(userId);
        //        var c = user.UserName;
        //        var result = await db.GetPermissionsUserMaps.FromSqlRaw("EXECUTE dbo.PermissionsUserMap @UserName = '" + c + "'").ToListAsync();

        //        List<PermissionsUserMap> Lst = result.Select(s => new PermissionsUserMap
        //        {
        //            ID = s.ID,
        //            PermissionName = s.PermissionName,
        //            TreeDepth = s.TreeDepth,
        //            PermissionDependentOn = s.PermissionDependentOn,
        //            HasPermission = s.HasPermission
        //        }).ToList();

        //        return Lst;
        //    }
        //}

        [HttpGet("{id}")]
        [Authorize]
        public async Task<Object> GetPermissionsUserMaps(string id)
        {
            return await db.GetPermissionsUserMaps.FromSqlRaw("EXECUTE dbo.PermissionsUserMap @UserName ={0}", id).ToListAsync();
        }
    }
}

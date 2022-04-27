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
    public class ListPanelTypesXController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public ListPanelTypesXController(
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager,
            IOptions<ApplicationSettings> appSettings)
        {
            _userManager = userManager;
            connectionString = configuration.GetConnectionString("TPC_DevDatabase");
            _appSettings = appSettings.Value;
        }

        [HttpGet("{id1}")]
        [Authorize]
        public async Task<Object> GetListPanelTypesXs(string id1)
        {
            var list = new List<ListPanelTypesX>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var user = await _userManager.FindByIdAsync(userId);
                var c = user.UserName;

                var email = c;

                var result = await db.GetListPanelTypesXs.FromSqlRaw("EXECUTE [dbo].[ListPanelTypesX] @CustomerSystemID = {0}, @UserEmailAddress = '" + email + "', @IncentiveStatus = 1, @InstallCompanyID = 1", id1).ToListAsync();
                List<ListPanelTypesX> Lst = result.Select(s => new ListPanelTypesX
                {
                    Panel_Type_Id = s.Panel_Type_Id,
                    PanelName = s.PanelName,
                    Inactive = s.Inactive
                }).ToList();

                return Lst;
            }
        }

        //[HttpGet]
        //[Authorize]
        //public async Task<Object> GetListPanelTypesXs()
        //{
        //    var list = new List<ListPanelTypesX>();

        //    await using (SqlConnection connection = new SqlConnection(connectionString))
        //    {
        //        connection.Open();
        //        string userId = User.Claims.First(c => c.Type == "UserID").Value;
        //        var user = await _userManager.FindByIdAsync(userId);
        //        var c = user.UserName;

        //        var email = c;

        //        var result = await db.GetListPanelTypesXs.FromSqlRaw("EXECUTE [dbo].[ListPanelTypesX] @CustomerSystemID = 1, @UserEmailAddress = '" + email + "', @IncentiveStatus = 1, @InstallCompanyID = 1").ToListAsync();
        //        List<ListPanelTypesX> Lst = result.Select(s => new ListPanelTypesX
        //        {
        //            Panel_Type_Id = s.Panel_Type_Id,
        //            PanelName = s.PanelName,
        //            Inactive = s.Inactive
        //        }).ToList();

        //        return Lst;
        //    }
        //}
    }
}

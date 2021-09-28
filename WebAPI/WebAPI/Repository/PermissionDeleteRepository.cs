using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models;

namespace WebAPI.Repository
{
    public class PermissionDeleteRepository : IPermissionDeleteRepository
    {
        private readonly string _connectionString;
        private List<PermissionDelete> _permissionDeletes;
        private readonly TPC_DevContext context;

        public PermissionDeleteRepository(IConfiguration configuration, TPC_DevContext context)
        {
            _permissionDeletes = new List<PermissionDelete>();
            _connectionString = configuration.GetConnectionString("TPC_DevDatabase");
            this.context = context;
        }

        public async Task<Object> InsertPermissionDeleteResult(PermissionDelete permissionDelete)
        {
            var userNameParam = new SqlParameter("@UserName", permissionDelete.UserName);
            var permissionIDParam = new SqlParameter("@PermissionID", permissionDelete.PermissionID);
            if (permissionDelete.PermissionID == null)
            {
                permissionIDParam.Value = "0";
            }
            var permissionNameParam = new SqlParameter("@PermissionName", permissionDelete.PermissionName);
            //if (permissionDelete.PermissionName == null)
            //{
            //    permissionNameParam.Value = "0";
            //}

            await context.Database.ExecuteSqlRawAsync("EXECUTE [dbo].[PermissionDelete] @UserName, @PermissionID, @PermissionName",
                userNameParam,
                permissionIDParam,
                permissionNameParam);

            return permissionDelete;
        }
    }
}

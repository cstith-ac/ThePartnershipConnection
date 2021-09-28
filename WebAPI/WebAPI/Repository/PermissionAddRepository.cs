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
    public class PermissionAddRepository : IPermissionAddRepository
    {
        private readonly string _connectionString;
        private List<PermissionAdd> _permissionAdds;
        private readonly TPC_DevContext context;

        public PermissionAddRepository(IConfiguration configuration, TPC_DevContext context)
        {
            _permissionAdds = new List<PermissionAdd>();
            _connectionString = configuration.GetConnectionString("TPC_DevDatabase");
            this.context = context;
        }

        public async Task<Object> InsertPermissionAddResult(PermissionAdd permissionAdd)
        {
            var userNameParam = new SqlParameter("@UserName", permissionAdd.UserName);
            var permissionIDParam = new SqlParameter("@PermissionID", permissionAdd.PermissionID);
            if (permissionAdd.PermissionID == null)
            {
                permissionIDParam.Value = "0";
            }
            var permissionNameParam = new SqlParameter("@PermissionName", permissionAdd.PermissionName);
            //if (permissionAdd.PermissionName == null)
            //{
            //    permissionNameParam.Value = "0";
            //}

            await context.Database.ExecuteSqlRawAsync("EXECUTE [dbo].[PermissionAdd] @UserName, @PermissionID, @PermissionName",
                userNameParam,
                permissionIDParam,
                permissionNameParam);

            return permissionAdd;
        }
    }
}

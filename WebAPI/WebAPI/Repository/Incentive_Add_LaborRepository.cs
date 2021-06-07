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
    public class Incentive_Add_LaborRepository : IIncentive_Add_LaborRepository
    {
        private readonly string _connectionString;
        private List<Incentive_Add_Labor> _incentive_Add_Labor;
        private readonly AFAContext context;

        public Incentive_Add_LaborRepository(IConfiguration configuration, AFAContext context)
        {
            _incentive_Add_Labor = new List<Incentive_Add_Labor>();
            _connectionString = configuration.GetConnectionString("AFA_Database");
            this.context = context;
        }

        public async Task<Object> InsertIncentive_Add_LaborResult(Incentive_Add_Labor incentive_Add_Labor)
        {
            var incentiveIDParam = new SqlParameter("@IncentiveID", incentive_Add_Labor.IncentiveID);

            var itemIDParam = new SqlParameter("@ItemID", incentive_Add_Labor.ItemID);

            var descriptionParam = new SqlParameter("@Description", incentive_Add_Labor.Description);
            if (incentive_Add_Labor.Description == null)
            {
                try
                {
                    descriptionParam.Value = "";
                }
                catch (Exception ex)
                {

                    throw new System.Exception("There's no desciption");
                }
            }

            var quantityParam = new SqlParameter("@Quantity", incentive_Add_Labor.Quantity);

            var costParam = new SqlParameter("@Cost", incentive_Add_Labor.Cost);

            await context.Database.ExecuteSqlRawAsync(
                "EXECUTE [dbo].[Incentive_Add_Labor] @IncentiveID, @ItemID, @Description, @Quantity, @Cost",
                incentiveIDParam,
                itemIDParam,
                descriptionParam,
                quantityParam,
                costParam);

            return incentive_Add_Labor;
        }
    }
}

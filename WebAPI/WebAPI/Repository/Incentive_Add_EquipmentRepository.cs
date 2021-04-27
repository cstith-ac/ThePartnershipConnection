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
    public class Incentive_Add_EquipmentRepository : IIncentive_Add_EquipmentRepository
    {
        private readonly string _connectionString;
        private List<Incentive_Add_Equipment> _incentive_Add_Equipment;
        private readonly AFAContext context;

        public Incentive_Add_EquipmentRepository(IConfiguration configuration, AFAContext context)
        {
            _incentive_Add_Equipment = new List<Incentive_Add_Equipment>();
            _connectionString = configuration.GetConnectionString("AFA_Database");
            this.context = context;
        }

        public async Task<Object> InsertIncentive_Add_EquipmentResult(Incentive_Add_Equipment incentive_Add_Equipment)
        {
            var incentiveIDParam = new SqlParameter("@IncentiveID", incentive_Add_Equipment.IncentiveID);
            
            var itemIDParam = new SqlParameter("@ItemID", incentive_Add_Equipment.ItemID);

            var descriptionParam = new SqlParameter("@Description", incentive_Add_Equipment.Description);

            var quantityParam = new SqlParameter("@Quantity", incentive_Add_Equipment.Quantity);

            var costParam = new SqlParameter("@Cost", incentive_Add_Equipment.Cost);

            await context.Database.ExecuteSqlRawAsync(
                "EXECUTE [dbo].[Incentive_Add_Equipment] @IncentiveID, @ItemID, @Description, @Quantity, @Cost",
                incentiveIDParam,
                itemIDParam,
                descriptionParam,
                quantityParam,
                costParam);

            return incentive_Add_Equipment;
        }
    }
}

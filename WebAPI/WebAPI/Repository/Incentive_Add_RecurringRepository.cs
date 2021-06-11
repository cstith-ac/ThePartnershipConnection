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
    public class Incentive_Add_RecurringRepository : IIncentive_Add_RecurringRepository
    {
        private readonly string _connectionString;
        private List<Incentive_Add_Recurring> _incentive_Add_Recurrings;
        private readonly AFAContext context;

        public Incentive_Add_RecurringRepository(IConfiguration configuration, AFAContext context)
        {
            _incentive_Add_Recurrings = new List<Incentive_Add_Recurring>();
            //_connectionString = configuration.GetConnectionString("TPC_DevDatabase");
            _connectionString = configuration.GetConnectionString("AFA_Database");
            this.context = context;
        }

        public async Task<Object> InsertIncentive_Add_RecurringResult(Incentive_Add_Recurring incentive_Add_Recurring)
        {
            //var incentiveIDParam = new SqlParameter("@IncentiveID", incentive_Add_Recurring.IncentiveID);
            var incentiveIDParam = new SqlParameter("@IncentiveID", incentive_Add_Recurring.IncentiveID);

            var itemIDParam = new SqlParameter("@ItemID", incentive_Add_Recurring.ItemID);

            var descriptionParam = new SqlParameter("@Description", incentive_Add_Recurring.Description);
            if (incentive_Add_Recurring.Description == null)
            {
                try
                {
                    descriptionParam.Value = "";
                }
                catch (Exception ex)
                {
                    throw new System.Exception("There's no description!");
                }
            }

            var billCycleParam = new SqlParameter("@BillCycle", incentive_Add_Recurring.BillCycle);
            if (incentive_Add_Recurring.BillCycle == null)
            {
                billCycleParam.Value = "0";
            }
            var rmrParam = new SqlParameter("@RMR", incentive_Add_Recurring.RMR);

            var passThroughParam = new SqlParameter("@PassThrough", incentive_Add_Recurring.PassThrough);

            var billingStartDateParam = new SqlParameter("@BillingStartDate", incentive_Add_Recurring.BillingStartDate);
            if (incentive_Add_Recurring.BillingStartDate == null)
            {
                try
                {
                    billingStartDateParam.Value = "1899-12-30";
                }
                catch (Exception)
                {
                    throw new System.Exception("There's no BillingStartDate!");
                }
            }

            var multipleParam = new SqlParameter("@Multiple", incentive_Add_Recurring.Multiple);

            var add2ItemParam = new SqlParameter("@Add2Item", incentive_Add_Recurring.Add2Item);

            await context.Database.ExecuteSqlRawAsync(
                "EXECUTE [dbo].[Incentive_Add_Recurring] @IncentiveID, @ItemID, @Description, @BillCycle, @RMR, @PassThrough, @BillingStartDate, @Multiple, @Add2Item",
                incentiveIDParam,
                itemIDParam,
                descriptionParam,
                billCycleParam,
                rmrParam,
                passThroughParam,
                billingStartDateParam,
                multipleParam,
                add2ItemParam);

            return incentive_Add_Recurring;
        }
    }
}

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
    public class Incentive_Add_FinishRepository : IIncentive_Add_FinishRepository
    {
        private readonly string _connectionString;
        private List<Incentive_Add_Finish> _incentive_Add_Finish;
        private readonly AFAContext context;

        public Incentive_Add_FinishRepository(IConfiguration configuration, AFAContext context)
        {
            _incentive_Add_Finish = new List<Incentive_Add_Finish>();
            _connectionString = configuration.GetConnectionString("AFA_Database");
            this.context = context;
        }

        public async Task<Object> InsertIncentive_Add_FinishResult(Incentive_Add_Finish incentive_Add_Finish)
        {
            var incentiveIDParam = new SqlParameter("@IncentiveID", incentive_Add_Finish.IncentiveID);

            var partnerTaxAmountParam = new SqlParameter("@PartnerTaxAmount", incentive_Add_Finish.PartnerTaxAmount);

            var serviceCheckedParam = new SqlParameter("@ServiceChecked", incentive_Add_Finish.ServiceChecked);

            var commentsParam = new SqlParameter("@Comments", incentive_Add_Finish.Comments);


            await context.Database.ExecuteSqlRawAsync(
                "EXECUTE [dbo].[Incentive_Add_Finish] @IncentiveID, @PartnerTaxAmount, @ServiceChecked, @Comments",
                incentiveIDParam,
                partnerTaxAmountParam,
                serviceCheckedParam,
                commentsParam);

            return incentive_Add_Finish;
        }
    }
}

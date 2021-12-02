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
            //if (partnerTaxAmountParam.Value is string)
            //{
            //    throw new System.Exception("PartnerTaxAmount is a string!");
            //}

            var serviceCheckedParam = new SqlParameter("@ServiceChecked", incentive_Add_Finish.ServiceChecked);

            //var commentsParam = new SqlParameter("@Comments", incentive_Add_Finish.Comments);
            var serviceTicketNumberParam = new SqlParameter("@ServiceTicketNumber", incentive_Add_Finish.ServiceTicketNumber == null ? DBNull.Value : (object)incentive_Add_Finish.ServiceTicketNumber);

            //if (incentive_Add_Finish.ServiceTicketNumber == null)
            //{
            //    serviceTicketNumberParam.Value = null;
            //}

            var customerEmailAddressParam = new SqlParameter("@CustomerEmailAddress", incentive_Add_Finish.CustomerEmailAddress);
            if (incentive_Add_Finish.CustomerEmailAddress == null) 
            {
                customerEmailAddressParam.Value = "";
            }

            var testParam = new SqlParameter("@Test", incentive_Add_Finish.Test);


            await context.Database.ExecuteSqlRawAsync(
                "EXECUTE [dbo].[Incentive_Add_Finish] @IncentiveID, @PartnerTaxAmount, @ServiceChecked, @ServiceTicketNumber, @CustomerEmailAddress, @Test",
                incentiveIDParam,
                partnerTaxAmountParam,
                serviceCheckedParam,
                //commentsParam
                serviceTicketNumberParam,
                customerEmailAddressParam,
                testParam);

            return incentive_Add_Finish;
        }
    }
}

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
    public class Incentive_ADD_StartRepository : IIncentive_ADD_StartRepository
    {
        private readonly string _connectionString;
        private List<Incentive_ADD_Start> _incentive_ADD_StartResults;
        private readonly TPC_DevContext context;

        public Incentive_ADD_StartRepository(IConfiguration configuration, TPC_DevContext context)
        {
            _incentive_ADD_StartResults = new List<Incentive_ADD_Start>();
            _connectionString = configuration.GetConnectionString("TPC_DevDatabase");
            this.context = context;
        }

        public async Task<int> InsertIncentive_ADD_StartResult(Incentive_ADD_Start jobIDAdded)
        {
            // define SqlParameters for the other two params to be passed
            var userEmailAddressParam = new SqlParameter("@UserEmailAddress", jobIDAdded.UserEmailAddress);
            var customerIDParam = new SqlParameter("@CustomerID", jobIDAdded.CustomerID);
            var customerSiteIDParam = new SqlParameter("@CustomerSiteID", jobIDAdded.CustomerSiteID);
            var customerSystemIDParam = new SqlParameter("@CustomerSystemID", jobIDAdded.CustomerSystemID);
            var alarmAccountParam = new SqlParameter("@AlarmAccount", jobIDAdded.AlarmAccount);
            var systemTypeIDParam = new SqlParameter("@SystemTypeID", jobIDAdded.SystemTypeID);
            var panelTypeIDParam = new SqlParameter("@PanelTypeID", jobIDAdded.PanelTypeID);
            var panelLocationParam = new SqlParameter("@PanelLocation", jobIDAdded.PanelLocation);
            var centralStationIDParam = new SqlParameter("@CentralStationID", jobIDAdded.CentralStationID);
            var additionalInfoParam = new SqlParameter("@AdditionalInfo", jobIDAdded.AdditionalInfo);
            var partnerInvoiceNumberParam = new SqlParameter("@PartnerInvoiceNumber", jobIDAdded.PartnerInvoiceNumber);
            var partnerInvoiceDateParam = new SqlParameter("@PartnerInvoiceDate", jobIDAdded.PartnerInvoiceDate);
            var contractDateParam = new SqlParameter("@ContractDate", jobIDAdded.ContractDate);
            var contractTermParam = new SqlParameter("@ContractTerm", jobIDAdded.ContractTerm);
            var renewalMonthsParam = new SqlParameter("@RenewalMonths", jobIDAdded.RenewalMonths);
            var serviceIncludedParam = new SqlParameter("@ServiceIncluded", jobIDAdded.ServiceIncluded);
            var partnerCommentsParam = new SqlParameter("@PartnerComments", jobIDAdded.PartnerComments);

            // define the output parameter that needs to be retained
            // for the Id created when the Stored Procedure executes 
            // the INSERT command
            var jobIDParam = new SqlParameter("@JobID", SqlDbType.Int);
            var statusMessageParam = new SqlParameter("@StatusMessage", SqlDbType.NVarChar);

            // the direction defines what kind of parameter we're passing
            // it can be one of:
            // Input
            // Output
            // InputOutput -- which does pass a value to Stored Procedure and retains a new state
            jobIDParam.Direction = ParameterDirection.Output;
            statusMessageParam.Direction = ParameterDirection.Output;

            // we can also use context.Database.ExecuteSqlCommand() or awaitable ExecuteSqlCommandAsync()
            // which also produces the same result - but the method is now marked obselete
            // so we use ExecuteSqlRawAsync() instead

            // we're using the awaitable version since GetOrCreateUserAsync() method is marked async

            await context.Database.ExecuteSqlRawAsync("exec dbo.Incentive_ADD_Start @UserEmailAddress, @CustomerID, @CustomerSiteID, @CustomerSystemID, @AlarmAccount, @SystemTypeID, @PanelTypeID, @PanelLocation, @CentralStationID, @AdditionalInfo, @PartnerInvoiceNumber, @PartnerInvoiceDate, @ContractDate, @ContractTerm, @RenewalMonths, @ServiceIncluded, @PartnerComments",
                userEmailAddressParam,
                customerIDParam,
                customerIDParam,
                customerSystemIDParam,
                alarmAccountParam,
                systemTypeIDParam,
                panelTypeIDParam,
                panelLocationParam,
                centralStationIDParam,
                additionalInfoParam,
                partnerInvoiceNumberParam,
                partnerInvoiceDateParam,
                contractDateParam,
                contractTermParam,
                renewalMonthsParam,
                serviceIncludedParam,
                partnerCommentsParam);

            // the userIdParam which represents the Output param
            // now holds the Id of the new user and is an Object type
            // so we convert it to an Integer and send
            return Convert.ToInt32(jobIDParam.Value);
        }
    }
}

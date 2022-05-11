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
    public class Incentive_ADD_StartERepository : IIncentive_ADD_StartERepository
    {
        private readonly string _connectionString;
        private List<Incentive_ADD_StartE> _incentive_ADD_StartEResults;
        //private readonly TPC_DevContext context;
        private readonly AFAContext context;

        public Incentive_ADD_StartERepository(IConfiguration configuration, AFAContext context)
        {
            _incentive_ADD_StartEResults = new List<Incentive_ADD_StartE>();
            _connectionString = configuration.GetConnectionString("AFADatabase");
            this.context = context;
        }

        public async Task<int> InsertInsentive_ADD_StartEResult(Incentive_ADD_StartE jobIDAdded)
        {
            // define SqlParameters for the other two params to be passed
            var userEmailAddressParam = new SqlParameter("@UserEmailAddress", jobIDAdded.UserEmailAddress);
            var installCompanyIDParam = new SqlParameter("@InstallCompanyID", jobIDAdded.InstallCompanyID);
            var customerIDParam = new SqlParameter("@CustomerID", jobIDAdded.CustomerID);
            var customerSiteIDParam = new SqlParameter("@CustomerSiteID", jobIDAdded.CustomerSiteID);
            var customerSystemIDParam = new SqlParameter("@CustomerSystemID", jobIDAdded.CustomerSystemID);
            var alarmAccountParam = new SqlParameter("@AlarmAccount", jobIDAdded.AlarmAccount);
            var systemTypeIDParam = new SqlParameter("@SystemTypeID", jobIDAdded.SystemTypeID);
            var panelTypeIDParam = new SqlParameter("@PanelTypeID", jobIDAdded.PanelTypeID);
            //if (jobIDAdded.PanelTypeID == null)
            //{
            //    panelTypeIDParam.Value = "0";
            //}
            var panelLocationParam = new SqlParameter("@PanelLocation", jobIDAdded.PanelLocation);
            if (jobIDAdded.PanelLocation == null)
            {
                panelLocationParam.Value = "";
            }
            var centralStationIDParam = new SqlParameter("@CentralStationID", jobIDAdded.CentralStationID);
            var additionalInfoParam = new SqlParameter("@AdditionalInfo", jobIDAdded.AdditionalInfo);
            if (jobIDAdded.AdditionalInfo == null)
            {
                additionalInfoParam.Value = "";
            }
            var partnerInvoiceNumberParam = new SqlParameter("@PartnerInvoiceNumber", jobIDAdded.PartnerInvoiceNumber);
            var partnerInvoiceDateParam = new SqlParameter("@PartnerInvoiceDate", jobIDAdded.PartnerInvoiceDate);
            var contractDateParam = new SqlParameter("@ContractDate", jobIDAdded.ContractDate);
            if (jobIDAdded.ContractDate == null)
            {
                contractDateParam.Value = "1899-12-30";
            }
            var contractTermParam = new SqlParameter("@ContractTerm", jobIDAdded.ContractTerm);
            if (jobIDAdded.ContractTerm == null)
            {
                contractTermParam.Value = "0";
            }
            var renewalMonthsParam = new SqlParameter("@RenewalMonths", jobIDAdded.RenewalMonths);
            if (jobIDAdded.RenewalMonths == null)
            {
                renewalMonthsParam.Value = "0";
            }
            var serviceIncludedParam = new SqlParameter("@ServiceIncluded", jobIDAdded.ServiceIncluded);
            var partnerCommentsParam = new SqlParameter("@PartnerComments", jobIDAdded.PartnerComments);
            if (jobIDAdded.PartnerComments == null)
            {
                partnerCommentsParam.Value = "There are no partner comments";
            }
            var environmentParam = new SqlParameter("@Environment", jobIDAdded.Environment);
            var sourceAppParam = new SqlParameter("@SourceApp", jobIDAdded.SourceApp);

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

            await context.Database.ExecuteSqlRawAsync("exec dbo.Incentive_ADD_StartE @UserEmailAddress,@InstallCompanyID ,@CustomerID, @CustomerSiteID, @CustomerSystemID, @AlarmAccount, @SystemTypeID, @PanelTypeID, @PanelLocation, @CentralStationID, @AdditionalInfo, @PartnerInvoiceNumber, @PartnerInvoiceDate, @ContractDate, @ContractTerm, @RenewalMonths, @ServiceIncluded, @PartnerComments, @Environment, @JobID out",
                userEmailAddressParam,
                installCompanyIDParam,
                customerIDParam,
                customerSiteIDParam,
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
                partnerCommentsParam,
                environmentParam,
                sourceAppParam,
                jobIDParam);

            // the userIdParam which represents the Output param
            // now holds the Id of the new user and is an Object type
            // so we convert it to an Integer and send
            return Convert.ToInt32(jobIDParam.Value);
        }
    }
}

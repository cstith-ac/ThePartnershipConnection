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
    public class CallSummaryUpdateRepository : ICallSummaryUpdateRepository
    {
        private readonly string _connectionString;
        private List<CallSummaryUpdate> _callSummaryUpdateResults;
        private readonly TPC_DevContext db = new TPC_DevContext();

        public CallSummaryUpdateRepository(IConfiguration configuration, TPC_DevContext context)
        {
            _callSummaryUpdateResults = new List<CallSummaryUpdate>();
            _connectionString = configuration.GetConnectionString("TPC_DevDatabase");
            //this.context = context;
        }

        public async Task<int> InsertCallSummaryUpdateResult(CallSummaryUpdate callSummaryUpdate)
        {
            //var ticketNumberParam = new SqlParameter("@TicketNumber", callSummaryUpdate.TicketNumber);

            var sedonaUserParam = new SqlParameter("@SedonaUser", callSummaryUpdate.SedonaUser);

            var customerSiteIDParam = new SqlParameter("@CustomerSiteID", callSummaryUpdate.CustomerSiteID);

            var customerSystemIDParam = new SqlParameter("@CustomerSystemID", callSummaryUpdate.CustomerSystemID);

            var problemIDParam = new SqlParameter("@ProblemID", callSummaryUpdate.ProblemID);

            var resolutionIDParam = new SqlParameter("@ResolutionID", callSummaryUpdate.ResolutionID);

            var nextStepIDParam = new SqlParameter("@NextStepID", callSummaryUpdate.NextStepID);

            var customerCommentsParam = new SqlParameter("@CustomerComments", callSummaryUpdate.CustomerComments);

            var techNotesParam = new SqlParameter("TechNotes", callSummaryUpdate.TechNotes);

            var customerOnCallParam = new SqlParameter("CustomerOnCall", callSummaryUpdate.CustomerOnCall);

            var customerCallBackPhoneParam = new SqlParameter("CustomerCallBackPhone", callSummaryUpdate.CustomerCallBackPhone);

            var ticketNumberParam = new SqlParameter("@TicketNumber", callSummaryUpdate.TicketNumber);

            //ticketNumberParam.Direction = ParameterDirection.Input;

            await db.Database.ExecuteSqlRawAsync(
                "EXECUTE [dbo].[CallSummaryUpdate] @TicketNumber, @SedonaUser, @CustomerSiteID, @CustomerSystemID, @ProblemID, @ResolutionID, @NextStepID, @CustomerComments, @TechNotes, @CustomerOnCall, @CustomerCallBackPhone",
                ticketNumberParam,
                sedonaUserParam,
                customerSiteIDParam,
                customerSystemIDParam,
                problemIDParam,
                resolutionIDParam,
                nextStepIDParam,
                customerCommentsParam,
                techNotesParam,
                customerOnCallParam,
                customerCallBackPhoneParam);

            return Convert.ToInt32(ticketNumberParam.Value);
        }
    }
}

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
    public class CallSummaryAddRepository : ICallSummaryAddRepository
    {
        private readonly string _connectionString;
        private List<CallSummaryAdd> _callSummaryAddResults;
        private readonly TPC_DevContext context;

        public CallSummaryAddRepository(IConfiguration configuration, TPC_DevContext context)
        {
            _callSummaryAddResults = new List<CallSummaryAdd>();
            _connectionString = configuration.GetConnectionString("TPC_DevDatabase");
            this.context = context;
        }

        public async Task<int> InsertCallSummaryAddResult(CallSummaryAdd ticketNumberAdded)
        {

            // define SqlParameters for the other two params to be passed
            var sedonaUserParam = new SqlParameter("@SedonaUser", ticketNumberAdded.SedonaUser);
            var systemIdParam = new SqlParameter("@SystemID", ticketNumberAdded.SystemID);
            var problemIdParam = new SqlParameter("@ProblemID", ticketNumberAdded.ProblemID);
            var resolutionIdParam = new SqlParameter("@ResolutionID", ticketNumberAdded.ResolutionID);
            var nextStepIdParam = new SqlParameter("@NextStepID", ticketNumberAdded.NextStepID);
            var customerCommentsParam = new SqlParameter("@CustomerComments", ticketNumberAdded.CustomerComments);
            var techNotesParam = new SqlParameter("@TechNotes", ticketNumberAdded.TechNotes);
            var customerOnCallParam = new SqlParameter("@CustomerOnCall", ticketNumberAdded.CustomerOnCall);
            var customerCallBackPhoneParam = new SqlParameter("@CustomerCallBackPhone", ticketNumberAdded.CustomerCallBackPhone);

            // define the output parameter that needs to be retained
            // for the Id created when the Stored Procedure executes 
            // the INSERT command
            var ticketNumberParam = new SqlParameter("@TicketNumber", SqlDbType.Int);

            // the direction defines what kind of parameter we're passing
            // it can be one of:
            // Input
            // Output
            // InputOutput -- which does pass a value to Stored Procedure and retains a new state
            ticketNumberParam.Direction = ParameterDirection.Output;

            // we can also use context.Database.ExecuteSqlCommand() or awaitable ExecuteSqlCommandAsync()
            // which also produces the same result - but the method is now marked obselete
            // so we use ExecuteSqlRawAsync() instead

            // we're using the awaitable version since GetOrCreateUserAsync() method is marked async
            await context.Database.ExecuteSqlRawAsync(
                    "exec dbo.CallSummaryAddP @SedonaUser, @SystemID, @ProblemID, @ResolutionID, @NextStepID, @CustomerComments, @TechNotes, @CustomerOnCall, @CustomerCallBackPhone, @TicketNumber out",
                    sedonaUserParam,
                    systemIdParam,
                    problemIdParam,
                    resolutionIdParam,
                    nextStepIdParam,
                    customerCommentsParam,
                    techNotesParam,
                    customerOnCallParam,
                    customerCallBackPhoneParam,
                    ticketNumberParam);

            // the userIdParam which represents the Output param
            // now holds the Id of the new user and is an Object type
            // so we convert it to an Integer and send
            return Convert.ToInt32(ticketNumberParam.Value);
        }
    }
}

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
    public class PartnerAddNoteRepository : IPartnerAddNoteRepository
    {
        private readonly string _connectionString;
        private List<PartnerAddNote> _partnerAddNotes;
        private readonly TPC_DevContext context;

        public PartnerAddNoteRepository(
            IConfiguration configuration,
            TPC_DevContext context)
        {
            _partnerAddNotes = new List<PartnerAddNote>();
            _connectionString = configuration.GetConnectionString("TPC_DevContext");
            this.context = context;
        }

        public async Task<Object> InsertPartnerAddNotes(PartnerAddNote partnerAddNote)
        {
            var emailAddressParam = new SqlParameter("@EmailAddress", partnerAddNote.EmailAddress);
            var noteTypeParam = new SqlParameter("@NoteType", partnerAddNote.NoteType);
            var memoParam = new SqlParameter("@Memo", partnerAddNote.Memo);
            var serviceTicketIDParam = new SqlParameter("@ServiceTicketID", partnerAddNote.ServiceTicketID);
            var customerIDParam = new SqlParameter("@CustomerID", partnerAddNote.CustomerID);
            var incentiveIDParam = new SqlParameter("@IncentiveID", partnerAddNote.IncentiveID);
            var cancelQueueIDParam = new SqlParameter("@CancelQueueID", partnerAddNote.CancelQueueID);
            var prospectIDParam = new SqlParameter("@ProspectID", partnerAddNote.ProspectID);
            var customerSystemIDParam = new SqlParameter("@CustomerSystemID", partnerAddNote.CustomerSystemID);

            await context.Database.ExecuteSqlRawAsync("exec dbo.PartnerAddNote @EmailAddress, @NoteType, @Memo, @ServiceTicketID, @CustomerID, @IncentiveID, @CancelQueueID, @ProspectID, @CustomerSystemID",
                emailAddressParam,
                noteTypeParam,
                memoParam,
                serviceTicketIDParam,
                customerIDParam,
                incentiveIDParam,
                cancelQueueIDParam,
                prospectIDParam,
                customerSystemIDParam);

            return partnerAddNote;
        }
    }
}

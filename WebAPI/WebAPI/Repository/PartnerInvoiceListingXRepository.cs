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
    public class PartnerInvoiceListingXRepository : IPartnerInvoiceListingXRepository
    {
        private readonly string _connectionString;
        private List<PartnerInvoiceListingX> _partnerInvoiceListingXs;
        TPC_DevContext db = new TPC_DevContext();

        public PartnerInvoiceListingXRepository(
            IConfiguration configuration,
            TPC_DevContext context)
        {
            _partnerInvoiceListingXs = new List<PartnerInvoiceListingX>();
            _connectionString = configuration.GetConnectionString("TPC_DevDatabase");
        }

        public async Task<Object> GetPartnerInvoiceListingXResult(PartnerInvoiceListingX partnerInvoiceListingX)
        {
            var emailAddressParam = new SqlParameter("@EmailAddress", partnerInvoiceListingX.EmailAddress);
            var filterParam = new SqlParameter("@Filter", partnerInvoiceListingX.Filter);
            var startDateParam = new SqlParameter("@StartDate", partnerInvoiceListingX.StartDate == null ? DBNull.Value : (object)partnerInvoiceListingX.StartDate);
            var endDateParam = new SqlParameter("@EndDate", partnerInvoiceListingX.EndDate == null ? DBNull.Value : (object)partnerInvoiceListingX.EndDate);
            var aliasEmailParam = new SqlParameter("@AliasEmail", partnerInvoiceListingX.AliasEmail);

            var result = await db.GetPartnerInvoiceListingXs.FromSqlRaw("exec PartnerInvoiceListingX @EmailAddress, @Filter, @StartDate, @EndDate, @AliasEmail", emailAddressParam, filterParam, startDateParam, endDateParam, aliasEmailParam).ToListAsync();

            List<PartnerInvoiceListingX> Lst = result.Select(s => new PartnerInvoiceListingX
            {
                TicketID = s.TicketID,
                IncentiveID = s.IncentiveID,
                VendorInvoiceNumber = s.VendorInvoiceNumber,
                InvoiceAmount = s.InvoiceAmount,
                InvoiceDate = s.InvoiceDate,
                ApprovedAmount = s.ApprovedAmount,
                DateEntered = s.DateEntered,
                TicketNumber = s.TicketNumber,
                Customer_Number = s.Customer_Number,
                Customer_Name = s.Customer_Name,
                Problem_Code = s.Problem_Code,
                ResolvedNotClosed = s.ResolvedNotClosed,
                Determination = s.Determination,
                DeterminedOn = s.DeterminedOn,
                HeldReason = s.HeldReason,
                APInvoiceNumber = s.APInvoiceNumber,
                APInvoiceAmount = s.APInvoiceAmount,
                CheckNumber = s.CheckNumber,
                CheckDate = s.CheckDate,
                AmountPaid = s.AmountPaid,
                CreditAmount = s.CreditAmount,
                CreditDate = s.CreditDate,
                RelevantMemo = s.RelevantMemo,
                RelevantComment = s.RelevantComment,
                ReportOrder = s.ReportOrder,
                Address_1 = s.Address_1,
                Address_2 = s.Address_2,
                Address_3 = s.Address_3,
                City = s.City,
                State = s.State,
                ZipCode = s.ZipCode,
                CSAccount = s.CSAccount
            }).ToList();
            
            return Lst;
        }
    }
}

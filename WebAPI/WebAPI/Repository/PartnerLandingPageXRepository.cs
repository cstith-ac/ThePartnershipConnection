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
    //public class PartnerLandingPageXRepository : IPartnerLandingPageXRepository
    //{
    //    private readonly string _connectionString;
    //    private List<PartnerLandingPageX> _partnerLandingPageX;
    //    private readonly TPC_DevContext context;

    //    public PartnerLandingPageXRepository(IConfiguration configuration, TPC_DevContext context)
    //    {
    //        _partnerLandingPageX = new List<PartnerLandingPageX>();
    //        _connectionString = configuration.GetConnectionString("TPC_DevDatabase");
    //        this.context = context;
    //    }

    //    public async Task<Object> GetPartnerLandingPageXResult(PartnerLandingPageX partnerLandingPageX)
    //    {
    //        var userEmailParam = new SqlParameter("@UserEmail", partnerLandingPageX.)
    //    }
    //}
}

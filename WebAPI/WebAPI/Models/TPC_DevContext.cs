using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace WebAPI.Models
{
    public partial class TPC_DevContext : DbContext
    {
        public TPC_DevContext()
        {
        }

        public TPC_DevContext(DbContextOptions<TPC_DevContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AspNetRoleClaims> AspNetRoleClaims { get; set; }
        public virtual DbSet<AspNetRoles> AspNetRoles { get; set; }
        public virtual DbSet<AspNetUserClaims> AspNetUserClaims { get; set; }
        public virtual DbSet<AspNetUserLogins> AspNetUserLogins { get; set; }
        public virtual DbSet<AspNetUserRoles> AspNetUserRoles { get; set; }
        public virtual DbSet<AspNetUserTokens> AspNetUserTokens { get; set; }
        public virtual DbSet<AspNetUsers> AspNetUsers { get; set; }
        public virtual DbSet<AspnetPermissions> AspnetPermissions { get; set; }
        public virtual DbSet<AspnetPermissionsMap> AspnetPermissionsMap { get; set; }
        public virtual DbSet<CustomerAccessList> CustomerAccessList { get; set; }
        public virtual DbSet<TpcdataLink> TpcdataLink { get; set; }
        public virtual DbSet<UserAccessLookup> UserAccessLookup { get; set; }

        public virtual DbSet<CustomerCareDashboardInfo> GetCustomerCareDashboardInfos { get; set; }
        public virtual DbSet<SiteToSystemList> GetSiteToSystemLists { get; set; }
        public virtual DbSet<CustomerToSiteList> GetCustomerToSiteLists { get; set; }
        public DbSet<CustomerSystemInfo> GetCustomerSystemInfos { get; set; }
        public virtual DbSet<CCAssistant_Systems> GetCCAssistant_Systems { get; set; }
        public virtual DbSet<PartnerContactList> GetPartnerContactLists { get; set; }
        public virtual DbSet<PartnerContactListAdditional> GetPartnerContactListAdditionals { get; set; }
        public virtual DbSet<PartnerInformation> GetPartnerInformations { get; set; }
        public virtual DbSet<PartnerInformationNew> GetPartnerInformationNews { get; set; }
        public virtual DbSet<CallSummaryResolutions> GetCallSummaryResolutions { get; set; }
        public virtual DbSet<CallSummaryClassList> GetCallSummaryClassLists { get; set; }
        public virtual DbSet<CallSummaryProblems> GetCallSummaryProblems { get; set; }
        public virtual DbSet<CallSummaryNextSteps> GetCallSummaryNextSteps { get; set; }
        public virtual DbSet<CallSummaryAdd> GetCallSummaryAddResults { get; set; }
        public virtual DbSet<CallSummaryUpdate> GetCallSummaryUpdates { get; set; }
        public virtual DbSet<ServiceTicketInfo> GetServiceTicketInfos { get; set; }
        public virtual DbSet<ServiceTicketInfo2> GetServiceTicketInfos2 { get; set; }
        public virtual DbSet<ServiceTicketNotes> GetServiceTicketNotes { get; set; }
        public virtual DbSet<CustomerContractNotes> GetCustomerContractNotes { get; set; }
        public virtual DbSet<CustomerContractInfo> GetCustomerContractInfos { get; set; }
        public virtual DbSet<Customer3GListing> GetCustomer3GListings { get; set; }
        public virtual DbSet<ListPanelTypes> GetListPanelTypes { get; set; }
        public virtual DbSet<ListCentralStations> GetListCentralStations { get; set; }
        public virtual DbSet<ListSitesForCustomer> GetListSitesForCustomers { get; set; }
        public virtual DbSet<ListSystemsForSite> GetListSystemsForSites { get; set; }
        public virtual DbSet<ListRecurringItems> GetListRecurringItems { get; set; }
        public virtual DbSet<ListMaterialItems> GetListMaterialItems { get; set; }
        public virtual DbSet<ListLaborItems> GetListLaborItems { get; set; }
        public virtual DbSet<CustomerSearchList> GetCustomerSearchLists { get; set; }
        public virtual DbSet<CustomerSearchListSites> GetCustomerSearchListSites { get; set; }
        public virtual DbSet<CustomerSearchListCentralStation> GetCustomerSearchListCentralStations { get; set; }
        public virtual DbSet<ListSystemTypes> GetListSystemTypes { get; set; }
        public virtual DbSet<ListMultiples> GetListMultiples { get; set; }
        public virtual DbSet<CustomerSystemInfoGet> GetCustomerSystemInfoGets { get; set; }
        public virtual DbSet<Incentive_ADD_Start> GetIncentive_ADD_StartResults { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=D1CH49N2,1433;Database=TPC_Dev;User ID=cstith;Password=TPC$123tpc");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AspNetRoleClaims>(entity =>
            {
                entity.HasIndex(e => e.RoleId);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.AspNetRoleClaims)
                    .HasForeignKey(d => d.RoleId);
            });

            modelBuilder.Entity<AspNetRoles>(entity =>
            {
                entity.HasIndex(e => e.NormalizedName)
                    .HasName("RoleNameIndex")
                    .IsUnique()
                    .HasFilter("([NormalizedName] IS NOT NULL)");

                entity.Property(e => e.Name).HasMaxLength(256);

                entity.Property(e => e.NormalizedName).HasMaxLength(256);
            });

            modelBuilder.Entity<AspNetUserClaims>(entity =>
            {
                entity.HasIndex(e => e.UserId);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserClaims)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserLogins>(entity =>
            {
                entity.HasKey(e => new { e.LoginProvider, e.ProviderKey });

                entity.HasIndex(e => e.UserId);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserLogins)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserRoles>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.RoleId });

                entity.HasIndex(e => e.RoleId);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.AspNetUserRoles)
                    .HasForeignKey(d => d.RoleId);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserRoles)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserTokens>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.LoginProvider, e.Name });

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserTokens)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUsers>(entity =>
            {
                entity.HasIndex(e => e.NormalizedEmail)
                    .HasName("EmailIndex");

                entity.HasIndex(e => e.NormalizedUserName)
                    .HasName("UserNameIndex")
                    .IsUnique()
                    .HasFilter("([NormalizedUserName] IS NOT NULL)");

                entity.Property(e => e.Afaemployee).HasColumnName("AFAEmployee");

                entity.Property(e => e.Afarole).HasColumnName("AFARole");

                entity.Property(e => e.Email).HasMaxLength(256);

                entity.Property(e => e.NormalizedEmail).HasMaxLength(256);

                entity.Property(e => e.NormalizedUserName).HasMaxLength(256);

                entity.Property(e => e.UserName).HasMaxLength(256);
            });

            modelBuilder.Entity<AspnetPermissions>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("ASPNetPermissions");

                entity.Property(e => e.Afaonly).HasColumnName("AFAOnly");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.PermissionName).HasMaxLength(50);

                entity.Property(e => e.PermissionToolTip).HasMaxLength(1000);
            });

            modelBuilder.Entity<AspnetPermissionsMap>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("ASPNetPermissionsMap");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.PermissionId).HasColumnName("PermissionID");

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<CustomerAccessList>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("CustomerAccessList");

                entity.Property(e => e.CustomerId).HasColumnName("CustomerID");

                entity.Property(e => e.CustomerName).HasMaxLength(100);

                entity.Property(e => e.CustomerNumber).HasMaxLength(50);

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.TimeStamp).HasColumnType("datetime");

                entity.Property(e => e.UserCode).HasMaxLength(50);
            });

            modelBuilder.Entity<TpcdataLink>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("TPCDataLink");

                entity.Property(e => e.DatabaseName).HasMaxLength(50);

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.ServerName).HasMaxLength(50);

                entity.Property(e => e.ThisOne).HasMaxLength(10);
            });

            modelBuilder.Entity<UserAccessLookup>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.LastUpdated).HasColumnType("datetime");

                entity.Property(e => e.ProcessId).HasColumnName("ProcessID");

                entity.Property(e => e.ProgramName).HasMaxLength(200);

                entity.Property(e => e.UserCode).HasMaxLength(50);
            });

            modelBuilder.Entity<CustomerCareDashboardInfo>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<SiteToSystemList>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<CustomerToSiteList>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<CustomerSystemInfo>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<CCAssistant_Systems>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<PartnerContactList>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<PartnerContactListAdditional>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<PartnerInformation>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<PartnerInformationNew>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<CallSummaryResolutions>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<CallSummaryClassList>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<CallSummaryProblems>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<CallSummaryNextSteps>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<CallSummaryAdd>(entity =>
            {
                //entity.HasIndex(e => e.TicketNumber);
                entity.HasNoKey();
            });

            modelBuilder.Entity<CallSummaryUpdate>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<ServiceTicketInfo>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<ServiceTicketInfo2>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<ServiceTicketNotes>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<CustomerContractNotes>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<CustomerContractInfo>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<Customer3GListing>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<ListPanelTypes>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<ListCentralStations>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<ListSitesForCustomer>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<ListSystemsForSite>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<ListRecurringItems>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<ListMaterialItems>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<ListLaborItems>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<CustomerSearchList>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<CustomerSearchListSites>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<CustomerSearchListCentralStation>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<ListSystemTypes>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<ListMultiples>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<CustomerSystemInfoGet>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<Incentive_ADD_Start>(entity =>
            {
                entity.HasNoKey();
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}

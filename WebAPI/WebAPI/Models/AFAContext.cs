using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public partial class AFAContext : DbContext
    {
        public AFAContext()
        {
        }

        public AFAContext(DbContextOptions<AFAContext> options): base(options)
        {
        }

        public virtual DbSet<Incentive_ADD_Start> GetIncentive_ADD_StartResults { get; set; }
        public virtual DbSet<Incentive_ADD_StartE> GetIncentive_ADD_StartEResults { get; set; }
        public virtual DbSet<Incentive_Add_Recurring> GetIncentive_Add_RecurringResults { get; set; }
        public virtual DbSet<Incentive_Add_Equipment> GetIncentive_Add_EquipmentResults { get; set; }
        public virtual DbSet<Incentive_Add_Labor> GetIncentive_Add_LaborResults { get; set; }
        public virtual DbSet<Incentive_Add_Finish> GetIncentive_Add_FinishResults { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                //#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                //optionsBuilder.UseSqlServer("Server=D1CH49N2,1433;Database=AFA;User ID=cstith;Password=TPC$123tpc");
                optionsBuilder.UseSqlServer("Server=10.0.81.29;Database=AFA;User ID=cstith;Password=TPC$123tpc");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Incentive_ADD_Start>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<Incentive_ADD_StartE>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<Incentive_Add_Recurring>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<Incentive_Add_Equipment>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<Incentive_Add_Labor>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<Incentive_Add_Finish>(entity =>
            {
                entity.HasNoKey();
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}

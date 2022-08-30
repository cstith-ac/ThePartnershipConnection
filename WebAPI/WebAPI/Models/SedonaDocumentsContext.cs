using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public partial class SedonaDocumentsContext : DbContext
    {
        public SedonaDocumentsContext()
        {
        }

        public SedonaDocumentsContext(DbContextOptions<SedonaDocumentsContext> options): base(options)
        {
        }

        public virtual DbSet<Customer_Document_ADD> GetCustomer_Document_ADDResults { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                //#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                //optionsBuilder.UseSqlServer("Server=D1CH49N2,1433;Database=SedonaDocuments;User ID=cstith;Password=TPC$123tpc");
                optionsBuilder.UseSqlServer("Server=10.0.81.29;Database=SedonaDocuments;User ID=cstith;Password=TPC$123tpc");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Customer_Document_ADD>(entity =>
            {
                entity.HasNoKey();
                //entity.Ignore(c => c.file_data);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}

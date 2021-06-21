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
    public class CheckboxAutoInsertListRepository : ICheckboxAutoInsertListRepository
    {
        private readonly string _connectionString;
        private List<CheckboxAutoInsertList> _checkboxAutoInsertLists;
        private readonly TPC_DevContext context;

        public CheckboxAutoInsertListRepository(IConfiguration configuration, TPC_DevContext context)
        {
            _checkboxAutoInsertLists = new List<CheckboxAutoInsertList>();
            _connectionString = configuration.GetConnectionString("TPC_DevDatabase");
            this.context = context;
        }

        public async Task<Object> InsertCheckboxAutoInsertList(CheckboxAutoInsertList checkboxAutoInsertList)
        {
            await using(SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                var checkBoxStatus1Param = new SqlParameter("@CheckBoxStatus1", checkboxAutoInsertList.CheckBoxStatus1);
                var checkBoxStatus2Param = new SqlParameter("@CheckBoxStatus2", checkboxAutoInsertList.CheckBoxStatus2);
                var checkBoxStatus3Param = new SqlParameter("@CheckBoxStatus3", checkboxAutoInsertList.CheckBoxStatus3);
                var checkBoxStatus4Param = new SqlParameter("@CheckBoxStatus4", checkboxAutoInsertList.CheckBoxStatus4);
                var checkBoxStatus5Param = new SqlParameter("@CheckBoxStatus5", checkboxAutoInsertList.CheckBoxStatus5);
                var checkBoxStatus6Param = new SqlParameter("@CheckBoxStatus6", checkboxAutoInsertList.CheckBoxStatus6);
                var checkBoxStatus7Param = new SqlParameter("@CheckBoxStatus7", checkboxAutoInsertList.CheckBoxStatus7);
                var checkBoxStatus8Param = new SqlParameter("@CheckBoxStatus8", checkboxAutoInsertList.CheckBoxStatus8);
                var checkBoxStatus9Param = new SqlParameter("@CheckBoxStatus9", checkboxAutoInsertList.CheckBoxStatus9);
                var checkBoxStatus10Param = new SqlParameter("@CheckBoxStatus10", checkboxAutoInsertList.CheckBoxStatus10);
                var checkBoxStatus11Param = new SqlParameter("@CheckBoxStatus11", checkboxAutoInsertList.CheckBoxStatus11);
                var checkBoxStatus12Param = new SqlParameter("@CheckBoxStatus12", checkboxAutoInsertList.CheckBoxStatus12);
                var checkBoxStatus13Param = new SqlParameter("@CheckBoxStatus13", checkboxAutoInsertList.CheckBoxStatus13);
                var checkBoxStatus14Param = new SqlParameter("@CheckBoxStatus14", checkboxAutoInsertList.CheckBoxStatus10);
                var checkBoxStatus15Param = new SqlParameter("@CheckBoxStatus15", checkboxAutoInsertList.CheckBoxStatus15);
                var checkBoxStatus16Param = new SqlParameter("@CheckBoxStatus16", checkboxAutoInsertList.CheckBoxStatus16);
                var checkBoxStatus17Param = new SqlParameter("@CheckBoxStatus17", checkboxAutoInsertList.CheckBoxStatus17);
                var checkBoxStatus18Param = new SqlParameter("@CheckBoxStatus18", checkboxAutoInsertList.CheckBoxStatus18);
                var checkBoxStatus19Param = new SqlParameter("@CheckBoxStatus19", checkboxAutoInsertList.CheckBoxStatus19);
                var checkBoxStatus20Param = new SqlParameter("@CheckBoxStatus20", checkboxAutoInsertList.CheckBoxStatus20);
                var checkBoxStatus21Param = new SqlParameter("@CheckBoxStatus21", checkboxAutoInsertList.CheckBoxStatus21);
                var checkBoxStatus22Param = new SqlParameter("@CheckBoxStatus22", checkboxAutoInsertList.CheckBoxStatus22);
                var checkBoxStatus23Param = new SqlParameter("@CheckBoxStatus23", checkboxAutoInsertList.CheckBoxStatus23);
                var checkBoxStatus24Param = new SqlParameter("@CheckBoxStatus24", checkboxAutoInsertList.CheckBoxStatus24);
                var checkBoxStatus25Param = new SqlParameter("@CheckBoxStatus25", checkboxAutoInsertList.CheckBoxStatus25);
                var checkBoxStatus26Param = new SqlParameter("@CheckBoxStatus26", checkboxAutoInsertList.CheckBoxStatus26);
                var checkBoxStatus27Param = new SqlParameter("@CheckBoxStatus27", checkboxAutoInsertList.CheckBoxStatus27);
                var checkBoxStatus28Param = new SqlParameter("@CheckBoxStatus28", checkboxAutoInsertList.CheckBoxStatus28);
                var checkBoxStatus29Param = new SqlParameter("@CheckBoxStatus29", checkboxAutoInsertList.CheckBoxStatus29);
                var checkBoxStatus30Param = new SqlParameter("@CheckBoxStatus30", checkboxAutoInsertList.CheckBoxStatus30);

                await context.Database.ExecuteSqlRawAsync("EXECUTE [dbo].[CheckboxAutoInsertList] @CheckBoxStatus1, @CheckBoxStatus2, @CheckBoxStatus3, @CheckBoxStatus4, @CheckBoxStatus5, @CheckBoxStatus6, @CheckBoxStatus7, @CheckBoxStatus8, @CheckBoxStatus9, @CheckBoxStatus10, @CheckBoxStatus11, @CheckBoxStatus12, @CheckBoxStatus13, @CheckBoxStatus14, @CheckBoxStatus15, @CheckBoxStatus16, @CheckBoxStatus17, @CheckBoxStatus18, @CheckBoxStatus19, @CheckBoxStatus20, @CheckBoxStatus21, @CheckBoxStatus22, @CheckBoxStatus23, @CheckBoxStatus24, @CheckBoxStatus25, @CheckBoxStatus26, @CheckBoxStatus27, @CheckBoxStatus28, @CheckBoxStatus29, @CheckBoxStatus30", 
                    checkBoxStatus1Param,
                    checkBoxStatus2Param,
                    checkBoxStatus3Param,
                    checkBoxStatus4Param,
                    checkBoxStatus5Param,
                    checkBoxStatus6Param,
                    checkBoxStatus7Param,
                    checkBoxStatus8Param,
                    checkBoxStatus9Param,
                    checkBoxStatus10Param,
                    checkBoxStatus11Param,
                    checkBoxStatus12Param,
                    checkBoxStatus13Param,
                    checkBoxStatus14Param,
                    checkBoxStatus15Param,
                    checkBoxStatus16Param,
                    checkBoxStatus17Param,
                    checkBoxStatus18Param,
                    checkBoxStatus19Param,
                    checkBoxStatus20Param,
                    checkBoxStatus21Param,
                    checkBoxStatus22Param,
                    checkBoxStatus23Param,
                    checkBoxStatus24Param,
                    checkBoxStatus25Param,
                    checkBoxStatus26Param,
                    checkBoxStatus27Param,
                    checkBoxStatus28Param,
                    checkBoxStatus29Param,
                    checkBoxStatus30Param);
                
                return (checkBoxStatus1Param.Value,checkBoxStatus30Param.Value);
            }
        }
    }
}

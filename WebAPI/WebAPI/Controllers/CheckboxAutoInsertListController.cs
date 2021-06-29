using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using WebAPI.Models;
using WebAPI.Repository;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckboxAutoInsertListController : ControllerBase
    {
        private ILogger _logger;
        //private ICheckboxAutoInsertListRepository _repository;
        TPC_DevContext db = new TPC_DevContext();
        string connectionString = "";

        public CheckboxAutoInsertListController(
            IConfiguration configuration,
            ILogger<CheckboxAutoInsertListController> logger
            //ICheckboxAutoInsertListRepository repository
            )
        {
            connectionString = configuration.GetConnectionString("TPC_DevDatabase");
            _logger = logger;
            //_repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        //[HttpPost]
        //public async Task<IActionResult> InsertCheckboxAutoInsertList([FromBody] CheckboxAutoInsertList checkboxAutoInsertList)
        //{
        //    return Ok(await _repository.InsertCheckboxAutoInsertList(checkboxAutoInsertList));
        //}

        //[HttpPost]
        //public CheckboxAutoInsertList InsertCheckboxAutoInsertList(int id)
        //{
        //    return db.CheckboxAutoInsertLists.FromSqlRaw("EXEC dbo.CheckboxAutoInsertList @CheckBoxStatus1={0}, @CheckBoxStatus2={0}, @CheckBoxStatus3={0}, @CheckBoxStatus4={0}, @CheckBoxStatus5={0}, @CheckBoxStatus6={0}, @CheckBoxStatus7={0}, @CheckBoxStatus8={0}, @CheckBoxStatus9={0}, @CheckBoxStatus10={0}, @CheckBoxStatus11={0}, @CheckBoxStatus12={0}, @CheckBoxStatus13={0}, @CheckBoxStatus14={0}, @CheckBoxStatus15={0}, @CheckBoxStatus16={0}, @CheckBoxStatus17={0}, @CheckBoxStatus18={0}, @CheckBoxStatus19={0}, @CheckBoxStatus20={0}, @CheckBoxStatus21={0}, @CheckBoxStatus22={0}, @CheckBoxStatus23={0}, @CheckBoxStatus24={0}, @CheckBoxStatus25={0}, @CheckBoxStatus26={0}, @CheckBoxStatus27={0}, @CheckBoxStatus28={0}, @CheckBoxStatus29={0}, @CheckBoxStatus30={0}", id).ToListAsync().Result.FirstOrDefault();
        //}

        [HttpPost]
        public async Task<Object> InsertCheckboxAutoInsertList(CheckboxAutoInsertList checkboxAutoInsertList)
        {
            var lists = new List<CheckboxAutoInsertList>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                SqlCommand command = new SqlCommand();

                //var installCompanyIDParam = new SqlParameter("@InstallCompanyID", 374);
                //var checkBoxStatus1Param = new SqlParameter("@CheckBoxStatus1", "Y");
                //var checkBoxStatus2Param = new SqlParameter("@CheckBoxStatus2", "N");
                //var checkBoxStatus3Param = new SqlParameter("@CheckBoxStatus3", "N");
                //var checkBoxStatus4Param = new SqlParameter("@CheckBoxStatus4", "y");
                //var checkBoxStatus5Param = new SqlParameter("@CheckBoxStatus5", "N");
                //var checkBoxStatus6Param = new SqlParameter("@CheckBoxStatus6", "Y");
                //var checkBoxStatus7Param = new SqlParameter("@CheckBoxStatus7", "N");
                //var checkBoxStatus8Param = new SqlParameter("@CheckBoxStatus8", "N");
                //var checkBoxStatus9Param = new SqlParameter("@CheckBoxStatus9", "N");
                //var checkBoxStatus10Param = new SqlParameter("@CheckBoxStatus10", "N");
                //var checkBoxStatus11Param = new SqlParameter("@CheckBoxStatus11", "N");
                //var checkBoxStatus12Param = new SqlParameter("@CheckBoxStatus12", "N");
                //var checkBoxStatus13Param = new SqlParameter("@CheckBoxStatus13", "N");
                //var checkBoxStatus14Param = new SqlParameter("@CheckBoxStatus14", "N");
                //var checkBoxStatus15Param = new SqlParameter("@CheckBoxStatus15", "N");
                //var checkBoxStatus16Param = new SqlParameter("@CheckBoxStatus16", "N");
                //var checkBoxStatus17Param = new SqlParameter("@CheckBoxStatus17", "N");
                //var checkBoxStatus18Param = new SqlParameter("@CheckBoxStatus18", "N");
                //var checkBoxStatus19Param = new SqlParameter("@CheckBoxStatus19", "N");
                //var checkBoxStatus20Param = new SqlParameter("@CheckBoxStatus20", "N");
                //var checkBoxStatus21Param = new SqlParameter("@CheckBoxStatus21", "N");
                //var checkBoxStatus22Param = new SqlParameter("@CheckBoxStatus22", "N");
                //var checkBoxStatus23Param = new SqlParameter("@CheckBoxStatus23", "N");
                //var checkBoxStatus24Param = new SqlParameter("@CheckBoxStatus24", "N");
                //var checkBoxStatus25Param = new SqlParameter("@CheckBoxStatus25", "N");
                //var checkBoxStatus26Param = new SqlParameter("@CheckBoxStatus26", "N");
                //var checkBoxStatus27Param = new SqlParameter("@CheckBoxStatus27", "N");
                //var checkBoxStatus28Param = new SqlParameter("@CheckBoxStatus28", "N");
                //var checkBoxStatus29Param = new SqlParameter("@CheckBoxStatus29", "N");
                //var checkBoxStatus30Param = new SqlParameter("@CheckBoxStatus30", "N");

                var installCompanyIDParam = new SqlParameter("@InstallCompanyID", checkboxAutoInsertList.InstallCompanyID);
                // installCompanyIDParam.SqlDbType = System.Data.SqlDbType.Int;
                var checkBoxStatus1Param = new SqlParameter("@CheckBoxStatus1", checkboxAutoInsertList.CheckBoxStatus1);
                //command.Parameters.AddWithValue("@CheckBoxStatus1", checkboxAutoInsertList.CheckBoxStatus1);
                //checkBoxStatus1Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                //checkBoxStatus1Param.Direction = System.Data.ParameterDirection.Input;
                var checkBoxStatus2Param = new SqlParameter("@CheckBoxStatus2", checkboxAutoInsertList.CheckBoxStatus2);
                // checkBoxStatus2Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus3Param = new SqlParameter("@CheckBoxStatus3", checkboxAutoInsertList.CheckBoxStatus3);
                // checkBoxStatus3Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus4Param = new SqlParameter("@CheckBoxStatus4", checkboxAutoInsertList.CheckBoxStatus4);
                // checkBoxStatus4Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus5Param = new SqlParameter("@CheckBoxStatus5", checkboxAutoInsertList.CheckBoxStatus5);
                // checkBoxStatus5Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus6Param = new SqlParameter("@CheckBoxStatus6", checkboxAutoInsertList.CheckBoxStatus6);
                //checkBoxStatus6Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus7Param = new SqlParameter("@CheckBoxStatus7", checkboxAutoInsertList.CheckBoxStatus7);
                //checkBoxStatus7Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus8Param = new SqlParameter("@CheckBoxStatus8", checkboxAutoInsertList.CheckBoxStatus8);
                //checkBoxStatus8Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus9Param = new SqlParameter("@CheckBoxStatus9", checkboxAutoInsertList.CheckBoxStatus9);
                //checkBoxStatus9Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus10Param = new SqlParameter("@CheckBoxStatus10", checkboxAutoInsertList.CheckBoxStatus10);
                //checkBoxStatus10Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus11Param = new SqlParameter("@CheckBoxStatus11", checkboxAutoInsertList.CheckBoxStatus11);
                //checkBoxStatus11Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus12Param = new SqlParameter("@CheckBoxStatus12", checkboxAutoInsertList.CheckBoxStatus12);
                //checkBoxStatus12Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus13Param = new SqlParameter("@CheckBoxStatus13", checkboxAutoInsertList.CheckBoxStatus13);
                //checkBoxStatus13Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus14Param = new SqlParameter("@CheckBoxStatus14", checkboxAutoInsertList.CheckBoxStatus14);
                //checkBoxStatus14Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus15Param = new SqlParameter("@CheckBoxStatus15", checkboxAutoInsertList.CheckBoxStatus15);
                //checkBoxStatus15Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus16Param = new SqlParameter("@CheckBoxStatus16", checkboxAutoInsertList.CheckBoxStatus16);
                //checkBoxStatus16Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus17Param = new SqlParameter("@CheckBoxStatus17", checkboxAutoInsertList.CheckBoxStatus17);
                //checkBoxStatus17Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus18Param = new SqlParameter("@CheckBoxStatus18", checkboxAutoInsertList.CheckBoxStatus18);
                //checkBoxStatus18Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus19Param = new SqlParameter("@CheckBoxStatus19", checkboxAutoInsertList.CheckBoxStatus19);
                //checkBoxStatus19Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus20Param = new SqlParameter("@CheckBoxStatus20", checkboxAutoInsertList.CheckBoxStatus20);
                //checkBoxStatus20Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus21Param = new SqlParameter("@CheckBoxStatus21", checkboxAutoInsertList.CheckBoxStatus21);
                //checkBoxStatus21Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus22Param = new SqlParameter("@CheckBoxStatus22", checkboxAutoInsertList.CheckBoxStatus22);
                //checkBoxStatus22Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus23Param = new SqlParameter("@CheckBoxStatus23", checkboxAutoInsertList.CheckBoxStatus23);
                //checkBoxStatus23Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus24Param = new SqlParameter("@CheckBoxStatus24", checkboxAutoInsertList.CheckBoxStatus24);
                //checkBoxStatus24Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus25Param = new SqlParameter("@CheckBoxStatus25", checkboxAutoInsertList.CheckBoxStatus25);
                //checkBoxStatus25Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus26Param = new SqlParameter("@CheckBoxStatus26", checkboxAutoInsertList.CheckBoxStatus26);
                //checkBoxStatus26Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus27Param = new SqlParameter("@CheckBoxStatus27", checkboxAutoInsertList.CheckBoxStatus27);
                //checkBoxStatus27Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus28Param = new SqlParameter("@CheckBoxStatus28", checkboxAutoInsertList.CheckBoxStatus28);
                //checkBoxStatus28Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus29Param = new SqlParameter("@CheckBoxStatus29", checkboxAutoInsertList.CheckBoxStatus29);
                //checkBoxStatus29Param.SqlDbType = System.Data.SqlDbType.NVarChar;
                var checkBoxStatus30Param = new SqlParameter("@CheckBoxStatus30", checkboxAutoInsertList.CheckBoxStatus30);
                //checkBoxStatus30Param.SqlDbType = System.Data.SqlDbType.NVarChar;

                var result = await db.CheckboxAutoInsertLists.FromSqlRaw("EXECUTE [dbo].[CheckboxAutoInsertList] @InstallCompanyID, @CheckBoxStatus1, @CheckBoxStatus2, @CheckBoxStatus3, @CheckBoxStatus4, @CheckBoxStatus5, @CheckBoxStatus6, @CheckBoxStatus7, @CheckBoxStatus8, @CheckBoxStatus9, @CheckBoxStatus10, @CheckBoxStatus11, @CheckBoxStatus12, @CheckBoxStatus13, @CheckBoxStatus14, @CheckBoxStatus15, @CheckBoxStatus16, @CheckBoxStatus17, @CheckBoxStatus18, @CheckBoxStatus19, @CheckBoxStatus20, @CheckBoxStatus21, @CheckBoxStatus22, @CheckBoxStatus23, @CheckBoxStatus24, @CheckBoxStatus25, @CheckBoxStatus26, @CheckBoxStatus27, @CheckBoxStatus28, @CheckBoxStatus29, @CheckBoxStatus30", installCompanyIDParam, checkBoxStatus1Param, checkBoxStatus2Param, checkBoxStatus3Param, checkBoxStatus4Param, checkBoxStatus5Param, checkBoxStatus6Param, checkBoxStatus7Param, checkBoxStatus8Param, checkBoxStatus9Param, checkBoxStatus10Param, checkBoxStatus11Param, checkBoxStatus12Param, checkBoxStatus13Param, checkBoxStatus14Param, checkBoxStatus15Param, checkBoxStatus16Param, checkBoxStatus17Param, checkBoxStatus18Param, checkBoxStatus19Param, checkBoxStatus20Param, checkBoxStatus21Param, checkBoxStatus22Param, checkBoxStatus23Param, checkBoxStatus24Param, checkBoxStatus25Param, checkBoxStatus26Param, checkBoxStatus27Param, checkBoxStatus28Param, checkBoxStatus29Param, checkBoxStatus30Param).ToListAsync();

                List<CheckboxAutoInsertList> Lst = result.Select(s => new CheckboxAutoInsertList
                {
                    //CheckBoxStatus1 = s.CheckBoxStatus1,
                    //CheckBoxStatus2 = s.CheckBoxStatus2,
                    ItemID = s.ItemID,
                    ItemType = s.ItemType,
                    Item_Code = s.Item_Code,
                    ItemDescription = s.ItemDescription,
                    DefaultAmount = s.DefaultAmount
                }).ToList();

                return Lst;
            }
        }
    }
}

using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models;

namespace WebAPI.Repository
{
    public class Customer_Document_ADDRepository : ICustomer_Document_ADDRepository
    {
        private readonly string _connectionString;
        private List<Customer_Document_ADD> _customer_Document_ADDResults;
        private readonly SedonaDocumentsContext context;

        public Customer_Document_ADDRepository(
            IConfiguration configuration, 
            SedonaDocumentsContext context)
        {
            _customer_Document_ADDResults = new List<Customer_Document_ADD>();
            _connectionString = configuration.GetConnectionString("SedonaDocuments_Database");
            this.context = context;
        }

        public async Task<int> InsertCustomer_Document_ADDResult(Customer_Document_ADD customer_Document_ADDED)
        {
            await using(SqlConnection connection = new SqlConnection(_connectionString))
            {
                //SqlCommand cmd = new SqlCommand();//new stuff
                //cmd.CommandType = CommandType.StoredProcedure;//new stuff

                //connection.Open();

                // define SqlParameters for the other two params to be passed
                var company_idParam = new SqlParameter("@company_id", customer_Document_ADDED.company_id);
                var customer_idParam = new SqlParameter("@customer_id", customer_Document_ADDED.customer_id);
                var customer_site_idParam = new SqlParameter("@customer_site_id", customer_Document_ADDED.customer_site_id);
                var customer_system_idParam = new SqlParameter("@customer_system_id", customer_Document_ADDED.customer_system_id);
                var job_idParam = new SqlParameter("@job_id", customer_Document_ADDED.job_id);
                var security_levelParam = new SqlParameter("@security_level", customer_Document_ADDED.security_level);

                if (customer_Document_ADDED.file_name == null || customer_Document_ADDED.file_name.Length == 0)
                {
                    throw new System.Exception("There's no file name!");
                }
                var file_nameParam = new SqlParameter("@file_name", customer_Document_ADDED.file_name);
                var file_sizeParam = new SqlParameter("@file_size", customer_Document_ADDED.file_size);

                if (customer_Document_ADDED.upload_date == null)
                {
                    throw new System.Exception("There's no date!");
                }
                var upload_dateParam = new SqlParameter("@upload_date", customer_Document_ADDED.upload_date);
                var document_extParam = new SqlParameter("@document_ext", customer_Document_ADDED.document_ext);
                var user_codeParam = new SqlParameter("@user_code", customer_Document_ADDED.user_code);
                var user_descriptionParam = new SqlParameter("@user_description", customer_Document_ADDED.user_description);
                var reference1Param = new SqlParameter("@reference1", customer_Document_ADDED.reference1);
                var reference2Param = new SqlParameter("@reference2", customer_Document_ADDED.reference2);
                var reference3Param = new SqlParameter("@reference3", customer_Document_ADDED.reference3);
                var reference4Param = new SqlParameter("@reference4", customer_Document_ADDED.reference4);

                if (customer_Document_ADDED.file_data == null || customer_Document_ADDED.file_data.Length == 0)
                {
                    throw new System.Exception("There's no file data!");
                }
                var file_dataParam = new SqlParameter("@file_data", SqlDbType.Image, customer_Document_ADDED.file_data.Length);
                file_dataParam.Value = customer_Document_ADDED.file_data;
                //var file_dataParam = new SqlParameter("@file_data", customer_Document_ADDED.file_data);

                //cmd.Parameters.Add("@file_data", SqlDbType.Binary).Value = file_dataParam;
                //cmd.Parameters.AddWithValue("@file_data", SqlDbType.Image).Value = file_dataParam;

                //using (var memoryStream = new MemoryStream())
                //{
                //    await file_dataParam
                //}

                //file_dataParam.SqlDbType = SqlDbType.Image;

                // define the output parameter that needs to be retained
                // for the Id created when the Stored Procedure executes 
                // the INSERT command
                var document_idParam = new SqlParameter("@document_id", SqlDbType.Int);

                // the direction defines what kind of parameter we're passing
                // it can be one of:
                // Input
                // Output
                // InputOutput -- which does pass a value to Stored Procedure and retains a new state
                document_idParam.Direction = ParameterDirection.Output;

                // we can also use context.Database.ExecuteSqlCommand() or awaitable ExecuteSqlCommandAsync()
                // which also produces the same result - but the method is now marked obselete
                // so we use ExecuteSqlRawAsync() instead

                // we're using the awaitable version since GetOrCreateUserAsync() method is marked async
                await context.Database.ExecuteSqlRawAsync(
                    "EXECUTE [dbo].[Customer_Document_ADD_incentive] @company_id, @customer_id, @customer_site_id, @customer_system_id, @job_id, @security_level, @file_name, @file_size, @upload_date, @document_ext, @user_code, @user_description, @reference1, @reference2, @reference3, @reference4, @file_data, @document_id out",
                    company_idParam,
                    customer_idParam,
                    customer_site_idParam,
                    customer_system_idParam,
                    job_idParam,
                    security_levelParam,
                    file_nameParam,
                    file_sizeParam,
                    upload_dateParam,
                    document_extParam,
                    user_codeParam,
                    user_descriptionParam,
                    reference1Param,
                    reference2Param,
                    reference3Param,
                    reference4Param,
                    file_dataParam,
                    document_idParam);

                // the userIdParam which represents the Output param
                // now holds the Id of the new user and is an Object type
                // so we convert it to an Integer and send
                return Convert.ToInt32(document_idParam.Value);
            }
        }
    }
}

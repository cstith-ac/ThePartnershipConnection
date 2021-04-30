using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using WebAPI.Models;
using Microsoft.AspNetCore.Http.Extensions;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadFilesTestController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        private readonly IWebHostEnvironment _webHostEnvironment;
        UploadFilesTestContext db = new UploadFilesTestContext();

        public UploadFilesTestController(
            IWebHostEnvironment webHostEnvironment,
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager,
            IOptions<ApplicationSettings> appSettings)
        {
            _userManager = userManager;
            connectionString = configuration.GetConnectionString("UnpackDocs_Database");
            _appSettings = appSettings.Value;
            _webHostEnvironment = webHostEnvironment;
        }

        //public async Task<IActionResult> OnPostUploadAsync()
        //{
        //    await using (SqlConnection connection = new SqlConnection(connectionString))
        //    {
        //        using (var memoryStream = new MemoryStream())
        //        {
        //            var f = Request.Form.Files[0];
        //            await f.CopyToAsync(memoryStream);

        //            // Upload the file if less than 2 MB
        //            if (memoryStream.Length < 2097152)
        //            {
        //                var file = new TestDocUpload()
        //                {
        //                    file_data = memoryStream.ToArray()
        //                };

        //                db.TestDocUploads.Add(file);

        //                await db.SaveChangesAsync();
        //            }
        //            else
        //            {
        //                ModelState.AddModelError("File", "The file is too large.");
        //            }
        //        }

        //        return Ok();
        //    }
        //}

        [HttpPost, DisableRequestSizeLimit]
        public async Task<IActionResult> UploadToDatabase(List<IFormFile> files)
        {
            try
            {
                await using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    var file = Request.Form.Files[0];
                    //foreach (var file in files)
                    //{
                    //    var fileName = Path.GetFileNameWithoutExtension(file.FileName);
                    //    var extension = Path.GetExtension(file.FileName);
                    //    var fileModel = new TestDocUpload();
                    //    using (var dataStream = new MemoryStream())
                    //    {
                    //        await file.CopyToAsync(dataStream);
                    //        fileModel.file_data = dataStream.ToArray();
                    //    }
                    //    db.TestDocUploads.Add(fileModel);
                    //    db.SaveChanges();
                    //}

                    var fileName = Path.GetFileNameWithoutExtension(file.FileName);
                    var extension = Path.GetExtension(file.FileName);

                    SqlCommand cmd = new SqlCommand();//new stuff
                    cmd.CommandType = CommandType.StoredProcedure;//new stuff

                    connection.Open();
                    //var file_dataParam = new SqlParameter("@file_data", SqlDbType.Bit);//null, why?
                    //cmd.Parameters.Add("@file_data", SqlDbType.Binary).Value = file_dataParam;
                    //cmd.Parameters.AddWithValue("@file_data", SqlDbType.Binary);

                    var fileModel = new TestDocUpload();//file_data is null

                    // Converts image file into byte[]
                    //byte[] imgData = files.ReadAllBytes(files);

                    //using (var dataStream = new MemoryStream())
                    //{
                    //    await file.CopyToAsync(dataStream);
                    //    fileModel.file_data = dataStream.ToArray();
                    //};
                    var file_dataParam = new SqlParameter("@file_data", SqlDbType.Image);//null, why?
                    cmd.Parameters.Add("@file_data", SqlDbType.Binary).Value = file_dataParam;
                    var getUploadsFilesTest = await db.TestDocUploads.FromSqlRaw("EXECUTE [dbo].[TestDocUpload]").ToListAsync();
                    getUploadsFilesTest.Add(fileModel);

                    //var fileName = Path.GetFileNameWithoutExtension(file.FileName);
                    //var extension = Path.GetExtension(file.FileName);
                    //var fileModel = new TestDocUpload();
                    //using (var dataStream = new MemoryStream())
                    //{
                    //    await file.CopyToAsync(dataStream);
                    //    fileModel.file_data = dataStream.ToArray();
                    //};
                    //var getUploadsFilesTest = await db.TestDocUploads.FromSqlRaw("EXECUTE [dbo].[TestDocUpload]").ToListAsync();
                    //getUploadsFilesTest.Add(fileModel);

                    //getUploadsFilesTest.SaveChanges();
                    return Ok();
                    //var file = Request.Form.Files[0];
                    //var folderName = await db.TestDocUploads.FromSqlRaw("EXECUTE dbo.TestDocUpload");
                    ////var folderName = Path.Combine("Resources", "Images");
                    //var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                    //if (file.Length > 0)
                    //{
                    //    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    //    var fullPath = Path.Combine(pathToSave, fileName);
                    //    var dbPath = Path.Combine(folderName, fileName);

                    //    using (var stream = new FileStream(fullPath, FileMode.Create))
                    //    {
                    //        file.CopyTo(stream);
                    //    }

                    //    return Ok(new { dbPath });
                    //}
                    //else
                    //{
                    //    return BadRequest();
                    //}
                }

                // var file = Request.Form.Files[0];
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        //public byte[] file_data { get; set; }
        //[HttpPost]
        //public async Task<IActionResult> SaveFileToDB(List<IFormFile> files)
        //{
        //    using (SqlConnection conn = new SqlConnection("Server=D1CH49N2,1433;Database=UnpackDocs;User ID=cstith;Password=TPC$123tpc"))
        //    {
        //        SqlCommand cmd = new SqlCommand();
        //        cmd.CommandType = CommandType.StoredProcedure;
        //        cmd.CommandText = "TestDocUpload";
        //        cmd.Connection = conn;

        //        foreach (var file in files)
        //        {
        //            //var fileModel = new TestDocUpload
        //            //{
        //            //    file_data = System.IO.
        //            //};
        //            using (var dataStream = new MemoryStream())
        //            {
        //                //await file_data.CopyTo(dataStream);
        //                await file.CopyToAsync(dataStream);
        //                file_data = dataStream.ToArray();
        //            }

        //            //cmd.Parameters.AddWithValue("@file_data", file_data);
        //            cmd.Parameters.Add("@file_data", SqlDbType.Image).Value = file_data;

        //            try
        //            {
        //                conn.Open();
        //                cmd.ExecuteNonQuery();
        //                return Ok();
        //            }
        //            catch (Exception ex)
        //            {
        //                return BadRequest(ex);
        //            }
        //            finally
        //            {
        //                conn.Close();
        //                cmd.Dispose();
        //                conn.Dispose();
        //            }
        //        }
        //        return NotFound();

        //        //using (var dataStream = new MemoryStream())
        //        //{
        //        //    await file_data.CopyToAsync(dataStream);
        //        //    file_data = dataStream.ToArray();
        //        //}

        //        //cmd.Parameters.AddWithValue("@file_data", file_data);
                

        //        //try
        //        //{
        //        //    conn.Open();
        //        //    cmd.ExecuteNonQuery();
        //        //    return Ok();
        //        //}
        //        //catch (Exception ex)
        //        //{
        //        //    return BadRequest(ex);
        //        //}
        //        //finally
        //        //{
        //        //    conn.Close();
        //        //    cmd.Dispose();
        //        //    conn.Dispose();
        //        //}
        //    }
        //}
    }
}

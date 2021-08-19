using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models;
using WebAPI.Repository;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Customer_Document_ADDController : ControllerBase
    {
        private ILogger _logger;
        private ICustomer_Document_ADDRepository _repository;

        public Customer_Document_ADDController(
            ILogger<Customer_Document_ADDController> logger,
            ICustomer_Document_ADDRepository repository)
        {
            _logger = logger;
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpPost]
        public async Task<IActionResult> InsertCustomer_Document_ADDResult([FromForm] Customer_Document_ADD customer_Document_ADDED)
        {
            //var reqFile = Request.Form.Files.First();

            //using (Stream stream = reqFile.OpenReadStream())
            //{
            //    using (var binaryReader = new BinaryReader(stream))
            //    {
            //        var fileContent = binaryReader.ReadBytes((int)stream.Length);
            //        customer_Document_ADDED.file_data = fileContent;
            //        var result = await _repository.InsertCustomer_Document_ADDResult(customer_Document_ADDED);
            //        return Ok(result);
            //    }
            //}

            //for (var i = 0; i < Request.Form.Files.Count; i++)
            //{
            //    var reqFile=i;
            //    using (Stream stream = reqFile.OpenReadStream())
            //    {
            //        using (var binaryReader = new BinaryReader(stream))
            //        {
            //            var fileContent = binaryReader.ReadBytes((int)stream.Length);
            //            customer_Document_ADDED.file_data = fileContent;
            //        }
            //    }
            //}

            foreach (var reqFile in Request.Form.Files)
            {
                for (int i = 0; i < reqFile.Length; i++)
                {
                    using (Stream stream = reqFile.OpenReadStream())
                    {
                        using (var binaryReader = new BinaryReader(stream))
                        {
                            var fileContent = binaryReader.ReadBytes((int)stream.Length);
                            customer_Document_ADDED.file_data = fileContent;
                        }
                    }
                }
               
            }
            var result = await _repository.InsertCustomer_Document_ADDResult(customer_Document_ADDED);
            return Ok(result);
        }

        //[HttpPost]
        //public async Task<IActionResult> InsertCustomer_Document_ADDResult([FromForm] Customer_Document_ADD customer_Document_ADDED)
        //{
        //    try
        //    {
        //        if (customer_Document_ADDED == null)
        //        {
        //            return BadRequest("object is null");
        //        }
        //        var reqFile = Request.Form.Files;
        //        var customerDocument = new Customer_Document_ADD()
        //        {
        //            company_id = customer_Document_ADDED.company_id,
        //            customer_id = customer_Document_ADDED.customer_id,
        //            customer_site_id = customer_Document_ADDED.customer_site_id,
        //            customer_system_id = customer_Document_ADDED.customer_system_id,
        //            job_id = customer_Document_ADDED.job_id,
        //            security_level = customer_Document_ADDED.security_level,
        //            file_name = customer_Document_ADDED.file_name,
        //            file_size = customer_Document_ADDED.file_size,
        //            upload_date = customer_Document_ADDED.upload_date,
        //            document_ext = customer_Document_ADDED.document_ext,
        //            user_code = customer_Document_ADDED.user_code,
        //            user_description = customer_Document_ADDED.user_description,
        //            reference1 = customer_Document_ADDED.reference1,
        //            reference2 = customer_Document_ADDED.reference2,
        //            reference3 = customer_Document_ADDED.reference3,
        //            reference4 = customer_Document_ADDED.reference4,
        //            file_data = customer_Document_ADDED.file_data,
        //            document_id = customer_Document_ADDED.document_id
        //        };

        //        var response = await _repository.InsertCustomer_Document_ADDResult(customer_Document_ADDED);
        //        return Ok(response);
        //    }
        //    catch (Exception exp)
        //    {
        //        return BadRequest(exp);
        //    }
        //}

        //[HttpPost]
        //public async Task<IActionResult> InsertCustomer_Document_ADDResult()
        //{
        //    var files = Request.Form.Files;

        //    foreach (var file in files)
        //    {

        //    }

        //    return Ok(201);
        //}
        //public async Task InsertCustomer_Document_ADDResult(IFormFile file)
        //{
        //    if (file == null) throw new Exception("File is null");
        //    if (file.Length == 0) throw new Exception("File is empty");

        //    using (Stream stream = file.OpenReadStream())
        //    {
        //        using (var binaryReader = new BinaryReader(stream))
        //        {
        //            var fileContent = binaryReader.ReadBytes((int)file.Length);
        //            await this.InsertCustomer_Document_ADDResult(file);
        //        }
        //    }
        //}

        //[HttpPost]
        //public async Task<IActionResult> InsertCustomer_Document_ADDResult([FromBody] Customer_Document_ADD customer_Document_ADDED)
        //{
        //    return Ok(await _repository.InsertCustomer_Document_ADDResult(customer_Document_ADDED));
        //}
    }
}

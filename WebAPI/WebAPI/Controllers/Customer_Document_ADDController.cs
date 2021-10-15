using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics;
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
        [DisableRequestSizeLimit]
        public async Task<IActionResult> InsertCustomer_Document_ADDResult([FromForm] Customer_Document_ADD customer_Document_ADDED)
        {
            // Create new stopwatch
            // Stopwatch stopwatch = new Stopwatch();

            // Begin timing
            // stopwatch.Start();

            foreach (var reqFile in Request.Form.Files)
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

            // var elapsed = stopwatch.Elapsed;

            var result = await _repository.InsertCustomer_Document_ADDResult(customer_Document_ADDED);
            
            // Console.WriteLine("Time elapsed: {0:hh\\:mm\\:ss}", stopwatch.Elapsed);

            return Ok(result);
        }
    }
}

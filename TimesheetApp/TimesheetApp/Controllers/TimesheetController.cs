using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using TimesheetApp.Models;
using TimesheetApp.Services;
namespace TimesheetApp.Controllers
{
    //creating a DTO class
    public class TimesheetCreateDto
    {
        [Required(ErrorMessage = "Date is required")]
        public DateTime Date { get; set; }

        [Required(ErrorMessage = "Hours worked is required")]
        [Range(1, 24, ErrorMessage = "Hours worked must be between 1 and 24")]
        public int HoursWorked { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(250)]
        public string Description { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TimesheetsController : ControllerBase
    {
        private readonly ITimesheetService _timesheetService;

        public TimesheetsController(ITimesheetService timesheetService)
        {
            _timesheetService = timesheetService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyTimesheets()
        {
            var employeeId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var timesheets = await _timesheetService.GetTimesheetsForEmployeeAsync(employeeId);
            return Ok(timesheets);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTimesheetById(int id)
        {
            var timesheet = await _timesheetService.GetTimesheetByIdAsync(id);
            if (timesheet == null)
            {
                return NotFound();
            }

            var employeeId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (timesheet.EmployeeId != employeeId)
            {
                return Forbid();
            }
            return Ok(timesheet);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TimesheetCreateDto timesheetDto)
        {
            var employeeId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var timesheet = new Timesheet
            {
                EmployeeId = employeeId,
                Date = timesheetDto.Date,
                HoursWorked = timesheetDto.HoursWorked,
                Description = timesheetDto.Description
            };

            var newTimesheet = await _timesheetService.AddTimesheetAsync(timesheet);
            return CreatedAtAction(nameof(GetTimesheetById), new { id = newTimesheet.TimesheetId }, newTimesheet);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TimesheetCreateDto timesheetDto)
        {
            var employeeId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var existingTimesheet = await _timesheetService.GetTimesheetByIdAsync(id);
            if (existingTimesheet == null || existingTimesheet.EmployeeId != employeeId)
            {
                return Forbid();
            }

            existingTimesheet.Date = timesheetDto.Date;
            existingTimesheet.HoursWorked = timesheetDto.HoursWorked;
            existingTimesheet.Description = timesheetDto.Description;

            await _timesheetService.UpdateTimesheetAsync(existingTimesheet);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var employeeId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var existingTimesheet = await _timesheetService.GetTimesheetByIdAsync(id);
            if (existingTimesheet == null || existingTimesheet.EmployeeId != employeeId)
            {
                return Forbid();
            }

            await _timesheetService.DeleteTimesheetAsync(id);
            return NoContent();
        }

    }
}

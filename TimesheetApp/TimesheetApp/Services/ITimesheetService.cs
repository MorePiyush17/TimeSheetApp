using TimesheetApp.Models;
namespace TimesheetApp.Services
{

    public interface ITimesheetService
    {
        Task<Timesheet> GetTimesheetByIdAsync(int id);
        Task<IEnumerable<Timesheet>> GetTimesheetsForEmployeeAsync(int employeeId);
        Task<Timesheet> AddTimesheetAsync(Timesheet timesheet);
        Task UpdateTimesheetAsync(Timesheet timesheet);
        Task DeleteTimesheetAsync(int id);
        Task<IEnumerable<Timesheet>> GetAllTimesheetsAsync();

    }
}

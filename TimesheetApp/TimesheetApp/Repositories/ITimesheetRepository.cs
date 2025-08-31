using TimesheetApp.Models;
namespace TimesheetApp.Repositories
{

    public interface ITimesheetRepository
    {
        Task<Timesheet> GetByIdAsync(int id);
        Task<IEnumerable<Timesheet>> GetByEmployeeIdAsync(int employeeId);
        Task AddAsync(Timesheet timesheet);
        void Update(Timesheet timesheet);
        void Delete(Timesheet timesheet);
        Task SaveChangesAsync();
        Task<IEnumerable<Timesheet>> GetAllAsync();


    }
}

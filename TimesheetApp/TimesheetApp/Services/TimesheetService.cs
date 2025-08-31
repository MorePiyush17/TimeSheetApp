using TimesheetApp.Models;
using TimesheetApp.Repositories;
namespace TimesheetApp.Services
{

    public class TimesheetService : ITimesheetService
    {
        private readonly ITimesheetRepository _timesheetRepository;

        public TimesheetService(ITimesheetRepository timesheetRepository)
        {
            _timesheetRepository = timesheetRepository;
        }

        public async Task<Timesheet> GetTimesheetByIdAsync(int id)
        {
            return await _timesheetRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Timesheet>> GetTimesheetsForEmployeeAsync(int employeeId)
        {
            return await _timesheetRepository.GetByEmployeeIdAsync(employeeId);
        }

        public async Task<Timesheet> AddTimesheetAsync(Timesheet timesheet)
        {
            await _timesheetRepository.AddAsync(timesheet);
            await _timesheetRepository.SaveChangesAsync();
            return timesheet;
        }

        public async Task UpdateTimesheetAsync(Timesheet timesheet)
        {
            _timesheetRepository.Update(timesheet);
            await _timesheetRepository.SaveChangesAsync();
        }

        public async Task DeleteTimesheetAsync(int id)
        {
            var timesheet = await _timesheetRepository.GetByIdAsync(id);
            if (timesheet != null)
            {
                _timesheetRepository.Delete(timesheet);
                await _timesheetRepository.SaveChangesAsync();
            }


        }
        public async Task<IEnumerable<Timesheet>> GetAllTimesheetsAsync()
        {
            return await _timesheetRepository.GetAllAsync();
        }

    }
}

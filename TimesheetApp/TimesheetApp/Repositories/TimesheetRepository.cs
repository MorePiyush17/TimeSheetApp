using Microsoft.EntityFrameworkCore;
using TimesheetApp.Data;
using TimesheetApp.Models;
namespace TimesheetApp.Repositories
{

    public class TimesheetRepository : ITimesheetRepository
    {
        private readonly AppDbContext _context;

        public TimesheetRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Timesheet> GetByIdAsync(int id)
        {
            return await _context.Timesheets.FindAsync(id);
        }

        public async Task<IEnumerable<Timesheet>> GetByEmployeeIdAsync(int employeeId)
        {
            return await _context.Timesheets.Where(t => t.EmployeeId == employeeId).ToListAsync();
        }

        public async Task AddAsync(Timesheet timesheet)
        {
            await _context.Timesheets.AddAsync(timesheet);
        }

        public void Update(Timesheet timesheet)
        {
            _context.Timesheets.Update(timesheet);
        }

        public void Delete(Timesheet timesheet)
        {
            _context.Timesheets.Remove(timesheet);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<Timesheet>> GetAllAsync()
        {
            return await _context.Timesheets.ToListAsync();
        }

    }
}

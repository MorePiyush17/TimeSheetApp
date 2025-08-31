using TimesheetApp.Models;
using TimesheetApp.Repositories;
namespace TimesheetApp.Services
{

    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public async Task<Employee> GetEmployeeByIdAsync(int id)
        {
            return await _employeeRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Employee>> GetAllEmployeesAsync()
        {
            return await _employeeRepository.GetAllAsync();
        }

        public async Task RegisterEmployeeAsync(Employee employee)
        {
            var existingEmployee = await _employeeRepository.GetByEmailAsync(employee.Email);
            if (existingEmployee != null)
            {
                throw new Exception("Employee with this email already exists.");
            }
            await _employeeRepository.AddAsync(employee);
            await _employeeRepository.SaveChangesAsync();
        }

        public async Task UpdateEmployeeAsync(Employee employee)
        {
            _employeeRepository.Update(employee);
            await _employeeRepository.SaveChangesAsync();
        }

        public async Task DeleteEmployeeAsync(int id)
        {
            var employee = await _employeeRepository.GetByIdAsync(id);
            if (employee != null)
            {
                _employeeRepository.Delete(employee);
                await _employeeRepository.SaveChangesAsync();
            }
        }

        public async Task<Employee> LoginAsync(string email, string password)
        {
            var employee = await _employeeRepository.GetByEmailAsync(email);
            if (employee != null && employee.Password == password)
            {
                return employee;
            }
            return null;
        }

    }
}

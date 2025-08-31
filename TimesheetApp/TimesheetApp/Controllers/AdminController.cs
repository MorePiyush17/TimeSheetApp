//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using TimesheetApp.Services;

//[ApiController]
//[Route("api/[controller]")]
//public class AdminController : ControllerBase
//{
//    private readonly IEmployeeService _employeeService;

//    public AdminController(IEmployeeService employeeService)
//    {
//        _employeeService = employeeService;
//    }

//    // Login endpoint
//    [HttpPost("login")]
//    [AllowAnonymous]
//    public async Task<IActionResult> Login([FromBody] LoginRequest request)
//    {
//        var token = await _employeeService.AuthenticateAsync(request.Email, request.Password);
//        if (token == null) return Unauthorized("Invalid credentials");

//        return Ok(new { token });
//    }

//    // Only Admin can access
//    [HttpGet("employees")]
//    [Authorize(Roles = "Admin")]
//    public async Task<IActionResult> GetEmployees()
//    {
//        var employees = await _employeeService.GetAllEmployeesAsync();
//        return Ok(employees);
//    }
//}

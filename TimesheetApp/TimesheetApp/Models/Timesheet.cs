using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TimesheetApp.Models
{
    public class Timesheet
    {
        [Key]
        public int TimesheetId { get; set; }

        [Required]
        [ForeignKey("Employee")]
        public int EmployeeId { get; set; }

        [Required(ErrorMessage = "Date is required")]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }

        [Required(ErrorMessage = "Hours worked is required")]
        [Range(1, 24, ErrorMessage = "Hours worked must be between 1 and 24")]
        public int HoursWorked { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(250, ErrorMessage = "Description cannot be longer than 250 characters")]
        public string Description { get; set; }

        // Navigation property
        public virtual Employee Employee { get; set; }
    }
}

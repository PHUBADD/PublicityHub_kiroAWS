namespace PublicityHub.Admin.Models
{
    using System.ComponentModel.DataAnnotations;

    public class CreateUserViewModel
    {
        [Required(ErrorMessage = "Full Name is required")]
        [MinLength(3, ErrorMessage = "Name must be at least 3 characters")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Phone number is required")]

        // ✅ Only digits allowed (10 digits example)
        [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "Enter valid 10-digit phone number")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Please select a role")]
        public string Role { get; set; }
    }
}

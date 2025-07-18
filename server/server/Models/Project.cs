using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class Project
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "{0} is required")]
        [RegularExpression("^[a-zA-Z ]+$", ErrorMessage = "{0} should not contain numbers")]
        public string Name { get; set; }

        [Required(ErrorMessage = "{0} is required")]
        public string Status { get; set; }

        [Required(ErrorMessage = "{0} is required")]
        public string Priority { get; set; }

        [Required(ErrorMessage = "{0} is required")]
        public string Assignee { get; set; }

        [Required(ErrorMessage = "{0} is required")]
        public DateTime Updated { get; set; }
    }
}

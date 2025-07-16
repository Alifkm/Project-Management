using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    public class ProjectController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}

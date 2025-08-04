using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Context;
using server.Models;

namespace server.Controllers
{
    public class ProjectController : Controller
    {
        public readonly ApplicationDbContext _context;
        public ProjectController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [Route("projects")]
        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var projects = await _context.Projects.ToListAsync();
            return Ok(projects);
        }

        [Route("projects/{keyword}")]
        public async Task<IActionResult> SearchProject(string keyword)
        {
            var projects = await _context.Projects.Where(p => p.Name.Contains(keyword)).ToListAsync();
            return Ok(projects);
        }
    }
}

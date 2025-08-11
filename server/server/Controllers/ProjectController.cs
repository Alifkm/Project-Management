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

        [Route("/")]
        [Route("projects")]
        [HttpGet]
        public async Task<IActionResult> GetProjects([FromQuery] string? keyword)
        {
            if(!string.IsNullOrEmpty(keyword))
            {
                var filteredProjects = await _context.Projects.Where(key => key.Name.Contains(keyword)).ToListAsync();
                return Ok(filteredProjects);
            }

            var allProjects = await _context.Projects.ToListAsync();
            return Ok(allProjects);
        }

        [Route("projects/create")]
        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] Project project)
        {
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
            return Ok(project);
        }

        [HttpDelete("projects/{id}/delete")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}

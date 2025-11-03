using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.EntityFrameworkCore;
using server.Context;
using server.Models;
using System.Linq.Expressions;

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
        public async Task<IActionResult> GetProjects([FromQuery] string? keyword, [FromQuery] string? orderBy, [FromQuery] int? page, [FromQuery] int? perPage)
        {
            var filteredProjects =  _context.Projects.AsQueryable();

            var selectors = new Dictionary<string, Expression<Func<Project, object>>>()
            {
                { "name", p => p.Name },
                { "status", p => p.Status },
                { "assignee", p => p.Assignee },
                { "priority", p => p.Priority },
                { "updated_at", p => p.Updated_At }
            };

            if (!string.IsNullOrEmpty(keyword) || !string.IsNullOrEmpty(orderBy) || page.HasValue || perPage.HasValue)
            {
                if (!string.IsNullOrEmpty(keyword))
                {
                    filteredProjects = filteredProjects.Where(key => key.Name.ToLower().Contains(keyword.ToLower()));
                }

                if (!string.IsNullOrEmpty(orderBy))
                {
                    string columnName = orderBy.Split(":")[0].ToLower();
                    string order = orderBy.Split(":")[1].ToLower();

                    if (selectors.TryGetValue(columnName, out var selector))
                    {
                        filteredProjects = order == "desc"
                            ? filteredProjects.OrderByDescending(selector)
                            : filteredProjects.OrderBy(selector);
                    }
                }

                if(perPage.HasValue)
                {
                    filteredProjects = filteredProjects.Take(perPage.Value);
                }

                var result = await filteredProjects.ToListAsync();
                return Ok(result);
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

        [Route("projects/{id}/edit")]
        [HttpGet]
        public async Task<IActionResult> EditProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            return Ok(project);
        }

        //[Route("projects")]
        //[HttpGet]
        //public async Task<IActionResult> OrderProject()
        //{

        //}

        [Route("projects/{id}/update")]
        [HttpPut]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] Project project)
        {
            var existingProject = await _context.Projects.FindAsync(id);

            if (id != project.Id)
            {
                return BadRequest();
            }

            existingProject.Name = project.Name;
            existingProject.Status = project.Status;
            existingProject.Assignee = project.Assignee;
            existingProject.Priority = project.Priority;
            existingProject.Updated_At = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(existingProject);
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

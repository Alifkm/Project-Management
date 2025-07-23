using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
            : base(options) 
        { 
        
        }

        public DbSet<Project> Projects { get; set; }
    }
}

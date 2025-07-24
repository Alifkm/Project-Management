using server.Context;
using server.Models;

namespace server.Seeder
{
    public static class DbSeeder
    {
        public static void SeedProjects(ApplicationDbContext projectContext)
        {
            if (!projectContext.Projects.Any())
            {
                projectContext.Projects.AddRange(
                    new Project
                    {
                        Name = "test",
                        Status = "test",
                        Priority = "tset",
                        Assignee = "test",
                        Created_At = DateTime.UtcNow,
                        Updated_At = DateTime.UtcNow
                    },
                    new Project
                    {
                        Name = "BRI Billing",
                        Status = "Testing",
                        Priority = "Urgent",
                        Assignee = "Alif Kahfi",
                        Created_At = DateTime.UtcNow,
                        Updated_At = DateTime.UtcNow
                    }
                );
                projectContext.SaveChanges();
            }
        }
    }
}

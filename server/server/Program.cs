using Microsoft.EntityFrameworkCore;
using Npgsql;
using server.Context;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Register DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

//builder.Services.AddDbContext<ApplicationDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//using var conn = new NpgsqlConnection("Host=db.fwtvmevffpewfgobtqfo.supabase.co;Port=5432;Database=postgres;Username=YOUR_USER;Password=YOUR_PASSWORD;Ssl Mode=Require;Trust Server Certificate=true;");
//conn.Open();
//Console.WriteLine("Success!");

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

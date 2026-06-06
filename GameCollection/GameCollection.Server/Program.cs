using GameCollection.Server.Data;
using Microsoft.EntityFrameworkCore;

// Loob rakenduste koostajat.
var builder = WebApplication.CreateBuilder(args);

// Registrikontrolleri tugi REST API lõpp-punktidele.
builder.Services.AddControllers();

// Registreeri Entity Framework Core ja seadista SQL Serveri ühendus.
builder.Services.AddDbContext<GameContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// Konfigureeri CORS-korra nii, et see lubaks päringuid esiotsast.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Rakenduse koostamine.
var app = builder.Build();

// Luba CORS-korra.
app.UseCors("AllowReact");

// Kontrolleri marsruutide paigutamine (API lõpp-punktid)
app.MapControllers();

//Rakenduse käivitamine.
app.Run();
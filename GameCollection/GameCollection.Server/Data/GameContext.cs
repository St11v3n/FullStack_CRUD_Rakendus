// Impordib mänguüksust (andmebaasi mudel).
using GameCollection.Server.Domain;
// Impordib Entity Framework Core.
using Microsoft.EntityFrameworkCore;

namespace GameCollection.Server.Data
{
    // Entity Framework Core'i poolt kasutatav andmebaasi kontekst.
    //// Annab juurdepääsu andmebaasi tabelitele ja haldab andmebaasi toiminguid.
    public class GameContext : DbContext
    {
        // Konstruktor saab sõltuvusinjektsioonist andmebaasi konfiguratsiooni.
        public GameContext(DbContextOptions<GameContext> options)
            : base(options)
        {
        }

        // Esindab andmebaasis tabelit Games.
        // Võimaldab mängukirjete päringuid teha, neid sisestada, uuendada ja kustutada.
        public DbSet<Game> Games => Set<Game>();
    }
}
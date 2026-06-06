//ASP.NET Core MVC kontroller haldab CRUD operatsioonid mängude jaoks.
using GameCollection.Server.Data;
using GameCollection.Server.Domain;
using GameCollection.Server.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace GameCollection.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GamesController : ControllerBase
    {
        //Andmebaasi kontekst kasutatakse, et ligipääseda mägnude tabelile.
        private readonly GameContext _context;

        //Konstruktori seadistamine andmebaasi kontekstile.
        public GamesController(GameContext context)
        {
            _context = context;
        }

        // GET: api/games
        //Tagastab listi kõikidest mängudest andmebaasis.
        [HttpGet]
        public IActionResult GetAll()
        {
            var games = _context.Games
                .Select(x => new GameListViewModel
                {
                    GameId = x.GameId,
                    Title = x.Title,
                    Genre = x.Genre,
                    Platform = x.Platform,
                    ReleaseYear = x.ReleaseYear,
                    Maker = x.Maker
                });

            return Ok(games);
        }

        // GET: api/games/{id}
        //Tagastab ühe mängu ID kaudu.
        [HttpGet("{gameId:guid}")]
        public IActionResult GetById(Guid gameId)
        {
            var game = _context.Games
                .Where(x => x.GameId == gameId)
                .Select(x => new GameDetailViewModel
                {
                    GameId = x.GameId,
                    Title = x.Title,
                    Genre = x.Genre,
                    Platform = x.Platform,
                    ReleaseYear = x.ReleaseYear,
                    Maker = x.Maker
                })
                .FirstOrDefault();

            //Kui mängu ei ole leitud, siis tekib error.
            if (game == null)
            {
                return NotFound($"Game with id {gameId} was not found.");
            }

            return Ok(game);
        }

        // POST: api/games
        //Koostab uue mängu andmebaasis.
        [HttpPost]
        public IActionResult Create([FromBody] GameCreateViewModel model)
        {
            //Sissetulevate päringute andmete valideerimine mudeli valideerimisreeglite abil.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //Võtab API-päringu (GameCreateViewModel) andmed ja teisendab need mänguüksuseks, mille EF Core saab andmebaasis salvestada.
            var game = new Game
            {
                GameId = Guid.NewGuid(),
                Title = model.Title,
                Genre = model.Genre ?? string.Empty,
                Platform = model.Platform ?? string.Empty,
                ReleaseYear = model.ReleaseYear,
                Maker = model.Maker ?? string.Empty
            };

            //Lisada uus mäng andmebaasi ning salvestada muudatused.
            _context.Games.Add(game);
            _context.SaveChanges();

            return Ok(game);
        }

        // PUT: api/games/{id}
        // Uuendab andmebaasis olemasolevat mängu.
        [HttpPut("{gameId:guid}")]
        public IActionResult Update(Guid gameId, [FromBody] GameUpdateViewModel model)
        {
            //Valideerib tulevaid andmeid.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Leia andmebaasist olemasolev mäng.
            var game = _context.Games.FirstOrDefault(x => x.GameId == gameId);

            // Kui mängu ei leita, tagastatakse errorit.
            if (game == null)
            {
                return NotFound($"Game with id {gameId} was not found.");
            }

            //// Värskenda välju päringust saadud uute väärtustega.
            game.Title = model.Title;
            game.Genre = model.Genre;
            game.Platform = model.Platform;
            game.ReleaseYear = model.ReleaseYear;
            game.Maker = model.Maker;

            //Salvesta muudatused andmebaasile.
            _context.SaveChanges();

            return Ok(game);
        }

        // DELETE: api/games/{id}
        //Eemaldab mängu andmebaasist.
        [HttpDelete("{gameId:guid}")]
        public IActionResult Delete(Guid gameId)
        {
            //Otsib mängu, mida eemaldada.
            var game = _context.Games.FirstOrDefault(x => x.GameId == gameId);

            //Kui mängu ei leida üles, siis tekib error.
            if (game == null)
            {
                return NotFound($"Game with id {gameId} was not found.");
            }

            //Eemaldab mängu andmebaasist ja salvestab muudatused.
            _context.Games.Remove(game);
            _context.SaveChanges();

            return Ok();
        }
    }
}
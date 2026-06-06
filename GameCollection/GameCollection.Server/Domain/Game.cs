namespace GameCollection.Server.Domain
{
    // Esindab andmebaasis salvestatud mänguüksust.
    public class Game
    {
        // Primaarvõti (unikaalne identifikaator).

        public Guid GameId { get; set; }

        //Mängu nimi.
        public string Title { get; set; } = string.Empty;

        //Mängu žanr.
        public string Genre { get; set; } = string.Empty;

        //Mängu platvorm.
        public string Platform { get; set; } = string.Empty;

        //Millal mäng välja lasti.
        public int ReleaseYear { get; set; }

        //Kes koostis mängu.
        public string Maker { get; set; } = string.Empty;
    }
}
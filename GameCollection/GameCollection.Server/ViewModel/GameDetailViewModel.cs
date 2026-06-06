namespace GameCollection.Server.ViewModel
{
    // ViewModel, mida kasutatakse üksiku mängu kohta detailide kuvamiseks.
    public class GameDetailViewModel
    {
        // Mängu unikaalne identifikaator.
        public Guid GameId { get; set; }

        //Mängu nimi.
        public string Title { get; set; } = string.Empty;

        //Mängu žanr.
        public string Genre { get; set; } = string.Empty;

        //Mängu platvorm.
        public string? Platform { get; set; }

        //Mängu väljalaskmis aasta.
        public int ReleaseYear { get; set; }

        //Mängu koostaja.
        public string? Maker { get; set; }
    }
}
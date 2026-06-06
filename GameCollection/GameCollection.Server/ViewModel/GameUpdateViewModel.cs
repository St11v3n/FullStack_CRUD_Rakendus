namespace GameCollection.Server.ViewModel
{
    // Vaatemudelit kasutatakse olemasoleva mängu uuendamisel.
    public class GameUpdateViewModel
    {
        //Mängu nimi.
        public string Title { get; set; } = string.Empty;

        //Mängu žanr.
        public string Genre { get; set; } = string.Empty;

        //Mängu platvorm.
        public string Platform { get; set; } = string.Empty;

        //Mängu väljalaskmis aasta.
        public int ReleaseYear { get; set; }

        //Mängu koostaja.
        public string Maker { get; set; } = string.Empty;
    }
}
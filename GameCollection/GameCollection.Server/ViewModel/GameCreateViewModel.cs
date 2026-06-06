// Impordib valideerimisatribuudid, näiteks Required, StringLength ja Range.
using System.ComponentModel.DataAnnotations;

// ViewModel, mida kasutatakse uue mängu loomisel.
// Määrab, millised väljad klient peab API-le saatma.
public class GameCreateViewModel
{
    // Mängu nimi on kohustuslik ja peab sisaldama 1 kuni 100 tähemärki.
    [Required(ErrorMessage = "Title is required")]
    [StringLength(100, MinimumLength = 1)]
    public string Title { get; set; } = string.Empty;

    // Žanr on kohustuslik ja piiratud 50 tähemärgiga.
    [Required(ErrorMessage = "Genre is required")]
    [StringLength(50)]
    public string Genre { get; set; } = string.Empty;

    // Platvorm on kohustuslik ja piiratud 50 tähemärgiga.
    [Required(ErrorMessage = "Platform is required")]
    [StringLength(50)]
    public string Platform { get; set; } = string.Empty;

    // Väljalaskeaasta peab olema vahemikus 1950 kuni 2100
    [Range(1950, 2100, ErrorMessage = "Release year must be valid")]
    public int ReleaseYear { get; set; }

    // Looja on kohustuslik ja piiratud 100 tähemärgiga.
    [Required(ErrorMessage = "Maker is required")]
    [StringLength(100)]
    public string Maker { get; set; } = string.Empty;
}
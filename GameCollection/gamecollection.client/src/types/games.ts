// Esindab mänguobjekti, mis on saadud backendi API-st või saadetud sinna.
export interface Game {

    // Mängu unikaalne identifikaator.
    gameId: string;

    //Mängu nimi.
    title: string;

    //Mängu žanr.
    genre: string;

    //Mängu platvorm.
    platform: string;

    //Mängu väljalaskmis aasta.
    releaseYear: number;

    //Mängu koostaja.
    maker: string;
}
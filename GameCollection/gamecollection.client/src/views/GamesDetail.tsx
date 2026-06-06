// Reacti komponent, mis kuvab üksiku mängu kohta detailset infot, mis loetakse ID järgi.
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Game } from "../types/games";

export default function GamesDetail() {
    // Võtab URL-i parameetritest gameId (nt /games/:gameId).
    const { gameId } = useParams<{ gameId: string }>();

    // Kasutatakse navigeerimiseks (nt tagasi-nupp).
    const navigate = useNavigate();

    // Salvestab hangitud mänguandmed.
    const [game, setGame] = useState<Game | null>(null);

    // Laadimise olek andmete toomisel backendist.
    const [loading, setLoading] = useState(true);

    // Salvestab errorit, kui API-kutse ebaõnnestub.
    const [error, setError] = useState<string | null>(null);

    // Käivitub komponendi laadimisel või mängu ID muutumisel.
    useEffect(() => {

        // Kui mängu ID-d pole olemas, peatub täitmine.
        if (!gameId) return;

        const fetchGame = async () => {
            try {
                setLoading(true);
                setError(null);

                // Tõmba üks mäng backendi API-st.
                const response = await fetch(
                    `/api/games/${encodeURIComponent(gameId)}`
                );

                // HTTP-vigade käsitlemine.
                if (!response.ok) {
                    throw new Error(`Failed to fetch game (${response.status})`);
                }

                // Teisendab JSON-i vastus mänguobjektiks.
                const data: Game = await response.json();

                // Salvestab mängu renderdamise olekus.
                setGame(data);

            } catch (err) {
                // Ootamatute vigade (võrgu-, parsimis- jne) käsitlemine.
                setError(
                    err instanceof Error
                        ? err.message
                        : "An unknown error occurred"
                );
            } finally {
                // Laadimisoleku peatamine.
                setLoading(false);
            }
        };

        fetchGame();
    }, [gameId]);

    // Kui URL-is mängu ID-d pole.
    if (!gameId) {
        return (
            <div style={{ padding: 20 }}>
                <h1>Game Detail</h1>
                <p style={{ color: "crimson" }}>No game ID provided</p>
                <Link to="/games">Back to list</Link>
            </div>
        );
    }

    // Kasutajaliidese laadimine API vastust oodates.
    if (loading) {
        return <div style={{ padding: 20 }}>Loading...</div>;
    }

    // Kasutajaliidese error, kui API-päring ebaõnnestub.
    if (error) {
        return (
            <div style={{ padding: 20 }}>
                <h1>Game Detail</h1>
                <p style={{ color: "crimson" }}>{error}</p>
                <Link to="/games">Back to list</Link>
            </div>
        );
    }

    // Kasutajaliides, kui mängu andmebaasist ei leitud.
    if (!game) {
        return (
            <div style={{ padding: 20 }}>
                <h1>Game Detail</h1>
                <p>Game not found.</p>
                <Link to="/games">Back to list</Link>
            </div>
        );
    }

    // Peamine kasutajaliides, mis kuvab mängu täielikud üksikasjad.
    return (
        <div style={{ padding: 20, maxWidth: 720, margin: "0 auto" }}>
            <h1>Game Detail</h1>

            {/* Tabel, kus kuvatakse kõik mängu omadused. */}
            <table border={1} cellPadding={8} style={{ width: "100%" }}>
                <tbody>
                    <tr>
                        <th>ID</th>
                        <td>{game.gameId}</td>
                    </tr>
                    <tr>
                        <th>Title</th>
                        <td>{game.title}</td>
                    </tr>
                    <tr>
                        <th>Genre</th>
                        <td>{game.genre}</td>
                    </tr>
                    <tr>
                        <th>Platform</th>
                        <td>{game.platform}</td>
                    </tr>
                    <tr>
                        <th>Release Year</th>
                        <td>{game.releaseYear}</td>
                    </tr>
                    <tr>
                        <th>Maker</th>
                        <td>{game.maker}</td>
                    </tr>
                </tbody>
            </table>

            {/* Navigeerimisnupp tagasi listilehele. */}
            <div style={{ marginTop: 12 }}>
                <button className="success" onClick={() => navigate("/games")}>
                    Back
                </button>
            </div>
        </div>
    );
}
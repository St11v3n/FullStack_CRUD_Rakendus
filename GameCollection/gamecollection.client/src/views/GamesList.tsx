// Reacti komponent, mis kuvab kõigi mängude nimekirja (READ-operatsioon).
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Game } from "../types/games";

export default function GamesList() {
    // Salvestab mängude nimekirja taustsüsteemi API-st.
    const [games, setGames] = useState<Game[]>([]);

    // Laadimise olek andmete toomise ajal.
    const [loading, setLoading] = useState(true);
    // Ebaõnnestunud API-päringute error teade.
    const [error, setError] = useState<string | null>(null);

    // Kasutatakse programmiliseks navigeerimiseks (nupud -> marsruudid).
    const navigate = useNavigate();

    // Käivitub komponendi laadimisel üks kord.
    useEffect(() => {
        const loadGames = async () => {
            try {
                setLoading(true);
                setError(null);

                // Laadi kõik mängud taustaprogrammi API-st alla.
                const res = await fetch("/api/Games");

                if (!res.ok) {
                    throw new Error(`Failed to load games (${res.status})`);
                }

                // Teisendab JSON-vastus tüüpitud massiiviks.
                const data: Game[] = await res.json();

                //Mängude salvestamine.
                setGames(data);

            } catch (err) {
                // Võru või serveri errorite kästilemine.
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load games"
                );
            } finally {
                setLoading(false);
            }
        };

        loadGames();
    }, []);

    return (
        <div className="page-card">

            {/* Lehe päis pealkirjaga + loomise nupp. */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16
            }}>
                <h1 style={{ margin: 0 }}>Games</h1>

                {/* Navigeeri lehe loomise juurde. */}
                <button
                    className="success"
                    onClick={() => navigate("/games/create")}
                >
                    + Create
                </button>
            </div>

            {/* Kasutajaliidese laadimine. */}
            {loading && <p>Loading games...</p>}

            {/* Kasutajaliidese error. */}
            {error && <p style={{ color: "crimson" }}>{error}</p>}

            {/* Tühi olek, kui mänge pole olemas. */}
            {!loading && !error && games.length === 0 && (
                <p>No games found. Create your first game!</p>
            )}

            {/* Tabel kuvatakse ainult siis, kui andmed on olemas. */}
            {!loading && !error && games.length > 0 && (
                <table
                    border={1}
                    cellPadding={8}
                    style={{
                        width: "100%",
                        borderCollapse: "collapse"
                    }}
                >
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Genre</th>
                            <th>Platform</th>
                            <th>Year</th>
                            <th>Maker</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {games.map((game) => (
                            <tr key={game.gameId}>
                                {/* Kuvab mängu andmed. */}
                                <td>{game.title}</td>
                                <td>{game.genre}</td>
                                <td>{game.platform}</td>
                                <td>{game.releaseYear}</td>
                                <td>{game.maker}</td>

                                {/* Iga mängu toimingunupud. */}
                                <td>
                                    <div style={{ display: "flex", gap: 8 }}>

                                        {/* Liigub detaillehele. */}
                                        <button
                                            className="primary"
                                            onClick={() => navigate(`/games/${game.gameId}`)}
                                        >
                                            Detail
                                        </button>

                                        {/* Liigub muutmislehele. */}
                                        <button
                                            className="warning"
                                            onClick={() => navigate(`/games/${game.gameId}/edit`)}
                                        >
                                            Edit
                                        </button>

                                        {/* Liigu kustutamise kinnituslehele. */}
                                        <button
                                            className="danger"
                                            onClick={() => navigate(`/games/${game.gameId}/delete`)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
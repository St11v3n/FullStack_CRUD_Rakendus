// Reacti komponent mängukirje kustutamiseks.
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Game } from "../types/games";

export default function GamesDelete() {

    //Extract gameId from URL parameters (route: /games/delete/:gameId).
    const { gameId } = useParams<{ gameId: string }>();

    // Hook, mida kasutatakse programmiliseks navigeerimiseks pärast kustutamist/tühistamist.
    const navigate = useNavigate();

    // Salvestab taustaprogrammist laaditud mänguandmed.
    const [game, setGame] = useState<Game | null>(null);

    // Laadimisolek esialgseks toomiseks.
    const [loading, setLoading] = useState(true);

    // Kustutamisoperatsiooni oleku laadimine.
    const [deleting, setDeleting] = useState(false);

    // Salvestab kasutajaliidese kuvamiseks veateateid.
    const [error, setError] = useState<string | null>(null);

    // Käivitub üks kord komponendi laadimisel (või kui mängu ID muutub).
    useEffect(() => {
        const loadGame = async () => {

            // Kui ID-d ei esitata, peatage täitmine.
            if (!gameId) {
                setError("No game ID provided");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Mängu üksikasjade toomine backendi API-st.
                const res = await fetch(`/api/Games/${encodeURIComponent(gameId)}`);

                // HTTP-errorite käsitlemine.
                if (!res.ok) {
                    throw new Error(`Failed to load game (${res.status})`);
                }

                // Teisendab vastuse JSON-iks mänguobjektiks.
                const data: Game = await res.json();

                // Salvesta mäng kuvamiseks olekus.
                setGame(data);

            } catch (err) {
                // Ootamatute vigade (võrgu-, parsimis- jne) käsitlemine.
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load game"
                );
            } finally {
                // Lõpeta spinneri laadimine olenemata õnnestumisest/ebaõnnestumisest.
                setLoading(false);
            }
        };

        loadGame();
    }, [gameId]);

    // Käsitleb kustutamisnupu klõpsamist.
    const onDelete = async () => {

        // Kustutamise takistamine, kui ID-d pole olemas.
        if (!gameId) return;

        try {
            setDeleting(true);
            setError(null);

            const res = await fetch(`/api/Games/${encodeURIComponent(gameId)}`, {
                method: "DELETE"
            });

            // Ebaõnnestunud kustutustaotluse käsitlemine.
            if (!res.ok) {
                throw new Error(`Delete failed (${res.status})`);
            }

            // Pärast edukat kustutamist suunatakse tagasi mängude nimekirja.
            navigate("/games");

        } catch (err) {
            // Kuva veateade kasutajaliideses.
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete game"
            );

        } finally {

            // Kustutamisoleku lähtestamine.
            setDeleting(false);
        }
    };

    // Näita andmete toomise ajal laadimisekraani.
    if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

    return (
        <div style={{ padding: 20, maxWidth: 520, margin: "0 auto" }}>
            <h2>Delete Game</h2>

            {/* Kuva veateade, kui midagi läheb valesti. */}
            {error && <p style={{ color: "crimson" }}>{error}</p>}

            {/* Kui mängu ei leitud. */}
            {!game ? (
                <p>Game not found</p>
            ) : (
                <>
                    {/* Kinnitussõnum. */}
                    <p>Are you sure you want to delete:</p>

                        {/* Mängu eelvaatekaart. */}
                    <div style={{ border: "1px solid #ddd", padding: 12, marginBottom: 16 }}>
                        <b>{game.title}</b>
                        <br />
                        {game.platform} | {game.releaseYear}
                    </div>

                        {/* Toimingunupud. */}
                    <div style={{ display: "flex", gap: 10 }}>
                        <button
                            type="button"
                            className="danger"
                            onClick={onDelete}
                            disabled={deleting}
                        >
                            {deleting ? "Deleting..." : "Yes, delete"}
                        </button>

                        {/* Tühistamisnupp viib kasutaja tagasi loendilehele */}
                        <button
                            type="button"
                            className="secondary"
                            onClick={() => navigate("/games")}
                            disabled={deleting}
                        >
                            Cancel
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
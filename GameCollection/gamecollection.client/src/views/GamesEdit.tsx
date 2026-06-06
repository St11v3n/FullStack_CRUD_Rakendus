// Reacti hookid oleku haldamiseks ja kõrvalmõjude jaoks.
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Game } from "../types/games";

// Määrab muutmisvormis kasutatava vormi oleku kuju.
type FormState = {
    title: string;
    genre: string;
    platform: string;
    releaseYear: number;
    maker: string;
};

export default function GamesEdit() {

    // Loeb URL-ist mängu ID (nt /games/edit/{gameId}).
    const { gameId } = useParams<{ gameId: string }>();

    // Used for navigation after saving or cancelling.
    const navigate = useNavigate();

    // Laadimise olek mänguandmete backendist toomisel.
    const [loading, setLoading] = useState(true);

    // Laadimis olek uuendatud andmete salvestamise ajal.
    const [saving, setSaving] = useState(false);

    // Salvestab API või valideerimisvigade veateateid.
    const [error, setError] = useState<string | null>(null);

    // Salvestab vormi sisendväärtused.
    const [form, setForm] = useState<FormState>({
        title: "",
        genre: "",
        platform: "",
        releaseYear: new Date().getFullYear(),
        maker: ""
    });

    // Laadib komponendi laadimisel või mängu ID muutumisel olemasolevad mänguandmed.
    useEffect(() => {
        const loadGame = async () => {

            // Kui URL-is ID-d pole, peatub täitmine.
            if (!gameId) {
                setError("No game ID provided");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                //Kutsub backend API-d, et saada üht mängu.
                const response = await fetch(`/api/Games/${gameId}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch game (${response.status})`);
                }

                //Teisendab API vastus mängu objektina.
                const data: Game = await response.json();

                //Täida vormiväljad olemasolevate andmetega.
                setForm({
                    title: data.title ?? "",
                    genre: data.genre ?? "",
                    platform: data.platform ?? "",
                    releaseYear: data.releaseYear ?? new Date().getFullYear(),
                    maker: data.maker ?? ""
                });

            } catch (err) {
                //// Võrgu- või API-vigade käsitlemine.
                setError(err instanceof Error ? err.message : "Failed to load game");
            } finally {
                setLoading(false);
            }
        };

        loadGame();
    }, [gameId]);

    // Tegeleb vormiväljade sisendmuudatustega.
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        //// Kui väli on releaseYear, teisendage väärtus numbriks.
        setForm(prev => ({
            ...prev,
            [name]: name === "releaseYear" ? Number(value) : value
        }));
    };

    // Tegeleb vormi esitamisega (PUT-päring backendile).
    const onSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        //Veendub, et mängu ID on olemas
        if (!gameId) {
            setError("No game ID provided");
            return;
        }

        try {
            setSaving(true);
            setError(null);

            //Loo kasulik koormus, mis vastab backendi UpdateViewModel.
            const payload = {
                title: form.title,
                genre: form.genre,
                platform: form.platform,
                releaseYear: form.releaseYear,
                maker: form.maker
            };

            //Saada värskendustaotlus taustsüsteemi API-le.
            const res = await fetch(`/api/Games/${gameId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            //// Ebaõnnestunud vastuse käsitlemine.
            if (!res.ok) {
                let message = `Failed to update game (${res.status})`;

                try {
                    const errorData = await res.json();

                    //// Proovitakse backendist valideerimisveateateid hankida.
                    message =
                        errorData.errors?.Title?.[0] ||
                        errorData.errors?.Genre?.[0] ||
                        errorData.errors?.Platform?.[0] ||
                        errorData.errors?.Maker?.[0] ||
                        errorData.errors?.ReleaseYear?.[0] ||
                        message;

                } catch {
                    // Kui vastus ei ole JSON, siis kasutatakse vaikesõnumit.
                }

                throw new Error(message);
            }

            // Pärast edukat värskendamist navigeeritakse mängu detailide lehele.
            navigate(`/games/${gameId}`);

        } catch (err) {
            // Tegeleb värskendusprotsessi käigus tekkivate vigadega.
            setError(err instanceof Error ? err.message : "Failed to update game");
        } finally {
            setSaving(false);
        }
    };

    // Näita laadimise olekut andmete toomise ajal.
    if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

    return (
        <div className="page-card">
            <h1>Edit Game</h1>

            {/* Kuva veateateid, kui need esinevad. */}
            {error && <p style={{ color: "crimson" }}>{error}</p>}

            {/* Muutmis vorm. */}
            <form
                onSubmit={onSubmit}
                style={{ display: "grid", gap: 12, maxWidth: 520 }}
            >
                <div>
                    <label>Title</label>
                    <input name="title" value={form.title} onChange={onChange} required />
                </div>

                <div>
                    <label>Genre</label>
                    <input name="genre" value={form.genre} onChange={onChange} required />
                </div>

                <div>
                    <label>Platform</label>
                    <input name="platform" value={form.platform} onChange={onChange} required />
                </div>

                <div>
                    <label>Release Year</label>
                    <input
                        name="releaseYear"
                        type="number"
                        value={form.releaseYear}
                        onChange={onChange}
                        required
                        min={1950}
                        max={2100}
                    />
                </div>

                <div>
                    <label>Maker</label>
                    <input name="maker" value={form.maker} onChange={onChange} required />
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                    <button className="primary" type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </button>

                    <button
                        className="success"
                        type="button"
                        onClick={() => navigate("/games")}
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
}
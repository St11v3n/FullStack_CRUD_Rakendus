// Reacti komponent uue mängukirje loomiseks.
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Vormi oleku tüübi definitsioon.
type FormState = {
    title: string;
    genre: string;
    platform: string;
    releaseYear: number;
    maker: string;
};

export default function GamesCreate() {
    const navigate = useNavigate();

    // Vormi sisendite kohalik olek.
    const [form, setForm] = useState<FormState>({
        title: "",
        genre: "",
        platform: "",
        releaseYear: new Date().getFullYear(),
        maker: ""
    });

    // Kasutajaliidese tagasiside laadimise/salvestamise olek.
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Tegeleb sisendmuudatustega ja uuendab olekut dünaamiliselt.
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,

            // Teisendab releaseYear numbriks, muud jätab stringidena.
            [name]: name === "releaseYear" ? Number(value) : value
        }));
    };

    // Tegeleb vormi esitamisega (POST-päring taustaprogrammi API-le).
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError(null);

            //Kasulik koormus saadeti taustsüsteemi API-le.
            const payload = {
                title: form.title,
                genre: form.genre || null,
                platform: form.platform || null,
                releaseYear: form.releaseYear,
                maker: form.maker || null
            };

            // Saada POST-päring API-le.
            const res = await fetch("/api/Games", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            // Tagaserveri valideerimisvigade käsitlemine.
            if (!res.ok) {
                const errorData = await res.json();

                const message =
                    errorData.errors?.Title?.[0] ||
                    errorData.errors?.Genre?.[0] ||
                    errorData.errors?.ReleaseYear?.[0] ||
                    `Failed to create game (${res.status})`;

                throw new Error(message);
            }

            // Pärast edu naase mängude nimekirja.
            navigate("/games");

        } catch (err) {
            setError(err instanceof Error ? err.message : "Error creating game");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="page-card">
            <h1>Create Game</h1>

            {/* Näita errorit, kui see on olemas */}
            {error && <p style={{ color: "crimson" }}>{error}</p>}

            <form
                onSubmit={onSubmit}
                style={{ display: "grid", gap: 12, maxWidth: 520 }}
            >
                {/* Sisestusväljad. */}
                <input
                    name="title"
                    value={form.title}
                    onChange={onChange}
                    placeholder="Title"
                    required
                />

                <input
                    name="genre"
                    value={form.genre}
                    onChange={onChange}
                    placeholder="Genre"
                    required
                />

                <input
                    name="platform"
                    value={form.platform}
                    onChange={onChange}
                    placeholder="Platform"
                    required
                />

                <input
                    name="releaseYear"
                    type="number"
                    value={form.releaseYear}
                    onChange={onChange}
                    placeholder="Year"
                    required
                />

                <input
                    name="maker"
                    value={form.maker}
                    onChange={onChange}
                    placeholder="Maker"
                    required
                />

                <button className="primary" type="submit" disabled={saving}>
                    {saving ? "Creating..." : "Create Game"}
                </button>
            </form>
        </div>
    );
}
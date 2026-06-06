// Impordib marsruutimiskomponendid React Routerist.
import { Routes, Route, Navigate } from "react-router-dom";

// Rakenduse lehtede (vaadete) importimine.
import GamesList from "./views/GamesList";
import GamesCreate from "./views/GamesCreate";
import GamesDetail from "./views/GamesDetail";
import GamesEdit from "./views/GamesEdit";
import GamesDelete from "./views/GamesDelete";

// Rakenduse põhikomponent.
export default function App() {
    return (
        <Routes>
            {/* Suunab root-URL (/) mängude nimekirja lehele. */}
            <Route path="/" element={<Navigate to="/games" />} />

            {/* Kuvab kõik mängud (lugemisoperatsioon). */}
            <Route path="/games" element={<GamesList />} />
            {/* Uue mängu loomise vorm (loomistoiming). */}
            <Route path="/games/create" element={<GamesCreate />} />

            {/* Kuvab üksiku mängu detailid. */}
            <Route path="/games/:gameId" element={<GamesDetail />} />

            {/* Olemasoleva mängu muutmise vorm (värskendustoiming). */}
            <Route path="/games/:gameId/edit" element={<GamesEdit />} />

            {/* Mängu kustutamise kinnitusleht (kustutustoiming). */}
            <Route path="/games/:gameId/delete" element={<GamesDelete />} />
        </Routes>
    );
}
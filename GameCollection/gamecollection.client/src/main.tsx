// Impordib Reacti teegid.
import React from "react";
import ReactDOM from "react-dom/client";

// Kliendipoolse marsruutimise jaoks imporditakse React Router.
import { BrowserRouter } from "react-router-dom";

// Imporditakse peamise rakenduse komponendi.
import App from "./App";

// Impordi globaalsed rakenduse stiilid.
import "./index.css";

// Loo Reacti root ja renderda rakendus.
ReactDOM.createRoot(document.getElementById("root")!).render(
    // StrictMode aitab tuvastada võimalikke probleeme arenduse ajal.
    <React.StrictMode>

        {/* BrowserRouter võimaldab lehtede vahel navigeerida ilma uuesti laadimata. */}
        <BrowserRouter>

            {/* Rakenduse peamine komponent. */}
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
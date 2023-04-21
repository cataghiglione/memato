import './App.css';
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { PublicPage } from "./pages/PublicPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { PickTeamPage } from "./pages/PickTeamPage";
import { UserPage } from "./pages/UserPage";
import { NewTeamPage } from "./pages/NewTeamPage";
import { FindRivalPage } from "./pages/FindRivalPage";
import { RequireAuth } from "./components/RequireAuth";

function App() {
    return (
        <Routes>
            <Route path="/" element={<PublicPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Use RequireAuth to protect all other routes */}
            <Route
                path="/*"
                element={<RequireAuth>
                    <Routes>
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/pickTeam" element={<PickTeamPage />} />
                        <Route path="/newTeam" element={<NewTeamPage />} />
                        <Route path="/user" element={<UserPage />} />
                        <Route path="/findRival" element={<FindRivalPage />} />
                    </Routes>
                </RequireAuth>}
            />
        </Routes>
    );
}

export default App;

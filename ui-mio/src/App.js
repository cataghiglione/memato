import './App.css';
import {
    Route
} from "react-router-dom";
import {LoginPage} from "./pages/LoginPage";
import {PublicPage} from "./pages/PublicPage";
import {Routes} from "react-router";
import {RegisterPage} from "./pages/RegisterPage";
import {UsersPage} from "./pages/UsersPage";
import {RequireAuth} from "./components/RequireAuth";
import {HomePage} from "./pages/HomePage";
import {PickTeamPage} from "./pages/PickTeamPage";
import {UserPage} from "./pages/UserPage";
import {NewTeamPage} from "./pages/NewTeamPage"
function App() {
    return (
        <Routes>
            <Route path="/" element={<PublicPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/user" element={<HomePage/>}/>
            <Route path="/pickTeam" element={<PickTeamPage/>}/>
            <Route path="/newTeam" element={<NewTeamPage/>}/>
            <Route path="/users" element={<UsersPage/>}/>
            <Route path="/userInfo" element={<UserPage/>}/>
            <Route
                path="/home"
                element={
                    <RequireAuth>
                        <HomePage/>
                    </RequireAuth>
                }
            />
        </Routes>
    );
}

export default App;

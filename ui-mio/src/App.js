import './App.css';
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { PublicPage } from "./pages/PublicPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { PickTeamPage } from "./pages/PickTeamPage";
import { UserPage } from "./pages/UserPage";
import{EditTeamPage} from "./pages/EditTeamPage";
import { NewTeamPage } from "./pages/NewTeamPage";
import { FindRivalPage } from "./pages/FindRivalPage";
import { RequireAuth } from "./components/RequireAuth";
import {useEffect, useState} from "react";
import {SettingsPage} from "./pages/SettingsPage";
import {useNavigate} from "react-router";


const App = () =>{
    /*  the initial state of the teamId variable is set to the value retrieved
        from the localStorage using the getItem method. If the value is not
        found in localStorage, the initial state is set to 0.*/
    const [teamId, setTeamId] = useState(() => {
        return 0;
    });

    const navigate = useNavigate();


    /*  To save the state in localStorage whenever it changes,
        an effect is used with a dependency array containing
        the count variable. This effect calls the setItem method
        of localStorage with the current value of count.*/
    useEffect(() => {
        localStorage.setItem('teamId', JSON.stringify(teamId));
    }, [teamId]);


    const toggleTeamId = (value) => {
        setTeamId(value);
        navigate("editTeam")
    }


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
                        <Route path="/home" element={<HomePage toggleTeamId = {toggleTeamId}    getTeamId={teamId}/>} />
                        <Route path="/pickTeam" element={<PickTeamPage toggleTeamId = {toggleTeamId}    getTeamId={teamId}/>} />
                        <Route path="/newTeam" element={<NewTeamPage toggleTeamId = {toggleTeamId}    getTeamId={teamId}/>} />
                        <Route path="/user" element={<UserPage toggleTeamId = {toggleTeamId}    getTeamId={teamId}/>} />
                        <Route path="/settings" element={<SettingsPage toggleTeamId = {toggleTeamId}    getTeamId={teamId}/>} />
                        <Route path="/findRival" element={<FindRivalPage toggleTeamId = {toggleTeamId}    getTeamId={teamId}/>} />
                        <Route path = "/editTeam" element = {<EditTeamPage toggleTeamId = {toggleTeamId}    getTeamId={teamId}/>} />
                    </Routes>
                </RequireAuth>}
            />
        </Routes>
    );
}

export default App;

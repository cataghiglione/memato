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
import {BingMap} from "./pages/BingMap";
import { RequireAuth } from "./components/RequireAuth";
import{CurrentSearchesPage} from "./pages/CurrentSearchesPage";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {ConfirmationsPage} from "./pages/ConfirmationsPage";
import {useAuthProvider} from "./auth/auth";
// import {MyConfirmationsPage} from "./pages/MyConfirmationsPage";


const App = () =>{
    const auth = useAuthProvider();
    const token = auth.getToken();
    /*  the initial state of the teamId variable is set to the value retrieved
        from the localStorage using the getItem method. If the value is not
        found in localStorage, the initial state is set to 0.*/
    const [teamId, setTeamId] = useState(() => {
        const storedTeamId = localStorage.getItem('teamId');
        return storedTeamId !== null ? JSON.parse(storedTeamId) : 0;
    });

    const navigate = useNavigate();


    /*  To save the state in localStorage whenever it changes,
        an effect is used with a dependency array containing
        the count variable. This effect calls the setItem method
        of localStorage with the current value of count.*/
    useEffect(() => {
        localStorage.setItem('teamId', JSON.stringify(teamId));
    }, [teamId]);
    useEffect(() => {
        localStorage.setItem('teamId', 0);
    }, [token])


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
                        <Route path="/findRival" element={<FindRivalPage toggleTeamId = {toggleTeamId}    getTeamId={teamId}/>} />
                        <Route path = "/editTeam" element = {<EditTeamPage toggleTeamId = {toggleTeamId}    getTeamId={teamId}/>} />
                        <Route path = "/currentSearches" element = {<CurrentSearchesPage toggleTeamId = {toggleTeamId}    getTeamId={teamId}/>} />
                        <Route path = "/ReactMap" element = {<BingMap toggleTeamId = {toggleTeamId}    getTeamId={teamId}/>} />
                        <Route path = "/pendingConfirmations" element={<ConfirmationsPage toggleTeamId = {toggleTeamId} getTeamId={teamId}/>}/>
                        {/*<Route path = "/myConfirmations" element={<MyConfirmationsPage toggleTeamId = {toggleTeamId} getTeamId={teamId}/>}/>*/}


                    </Routes>
                </RequireAuth>}
            />
        </Routes>
    );
}

export default App;

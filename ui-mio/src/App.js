import './App.css';
import {
    Route
} from "react-router-dom";
import {LoginPage} from "./pages/LoginPage";
import {PublicPage} from "./pages/PublicPage";
import {Routes} from "react-router";
import {RegisterPage} from "./pages/RegisterPage";
import {RequireAuth} from "./components/RequireAuth";
import {HomePage} from "./pages/HomePage";
import {PickTeamPage} from "./pages/PickTeamPage";
import {UserPage} from "./pages/UserPage";
import {NewTeamPage} from "./pages/NewTeamPage"
import {FindRivalPage} from "./pages/FindRivalPage";
import {Component} from "react";

class App extends Component {
    render() {
        return (
            <Routes>
                <Route path="/" element={<PublicPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/home" element={<HomePage/>}/>
                <Route path="/pickTeam" element={<PickTeamPage/>}/>
                <Route path="/newTeam" element={<NewTeamPage/>}/>
                <Route path="/user" element={<UserPage/>}/>
                <Route path="/findRival" element={<FindRivalPage/>}/>
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
}

export default App;

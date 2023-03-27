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

function App() {
    return (
        <Routes>
            <Route path="/" element={<PublicPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/user/:mail" element={<HomePage/>}/>
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

import './App.css';
import {
    Route
} from "react-router-dom";
import {LoginPage} from "./pages/LoginPage";
import {PublicPage} from "./pages/PublicPage";
import {Routes} from "react-router";
import {RegisterPage} from "./pages/RegisterPage";
import {HomePage} from "./pages/HomePage";
import {RequireAuth} from "./components/RequireAuth";

function App() {
    return (
        <Routes>
            <Route path="/" element={<PublicPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
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

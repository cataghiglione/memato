import './App.css';
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { PublicPage } from "./pages/PublicPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { PickTeamPage } from "./pages/PickTeamPage";
import { UserPage } from "./pages/UserPage";
import { EditTeamPage } from "./pages/EditTeamPage";
import { NewTeamPage } from "./pages/NewTeamPage";
import { BingMap } from "./pages/BingMap";
import { RequireAuth } from "./components/RequireAuth";
import { CurrentSearchesPage } from "./pages/CurrentSearchesPage";
import { WebSocketChat } from "./pages/WebSocketChatPage";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {ConfirmationsPage} from "./pages/ConfirmationsPage";
import {useAuthProvider} from "./auth/auth";
import {NotificationPage} from "./pages/NotificationPage";
import {ContactsPage} from "./pages/ContactsPage";
import {MyConfirmationsPage} from "./pages/MyConfirmationsPage";
import {ChatPage} from "./pages/ChatPage";
import {FindRivalPage} from "./pages/FindRivalPage";
import {toast} from "react-toastify";
import {Icon} from "@iconify/react";


const App = () =>{
    const auth = useAuthProvider();
    const token = auth.getToken();
    /*  the initial state of the teamId variable is set to the value retrieved
        from the localStorage using the getItem method. If the value is not
        found in localStorage, the initial state is set to 0.*/
    const [teamId, setTeamId] = useState(() => {
        if(token){
        const storedTeamId = localStorage.getItem('teamId');
        return storedTeamId !== null ? JSON.parse(storedTeamId) : 0;}
        else {return 0;}
    });

    /**
     * WEB SOCKET
     */
    //Establish the WebSocket connection and set up event handlers
    // eslint-disable-next-line no-restricted-globals
    var webSocket = new WebSocket("ws://" + location.hostname + ":4326/notificationServer");
    webSocket.onmessage = function (msg) { updateChat(msg); };
    webSocket.onopen = () => {
        if(teamId !== null || teamId !== '0')
            webSocket.send(`TeamId:${teamId}`);
    }
    function sendMessageWS(message) {
        if (message !== "") {
            if(message.substring(7) === "TeamId:"){
                webSocket.send(message);
            }
            else{
                webSocket.send(JSON.stringify(message));
            }
        }
    }

    function updateChat(msg) {
        var data = JSON.parse(msg.data);
        var message = (
            <div>
                {/*PROBAR CON IMAGEN*/}
                <img></img>
                <p>{data.userMessage}</p>
            </div>);
        toast(data.userMessage, {
            containerId: 'toast-container',
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
        });
    }


    /*  To save the state in localStorage whenever it changes,
        an effect is used with a dependency array containing
        the count variable. This effect calls the setItem method
        of localStorage with the current value of count.*/
    useEffect(() => {
        localStorage.setItem('teamId', JSON.stringify(teamId));
    }, [teamId]);
    useEffect(() => {
        // if the token is empty or null, the teamId will be 0
        if (!token) {
            localStorage.setItem('teamId', JSON.stringify(0));
        }
    }, [token])


    const toggleTeamId = (value) => {
        setTeamId(value);
    }


    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Use RequireAuth to protect all other routes */}
            <Route
                path="/*"
                element={<RequireAuth>
                    <Routes>
                        <Route path="/home" element={<HomePage toggleTeamId = {toggleTeamId}    getTeamId={teamId}/>} />
                        <Route path="/pickTeam" element={<PickTeamPage toggleTeamId = {toggleTeamId}    getTeamId={teamId}/>} />
                        <Route path="/newTeam" element={<NewTeamPage toggleTeamId = {toggleTeamId}    getTeamId={teamId}/>} />
                        <Route path="/user" element={<UserPage toggleTeamId = {toggleTeamId} getTeamId={teamId} />} />
                        <Route path="/findRival" element={<FindRivalPage toggleTeamId = {toggleTeamId} getTeamId={teamId} sendMesssageWS={(message) =>sendMessageWS(message)}/>} />
                        <Route path = "/editTeam" element = {<EditTeamPage toggleTeamId = {toggleTeamId} getTeamId={teamId}/>} />
                        <Route path = "/currentSearches" element = {<CurrentSearchesPage toggleTeamId = {toggleTeamId} getTeamId={teamId}/>} />
                        <Route path = "/ReactMap" element = {<BingMap toggleTeamId = {toggleTeamId} getTeamId={teamId}/>} />
                        <Route path = "/pendingConfirmations" element={<ConfirmationsPage toggleTeamId = {toggleTeamId} getTeamId={teamId}/>}/>
                        <Route path = "/notificationPage" element={<NotificationPage toggleTeamId = {toggleTeamId} getTeamId={teamId}/>}/>
                        <Route path = "/chat" element={<ChatPage toggleTeamId = {toggleTeamId} getTeamId={teamId}/>}/>
                        <Route path = "/webSocketChat" element={<WebSocketChat toggleTeamId = {toggleTeamId} getTeamId={teamId}/>}/>
                        <Route path = "/contacts" element={<ContactsPage toggleTeamId = {toggleTeamId} getTeamId={teamId}/>}/>
                        <Route path = "/myConfirmations" element={<MyConfirmationsPage toggleTeamId = {toggleTeamId} getTeamId={teamId}/>}/>
                    </Routes>
                </RequireAuth>}
            />
        </Routes>
    );
}

export default App;

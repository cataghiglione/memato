import * as React from 'react'
import {useEffect, useState} from 'react'
import {useNavigate} from "react-router";
import {useAuthProvider} from "../auth/auth";
import {useMySystem} from "../service/mySystem";
import {HomePage} from "./HomePage";
import "../css/Home.css"
import MenuSidebarWrapper from "./MenuDropdown";

function goToHome() {
    window.location.href = "/user"
}
function goToTeams() {
    window.location.href = "/pickTeam"
}

export const UserPage = () => {
    const navigate = useNavigate()
    const mySystem = useMySystem()
    const auth = useAuthProvider()
    const token = auth.getToken();
    const [user, setUser] = useState('')
    const [once, setOnce] = useState(true);

    const signOut = () => {
        mySystem.signOut(token, navigate("/"))
        auth.removeToken();
    }
    const getUser = () => {
        console.log(token)
        mySystem.getUser(token, (user) => setUser(user))
        console.log(user)
        setOnce(false);
    }

    return (
        <div>
            {once && getUser()}
            <MenuSidebarWrapper/>

            <div className="containerPrincipal">
                <h1>Hi {user.username}
                </h1>
                <p>First name: {user.firstName}</p>
                <p>Last name: {user.lastName}</p>
                <p>Email: {user.email}</p>
                <p>Password: {user.password}</p>
                <button id="submit" type="submit" onClick={() => goToTeams()}>Teams</button>
            </div>

            <footer className="footer">
                <a href="" onClick={goToHome}>Home</a>
            </footer>
        </div>
    )
}
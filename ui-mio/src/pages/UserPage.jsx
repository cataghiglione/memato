import * as React from 'react'
import {useEffect, useState} from 'react'
import {useNavigate} from "react-router";
import {useAuthProvider} from "../auth/auth";
import {signOut, getUser, getTeam, listTeams} from "../service/mySystem";
import {HomePage} from "./HomePage";
import "../css/Home.css"
import {TeamDropdown} from "./TeamDropdown";

function goToHome() {
    window.location.href = "/user"
}
function goToTeams() {
    window.location.href = "/pickTeam"
}

export function UserPage (props) {
    const navigate = useNavigate()
    const auth = useAuthProvider()
    const token = auth.getToken();
    const [user, setUser] = useState('')
    const [once, setOnce] = useState(true);

    const signOutMethod = () => {
        signOut(token, navigate("/"))
        auth.removeToken();
    }
    const getUserMethod = () => {
        console.log(token)
        getUser(token, (user) => setUser(user))
        console.log(user)
        setOnce(false);
    }
    return (
        <div>
            {once && getUserMethod()}
            <TeamDropdown getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}/>
            <div className="containerPrincipal">
                <h1>Hi {user.username}
                </h1>
                <p>First name: {user.firstName}</p>
                <p>Last name: {user.lastName}</p>
                <p>Email: {user.email}</p>
                <p>Password: {user.password}</p>
                <button id="submit" type="submit" onClick={() => goToTeams()}>Teams</button>
                <br></br>
                <br></br>
                <button onClick={signOut}>Sign Out</button>

            </div>

            <footer className="footer">
                <a href="" onClick={goToHome}>Home</a>
            </footer>
        </div>
    )
}
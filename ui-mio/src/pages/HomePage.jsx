import * as React from 'react'
import {useEffect, useState} from 'react'
import {useNavigate} from "react-router";
import {useAuthProvider} from "../auth/auth";
import {useMySystem} from "../service/mySystem";

function goToTeams() {
    window.location.href = "/pickTeam"
}
export const HomePage = () => {
    const navigate = useNavigate()
    const mySystem = useMySystem()
    const auth = useAuthProvider()

    const token = auth.getToken();
    const [user, setUser] = useState('')
    console.log("ESTOY EN HOMEE")
    mySystem.getUser(token, (user) => {setUser(user);})
    console.log("pase")
    console.log(user)
    const signOut = () => {
        auth.removeToken();

        //TODO falta llamar al server
        navigate("/");
    }

    return (
        <div>
            <nav className="navbar navbar-default" role="navigation">
                <div>
                    <ul className="nav navbar-nav navbar-right">
                        <li>
                            <a href="" onClick={signOut}>Sign Out</a>
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="container">
                <h1>Hi ${user.name}
                </h1>
            </div>
            <div>
                <button id="submit" type="submit" onClick={() => goToTeams()}>Teams</button>
            </div>

            <footer className="footer">
                <p>Footer</p>
            </footer>
        </div>
    )
}
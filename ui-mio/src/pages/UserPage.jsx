import * as React from 'react'
import {useState} from 'react'
import {useNavigate} from "react-router";
import {useAuthProvider} from "../auth/auth";
import {signOut, getUser} from "../service/mySystem";
import "../css/Home.css"
import {TeamDropdown} from "./TeamDropdown";

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
                <button className={"common-button"} onClick={() => window.location.href = "/pickTeam"}>Teams</button>
                <br/>
                <br/>
                <button className={"common-button"} onClick={signOutMethod}>Sign Out</button>

            </div>
        </div>
    )
}
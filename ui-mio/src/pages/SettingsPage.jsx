import * as React from 'react'
import {useNavigate} from "react-router";
import {useAuthProvider} from "../auth/auth";
import {signOut, deleteAccount} from "../service/mySystem";
import "../css/Home.css"
import {TeamDropdown} from "./TopDropdown/TeamDropdown";

export function SettingsPage (props) {
    const navigate = useNavigate()
    const auth = useAuthProvider()
    const token = auth.getToken();

    function signOutMethod(){
        signOut(token, navigate("/"))
        auth.removeToken();
    }
    const deleteMethod = () => {
        deleteAccount(token, navigate("/"))
        auth.removeToken();
    }
    return (
        <div>
            <TeamDropdown getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}/>
            <div className="containerPrincipal">
                <h1 style={{textAlign:"center"}}>Settings</h1>
                <button className={"common-button"} onClick={() => window.location.href = "/user"}>Profile</button>
                <br/><br/>
                <br/><br/>
                <br/><br/>
                <button className={"delete-button"} onClick={signOutMethod}>Sign Out</button>
                <br/>
                <br/>
                <button className={"delete-button"} onClick={deleteMethod}>Delete Account</button>
            </div>
        </div>
    )
}
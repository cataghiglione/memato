import React, {Component, useEffect, useState} from 'react';
import "../css/PickTeams.css"
import {useNavigate} from "react-router";
import {useMySystem} from "../service/mySystem";
import {useAuthProvider} from "../auth/auth";
import {useSearchParams} from "react-router-dom";

function goToNewTeam(){
    window.location.href = "/newTeam"
}
function goToHome(){
    window.location.href = "/user"
}
function showTeam(team){
    window.location.href = "/pickTeam"
}
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}
export const PickTeamPage = () => {
    const navigate = useNavigate()
    const mySystem = useMySystem()
    const auth = useAuthProvider()

    const token = auth.getToken();
    const [teams, setTeams] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const isOk = searchParams.get("ok")
    useEffect(() => {
        mySystem.listTeams(token, (teams) => setTeams(teams));
    }, [])
    return (
        <div>
            {isOk && <div className="alert alert-success" role="alert">Team created</div>}
            {isOk && sleep(500)}
            <nav className="navbar navbar-default" role="navigation">
                <div>
                    <ul className="nav navbar-nav navbar-right">

                    </ul>
                </div>
            </nav>

            <div className="containerPrincipal">
                <h1>Teams</h1>
                <ul>
                    {teams.map(team =>
                        <p>nombre = {team.name}    deporte = {team.sport} </p>
                    )}
                </ul>
                <button className={"newTeamButton"} onClick={goToNewTeam}>New Team</button>
            </div>

            <footer className="footer">
                <p>Footer</p>
                <a href="" onClick={goToHome}>Home</a>
            </footer>
        </div>
    )
}
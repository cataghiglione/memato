import React, {Component, useEffect, useState} from 'react';
import "../css/Home.css"
import "../css/PickTeam.css"
import {useNavigate} from "react-router";
import {listTeams} from "../service/mySystem";
import {useAuthProvider} from "../auth/auth";
import {useSearchParams} from "react-router-dom";
import {HomePage} from "./HomePage";
import MenuSidebarWrapper from "./MenuSideBar";

function goToNewTeam(){
    window.location.href = "/newTeam"
}
export const PickTeamPage = () => {
    const navigate = useNavigate()
    const auth = useAuthProvider()

    const token = auth.getToken();
    const [teams, setTeams] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const isOk = searchParams.get("ok")

    const [nextTeam, setNextTeam] = useState('')
    useEffect(() => {
        listTeams(token, (teams) => setTeams(teams));
    }, [token])

    const changeNextTeam = (event) => {
        setNextTeam(event.target.value);
        if(event.target.value != null){
            navigate('/findRival?id='+ event.target.value)
        }
    }

    return (
        <div>
            <div className="containerPrincipal">
                <h1 style={{textAlign:"center"}}>Teams</h1>
                <button className={"newTeamButton"} onClick={goToNewTeam}>New Team</button>
                {teams.length > 0 &&
                    <select className={"team-pick"} multiple={true} onChange={changeNextTeam}>
                        {teams.map(team =>
                                <option className={"team-select-option"} value={team.id} style={{ textTransform: 'capitalize'}}>
                                    Nombre: {team.name}, Deporte: {team.sport} {team.quantity} </option>
                            // <p>nombre = {team.name}    deporte = {team.sport} </p>
                            // <option>{team.name}</option>

                        )}
                    </select>
                }
                {teams.length === 0 &&
                    <p className={"noTeamPick"}>You haven't created any team yet</p>
                }
            </div>
        </div>
    )
}
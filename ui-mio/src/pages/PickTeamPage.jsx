import React, {Component, useEffect, useState} from 'react';
import "../css/PickTeam.css"
import {useNavigate} from "react-router";
import {listTeams} from "../service/mySystem";
import {useAuthProvider} from "../auth/auth";
import {TeamDropdown} from "./TopDropdown/TeamDropdown";

function goToNewTeam(){
    window.location.href = "/newTeam"
}

export function PickTeamPage(props) {
    const navigate = useNavigate()
    const auth = useAuthProvider()

    const token = auth.getToken();
    const [teams, setTeams] = useState([]);


    const [nextTeam, setNextTeam] = useState('')
    useEffect(() => {
        listTeams(token, (teams) => setTeams(teams));
    }, [token])

    const changeNextTeam = (event) => {
        setNextTeam(event.target.value);
        if(event.target.value != null){
            navigate('/editTeam')
        }
    }

    return (
        <div>
            <TeamDropdown getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}/>
            <div className="containerPrincipal">
                <h1 className={"teamTitle"}>Your teams</h1>
                <div>
                <button className={"newTeamButton"} onClick={goToNewTeam}>New Team</button>
                </div>
                <div>
                {teams.length > 0 &&
                    <select className="team-pick" multiple={true} onChange={changeNextTeam}>
                        {teams.map(team =>
                            <option className={"team-select-option"}
                                    >
                                Nombre: {team.name}, Deporte: {team.sport} {team.quantity}
                            </option>
                        )}
                    </select>



                }
                </div>
                {teams.length === 0 &&
                    <p className={"noTeamPick"}>You haven't created any teams yet</p>
                }
            </div>
        </div>
    )
}
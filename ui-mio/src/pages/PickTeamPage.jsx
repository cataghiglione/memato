import React, {Component, useEffect, useState} from 'react';
import "../css/PickTeam.css"
import {useNavigate} from "react-router";
import {listTeams} from "../service/mySystem";
import {useAuthProvider} from "../auth/auth";
import {TopBar} from "./TopBar/TopBar";

function goToNewTeam(){
    window.location.href = "/newTeam"
}

export function PickTeamPage(props) {
    const navigate = useNavigate()
    const auth = useAuthProvider()

    const token = auth.getToken();
    const [teams, setTeams] = useState([]);
    const [noTeams, setNoTeams] = useState(true);

    const [editing, setEditing] = useState(false);

    const [nextTeam, setNextTeam] = useState('')
    useEffect(() => {
        listTeams(token, (teams) => setTeams(teams));
        if(teams.length !== 0){setNoTeams(false)}
    }, [teams.length, token])

    const getType = (event) => {
        console.log(typeof teams)
    }

        const changeNextTeam = (event) => {
        setNextTeam(event.target.value);
        props.toggleTeamId(event.target.value)
        if(event.target.value != null){
            navigate('/editTeam')
        }
    }
    return (
        <div>
            <TopBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId} noTeams={noTeams}/>
            <div className="containerPrincipal" style={{marginLeft: '7%', marginTop: "-5%"}}>
                <h1 className={"teamTitle"}>Your teams</h1>
                <h2 className={"teamSubtitle"}>Click on a team to edit it</h2>
                <div>
                <button className={"newTeamButton"} onClick={goToNewTeam}>New Team</button>
                </div>
                <div>
                {!noTeams &&
                    <div>
                        <select className={`team-pick ${editing ? 'editing' : ''}`} multiple={true} onChange={changeNextTeam}>
                            {teams.map((team) => (
                                <option className={"team-select-option"} key={team.id} value={team.id}>
                                    Nombre: {team.name}, Deporte: {team.sport} {team.quantity}
                                </option>
                            ))}
                        </select>
                        <button className="modify-team-button" onClick={() => setEditing(!editing)}>Edit Team</button>

                    </div>
                }
                </div>
                {noTeams &&
                    <p className={"noTeamPick"}>You haven't created any teams yet</p>
                }
            </div>
        </div>
    )
}
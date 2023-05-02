import React, {Component, useEffect, useState} from 'react';
import "../css/PickTeam.css"
import {useNavigate} from "react-router";
import {listTeams} from "../service/mySystem";
import {useAuthProvider} from "../auth/auth";
import {TopBar} from "./TopBar/TopBar";
import "../css/Home.css";

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
    //todo Fijate que en changeNextTeam como que va dos veces a /editTeam, findRival te lleva primero a /editTeam y dps a /findRival
    // si haces volver atrás en el buscador de findTeam te lleva a /editTeam
    const findRival = (event) => {
        setNextTeam(event.target.value);
        props.toggleTeamId(event.target.value)
        if(event.target.value != null){
            navigate('/findRival')
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
                            <select className={`team-pick ${editing ? 'editing' : ''}`} multiple={true} onChange={findRival}>
                                {teams.map((team) => (
                                        <option className={"team-select-option-pick"} key={team.id} value={team.id}>
                                        Nombre: {team.name}, Deporte: {team.sport} {team.quantity}
                                        </option>
                                ))}
                            </select>
                            <select className={`team-edit ${editing ? 'editing' : ''}`} multiple={true} onChange={changeNextTeam}>
                                {teams.map((team) => (
                                    <option className={"team-edit-option"} key={team.id} value={team.id} style={{backgroundImage: "../images/Modify_team_pencil.jpg"}}>
                                        X
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
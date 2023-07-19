import React, {Component, useEffect, useState} from 'react';
import "../css/PickTeam.scss"
import {useNavigate} from "react-router";
import {listTeams} from "../service/mySystem";
import {useAuthProvider} from "../auth/auth";
import {TopBar} from "./TopBar/TopBar";
import "../css/Home.scss";
import {Pencil, PencilSquare} from "react-bootstrap-icons";
import {ToastContainer} from "react-toastify";
import SideBar from "./SideBar";

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

    const changeNextTeam = (id) => {
        setNextTeam(id);
        props.toggleTeamId(id);
        if(id != null){
            navigate('/editTeam')
        }
    }
    //todo Fijate que en changeNextTeam como que va dos veces a /editTeam, findRival te lleva primero a /editTeam y dps a /findRival
    // si haces volver atrás en el buscador de findTeam te lleva a /editTeam
    const findRival = (id) => {
        setNextTeam(id);
        props.toggleTeamId(id)
        if(id != null){
            navigate('/findRival')
        }
    }
    return (
        <div>
            <SideBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}></SideBar>
            <TopBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId} noTeams={noTeams}/>
            <div className="containerPrincipalPickTeam" style={{marginLeft: '10%'}}>
                <div className={"teamTitle"}>
                    <h1 style={{left: "700px"}}>Your teams</h1>
                    {/*<br/>*/}
                    <h2 style={{fontSize: "20px"}}>Click on a team to use it</h2>
                </div>
                <br/>
                <button className={"newTeamButton"} onClick={goToNewTeam}>New Team</button>
                {!noTeams && (
                    <div>
                        <div className={`team-pick`} multiple={true}>
                            {teams.map((team) => (
                                <button className={"team-select-option-pick"} key={team.id} value={team.id} onClick={() => findRival(team.id)}>
                                    {team.sport} {team.quantity}: {team.name}
                                </button>
                            ))}
                        </div>
                        <div className={`team-edit`} multiple={true}>
                            {teams.map((team) => (
                                <button className={"team-edit-option"} key={team.id} value={team.id} onClick={() => changeNextTeam(team.id)}>
                                    <PencilSquare style={{color:"black"}} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {noTeams &&
                    <p className={"noTeamPick"}>You haven't created any teams yet</p>
                }
            </div>
            <ToastContainer/> {/* Mover el ToastContainer aquí */}
        </div>
    )
}
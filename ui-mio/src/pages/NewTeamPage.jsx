import * as React from 'react'

import {useState} from "react";
import {useNavigate} from "react-router";
import {useMySystem} from "../service/mySystem";
import "../css/Login.css"
import "../images/RivalMatch_logoRecortado.png"

export const NewTeamPage = () => {

    const [sport, setSport] = useState('')
    const [quant_Players, setQuant_player] = useState('')
    const [group, setGroup] = useState('')
    const[zone, setZone] = useState('')
    const[name, setName] = useState('')

    const [errorMsg, setErrorMsg] = useState(undefined)
    const navigate = useNavigate();
    const mySystem = useMySystem();

    const handleSubmit = async e => {
        console.log("Estoy aca");
        e.preventDefault();
        registerUser({
            sport: sport,
            quant_players: quant_Players,
            group: group,
            zone: zone,
            name: name
        })
    }

    const resetForm = () => {
        setSport('')
        setZone('')
        setGroup('')
        setQuant_player('')
        setName('')
    }

    const registerUser = (user) => {
        console.log("pase!")
        mySystem.newTeam(
            user,
            () => console.log("New Team created!"),
            () => {
                setErrorMsg('Team already exists!')
                resetForm();
            }
        )
    }

    const sportChange = (event) => {
        setSport(event.target.value)
    }
    const quant_PlayersChange = (event) => {
        setQuant_player(event.target.value)
    }
    const groupChange = (event) => {
        setGroup(event.target.value)
    }
    const zoneChange = (event) => {
        setZone(event.target.value)
    }

    const nameChange = (event) => {
        setName(event.target.value)
    }

    function newTeamRequest(){
        console.log("Im requesting a new Team!");
    }

    return (
        <div className={"containerPrincipal"}>
            {errorMsg && <div className="alert alert-danger" role="alert">{errorMsg}</div>}

            <img style={{ width: 218, height: "auto"}} src={require("../images/RivalMatch_logoRecortado.png")} alt={"Logo"}/>
            <form onSubmit={handleSubmit}>
                <br/>
                <div>
                    <input type="sport"
                           placeholder="Football"
                           value={sport}
                           name="sport"
                           onChange={sportChange}/>
                </div>

                <br/>
                <div>
                    <input type="Name"
                           id="Name"
                           placeholder="Name"
                           name ="Name"
                           value={name}
                           onChange={nameChange}/>
                </div>
                <br/>
                <div>
                    <input
                        type="quantity Players"
                        id="quantPlayers"
                        placeholder="11"
                        name="quantity Players"
                        value={quant_Players}
                        onChange={quant_PlayersChange}/>
                </div>
                <br/>
                <div>
                    <input
                        type="zone"
                        id="zone"
                        placeholder="Pilar"
                        name="zone"
                        value={zone}
                        onChange={zoneChange}/>
                </div>
                <br/>
                <div>
                    <input type="group"
                           id="group"
                           placeholder="Young"
                           name="group"
                           value={group}
                           onChange={groupChange}/>
                </div>
                <br/>
                <br/>
                <div>
                    {/*<button type="submit" className={"signUpButton"}>Sign up</button>*/}
                    <button id="submit" type="submit" onClick={() => newTeamRequest()}>Create Team</button>
                </div>
                <br/>
            </form>
        </div>
    )
}

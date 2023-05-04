import React, {Component, useEffect, useState} from 'react';
import {useAuthProvider} from "../auth/auth";
import {useSearchParams} from "react-router-dom";
import "../css/EditTeam.css"
import { getTeam, updateTeam, deleteTeam} from "../service/mySystem";
import {useLocation} from "react-router";
import {useNavigate} from "react-router";
import {TopBar} from "./TopBar/TopBar";

function goToPickTeam() {
    window.location.href = "/pickTeam"
}
export function EditTeamPage(props) {
    const auth = useAuthProvider()
    const token = auth.getToken();
    const location = useLocation();
    const id = props.getTeamId;
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [errorMsg, setErrorMsg] = useState(undefined)
    const isOk = searchParams.get("ok")


    const [sport, setSport] = useState('')
    const [quant_Players, setQuant_player] = useState('')
    const [age_group, setAge_group] = useState('')
    // const [zone, setZone] = useState('')
    const [name, setName] = useState('')
    const [team, setTeam] = useState('');

    useEffect(() => {
        getTeam(token, id, (team) => setTeam(team));
    }, [])
    useEffect(() => {
        setSport(team.sport);
        setQuant_player(team.quantity);
        setName(team.name);
        // setZone(team.zone)
        setAge_group(team.age_group)
    }, [team]);

    const isEmpty = value => value === null || value === undefined || value === '';



    const handleSubmit = async e => {
        e.preventDefault();

        if (isEmpty(name)){setName(team.name)
        console.log("entre a este if")}
        // if (isEmpty(zone)){setZone(team.zone)}
        if (isEmpty(sport)){setSport( team.sport)}
        if(isEmpty(quant_Players)){setQuant_player(team.quantity)}
        if(isEmpty(age_group)){setAge_group(team.age_group)}
        console.log("no entre al error")
        saveChanges({
            sport: sport || team.sport,
            quantity: quant_Players || team.quantity,
            age_group: age_group || team.age_group,
            // zone: zone || team.zone,
            name: name || team.name
        })
    }

    const resetForm = () => {
        setName(team.name);
        // setZone(team.zone);
        setAge_group(team.age_group);
        setSport(team.sport);
        setQuant_player(team.quantity);
    };


    const saveChanges = (form) => {
        console.log("estoy en save changes")
        updateTeam(token,id,
            form,
            () => navigate("/pickTeam?ok=true"),
            () => {
                setErrorMsg('An error ocurred')
                navigate("/pickTeam?ok=false")
            }
        )
    }
    const handleDeleteClick = () => {
        if (window.confirm('Are you sure you want to delete this team?')) {
            console.log("entre a borrar")
            deleteTeam(token,id,()=>navigate("/pickTeam?ok=true"),()=>{setErrorMsg('An error ocurred')
                navigate("/pickTeam?ok=false")})
        }
        else {
            goToPickTeam()
        }
    }
    const handleGoToPickTeam = () => {
        resetForm();
        goToPickTeam();
    };


    const sportChange = (event) => {
        setSport(event.target.value)
    }
    const quant_PlayersChange = (event) => {
        setQuant_player(event.target.value)
    }
    const groupChange = (event) => {
        setAge_group(event.target.value)
    }
    // const zoneChange = (event) => {
    //     setZone(event.target.value)
    // }

    const nameChange = (event) => {
        setName(event.target.value)
    }

    function newTeamRequest() {
        console.log("Im requesting a new Team!");
    }

    if (isOk) {
        resetForm();
    }


    const teamNameStyle = {
        fontSize: 40,
        textTransform: 'capitalize'

    };
    const sportAndQuantityStyle = {
        fontSize: 30,
        textTransform: 'capitalize'
    };
    return (
        <div>
            {errorMsg && <div className="alert alert-danger" role="alert">{errorMsg}</div>}
            {isOk && <div className="alert alert-success" role="alert">Changes saved</div>}
            {/*<div className={"logo"}>*/}
            {/*    <img style={{width: 150, height: "auto"}} src={require("../images/logo_solo_letras.png")} alt={"Logo"}/>*/}
            {/*</div>*/}
            <div className={"team_name"} style={teamNameStyle}>
                {team.name}
            </div>
            <div className={"sport_and_quantity"} style={sportAndQuantityStyle}>
                {team.sport} {team.quantity}
            </div>

            <TopBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}/>
            <div className={"form"}>


                <form onSubmit={handleSubmit}>
                    <br/>
                    <div>
                        <p>Team name: <input type="Name"
                               id="Name"
                               placeholder="Name"
                               name="Name"
                               value={name}
                               onChange={nameChange}/></p>
                    </div>
                    {/*<div>*/}
                    {/*    <input*/}
                    {/*        type="zone"*/}
                    {/*        id="zone"*/}
                    {/*        placeholder="Zone"*/}
                    {/*        name="zone"*/}
                    {/*        value={zone}*/}
                    {/*        onChange={zoneChange}/>*/}
                    {/*</div>*/}
                    <div>
                        <br/>
                       <p>Group:  <select id="age_group" required onChange={groupChange} value={age_group}>
                            <option  value=""></option>
                            <option value="Young">Young</option>
                            <option value="Adults">Adults</option>
                        </select></p>
                    </div>


                    <br/>
                    <p>Sport: <select id="sport" required onChange={sportChange} value={sport}>
                        <option value=""></option>
                        <option value="Football">Football</option>
                        <option value="Padel">Padel</option>
                    </select></p>
                    <br/>
                    {sport === "Football" &&
                        (
                            <div>
                                <p>Quantity<select id="Quantity" required onChange={quant_PlayersChange} value={quant_Players}>
                                    <option  value=""></option>
                                    <option value="11">11</option>
                                    <option value="7">7</option>
                                    <option value="5">5</option>
                                </select></p>
                            </div>
                        )
                    }
                    {sport === "Padel" &&
                        (
                            <div>
                                <p>Quantity: <select id="Quantity" required onChange={quant_PlayersChange} defaultValue={team.quantity}>
                                    <option value=""></option>
                                    <option value="2">2</option>
                                    <option value="1">1</option>
                                </select></p>
                            </div>
                        )
                    }
                    <div>
                        {/*<button type="submit" className={"signUpButton"}>Sign up</button>*/}
                        <button id="submit" type="submit" className={"saveChangesButton"} onClick={() => newTeamRequest()}>Save Changes</button>
                    </div>
                    <div>
                        <button className={"goBackButton"} onClick={handleGoToPickTeam}>Return to Pick Team</button>
                    </div>
                </form>
                    <br/>
                    <div>
                        <button className={"delete-button"} onClick={handleDeleteClick}>Delete team</button>
                    </div>


            </div>


        </div>
    )
}
import React, {Component, useEffect, useState} from 'react';
import {useAuthProvider} from "../auth/auth";
import {useSearchParams} from "react-router-dom";
import "../css/EditTeam.css"
import { getTeam, updateTeam, deleteTeam} from "../service/mySystem";
import {useLocation} from "react-router";
import {useNavigate} from "react-router";

function goToPickTeam() {
    window.location.href = "/pickTeam"
}
export const EditTeamPage = () => {
    const auth = useAuthProvider()
    const token = auth.getToken();
    const location = useLocation();
    const params = new URLSearchParams(location.search)
    const id = params.get("id");
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [errorMsg, setErrorMsg] = useState(undefined)
    const isOk = searchParams.get("ok")


    const [sport, setSport] = useState('')
    const [quant_Players, setQuant_player] = useState('')
    const [age_group, setAge_group] = useState('')
    const [zone, setZone] = useState('')
    const [name, setName] = useState('')
    const [team, setTeam] = useState('');
    useEffect(() => {
        getTeam(token, id, (team) => setTeam(team));
    }, [])
    useEffect(() => {
        setSport(team.sport);
        setQuant_player(team.quantity);
        setName(team.name);
        setZone(team.zone)
        setAge_group(team.age_group)
    }, [team]);

    const isEmpty = value => value === null || value === undefined || value === '';



    const handleSubmit = async e => {
        e.preventDefault();
        // if (!name || !zone ) {
        //     console.log("estoy en un error")
        //     setErrorMsg('Please fill out all the required fields')
        //     return;
        // }
        if (isEmpty(name)){setName(team.name)
        console.log("entre a este if")}
        if (isEmpty(zone)){setZone(team.zone)}
        if (isEmpty(sport)){setSport( team.sport)}
        if(isEmpty(quant_Players)){setQuant_player(team.quantity)}
        if(isEmpty(age_group)){setAge_group(team.age_group)}
        console.log("no entre al error")
        saveChanges({
            sport: sport || team.sport,
            quantity: quant_Players || team.quantity,
            age_group: age_group || team.age_group,
            zone: zone || team.zone,
            name: name || team.name
        })
    }

    const resetForm = () => {
        setSport('')
        setZone('')
        setAge_group('')
        setQuant_player('')
        setName('')
    }

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


    const sportChange = (event) => {
        setSport(event.target.value)
    }
    const quant_PlayersChange = (event) => {
        setQuant_player(event.target.value)
    }
    const groupChange = (event) => {
        setAge_group(event.target.value)
    }
    const zoneChange = (event) => {
        setZone(event.target.value)
    }

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
            <div className={"logo"}>
                <img style={{width: 150, height: "auto"}} src={require("../images/logo_solo_letras.png")} alt={"Logo"}/>
            </div>
            <div className={"team_name"} style={teamNameStyle}>
                {team.name}
            </div>
            <div className={"sport_and_quantity"} style={sportAndQuantityStyle}>
                {team.sport} {team.quantity}
            </div>

            <div className={"form"}>


                <form onSubmit={handleSubmit}>
                    <br/>
                    <div>
                        <input type="Name"
                               id="Name"
                               placeholder="Name"
                               name="Name"
                               value={name}
                               onChange={nameChange}/>
                    </div>
                    <br/>
                    <div>
                        <input
                            type="zone"
                            id="zone"
                            placeholder="Zone"
                            name="zone"
                            value={zone}
                            onChange={zoneChange}/>
                    </div>
                    <div>
                        <br/>
                        <select id="age_group" required onChange={groupChange} value={age_group}>
                            <option disabled = {true} value="Group">Group</option>
                            <option value="Young">Young</option>
                            <option value="Adults">Adults</option>
                        </select>
                    </div>


                    <br/>
                    <select id="sport" required onChange={sportChange} value={sport}>
                        <option disabled={true} value="Sport">Sport</option>
                        <option value="Football">Football</option>
                        <option value="Padel">Padel</option>
                    </select>
                    <br/>
                    {sport === "Football" &&
                        (
                            <div>
                                <select id="Quantity" required onChange={quant_PlayersChange} value={quant_Players}>
                                    <option disabled = {true} value="Quantity">Quantity</option>
                                    <option value="11">11</option>
                                    <option value="7">7</option>
                                    <option value="5">5</option>
                                </select>
                            </div>
                        )
                    }
                    {sport === "Padel" &&
                        (
                            <div>
                                <select id="Quantity" required onChange={quant_PlayersChange} defaultValue={team.quantity}>
                                    <option disabled = {true} value="Quantity">Quantity</option>
                                    <option value="2">2</option>
                                    <option value="1">1</option>
                                </select>
                            </div>
                        )
                    }
                    <div>
                        {/*<button type="submit" className={"signUpButton"}>Sign up</button>*/}
                        <button id="submit" type="submit" className={"saveChangesButton"} onClick={() => newTeamRequest()}>Save Changes</button>
                    </div>
                    <div>
                        <button className={"goBackButton"} onClick={goToPickTeam}>Return to Pick Team</button>
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
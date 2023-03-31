import * as React from 'react'

import {useState} from "react";
import {useNavigate} from "react-router";
import {useMySystem} from "../service/mySystem";
import "../css/Home.css"
import "../images/RivalMatch_logoRecortado.png"
import {HomePage} from "./HomePage";

export const NewTeamPage = () => {

    const [sport, setSport] = useState('')
    const [quant_Players, setQuant_player] = useState('')
    const [group, setGroup] = useState('')
    const [zone, setZone] = useState('')
    const [name, setName] = useState('')

    const [errorMsg, setErrorMsg] = useState(undefined)
    const [menuOpen, setMenuOpen] = useState(false);
    const [pageChange, setPageChange] = useState("New Team");
    const navigate = useNavigate();
    const mySystem = useMySystem();
    const handleSubmit = async e => {
        e.preventDefault();
        registerTeam({
            sport: sport,
            quantity: quant_Players,
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
        navigate("/newTeam")
    }

    const registerTeam = (team) => {
        mySystem.newTeam(
            team,
            () => {
                navigate("/pickTeam?ok=true", {replace: true})
                console.log("entro al okCall")
            },
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

    function newTeamRequest() {
        console.log("Im requesting a new Team!");
    }
    const changePage = (event) => {
        setPageChange(event.target.value);
    }

    return (
        <div>
            <button className={"Menu"} id="submit" type="submit" onClick={() => setMenuOpen(!menuOpen)}>
                <img style={{ width: 22, height: "auto"}} src={require("../images/sideBarIcon.png")} alt={"Logo"}/>
            </button>
            {menuOpen &&
                <select className={"custom-select"} id="Menu" multiple={true} onChange={changePage}>
                    <option className={"custom-select-option"} value="Home">Home</option>
                    <option className={"custom-select-option"} value="User">User</option>
                    <option className={"custom-select-option"} value="Pick Team">Pick Team</option>
                    <option className={"custom-select-option"} value="New Team">New Team</option>
                </select>
            }

            <div className="containerPrincipal">
                {errorMsg && <div className="alert alert-danger" role="alert">{errorMsg}</div>}

                {pageChange === "User" && HomePage.goToUserInfo()}
                {pageChange === "Pick Team" && HomePage.goToPickTeam()}
                {pageChange === "New Team" && HomePage.goToNewTeam()}
                {pageChange === "Home" && HomePage.goToHome()}
                <img style={{width: 218, height: "auto"}} src={require("../images/RivalMatch_logoRecortado.png")}
                     alt={"Logo"}/>
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
                            placeholder="Pilar"
                            name="zone"
                            value={zone}
                            onChange={zoneChange}/>
                    </div>
                    <br/>
                    <select id="Group" required onChange={groupChange}>
                        <option value="Group">Group</option>
                        <option value="Young">Young</option>
                        <option value="Adults">Adults</option>
                    </select>
                    <br/>
                    <select id="sport" required onChange={sportChange}>
                        <option value="Sport">Sport</option>
                        <option value="Football">Football</option>
                        <option value="Padel">Padel</option>
                    </select>
                    <br/>
                    {sport === "Football" &&
                        (
                            <div>
                                <select id="Quantity" required onChange={quant_PlayersChange}>
                                    <option value="Quantity">Quantity</option>
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
                                <select id="Quantity" required onChange={quant_PlayersChange}>
                                    <option value="Quantity">Quantity</option>
                                    <option value="2">2</option>
                                    <option value="1">1</option>
                                </select>
                            </div>
                        )
                    }
                    <div>
                        {/*<button type="submit" className={"signUpButton"}>Sign up</button>*/}
                        <button id="submit" type="submit" onClick={() => newTeamRequest()}>Create Team</button>
                    </div>
                    <br/>
                </form>
            </div>
    </div>
    )
}

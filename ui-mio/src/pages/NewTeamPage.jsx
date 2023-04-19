import * as React from 'react'

import {useState} from "react";
import {useNavigate} from "react-router";
import {newTeam} from "../service/mySystem";
import "../css/Home.css"
import "../images/RivalMatch_logoRecortado.png"
import {useSearchParams} from "react-router-dom";
import {render} from "@testing-library/react";
import {useAuthProvider} from "../auth/auth";
import MenuSidebarWrapper from "./MenuSideBar";

export const NewTeamPage = () => {

    const [sport, setSport] = useState('')
    const [quant_Players, setQuant_player] = useState('')
    const [age_group, setAge_group] = useState('')
    const [zone, setZone] = useState('')
    const [name, setName] = useState('')
    const auth = useAuthProvider()
    const token = auth.getToken();

    const [errorMsg, setErrorMsg] = useState(undefined)
    const navigate = useNavigate();
    const mySystem = useMySystem();
    const [searchParams, setSearchParams] = useSearchParams();
    const isOk = searchParams.get("ok")

    const [menuOpen, setMenuOpen] = useState(false);
    const [pageChange, setPageChange] = useState("Home");

    const changePage = (event) => {
        setPageChange(event.target.value);
    }

    const handleSubmit = async e => {
        console.log("Estoy aca");
        e.preventDefault();
        registerTeam({
            sport: sport,
            quantity: quant_Players,
            age_group: age_group,
            zone: zone,
            name: name
        })
    }

    const resetForm = () => {
        setSport('')
        setZone('')
        setAge_group('')
        setQuant_player('')
        setName('')
    }

    const registerTeam = (user) => {
        console.log("estoy en el registro!")
        newTeam(token,
            user,
            () => navigate("/pickTeam?ok=true"),
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


    return (
        <div>
            <MenuSidebarWrapper/>
            <div className={"containerPrincipal"}>
                {errorMsg && <div className="alert alert-danger" role="alert">{errorMsg}</div>}
                {isOk && <div className="alert alert-success" role="alert">Team created</div>}

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
                    <div>
                    <br/>
                    <select id="age_group" required onChange={groupChange}>
                        <option value="Group">Group</option>
                        <option value="Young">Young</option>
                        <option value="Adults">Adults</option>
                    </select>
                    </div>


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

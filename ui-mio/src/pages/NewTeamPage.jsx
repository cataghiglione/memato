import * as React from 'react'

import {useState} from "react";
import {useNavigate} from "react-router";
import {newTeam} from "../service/mySystem";
import "../css/Home.scss"
import "../images/RivalMatch_logoRecortado.png"
import {useSearchParams} from "react-router-dom";
import {render} from "@testing-library/react";
import {useAuthProvider} from "../auth/auth";
import MenuSidebarWrapper from "./TopBar/MenuSideBar";
import {TopBar} from "./TopBar/TopBar";
import {Icon} from "@iconify/react";
import SideBar from "./SideBar";

export function NewTeamPage (props){

    const [sport, setSport] = useState("")
    const [quant_Players, setQuant_player] = useState("")
    const [age_group, setAge_group] = useState("")
    // const [zone, setZone] = useState('')
    const [name, setName] = useState('')
    const auth = useAuthProvider()
    const token = auth.getToken();

    const [errorMsg, setErrorMsg] = useState(undefined)
    const navigate = useNavigate();
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
        //falta poner uno con zone, si se vuelve a agregar
        if (!name || !age_group || !sport || !quant_Players) {
            setErrorMsg('Please fill out all the required fields')
            return;
        }
        registerTeam({
            sport: sport,
            quantity: quant_Players,
            age_group: age_group,
            // zone: zone,
            name: name.charAt(0).toUpperCase() + name.substring(1).toLowerCase()
        })
    }

    const resetForm = () => {
        setSport('')
        // setZone('')
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
    const handleFootballQuantChange=()=>{
        setQuant_player("11")
    }
    const handlePadellQuantChange=()=>{
        setQuant_player("2")
    }



    return (
        <div>
            <SideBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}></SideBar>
            <TopBar getTeamId = {props.getTeamId}/>
            <div className={"containerPrincipalNewTeam"}>
                {errorMsg && <div className="alert alert-danger" role="alert">{errorMsg}</div>}
                {isOk && <div className="alert alert-success" role="alert">Team created</div>}
                <h1 className={"team_name"}>Create a team</h1>
                {/*<img style={{width: 218, height: "auto"}} src={require("../images/RivalMatch_logoRecortado.png")}*/}
                {/*     alt={"Logo"}/>*/}
                <form onSubmit={handleSubmit}>
                    <br/>
                    <div className={"new-team-name"} >
                        <p>Team Name: <input type="Name"
                               id="Name"
                               placeholder="Name"
                               name="Name"
                               value={name}
                               onChange={nameChange}/>
                        </p>
                    </div>

                    {/*<div>*/}
                    {/*    <p>Zone:<input*/}
                    {/*        type="zone"*/}
                    {/*        id="zone"*/}
                    {/*        placeholder="Zone"*/}
                    {/*        name="zone"*/}
                    {/*        value={zone}*/}
                    {/*        onChange={zoneChange}/></p>*/}
                    {/*</div>*/}
                    <div className={"new-team-age-group"}>
                        <br/>
                        <p>Group:<select id="age_group"  onChange={groupChange} value={age_group}>
                            <option  value=""></option>
                            <option value="Young">Young</option>
                            <option value="Adults">Adults</option>
                        </select></p>
                    </div>
                    <br/>
                    <div className={"new-team-sport"}>
                        <p>Sport:<select id="sport"  onChange={sportChange} value={sport}>
                            <option value=""></option>
                            <option value="Football">Football</option>
                            <option value="Padel">Padel</option>
                        </select></p>
                    </div>
                    <br/><br/><br/>
                    {sport === "Football" && (
                        <div className={"new-team-quantity"}>
                            {/*{handleFootballQuantChange()}*/}

                            <p>Quantity<select id="Quantity"  onChange={quant_PlayersChange} value={quant_Players}>
                                <option value=""></option>
                                <option value="11">11</option>
                                <option value="7">7</option>
                                <option value="5">5</option>
                            </select></p>
                        </div>
                    )}
                    {sport === "Padel" && (
                        <div className={"new-team-quantity"}>
                            {/*{handlePadellQuantChange()}*/}
                            {/*{setQuant_player("2")}*/}
                            <p>Quantity:<select id="Quantity"  onChange={quant_PlayersChange} value={quant_Players}>
                                <option  value=""></option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                            </select></p>
                        </div>
                    )}
                    <div>
                        <br/>
                        {/*<button type="submit" className={"signUpButton"}>Sign up</button>*/}
                        <button id="submit" type="submit" className={"saveChangesButton"} onClick={() => newTeamRequest()}>Create Team</button>
                    </div>
                    <br/>
                </form>
            </div>
        </div>
    )
}

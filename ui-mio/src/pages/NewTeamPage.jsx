import * as React from 'react'

import {useState} from "react";
import {useNavigate} from "react-router";
import {useMySystem} from "../service/mySystem";
import "../css/Login.css"
import "../images/RivalMatch_logoRecortado.png"
import {useSearchParams} from "react-router-dom";
import {render} from "@testing-library/react";
import {useAuthProvider} from "../auth/auth";

export const NewTeamPage = () => {

    const [sport, setSport] = useState('')
    const [quant_Players, setQuant_player] = useState('')
    const [group, setGroup] = useState('')
    const [zone, setZone] = useState('')
    const [name, setName] = useState('')
    const auth = useAuthProvider()
    const token = auth.getToken();

    const [errorMsg, setErrorMsg] = useState(undefined)
    const navigate = useNavigate();
    const mySystem = useMySystem();
    const [searchParams, setSearchParams] = useSearchParams();
    const isOk = searchParams.get("ok")
    const handleSubmit = async e => {
        console.log("Estoy aca");
        e.preventDefault();
        registerUser({
            sport: sport,
            quantity: quant_Players,
            age_group: group,
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

    const registerUser = (user) => {
        console.log("estoy en el registro!")
        mySystem.newTeam(token,
            user,
            () => navigate("/newTeam?ok=true"),
            () => {
                setErrorMsg('Team already exists!')
                resetForm();
            }
        )
    }

    const sportChange = (event) => {
        setSport(event.target.value)
        // console.log(sport)
        // if(event.target.value === "Football"){
        //     render(
        //         <br>
        //         <div>
        //                 <select id="Quantity" required onChange={this.quant_PlayersChange}>
        //                 <option>11</option>
        //                 <option>7</option>
        //             </select>
        //         </div>
        //     </br>
        // )
        // }
        // else{
        //     return(
        //         <br>
        //         <div>
        //             <select id="Quantity" required onChange={quant_PlayersChange}>
        //                 <option value="2">2</option>
        //                 <option value="1">1</option>
        //             </select>
        //         </div>
        //         </br>
        //     )}
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

    if (isOk) {
        resetForm();
    }


    return (
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
                <br/>
                <select id="Group" required onChange={groupChange}>
                    <option value="Group">Group </option>
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
    )
}

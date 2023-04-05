import React, {Component, useEffect, useState} from 'react';
import "../css/Home.css"
import "../css/PickTeam.css"
import {useNavigate} from "react-router";
import {useMySystem} from "../service/mySystem";
import {useAuthProvider} from "../auth/auth";
import {useSearchParams} from "react-router-dom";
import {HomePage} from "./HomePage";

function goToNewTeam(){
    window.location.href = "/newTeam"
}
function goToHome(){
    window.location.href = "/user"
}
function showTeam(team){
    window.location.href = "/pickTeam"
}
function goToFindRival(team){
    window.location.href = "/findRival"
}
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}
export const PickTeamPage = () => {
    const navigate = useNavigate()
    const mySystem = useMySystem()
    const auth = useAuthProvider()

    const token = auth.getToken();
    const [teams, setTeams] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const isOk = searchParams.get("ok")

    const [menuOpen, setMenuOpen] = useState(false);
    const [pageChange, setPageChange] = useState("Home");

    const [nextTeam, setNextTeam] = useState('')
    useEffect(() => {
        mySystem.listTeams(token, (teams) => setTeams(teams));
    }, [])

    const changePage = (event) => {
        setPageChange(event.target.value);
    }
    const changeNextTeam = (event) => {
        setNextTeam(event.target.value);
        if(event.target.value != null){
            navigate('/findRival?id='+ event.target.value)
        }
    }

    return (
        <div>
            <button className={"Menu"} id="submit" type="submit" onClick={() => setMenuOpen(!menuOpen)}>
                <img style={{ width: 22, height: "auto"}} src={require("../images/sideBarIcon.png")} alt={"Logo"}/>
            </button>
            {isOk && <div className="alert alert-success" role="alert">Team created</div>}
            {isOk && sleep(500)}
            {menuOpen &&
                <select className={"custom-select"} id="Menu" multiple={true} onChange={changePage}>
                    <option className={"custom-select-option"} value="Home">Home</option>
                    <option className={"custom-select-option"} value="User">User</option>
                    <option className={"custom-select-option"} value="Pick Team">Pick Team</option>
                    <option className={"custom-select-option"} value="New Team">New Team</option>
                    <option className={"custom-select-option"} value="Find Rival">Find Rival</option>
                </select>
            }

            <div className="containerPrincipal">
                {pageChange === "User" && HomePage.goToUserInfo()}
                {pageChange === "Pick Team" && HomePage.goToPickTeam()}
                {pageChange === "New Team" && HomePage.goToNewTeam()}
                {pageChange === "New Team" && goToNewTeam()}
                {pageChange === "Find Rival" && goToFindRival()}
                <h1>Teams</h1>
                <button className={"newTeamButton"} onClick={goToNewTeam}>New Team</button>
                <select className={"team-select"} multiple={true} onChange={changeNextTeam}>
                    {teams.map(team =>
                        <option className={"team-select-option"} value={team.id}>nombre = {team.name}    deporte = {team.sport} </option>
                        // <p>nombre = {team.name}    deporte = {team.sport} </p>
                        // <option>{team.name}</option>

                    )}
                </select>
                <button className={"newTeamButton"} onClick={goToNewTeam}>New Team</button>
            </div>
        </div>
    )
}
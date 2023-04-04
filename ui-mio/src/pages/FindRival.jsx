import React, {useEffect, useState} from 'react';
import "../css/Home.css"
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

export const FindRivalPage = () => {
    const navigate = useNavigate()
    const mySystem = useMySystem()
    const auth = useAuthProvider()

    const token = auth.getToken();

    const [searchParams] = useSearchParams();
    const idTeam = searchParams.get("id")

    const [menuOpen, setMenuOpen] = useState(false);
    const [pageChange, setPageChange] = useState("Home");

    const [teams, setTeams] = useState([]);

    useEffect(() => {
        mySystem.findRival(token, idTeam, (teams) => setTeams(teams));
    }, [])

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
                {pageChange === "User" && HomePage.goToUserInfo()}
                {pageChange === "Pick Team" && HomePage.goToPickTeam()}
                {pageChange === "New Team" && HomePage.goToNewTeam()}
            </div>
            <div>
                {console.log(teams)}
                {teams.map(team =>
                    <p>nombre = {team.name}    deporte = {team.sport} </p>
                )}
            </div>
        </div>
    )
}
import * as React from 'react'
import {useEffect, useState} from 'react'
import {useNavigate} from "react-router";
import {useAuthProvider} from "../auth/auth";
import {useMySystem} from "../service/mySystem";
import {HomePage} from "./HomePage";
import "../css/Home.css"

function goToHome() {
    window.location.href = "/user"
}
function goToTeams() {
    window.location.href = "/pickTeam"
}

export const UserPage = () => {
    const navigate = useNavigate()
    const mySystem = useMySystem()
    const auth = useAuthProvider()
    const token = auth.getToken();
    const [user, setUser] = useState('')
    const [once, setOnce] = useState(true);

    const [menuOpen, setMenuOpen] = useState(false);
    const [pageChange, setPageChange] = useState("Home");

    const changePage = (event) => {
        setPageChange(event.target.value);
    }

    const signOut = () => {
        auth.removeToken();

        //TODO falta llamar al server
        navigate("/");
    }
    const getUser = () => {
        console.log(token)
        mySystem.getUser(token, (user) => setUser(user))
        console.log(user)
        setOnce(false);
    }

    return (
        <div>
            {once && getUser()}
            <button className={"Menu"} id="submit" type="submit" onClick={() => setMenuOpen(!menuOpen)}>
                <img style={{ width: 22, height: "auto"}} src={require("../images/sideBarIcon.png")} alt={"Logo"}/>
            </button>
            <nav className="navbar navbar-default" role="navigation">
                <div>
                    <ul className="nav navbar-nav navbar-right">
                        <li>
                            <a href="" onClick={signOut}>Sign Out</a>
                        </li>
                    </ul>
                </div>
            </nav>
            {menuOpen &&
                <select className={"custom-select"} id="Menu" multiple={true} onChange={changePage}>
                    <option className={"custom-select-option"} value="Home">Home</option>
                    <option className={"custom-select-option"} value="User">User</option>
                    <option className={"custom-select-option"} value="Pick Team">Pick Team</option>
                    <option className={"custom-select-option"} value="New Team">New Team</option>
                </select>
            }

            <div className="containerPrincipal">
                {pageChange === "User" && goToHome()}
                {pageChange === "Pick Team" && HomePage.goToPickTeam()}
                {pageChange === "New Team" && HomePage.goToNewTeam()}
                <h1>Hi {user.username}
                </h1>
                <p align="center">First name: {user.firstName}</p>
                <p>Last name: {user.lastName}</p>
                <p>Email: {user.email}</p>
                <p>Password: {user.password}</p>
                <button id="submit" type="submit" onClick={() => goToTeams()}>Teams</button>
            </div>

            <footer className="footer">
                <a href="" onClick={goToHome}>Home</a>
            </footer>
        </div>
    )
}
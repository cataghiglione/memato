import * as React from 'react'
import {useState} from 'react'
import {useNavigate} from "react-router";
import {useAuthProvider} from "../auth/auth";
import {useMySystem} from "../service/mySystem";
import "../css/Home.css";
function goToPickTeam() {
    window.location.href = "/pickTeam"
}
function goToNewTeam() {
    window.location.href = "/newTeam"
}

function goToUserInfo() {
    window.location.href = "/user"
}
function goToHome() {
    window.location.href = "/home"
}

export const HomePage = () => {
    const navigate = useNavigate()
    const mySystem = useMySystem()
    const auth = useAuthProvider()
    const token = auth.getToken();
    const [user, setUser] = useState('')
    const [onceOpen, setOnceOpen] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [pageChange, setPageChange] = useState("Home");

    const signOut = () => {
        auth.removeToken();

        //TODO falta llamar al server
        navigate("/");
    }
    const getUser = () => {
        console.log(token)
        mySystem.getUser(token, (user) => {
            console.log(user);
            setUser(user);
        })
        setOnceOpen(false);
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
                {onceOpen && getUser()}
                {pageChange === "User" && goToUserInfo()}
                {pageChange === "Pick Team" && goToPickTeam()}
                {pageChange === "New Team" && goToNewTeam()}
                <div>
                    <h1>Hi {user.firstName}
                    </h1>
                </div>
            </div>
        </div>
    )
}
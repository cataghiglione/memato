import * as React from 'react'
import {useState} from 'react'
import {useAuthProvider} from "../auth/auth";
import {useMySystem} from "../service/mySystem";
import MenuDropdown from "./MenuDropdown";
import "../css/Home.css";


export const HomePage = () => {
    const mySystem = useMySystem()
    const auth = useAuthProvider()
    const token = auth.getToken();
    const [user, setUser] = useState('')
    const [onceOpen, setOnceOpen] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const getUser = () => {
        mySystem.getUser(token, (user) => {
            setUser(user);
        })
        setOnceOpen(false);
    }
    const menu = new MenuDropdown();
    return (
        <div>
            {/*<button className={"Menu"} id="submit" type="submit" onClick={() => setMenuOpen(!menuOpen)}>*/}
            {/*    <img style={{ width: 22, height: "auto"}} src={require("../images/sideBarIcon.png")} alt={"Logo"}/>*/}
            {/*</button>*/}
            {/*{menuOpen && menuForm(menuOpen)}*/}
            {/*{!menuOpen &&*/}
            {/*    <p>NO ABREEE 2.0</p>}*/}
            {/*{console.log(menuOpen.toString())}*/}
            {menu.render()}
            <div className="containerPrincipal">
                {onceOpen && getUser()}
                <div>
                    <h1>Hi {user.firstName}
                    </h1>
                </div>
            </div>
        </div>
    )
}
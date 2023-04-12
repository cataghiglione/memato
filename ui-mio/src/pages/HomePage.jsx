import * as React from 'react'
import {useState} from 'react'
import {useAuthProvider} from "../auth/auth";
import {useMySystem} from "../service/mySystem";
import MenuSidebarWrapper from "./MenuDropdown";
import "../css/Home.css";


export const HomePage = () => {
    const mySystem = useMySystem()
    const auth = useAuthProvider()
    const token = auth.getToken();
    const [user, setUser] = useState('')
    const [onceOpen, setOnceOpen] = useState(true);
    const getUser = () => {
        mySystem.getUser(token, (user) => {
            setUser(user);
        })
        setOnceOpen(false);
    }
    return (
        <div>
            <MenuSidebarWrapper/>
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
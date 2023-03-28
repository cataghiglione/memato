import * as React from 'react'
import {useEffect, useState} from 'react'
import {useNavigate} from "react-router";
import {useAuthProvider} from "../auth/auth";
import {useMySystem} from "../service/mySystem";

export const UsersPage = () => {
    const navigate = useNavigate()
    const mySystem = useMySystem()
    const auth = useAuthProvider()

    const token = auth.getToken();
    const [users, setUsers] = useState([])
    const [user, setUser] = useState('')

    useEffect(() => {
        mySystem.listUsers(token, (users) => setUsers(users));
    }, [])

    const signOut = () => {
        auth.removeToken();

        //TODO falta llamar al server
        navigate("/");
    }

    return (
        <div>
            <nav className="navbar navbar-default" role="navigation">
                <div>
                    <ul className="nav navbar-nav navbar-right">
                        <li>
                            <a href="" onClick={signOut}>Sign Out</a>
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="container">
                <h1>Users</h1>
                <ul>
                    {users.map(user =>
                        <li key={user.email}>{user.email}</li>
                    )}
                </ul>
            </div>

            <footer className="footer">
                <p>Footer</p>
            </footer>
        </div>
    )
}

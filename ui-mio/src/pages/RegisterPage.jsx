import * as React from 'react'
import {Link} from "react-router-dom";
import {useState} from "react";
import {useNavigate} from "react-router";
import {useMySystem} from "../service/mySystem";
import "../css/Login.css"
import "../images/RivalMatch_logoRecortado.png"

function goToLogin() {
    window.location.href = "/login"
}
export const RegisterPage = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState(undefined)
    const navigate = useNavigate();
    const mySystem = useMySystem();

    const handleSubmit = async e => {
        e.preventDefault();
        registerUser({
            email: username,
            password: password
        })
    }

    const resetForm = () => {
        setUsername('')
        setPassword('')
    }

    const registerUser = (user) => {
        mySystem.register(
            user,
            () => navigate("/login?ok=true"),
            () => {
                setErrorMsg('User already exists!')
                resetForm();
            }
        )
    }

    const usernameChange = (event) => {
        setUsername(event.target.value)
    }

    const passwordChange = (event) => {
        setPassword(event.target.value)
    }

    return (
        <div className={"containerPrincipal"}>
            {errorMsg && <div className="alert alert-danger" role="alert">{errorMsg}</div>}

            <img style={{ width: 218, height: "auto"}} src={require("../images/RivalMatch_logoRecortado.png")} alt={"Logo"}/>
            <form onSubmit={handleSubmit}>
                <br/>
                <div>
                    <input type="email"
                           placeholder="name@example.com"
                           value={username}
                           name="email"
                           onChange={usernameChange}/>
                </div>
                <br/>
                <div>
                    <input type="password"
                           id="floatingPassword"
                           placeholder="Password"
                           name="password"
                           value={password}
                           onChange={passwordChange}/>
                </div>
                <br/>
                <br/>
                <div>
                    <button type="submit" className={"signUpButton"}>Sign up</button>
                </div>
                <br/>
                <div>
                    <button className={"goToSignUp"} onClick={goToLogin}>Go to Login</button>
                </div>
            </form>
        </div>
    )
}

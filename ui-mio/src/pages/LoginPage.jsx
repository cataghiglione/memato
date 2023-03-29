import * as React from 'react'
import {useState} from 'react'
import {useSearchParams} from "react-router-dom";
import {useNavigate} from "react-router";
import {useMySystem} from "../service/mySystem";
import "../css/Login.css";
import "bootstrap/dist/css/bootstrap.min.css"; //npm install bootstrap axios md5 universal-cookie
import "../images/RivalMatch_logoRecortado.png";
import {UsersPage} from "./UsersPage";

function setToken(userToken) {
    sessionStorage.setItem('token', JSON.stringify(userToken));
}

function goToRegister() {
    window.location.href = "/register"
}

export const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState(undefined)
    const navigate = useNavigate()
    const mySystem = useMySystem()
    const [searchParams, setSearchParams] = useSearchParams();
    const isOk = searchParams.get("ok")

    function loginUser(credentials) {
        console.log("toy aca")
        mySystem.login(
            credentials,
            (token) => {
                setToken(token)
                navigate("/home", {replace: true});
                console.log("1234")
            },
            (msg) => {
                setErrorMsg(msg)
                setUsername('')
                setPassword('')
            })
    }

    const handleSubmit = async e => {
        e.preventDefault();
        await loginUser({
            email: username,
            password: password
        })
    }

    const usernameChange = (event) => {
        setUsername(event.target.value)
    }

    const passwordChange = (event) => {
        setPassword(event.target.value)
    }

    function LoginRequest(){
        console.log("hola");
    }

    return (
        <div className={"containerPrincipal"}>
            {isOk && <div className="alert alert-success" role="alert">User created</div>}
            {errorMsg && <div className="alert alert-warning" role="alert">{errorMsg}</div>}

            <img style={{ width: 218, height: "auto"}} src={require("../images/RivalMatch_logoRecortado.png")} alt={"Logo"}/>
            <form onSubmit={handleSubmit}>
                <div>
                    <br></br>
                    <input type="email" id="username" value={username} placeholder="name@example.com" onChange={usernameChange}/>
                    {/*<input type="email"*/}
                    {/*       value={username}*/}
                    {/*       onChange={usernameChange}*/}
                    {/*       placeholder="Name@example.com"*/}
                    {/*       name="email"/>*/}
                </div>
                <br></br>
                <div>
                    <input type="password"
                           value={password}
                           id="password"
                           onChange={passwordChange}
                           placeholder="Password"/>
                </div>
                <br></br>
                <br></br>
                {/*<button type="submit" className={"logInButton"}>Sign in</button>*/}
                <button id="submit" type="submit" onClick={() => LoginRequest()}>Login</button>
            </form>
            <br></br>
            <button className={"goToSignUp"} onClick={goToRegister}>Go to sign up</button>
        </div>
    )
}

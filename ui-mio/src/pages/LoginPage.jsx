import * as React from 'react'
import {useState} from 'react'
import {useSearchParams} from "react-router-dom";
import {useNavigate} from "react-router";
import {login} from "../service/mySystem";
import "../css/Login.scss";
import "bootstrap/dist/css/bootstrap.min.css"; //npm install bootstrap axios md5 universal-cookie
import "../images/RivalMatch_logoRecortado.png";

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
    const [searchParams, setSearchParams] = useSearchParams();
    const isOk = searchParams.get("ok")

    function loginUser(credentials) {
        console.log("toy aca")
        login(
            credentials,
            (token) => {
                setToken(token)
                navigate("/home", {replace: true});
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
        <div className={"mainContainer"}>
            {isOk && <div className="alert alert-success" role="alert">User created</div>}
            {errorMsg && <div className="alert alert-warning" role="alert">{errorMsg}</div>}

            <img style={{ width: 218, height: "auto"}} src={require("../images/RivalMatch_logoRecortado.png")} alt={"Logo"}/>
            <form onSubmit={handleSubmit}>
                <div>
                    <br></br>
                    <input type="email" id="username" value={username} placeholder="name@example.com" onChange={usernameChange}/>
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
                <button id="submit" type="submit" className={"greenButton "} onClick={() => LoginRequest()}>Login</button>
            </form>
            <br></br>
                      <button   className={"signUpButtonLogin "} onClick={goToRegister}>Go to sign up</button>

        </div>
    )
}

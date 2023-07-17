import * as React from 'react'
import {useEffect, useState} from 'react'
import {useSearchParams} from "react-router-dom";
import {useNavigate} from "react-router";
import {login, sendMessageWS} from "../service/mySystem";
import "../css/Login.scss";
import "bootstrap/dist/css/bootstrap.min.css"; //npm install bootstrap axios md5 universal-cookie
import "../images/RivalMatch_logoRecortado.png";
import 'animate.css';
import { Icon } from '@iconify/react';
import {toast, ToastContainer} from "react-toastify";

function setToken(userToken) {
    sessionStorage.setItem('token', JSON.stringify(userToken));
}

export const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState(undefined)
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    const isOk = searchParams.get("ok")
    const [goToReg, setGoToReg] = useState(false)
    const [logIn, setLogIn] = useState(false)

    useEffect(() => {
        if(goToReg) {
            const goToRegister = () => {
                window.location.href = "/register";
            };

            const redirectTimer = setTimeout(goToRegister, 1000); // Esperar 1 segundo (ajusta el tiempo según la duración de la animación)

            return () => {
                clearTimeout(redirectTimer); // Limpiar el temporizador al desmontar el componente
            };
        }
    }, [goToReg]);

    function loginUser(credentials) {
        console.log("toy aca")
        login(
            credentials,
            (token) => {
                setToken(token)
                navigate("/home", {replace: true});
            },
            (msg) => {
                toast.error(msg, {
                    position: "top-center",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
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

    const goToRegister = () => {
        return (
            <div className="LogoLogIn">
                <h1 className="animate__animated animate__bounceOutRight" onAnimationEnd={setGoToReg(true)}>
                    <img style={{ width: 218, height: "auto" }} src={require("../images/logoRM/logoRM_persona.png")} alt="Logo" />
                </h1>
            </div>
        );
    }
    function LoginRequest(){
        setLogIn(true);
    }

    return (
        <body>
            <ToastContainer /> {/* Mover el ToastContainer aquí */}
            <div className={"LogoLogIn"}>
                <h1 className="animate__animated animate__bounceInLeft">
                    <img style={{ width: 218, height: "auto"}}  src={require("../images/logoRM/logoRM_persona.png")} alt={"Logo"}/>
                </h1>
                <img style={{ width: 218, height: "auto"}} src={require("../images/logoRM/logoRM_letra.png")} alt={"Logo"}/>
            </div>
            <div className={"containerPrincipalLogInPage"}>
                <br/><br/>
                <form onSubmit={logIn && handleSubmit}>
                    <br/>
                    <br/>
                    <input type="email" name="logemail" className="form-style"
                           placeholder="Your Email" id="logemail" autoComplete="off" onChange={usernameChange}/>
                    <Icon className="input-icon-log" icon="uil:at"/>
                    <br></br>
                    <div>
                        <input type="password"
                               value={password}
                               id="password"
                               onChange={passwordChange}
                               placeholder="Password"
                               className="form-style"/>
                        <Icon className="input-icon-log" icon="uil:lock-alt"/>
                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <button id="submit" type="submit" className={"submitButtonLogIn"} onClick={() => LoginRequest()}>
                        <img style={{ width: 50, height: "auto"}}  src={require("../images/logoRM/logoRM_persona.png")} alt={"Logo"}/> LOG IN
                    </button>
                </form>
                <br></br>
                <button className={"signUpButtonLogin"} onClick={goToRegister}>Go to sign up</button>
            </div>
        </body>
    )
}


// <div className="section">
//     <div className="row full-height">
//         <div className="col-12 text-center align-self-center py-5">
//             <div className="section pb-5 pt-5 pt-sm-2 text-center">
//                 <div className="card-3d-wrap mx-auto">
//                     <div className="card-3d-wrapper">
//                         <div className="card-front">
//                             <div className="center-wrap">
//                                 <div className="section">
//                                     <h4 className="mb-4 pb-3">Log In</h4>
//                                     <div className="form-group">
//                                         <input type="email" name="logemail" className="form-style"
//                                                placeholder="Your Email" id="logemail" autoComplete="off"/>
//                                         <Icon className="input-icon" icon="uil:at"/>
//
//                                     </div>
//                                     <div className="form-group mt-2">
//                                         <input type="password" name="logpass" className="form-style"
//                                                placeholder="Your Password" id="logpass" autoComplete="off"/>
//                                         <Icon className="input-icon" icon="uil:lock-alt"/>
//                                     </div>
//                                     <a href="#" className="btn mt-4">submit</a>
//                                     <p className="mb-0 mt-4 text-center"><a href="#0" className="link">Forgot
//                                         your password?</a></p>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="card-back">
//                             <div className="center-wrap">
//                                 <div className="section text-center">
//                                     <h4 className="mb-4 pb-3">Sign Up</h4>
//                                     <div className="form-group">
//                                         <input type="text" name="logname" className="form-style"
//                                                placeholder="Your Full Name" id="logname" autoComplete="off"/>
//                                         <Icon className="input-icon" icon="uil:user"/>
//
//                                     </div>
//                                     <div className="form-group mt-2">
//                                         <input type="email" name="logemail" className="form-style"
//                                                placeholder="Your Email" id="logemail" autoComplete="off"/>
//                                         <Icon className="input-icon" icon="uil:at"/>
//                                     </div>
//                                     <div className="form-group mt-2">
//                                         <input type="password" name="logpass" className="form-style"
//                                                placeholder="Your Password" id="logpass" autoComplete="off"/>
//                                         <Icon className="input-icon" icon="uil:lock-alt"/>
//                                     </div>
//                                     <a href="#" className="btn mt-4">submit</a>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// </div>
import * as React from 'react'
import {useState} from "react";
import {useNavigate} from "react-router";
import {register} from "../service/mySystem";
import "../css/Login.scss"
import "../images/RivalMatch_logoRecortado.png"
import {toast, ToastContainer} from "react-toastify";
import {Icon} from "@iconify/react";

function goToLogin() {
    window.location.href = "/"
}
export const RegisterPage = () => {

    const [username, setUsername] = useState('')
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')
    const[name, setName] = useState('')
    const[lastName, setLastName] = useState('')
    const navigate = useNavigate()

    const [errorMsg, setErrorMsg] = useState(undefined)
    const [registerButton, setRegisterButton] = useState(false)

    const handleSubmit = async e => {
        e.preventDefault();
        if(!username || !name || !lastName || !mail || !password){
            toast.error('Please fill out all the required fields', {
                position: "top-center",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
        registerUser({
            username: username,
            firstName: name,
            lastName: lastName,
            email: mail,
            password: password
        })
    }

    const resetForm = () => {
        setUsername('')
        setPassword('')
        setName('')
        setMail('')
        setLastName('')
    }
    const goToLogin=()=> {
        navigate("/")
    }

    const registerUser = (user) => {
        register(
            user,
            () => {
                toast.success('User created!', {containerId: 'toast-container',
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });},
            () => {
                toast.success('User already exists!', {containerId: 'toast-container',
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
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
    const nameChange = (event) => {
        setName(event.target.value)
    }
    const lastNameChange = (event) => {
        setLastName(event.target.value)
    }
    const mailChange = (event) => {
        setMail(event.target.value)
    }
    function RegisterRequest(){
        setRegisterButton(true);
        console.log("Im requesting a register!");
    }

    return (
        <div>
            <div className={"LogoRegister"}>
                <h1 className="animate__animated animate__bounceInLeft">
                    <img style={{ width: 218, height: "auto"}}  src={require("../images/logoRM/logoRM_persona.png")} alt={"Logo"}/>
                </h1>
                <img style={{ width: 218, height: "auto"}} src={require("../images/logoRM/logoRM_letra.png")} alt={"Logo"}/>
            </div>
            <div className={"containerPrincipalRegisterPage"}>
                <ToastContainer /> {/* Mover el ToastContainer aquí */}
                <form onSubmit={registerButton && handleSubmit}>
                    <br/>
                    <div>
                        <input type="email" name="logemail" className="form-style"
                               placeholder="Your Email" id="logemail" autoComplete="off" onChange={mailChange}/>
                        <Icon className="input-icon-log" icon="uil:at"/>
                    </div>

                    <div>
                        <input type="name" name="logFirstName" className="form-style"
                               placeholder="Your First Name" id="logFirstName" autoComplete="off" onChange={nameChange}/>
                        <Icon className="input-icon-log" icon="material-symbols:person" />
                    </div>


                    <div>
                        <input type="lastName" name="logLastName" className="form-style"
                               placeholder="Your Last Name" id="logLastName" autoComplete="off" onChange={lastNameChange}/>
                        <Icon className="input-icon-log" icon="material-symbols:person" />
                    </div>

                    <div>
                        <input type="name" name="logUsername" className="form-style"
                               placeholder="Your Username" id="logUsername" autoComplete="off" onChange={usernameChange}/>
                        <Icon className="input-icon-log" icon="material-symbols:person" />
                    </div>

                    <div>
                        <input type="password" name="logPassword" className="form-style"
                               placeholder="Your Password" id="logPassword" autoComplete="off" onChange={passwordChange}/>
                        <Icon className="input-icon-log" icon="uil:lock-alt"/>
                    </div>

                    <br/><br/>
                </form>
                <div>
                    <button id="submit" type="submit" className={"submitButtonRegister"} onClick={() => RegisterRequest()}>Register</button>
                </div>
                <div>
                    <button className={"signUpButtonLogin"} onClick={goToLogin}>Go to Login</button>
                </div>
            </div>
        </div>
    )
}

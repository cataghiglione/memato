import * as React from 'react'
import {useEffect, useState} from 'react'
import {useNavigate} from "react-router";
import {useAuthProvider} from "../auth/auth";
import {getUser, updateUser, deleteAccount, login} from "../service/mySystem";
import "../css/EditTeam.scss"
import {TopBar} from "./TopBar/TopBar";
import {toast, ToastContainer} from "react-toastify";
import SideBar from "./SideBar";

function setToken(userToken) {
    sessionStorage.setItem('token', JSON.stringify(userToken));
}

export function UserPage(props) {
    const navigate = useNavigate()
    const auth = useAuthProvider()
    const token = auth.getToken();
    const [errorMsg, setErrorMsg] = useState(undefined)

    const [user, setUser] = useState('')
    const [once, setOnce] = useState(true);
    const [submit, setSubmit] = useState(false);

    const [first_name, setFirst_name] = useState("")
    const [last_name, setLast_name] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")

    useEffect(() => {
        setFirst_name(user.firstName);
        setLast_name(user.lastName);
        setEmail(user.email);
        setPassword(user.password)
        setUsername(user.username)
    }, [user]);

    useEffect(()=>{
        getUser(token, (user) => setUser(user))
        setOnce(false);
    }, [])

    // const getUserMethod = () => {
    //     console.log(token)
    //     getUser(token, (user) => setUser(user))
    //     setOnce(false);
    // }

    const isEmpty = value => value === null || value === undefined || value === '';

    const handleSubmit = async e => {
        e.preventDefault();
        if (isEmpty(first_name)) {
            setFirst_name(user.first_name)
        }
        if (isEmpty(last_name)) {
            setLast_name(user.last_name)
        }
        if (isEmpty(email)) {
            setEmail(user.email)
        }
        if (isEmpty(password)) {
            setPassword(user.password)
        }
        if (isEmpty(user)) {
            setUsername(user.username)
        }
        saveChanges({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
            username: username
        })
    }

    const saveChanges = (form) => {
        updateUser(token,
            form,
            () => {
                toast.success('User updated!', {
                    containerId: 'toast-container',
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                login({email:form.email, password: form.password}, (token) => {
                        setToken(token)})
                getUser(token, (user) => setUser(user));
            },
            () => {
                toast.error('Something wrong has happened', {
                    containerId: 'toast-container',
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        )
    }

    const first_nameChange = (event) => {
        setFirst_name(event.target.value)
    }
    const last_nameChange = (event) => {
        setLast_name(event.target.value)
    }
    const emailChange = (event) => {
        setEmail(event.target.value)
    }
    const passwordChange = (event) => {
        setPassword(event.target.value)
    }

    const usernameChange = (event) => {
        setUsername(event.target.value)
    }

    function editUserRequest() {
        console.log("Im requesting an edit on a User!");
        setSubmit(true);
    }
    function deleteMethod(){
        deleteAccount(token, navigate("/"))
        auth.removeToken()
    }

    return (
        <div>
            {errorMsg && <div className="alert alert-danger" role="alert">{errorMsg}</div>}
            {/*{once && getUserMethod()}*/}
            <SideBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}></SideBar>
            <TopBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}/>
            <div className={"editTeamContainer"}>
                <br/>
                <br/>
                <h1 className={"team_name"} style={{fontSize: "35px"}}> Profile </h1>
                <br/>
                <div>
                    <form onSubmit={submit && handleSubmit}>
                        <br/>
                        <div className={"edit-user-name"} style={{left: "400px"}}>
                            Username:<input type="Username"
                                   id="Username"
                                   placeholder="Username"
                                   name="Username"
                                   value={username}
                                   onChange={usernameChange}/>
                        </div>
                        <br/>
                        <div className={"edit-user-name"} style={{left: "700px"}}>
                            First name:<input type="First name"
                                   id="First name"
                                   placeholder="Firstname"
                                   name="First name"
                                   value={first_name}
                                   onChange={first_nameChange}/>
                        </div>
                        <br/>
                        <div className={"edit-user-name"} style={{left: "1000px"}}>Last name:<input type="Last name"
                                   id="Last name"
                                   placeholder="Lastname"
                                   name="Last name"
                                   value={last_name}
                                   onChange={last_nameChange}/>
                        </div>
                        <br/>
                        <div className={"edit-user-name"} style={{left: "550px", top: "350px"}}>Email:<input type="Email"
                                   id="Email"
                                   placeholder="Email"
                                   name="Email"
                                   value={email}
                                   onChange={emailChange}/>
                        </div>
                        <br/>
                        <div className={"edit-user-name"}
                             style={{left: "850px", top: "350px"}}>Password:<input type="Password"
                                   id="Password"
                                   placeholder="Password"
                                   name="Password"
                                   value={password}
                                   onChange={passwordChange}/>
                        </div>
                        <div>
                            <button id="submit" type="submit" className={"saveChangesButton"}    style={{right: "550px", fontSize: "16px"}}
                                    onClick={() => editUserRequest()}>Save Changes
                            </button>
                        </div>
                        <div>
                            <br/>
                            <button className={"delete-button"} style={{right: "750px"}} onClick={() => deleteMethod()}>Delete Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer/> {/* Mover el ToastContainer aquí */}
        </div>
    )
}
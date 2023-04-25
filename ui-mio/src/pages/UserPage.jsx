import * as React from 'react'
import {useEffect, useState} from 'react'
import {useNavigate} from "react-router";
import {useAuthProvider} from "../auth/auth";
import {getUser, updateUser} from "../service/mySystem";
import "../css/Home.css"
import {TopBar} from "./TopBar/TopBar";

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

    const getUserMethod = () => {
        console.log(token)
        getUser(token, (user) => setUser(user))
        setOnce(false);
    }

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
            first_name: first_name || user.first_name,
            last_name: last_name || user.last_name,
            email: email || user.email,
            password: password || user.password,
            username: username || user.username
        })
    }

    const saveChanges = (form) => {
        updateUser(token,
            form,
            () => navigate("/user"),
            () => {
                setErrorMsg('An error ocurred')
                navigate("/user")
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

    return (
        <div>
            {errorMsg && <div className="alert alert-danger" role="alert">{errorMsg}</div>}
            {once && getUserMethod()}
            <TopBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}/>
            <div>
                <br/>
                <br/>
                <h1> Profile
                </h1>
                <div className={"form"}>

                    <form onSubmit={submit && handleSubmit}>
                        <br/>
                        <div>
                            <input type="Username"
                                   id="Username"
                                   placeholder="Username"
                                   name="Username"
                                   value={username}
                                   onChange={usernameChange}/>
                        </div>
                        <br/>
                        <div>
                            <input type="First name"
                                   id="First name"
                                   placeholder="Firstname"
                                   name="First name"
                                   value={first_name}
                                   onChange={first_nameChange}/>
                        </div>
                        <br/>
                        <div>
                            <input type="Last name"
                                   id="Last name"
                                   placeholder="Lastname"
                                   name="Last name"
                                   value={last_name}
                                   onChange={last_nameChange}/>
                        </div>
                        <br/>
                        <div>
                            <input type="Email"
                                   id="Email"
                                   placeholder="Email"
                                   name="Email"
                                   value={email}
                                   onChange={emailChange}/>
                        </div>
                        <br/>
                        <div>
                            <input type="Password"
                                   id="Password"
                                   placeholder="Password"
                                   name="Password"
                                   value={password}
                                   onChange={passwordChange}/>
                        </div>
                        <div>
                            <button id="submit" type="submit" className={"saveChangesButton"}
                                    onClick={() => editUserRequest()}>Save Changes
                            </button>
                        </div>
                        <div>
                            <button className={"goBackButton"} onClick={() => navigate("/settings")}>Return to
                                Settings
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
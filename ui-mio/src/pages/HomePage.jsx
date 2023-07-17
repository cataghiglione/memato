import * as React from 'react'
import {useEffect, useState} from 'react'
import {useAuthProvider} from "../auth/auth";
import {listTeams, getUser} from "../service/mySystem";
import "../css/Home.scss";
import SideBar from "./SideBar";
import { Icon } from '@iconify/react';
// import "../css/PickTeam.scss";
import {useNavigate} from "react-router";
import {TopBar} from "./TopBar/TopBar";
import {PencilSquare} from "react-bootstrap-icons";
import {ToastContainer} from "react-toastify";

function goToNewTeam(){
    window.location.href = "/newTeam"
}
export function HomePage(props){
    const navigate = useNavigate()
    const auth = useAuthProvider()
    const token = auth.getToken();
    const [user, setUser] = useState('')
    const [onceOpen, setOnceOpen] = useState(true);
    const [teams, setTeams] = useState([]);
    const [nextTeam, setNextTeam] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const containerStyle = teams.length > 0 ? { marginTop: `-${10 * teams.length}px`, marginLeft: '7%'} : {marginLeft: '7%'};


    useEffect(() => {
        listTeams(token, (teams) => setTeams(teams));
        getUser(token, (user) => {
            setUser(user);
        })
    }, [token])

    const changeNextTeam = (event) => {
        setNextTeam(event.target.value);
        if(event.target.value != null){
            props.toggleTeamId(event.target.value)
            navigate('/editTeam')
        }
    }
    const findRival = (event) => {
        setNextTeam(event.target.value);
        props.toggleTeamId(event.target.value)
        if(event.target.value != null){
            navigate('/findRival')
        }
    }
    return (
        <body>
        <SideBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}/>
            <TopBar toggleTeamId={props.toggleTeamId} getTeamId={props.getTeamId}/>
            <div className={`containerPrincipalHomePage ${sidebarOpen ? 'page-content-shifted' : ''}`} style={containerStyle}>
                {/*<nav>*/}
                {/*    <ul>*/}
                {/*        <figure className="brick">*/}
                {/*            <Icon icon="tabler:home" className={"icon"}/>*/}
                {/*            Dashboard*/}
                {/*        </figure>*/}
                {/*        <figure className="brick">*/}
                {/*            <Icon icon="fluent:people-team-32-regular" className={"icon"}/>*/}
                {/*            Teams*/}
                {/*        </figure>*/}
                {/*    </ul>*/}
                {/*</nav>*/}
                <h1> Welcome {user.firstName}! </h1>
                <br/>
                <h3> Your teams </h3>
                <br/>
                <button className={"newTeamButton"} onClick={goToNewTeam} style={{width:"325px"}}>
                    {teams.length===0 ? 'Create your first team' : 'New Team'}
                </button>
                {teams.length > 0 && (
                    <div>
                        <div className={`team-pick`} multiple={true} onClick={findRival}>
                            {teams.map((team) => (
                                <button className={"team-select-option-pick"} key={team.id} value={team.id} >
                                    {team.sport} {team.quantity}: {team.name}
                                </button>
                            ))}
                        </div>
                        <div className={`team-edit`} multiple={true} onClick={changeNextTeam}>
                            {teams.map((team) => (
                                <button className={"team-edit-option"} key={team.id} value={team.id} >
                                    <PencilSquare style={{color:"black"}} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer/> {/* Mover el ToastContainer aquí */}
        </body>
    )
}
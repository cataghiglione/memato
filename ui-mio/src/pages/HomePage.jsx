import * as React from 'react'
import {useEffect, useState} from 'react'
import {useAuthProvider} from "../auth/auth";
import {listTeams, getUser} from "../service/mySystem";
import "../css/Home.css";
import {useNavigate} from "react-router";
import {TopBar} from "./TopBar/TopBar";

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
    const containerStyle = teams.length > 0 ? { marginTop: `-${10 * teams.length}px`, marginLeft: '7%'} : {marginLeft: '7%'};


    useEffect(() => {
        listTeams(token, (teams) => setTeams(teams));
    }, [token])

    const changeNextTeam = (event) => {
        setNextTeam(event.target.value);
        if(event.target.value != null){
            props.toggleTeamId(event.target.value)
            navigate('/editTeam')
        }
    }
    const getUserMethod = () => {
        getUser(token, (user) => {
            setUser(user);
        })
        setOnceOpen(false);
    }
    return (
        <div>
            <TopBar toggleTeamId={props.toggleTeamId} getTeamId={props.getTeamId}/>
            <div className="containerPrincipal" style={containerStyle}>
                {onceOpen && getUserMethod()}
                <div>
                    <h1>Welcome {user.firstName}!
                    </h1>
                </div>
                <h1>My teams</h1>
                <button className={"newTeamButton"} onClick={goToNewTeam} style={{width:"325px"}}>
                    {teams.length===0 ? 'Create your first team' : 'New Team'}
                </button>
                {teams.length > 0 &&
                    <div className={"team-pick"} multiple={true}  style={{width:"325px"}} onClick={changeNextTeam}>
                        {teams.map(team =>
                                <button className={"team-select-option-home"} value={team.id} style={{ textTransform: 'capitalize'}}>
                                    {team.sport} {team.quantity}: {team.name}
                                </button>
                        )}
                    </div>
                }
                {/*{teams.length === 0 &&*/}
                {/*    <p className={"noTeamPick"}>You haven't created any teams yet</p>*/}
                {/*}*/}
            </div>
        </div>
    )
}
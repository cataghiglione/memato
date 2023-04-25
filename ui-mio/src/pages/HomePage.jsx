import * as React from 'react'
import {useEffect, useState} from 'react'
import {useAuthProvider} from "../auth/auth";
import {listTeams, getUser} from "../service/mySystem";
import "../css/Home.css";
import {useNavigate} from "react-router";

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

    useEffect(() => {
        listTeams(token, (teams) => setTeams(teams));
    }, [token])

    const changeNextTeam = (event) => {
        setNextTeam(event.target.value);
        if(event.target.value != null){
            props.toggleTeamId(event.target.value)
            navigate('/user')
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
            <div className="containerPrincipal">
                {onceOpen && getUserMethod()}
                <div>
                    <h1>Welcome {user.firstName}!
                    </h1>
                </div>
                <h1>My teams</h1>
                <button className={"newTeamButton"} onClick={goToNewTeam}>
                    {teams.length===0 ? 'Create your first team' : 'New Team'}
                </button>
                {teams.length > 0 &&
                    <select className={"team-pick"} multiple={true} onChange={changeNextTeam}>
                        {teams.map(team =>
                                <option className={"team-select-option"} value={team.id} style={{ textTransform: 'capitalize'}}>
                                    Nombre: {team.name}, Deporte: {team.sport} {team.quantity} </option>
                            // <p>nombre = {team.name}    deporte = {team.sport} </p>
                            // <option>{team.name}</option>

                        )}
                    </select>
                }
                {/*{teams.length === 0 &&*/}
                {/*    <p className={"noTeamPick"}>You haven't created any teams yet</p>*/}
                {/*}*/}
            </div>
        </div>
    )
}
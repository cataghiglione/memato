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
                    <h1>Hi {user.firstName}
                    </h1>
                </div>
                <h1>My teams</h1>
                <button className={"newTeamButton"} onClick={goToNewTeam}>New Team</button>
                <select className={"team-select"} multiple={true} onChange={changeNextTeam}>
                    {teams.map(team => <option className={"team-select-option"} key={team.id} value={team.id}> nombre = {team.name} deporte = {team.sport} </option>)}
                    {/*teams.map(team => {*/}
                    {/*<tr key={team}>*/}
                    {/*    <td>{}</td>*/}
                    {/*    <td>*/}
                    {/*        <strong>{}</strong>*/}
                    {/*    </td>*/}
                    {/*</tr>*/}
                {/*})*/}
                </select>
            </div>
        </div>
    )
}
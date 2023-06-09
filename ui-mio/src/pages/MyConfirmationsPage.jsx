import React, {Component, useEffect, useState} from 'react';
import {useAuthProvider} from "../auth/auth";
import {TopBar} from "./TopBar/TopBar";
import {getConfirmedMatches, getPendingConfirmations, getTeam} from "../service/mySystem";
import {MapInReact} from "./MapInReact";

export function MyConfirmationsPage(props){
    const auth = useAuthProvider()
    const token = auth.getToken();
    const id = props.getTeamId;

    const[team, setTeam]=useState('');
    let [confirmedMatches, setConfirmedMatches] = useState([]);
    useEffect(() => {
        getTeam(token,id, (team) => setTeam(team));
    }, [token, id])

    useEffect(() => {
            getConfirmedMatches(token, id, (matches) => {
                    setConfirmedMatches(matches)
                }, (matches) => {
                    // TODO ERROR CALLBACK
                }
            )
        }
        ,
        [id, token]
    )

    return(

        <div>
            <TopBar toggleTeamId={props.toggleTeamId} getTeamId={props.getTeamId}/>
            {/* Otros elementos del componente */}
            <MapInReact confirmedMatches={confirmedMatches} />
        </div>

    )







}
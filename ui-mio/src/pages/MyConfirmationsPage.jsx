import React, {Component, useEffect, useState} from 'react';
import {useAuthProvider} from "../auth/auth";
import {TopBar} from "./TopBar/TopBar";
import {getConfirmedMatches, getPendingConfirmations, getTeam} from "../service/mySystem";
import { MapInReactFunction} from "./MapInReact";
import "../css/MyConfirmations.scss"

export function MyConfirmationsPage(props) {
    const auth = useAuthProvider()
    const token = auth.getToken();
    const id = props.getTeamId;

    const [team, setTeam] = useState('');
    let [confirmedMatches, setConfirmedMatches] = useState([]);
    useEffect(() => {
        getTeam(token, id, (team) => setTeam(team));
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

    function goToFindRival() {
        window.location.href = "/findRival"

    }

    return (

        <div>
            <TopBar toggleTeamId={props.toggleTeamId} getTeamId={props.getTeamId}/>
            <div className={"containerMyConfirmationsPage"}>
                {(confirmedMatches.length > 0) && (
                    <div className={"map-container"}>
                        <div className={"map"}>
                            <MapInReactFunction confirmedMatches={confirmedMatches}/>
                        </div>
                    </div>)}
                {(confirmedMatches.length === 0) && (
                    <div>
                        <div className={"noConfirmedMatchesTitle"}>
                            {team.name}'s confirmations
                        </div>
                        <div className={"refereePicture"}>
                            <img style={{width: 218, height: "auto"}} src={require("../images/referee.png")}
                                 alt={"referee"}/>
                        </div>
                        <div className={"noMatchesTitle"}>
                            {team.name} does not have any confirmed matches!
                        </div>
                        <div className={"findRivalText"}>
                            Find a new rival now!
                        </div>
                        <div>
                            <button className={"findRivalB"} id="submit" type="submit" onClick={goToFindRival}> Find
                                Rival!
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </div>

    )


}
import React, {Component, useEffect, useState} from 'react';
import {useAuthProvider} from "../auth/auth";
import {getPendingConfirmations, confirmMatch, getTeam,declineMatch} from "../service/mySystem";
import {TopBar} from "./TopBar/TopBar";
import "../css/Confirmations.css"

export function ConfirmationsPage(props) {
    const auth = useAuthProvider()
    const token = auth.getToken();
    const id = props.getTeamId;
    let [matches, setMatches] = useState([]);
    const[team, setTeam]=useState('');


    useEffect(() => {
            getPendingConfirmations(token, id, (matches) => {
                    setMatches(matches)
                }, (matches) => {
                    // TODO ERROR CALLBACK
                }
            )
        }
        ,
        [id, token]
    )
    useEffect(() => {
        getTeam(token,id, (team) => setTeam(team));
    }, [token, id])



    const handleConfirmMatch = async (match_id) => {
        // CALL BACK to confirm the match and then call pending confirmations again
        await confirmMatch(token, match_id, id, () => {
            getPendingConfirmations(token, id, (matches) => {
                    setMatches(matches)
                }, (matches) => {
                    // TODO ERROR CALLBACK
                }
            )
        })
    }
    const handleDeclineMatch = async (match_id) =>{
        await declineMatch(token,match_id,id, ()=>{
            getPendingConfirmations(token, id, (matches) => {
                    setMatches(matches)
                }, (matches) => {
                    // TODO ERROR CALLBACK
                }
            )
        })

    }



    return (
        <div>
            <div className={"logo"}>
                <img style={{width: 218, height: "auto"}} src={require("../images/logo_solo_letras.png")}
                     alt={"Logo"}/>
            </div>
            <TopBar toggleTeamId={props.toggleTeamId} getTeamId={props.getTeamId}/>
            <div className={"containerPrincipal"}>
                <div>
                    {(matches.length > 0) && (
                        <div>
                            <div className={"confirmationsTitle"}>
                                {team.name}'s pending confirmations
                            </div>
                            {matches.map((match) => (
                                <div className={"matchesContainer"}>
                                    <div key={match.id}>
                                        <p className={"match-info"}>Rival: {match.team2.name}
                                        </p>
                                        <p className={"match-info"}>Time: {match.time}</p>
                                        <p className={"match-info"}>Day: {match.day}</p>
                                        {match.team1Confirmed &&(
                                            <p>You have confirmed this match, wait for the other team to confirm</p>
                                        )}
                                        {!match.team1Confirmed &&(
                                            <div>
                                            <button class = {"confirmButton"} onClick={()=>handleConfirmMatch(match.id)}>Confirm</button>

                                            <button className = {"declineButton"} onClick={()=>handleDeclineMatch(match.id)}>Reject</button>
                                            </div>
                                            )}
                                    </div>

                                </div>

                            ))}
                        </div>

                    )}
                </div>
            </div>
        </div>
    )
}

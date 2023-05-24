import React, {Component, useEffect, useState} from 'react';
import {useAuthProvider} from "../auth/auth";
import {useSearchParams} from "react-router-dom";
import {useNavigate} from "react-router";
import {getPendingConfirmations, confirmMatch} from "../service/mySystem";
import {TopBar} from "./TopBar/TopBar";
import "../css/Confirmations.css"

export function ConfirmationsPage(props) {
    const auth = useAuthProvider()
    const token = auth.getToken();
    const id = props.getTeamId;
    let [matches, setMatches] = useState([]);
    let [confirmed, setConfirmed] = useState(false);

    useEffect(() => {
            getPendingConfirmations(token, id, (matches) => {
                    setMatches(matches)
                    setConfirmed(false)
                }, (matches) => {
                    setMatches(matches)
                    setConfirmed(true)
                }
            )
        }
        ,
        [id, token]
    )


    const getRivalName = (match) => {
        if (match.search1.id === id) {
            return match.search1.team.name;
        } else {
            return match.search2.team.name;
        }
    };


    const handleConfirmMatch = async (match_id) => {
        // CALL BACK to confirm the match and then call pending confirmations again
        await confirmMatch(token, match_id, id, () => {
            getPendingConfirmations(token, id, (matches) => {
                    setMatches(matches)
                    setConfirmed(false)
                }, (matches) => {
                    setMatches(matches)
                    setConfirmed(true)
                }
            )
        })
    }

    function declineMatch(match_id) {
        // CALL BACK to decline the match and then call pending confirmations again
        return undefined;
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
                    {(matches.length > 0 && confirmed)&&  (
                        <div>
                            <div className={"searchesTitle"}>
                                Your team's pending confirmations
                            </div>
                            {matches.map((match) => (
                                <div className={"searchesContainer"}>
                                    <div key={match.id}>
                                        <p className={"search-info"}>Rival: {getRivalName(match)}</p>
                                        <p className={"search-info"}>Time: {match.search1.time}</p>
                                        <p className={"search-info"}>Day: {match.search1.day}/{
                                            match.search1.month + 1}</p>
                                        {/* tendriamos que poner una condicion, ya que si el team ya confirmo,
                                            no tendria que tener la opcion de confirmar de vuelta*/}
                                        <p>You have confirmed this match, wait for the other team to confirm</p>
                                    </div>
                                    {/*<button className={"delete-search-button"} onClick={() => handleDeleteClick(search)}>*/}
                                    {/*    <i className="bi bi-trash"></i>*/}
                                    {/*</button>*/}
                                </div>

                            ))}
                        </div>

                    )}
                </div>
                <div>
                    {(matches.length > 0 && !confirmed)&&   (
                        <div>
                            <div className={"searchesTitle"}>
                                Your team's pending confirmations
                            </div>
                            {matches.map((match) => (
                                <div className={"searchesContainer"}>
                                    <div key={match.id}>
                                        <p className={"search-info"}>Rival: {getRivalName(match)}</p>
                                        <p className={"search-info"}>Time: {match.search1.time}</p>
                                        <p className={"search-info"}>Day: {match.search1.day}/{
                                            match.search1.month + 1}</p>
                                        {/* tendriamos que poner una condicion, ya que si el team ya confirmo,
                                            no tendria que tener la opcion de confirmar de vuelta*/}
                                        <button className={"confirmButton"}
                                                onClick={() => handleConfirmMatch(match.id)}> Confirm
                                        </button>
                                        <button className={"declineButton"}
                                                onClick={() => declineMatch(match.id)}> Decline
                                        </button>
                                    </div>
                                    {/*<button className={"delete-search-button"} onClick={() => handleDeleteClick(search)}>*/}
                                    {/*    <i className="bi bi-trash"></i>*/}
                                    {/*</button>*/}
                                </div>

                            ))}
                        </div>

                    )}
                </div>
            </div>
        </div>
        // )}


    )

}

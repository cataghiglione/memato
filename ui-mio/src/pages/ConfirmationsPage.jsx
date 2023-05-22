import React, {Component, useEffect, useState} from 'react';
import {useAuthProvider} from "../auth/auth";
import {useSearchParams} from "react-router-dom";
import {useNavigate} from "react-router";
import {getPendingConfirmations, isTeamOneOrTeamTwo} from "../service/mySystem";
import {TopBar} from "./TopBar/TopBar";
import "../css/Confirmations.css"

export function ConfirmationsPage(props) {
    const auth = useAuthProvider()
    const token = auth.getToken();
    const id = props.getTeamId;
    const [matches, setMatches] = useState([]);
    let [teamName, setTeamName] = useState("");

    useEffect(() => {
        getPendingConfirmations(token, id, (matches) =>
            setMatches(matches))
    }
    , [id, token])



    const getRivalName = (match) => {
        if (match.search1.id === id) {
            return match.search1.team.name;
        } else {
            return match.search2.team.name;
        }
    };


    function confirmMatch(match_id){
        // CALL BACK to confirm the match and then call pending confirmations again
        return undefined;
    }

    function declineMatch(match_id) {
        // CALL BACK to decline the match and then call pending confirmations again
        return undefined;
    }

    return (
        <div>
            <div className={"logo"}>
                <img style={{width: 218, height: "auto"}} src={require("../images/logo_solo_letras.png")} alt={"Logo"}/>
            </div>
            <TopBar toggleTeamId={props.toggleTeamId} getTeamId={props.getTeamId}/>
            <div className={"containerPrincipal"}>
                <div>
                    {matches.length > 0 && (
                        <div>
                            <div className={"searchesTitle"}>
                                Your team's pending confirmations
                            </div>
                            {matches.map((match) => (
                                <div className={"searchesContainer"}>
                                    <div key={match.id}>
                                        <p className={"search-info"}>Rival: { getRivalName(match)}</p>
                                        <p className={"search-info"}>Time: {match.search1.time}</p>
                                        <p className={"search-info"}>Day: {match.search1.day}/{
                                            match.search1.month + 1}</p>
                                        {/* tendriamos que poner una condicion, ya que si el team ya confirmo,
                                            no tendria que tener la opcion de confirmar de vuelta*/}
                                        <button className={"confirmButton"} onClick={confirmMatch(match.id)}> Confirmar </button>
                                        <button className={"declineButton"} onClick={declineMatch(match.id)}> Rechazar </button>
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

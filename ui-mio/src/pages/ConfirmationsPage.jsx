import React, {Component, useEffect, useState} from 'react';
import {useAuthProvider} from "../auth/auth";
import {useSearchParams} from "react-router-dom";
import {useNavigate} from "react-router";
import {getPendingConfirmations} from "../service/mySystem";
import {TopBar} from "./TopBar/TopBar";
import "../css/Confirmations.css"

export function ConfirmationsPage(props) {
    const auth = useAuthProvider()
    const token = auth.getToken();
    const id = props.getTeamId;
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        getPendingConfirmations(token, id, (matches) =>
            setMatches(matches))
    }, [matches])


    const getTeamNumber = (match) => {
        if (match.search1.team.id === id) {
            return match.search2.team.name;
        } else return match.search1.team.name;


    }


    return (
        <div>
            <div className={"logo"}>
                <img style={{width: 218, height: "auto"}} src={require("../images/logo_solo_letras.png")} alt={"Logo"}/>
            </div>
            <TopBar toggleTeamId={props.toggleTeamId} getTeamId={props.getTeamId}/>
            <div className={"containerPrincipal"}>
                <div>
                    {matches.length> 0 && (
                        <div>
                            <div className={"searchesTitle"}>
                                Your team's current searches
                            </div>
                            {matches.map((match) => (
                                <div className={"searchesContainer"}>
                                    <div key={match.id}>
                                        <p className={"search-info"}>Team: {getTeamNumber(match)}</p>
                                        <p className={"search-info"}>Time: {match.search1.time}</p>
                                        <p className={"search-info"}>Day: {match.search1.day}/{
                                            match.search1.month + 1}</p>
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

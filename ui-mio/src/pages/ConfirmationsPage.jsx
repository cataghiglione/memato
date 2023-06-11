import React, {Component, useEffect, useState} from 'react';
import {useAuthProvider} from "../auth/auth";
import {getPendingConfirmations, confirmMatch, getTeam, declineMatch, newMatch, newContact} from "../service/mySystem";
import {TopBar} from "./TopBar/TopBar";
import "../css/Confirmations.scss"
import {ChatFill} from "react-bootstrap-icons";
import {useNavigate} from "react-router";

export function ConfirmationsPage(props) {
    const navigate = useNavigate()
    const auth = useAuthProvider()
    const token = auth.getToken();
    const id = props.getTeamId;
    let [matches, setMatches] = useState([]);
    const[team, setTeam]=useState('');
    let [searches, setSearches] = useState([]);

    useEffect(() => {
            getPendingConfirmations(token, id, (matches) => {
                    setMatches(matches)
                }, (matches) => {
                    // TODO ERROR CALLBACK
                }
            )
        },
        [id, token]
    )
    useEffect(() => {
        getTeam(token,id, (team) => setTeam(team));
    }, [token, id])



    const handleConfirmMatch = async (match_id) => {
        await confirmMatch(token, match_id, id, () => {
            getPendingConfirmations(token, id, (matches) => {
                    setMatches(matches)
                    // and takes you to that contact (hacleo hoy)
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

                }, () => {
                // TODO ERROR CALLBACK

                }
            )
        })

    }

    function findOrCreateContact(id) {
        newContact(token, {
                team1_id:props.getTeamId,
                team2_id:id
            }, (res)=>{
                console.log(res)
                navigate("/chat")
            },
            ()=>{
                // TODO when error callback happens it takes you only to the /chat, without throwing the error on console
                console.log('Contact already exists!')
                navigate("/chat")
            }
        )
    }
    function goToFindRival(){
        window.location.href = "/findRival"

    }



    return (
        <div>
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
                                                <button className={"chatButton"} onClick={()=>findOrCreateContact(match.team2.id)}> <ChatFill /></button>
                                            </div>
                                            )}
                                    </div>

                                </div>

                            ))}
                        </div>

                    )}
                    {(matches.length===0) &&(
                        <div>
                            <div className={"noConfirmationsTitle"}>
                                {team.name}'s pending confirmations
                            </div>
                            <div className={"refereeImage"}>
                                <img style={{width: 218, height: "auto"}} src={require("../images/referee.png")}
                                     alt={"referee"}/>
                            </div>
                            <div className={"noPendingConfs"}>
                                {team.name} does not have any pending confirmations!
                            </div>
                            <div className={"findRText"}>
                                Find a new rival now!
                            </div>
                            <div>
                                <button className={"findRButton"} id="submit" type="submit" onClick={goToFindRival}> Find
                                    Rival!
                                </button>
                            </div>
                        </div>

                    )}
                </div>
            </div>
        </div>
    )
}

import React, {Component, useEffect, useState} from 'react';
import {useAuthProvider} from "../auth/auth";
import {getPendingConfirmations, confirmMatch, getTeam, declineMatch, newMatch, newContact} from "../service/mySystem";
import {TopBar} from "./TopBar/TopBar";
import "../css/Confirmations.scss"
import {ChatFill} from "react-bootstrap-icons";
import {useNavigate} from "react-router";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export function ConfirmationsPage(props) {
    const navigate = useNavigate()
    const auth = useAuthProvider()
    const token = auth.getToken();
    const id = props.getTeamId;
    let [matches, setMatches] = useState([]);
    const [team, setTeam] = useState('');
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
        getTeam(token, id, (team) => setTeam(team));
    }, [token, id])


    const handleConfirmMatch = async (match_id) => {
        await confirmMatch(token, match_id, id, () => {
            getPendingConfirmations(token, id, (matches) => {
                    setMatches(matches)
                toast.success('Confirmation sent!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                    // and takes you to that contact (hacleo hoy)
                }, (matches) => {
                    // TODO ERROR CALLBACK
                }
            )
        })
    }
    const handleDeclineMatch = async (match_id) => {
        await declineMatch(token, match_id, id, () => {
            getPendingConfirmations(token, id, (matches) => {
                    setMatches(matches)
                toast.success('Match rejected!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });



                }, () => {
                    // TODO ERROR CALLBACK

                }
            )
        })

    }

    function findOrCreateContact(team_id) {
        newContact(token, {
                team1_id: id,
                team2_id: team_id
            }, (res) => {
                console.log(res)
                navigate(`/chat?contactId=${res}`)
            },
            () => {
                // TODO when error callback happens it takes you only to the /chat, without throwing the error on console
                console.log('Contact already exists!')
                navigate("/chat")
            }
        )
    }

    function goToFindRival() {
        window.location.href = "/findRival"

    }


    return (
        <div>
            <TopBar toggleTeamId={props.toggleTeamId} getTeamId={props.getTeamId}/>
            <div className={"containerConfirmationsPage"}>
                <br/>
                <div>
                    {(matches.length > 0) && (
                        <div>
                            <br/>
                            <div className={"confirmationsTitle"}>
                                <h1> {team.name}'s pending confirmations </h1>
                            </div>
                            {matches.map((match) => (
                                <div className={"matchesContainer"}>
                                    <div key={match.id}>
                                        <p className={"match-info"}>Rival: {match.team2.name}
                                        </p>
                                        <p className={"match-info"}>Time(s): {match.time.join(", ")}</p>
                                        <p className={"match-info"}>Day: {match.day}</p>
                                        {match.team1Confirmed && (
                                            <p>You have confirmed this match, wait for the other team to confirm</p>
                                        )}
                                        {!match.team1Confirmed && (
                                            <div>
                                                <button class={"confirmButton"}
                                                        onClick={() => handleConfirmMatch(match.id)}>Confirm
                                                </button>
                                                <button className={"declineButton"}
                                                        onClick={() => handleDeclineMatch(match.id)}>Reject
                                                </button>
                                                <button className={"chatButton"}
                                                        onClick={() => findOrCreateContact(match.team2.id)}><ChatFill/>
                                                </button>
                                            </div>
                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                    {(matches.length === 0) && (
                        <div>
                            <br/>
                            <div className={"noConfirmationsTitle"}>
                                {team.name}'s pending confirmations
                            </div>
                            <br/>
                            <div className={"refereeImage"}>
                                <img style={{width: 218, height: "auto"}} src={require("../images/referee.png")}
                                     alt={"referee"}/>
                            </div>
                            <br/>
                            <div className={"noPendingConfs"}>
                                {team.name} does not have any pending confirmations!
                            </div>
                            <br/><br/>
                            <div className={"findRText"}>
                                Find a new rival now!
                            </div>
                            <br/>
                            <div>
                                <button className={"findRButton"} id="submit" type="submit"
                                        onClick={goToFindRival}> Find
                                    Rival!
                                </button>
                            </div>
                        </div>

                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

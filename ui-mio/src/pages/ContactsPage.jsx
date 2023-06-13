import React, {Component, useEffect, useState} from 'react';
import {useAuthProvider} from "../auth/auth";
import {TopBar} from "./TopBar/TopBar";
import "../css/Confirmations.scss"
import {getContacts, getTeam, newMatch} from "../service/mySystem";
import {ChatFill} from "react-bootstrap-icons";


export function ContactsPage(props) {
    const auth = useAuthProvider()
    const token = auth.getToken();
    const id = props.getTeamId;
    let [contacts, setContacts] = useState([]);
    const [team, setTeam] = useState('');


    useEffect(() => {
            getContacts(token, id, (contacts) => {
                    setContacts(contacts)
                }, (contacts) => {
                    console.log("puto cabron")
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

    return (
        <div>
            <TopBar toggleTeamId={props.toggleTeamId} getTeamId={props.getTeamId}/>
            <div className={"containerPrincipal"}>
                <div>
                    {(contacts.length > 0) && (
                        <div>
                            <div className={"confirmationsTitle"}>
                                {team.name}'s contacts
                            </div>
                            {contacts.map((contact) => (
                                <div className={"matchesContainer"}>
                                    <div key={contact.id}>
                                        <p className={"match-info"}>Rival: {contact.team2.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    )}
                    {(contacts.length === 0) && (
                            <div>
                                <p> You dont have contacts</p>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
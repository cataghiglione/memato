import React, { useState, useEffect } from 'react';
import "../css/Chat.css"
import {TopBar} from "./TopBar/TopBar";
import {getContacts, getMessages, sendMessage, getOtherTeamName} from "../service/mySystem";
import {useAuthProvider} from "../auth/auth";
import {useNavigate} from "react-router";
export function ChatPage (props) {
    const auth = useAuthProvider()
    const navigate = useNavigate()
    const token = auth.getToken();
    const [message, setMessage] = useState('');
    let [contacts, setContacts] = useState([]);
    const urlParams = new URLSearchParams(window.location.search);
    const [currentContact, setCurrentContact] = useState( () => {
        return urlParams.has("contactId") ? urlParams.get("contactId") : 0;
    });
    const [otherTeamName, setOtherTeamName] = useState('');
    const [yourMessages, setYourMessages] = useState(['']);
    const [messageSent, setMessageSent] = useState(true);
    const teamId = props.getTeamId;
    useEffect(() => {
        pollForNewMessages()
    }, [])
    // useEffect(() => {
    //     if(urlParams.has("contactId")){
    //         setCurrentContact(urlParams.get('contactId'))
    //     }
    //     else{
    //         setCurrentContact(0)
    //     }
    // }, [window.location.search]);
    useEffect(() => {
        getOtherTeamName(token, currentContact, teamId, (res) =>{
            setOtherTeamName(res)
        })
    }, [currentContact, teamId, token]);

    function pollForNewMessages(){
        getMessages(token, currentContact, (response) => {
            setYourMessages(response);
            setTimeout(pollForNewMessages, 1000);
        })

    }



    const sendMessageMethod = async () => {
        if(message !== ""){
            sendMessage(token, {
                team_id: teamId,
                contact_id: currentContact,
                text: message,
                date: getTodayUtcTZFormat()
            }, () => {
                setMessage("");
                setMessageSent(true);
            })
        }
    };


    function getTodayUtcTZFormat() {
        return new Date().toISOString();
    }

    useEffect(() => {
            getContacts(token, teamId, (contacts) => {
                    setContacts(contacts)
                }
            )
        },[teamId, token]
    )

    async function goToContact(id) {
        setCurrentContact(id)
        window.location.href = `/chat?contactId=${id}`
    }

    return (
        <div>
            <TopBar getTeamId = {props.getTeamId} toggleTeamId = {props.toggleTeamId}/>
            <div className="chat-container">
                <div className="contacts">
                    {contacts.length === 0 && (
                        <div style={{alignItems: "center"}}>
                            <p> You don't have any contacts </p>
                        </div>
                    )}
                    {contacts.map((contact) => (
                        <div>
                            <ul>
                                <li className="contact" key={contact.id} onClick={() => goToContact(contact.id)}>
                                    {contact.team2.name}
                                </li>
                            </ul>
                            {contact.id === currentContact && setOtherTeamName(contact.team2.name)}
                        </div>
                    ))}
                </div>
                {currentContact !== 0 && (
                    <div className="conversation">
                        <div className="user-bar">
                            <div className="name">
                                <span>{otherTeamName}</span>
                            </div>
                        </div>
                        <div className="conversation-container">
                            {yourMessages.length === 0 && (
                                <div style={{alignItems: "center", fontFamily: "Tiro Gurmukhi"}}>
                                    <p> There are no messages in this chat </p>
                                </div>
                            )}
                            {yourMessages.length > 0 && (
                                <div>
                                    {yourMessages.map((message)=>(
                                        <div>
                                            {message.team_id === parseInt(teamId) && (
                                                <div className="message sent">
                                                    <span>{message.text}</span>
                                                    <span className="metadata"><span className="time">{message.hour}:{message.minute}</span></span>
                                                </div>
                                            )}
                                            {message.team_id !== parseInt(teamId) && (
                                                <div className="message received">
                                                    <span>{message.text}</span>
                                                    <span className="metadata"><span className="time">{message.hour}:{message.minute}</span></span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                        <div className="conversation-compose">
                            <input
                                className="input-msg"
                                id="message"
                                placeholder="Type your message"
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                // onKeyPress={handleKeyPress}
                            />
                            <button className="send" onClick={() => sendMessageMethod()}>
                                <div className="circle">
                                    <img src={require("../images/sendIcon.png")}/>
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
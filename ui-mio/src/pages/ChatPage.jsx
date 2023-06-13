import React, { useState, useEffect } from 'react';
import "../css/Chat.css"
import {TopBar} from "./TopBar/TopBar";
import {getContacts, getMessages, sendMessage} from "../service/mySystem";
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
    const [yourMessages, setYourMessages] = useState(['']);
    const [messageSent, setMessageSent] = useState(true);
    useEffect(() => {
        if(urlParams.has("contactId")){
            setCurrentContact(urlParams.get('contactId'))
        }
        else{
            setCurrentContact(0)
        }
    }, [window.location.search]);
    function getMessagesMethod() {
        if(currentContact !== 0){
            getMessages(token, currentContact, (response) => {
                setYourMessages(response);
            })
        }
    }

    const sendMessageMethod = async () => {
        if(message !== ""){
            sendMessage(token, {
                team_id: props.getTeamId,
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
            getContacts(token, props.getTeamId, (contacts) => {
                    setContacts(contacts)
                }
            )
        },[props.getTeamId, token]
    )
    useEffect(() => {
        if(messageSent){
            getMessages(token, currentContact, (response) => {
                setYourMessages(response);
            })
            setMessageSent(false)
        }
        },[props.getTeamId, token, messageSent, currentContact]
    )
    useEffect(() => {
            if(currentContact !== 0){
                getMessages(token, currentContact, (response) => {
                    setYourMessages(response);
                })
                setMessageSent(false)
            }
        },[props.getTeamId, token, currentContact]
    )

    async function goToContact(id) {
        navigate(`/chat?contactId=${id}`)
        setCurrentContact(id)
    }

    return (
        <div>
            <TopBar getTeamId = {props.getTeamId} toggleTeamId = {props.toggleTeamId}/>
            <div className="chat-container">
                <div className="contacts">
                    {contacts.map((contact) => (
                        <div>
                            <ul>
                                <li className="contact" key={contact.id} onClick={() => goToContact(contact.id)}>{contact.team2.name}</li>
                            </ul>
                        </div>
                    ))}
                </div>
                {currentContact !== 0 && (
                    <div className="conversation">
                        <div className="conversation-container">
                            {yourMessages.length > 0 && (
                                <div>
                                    {yourMessages.map((message)=>(
                                        <div>
                                            {console.log(yourMessages)}
                                            {message.team_id === parseInt(props.getTeamId) && (
                                                <div className="message sent">
                                                    <span>{message.text}</span>
                                                    <span className="metadata"><span className="time">{message.hour}:{message.minute}</span></span>
                                                </div>
                                            )}
                                            {message.team_id !== parseInt(props.getTeamId) && (
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
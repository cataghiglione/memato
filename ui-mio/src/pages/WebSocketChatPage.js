import React, { useState, useEffect } from 'react';
import "../css/Chat.css"
import {TopBar} from "./TopBar/TopBar";
import {getContacts, getMessages, sendMessage} from "../service/mySystem";
import {useAuthProvider} from "../auth/auth";
export function WebSocketChat (props) {
    const auth = useAuthProvider()
    const token = auth.getToken();
    const [message, setMessage] = useState('');
    let [contacts, setContacts] = useState([]);
    const [currentContact, setCurrentContact] = useState(0);
    const [yourMessages, setYourMessages] = useState(['']);

    const sendMessageMethod = () => {
        sendMessage(token, {
            team_id: props.getTeamId,
            contact_id: currentContact,
            text: message,
            date: "2023-06-13T15:46:42.300Z"
        }, setMessage(''))
    };


    useEffect(() => {
            getContacts(token, props.getTeamId, (contacts) => {
                    setContacts(contacts)
                }
            )
        },[props.getTeamId, token]
    )

    async function goToContact(id) {
        setCurrentContact(id);
        await getMessages(token, currentContact, (response) => {
            setYourMessages(response);
        });
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
                    <div className="chat">
                        <div className="chat-messages">
                            {yourMessages.map((message)=>(
                                    <div className="chat-message">
                                        <span className="sender">{message.team_name}: </span>
                                        <span className="message">{message.text}</span>
                                        <span className="timestamp">{message.hour}:{message.minute}</span>
                                    </div>
                                ))}
                        </div>
                        <input
                            id="message"
                            placeholder="Type your message"
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            // onKeyPress={handleKeyPress}
                        />
                        <button id="send" onClick={() => sendMessageMethod()}>Send</button>
                    </div>
                )}
            </div>
        </div>
    );
}
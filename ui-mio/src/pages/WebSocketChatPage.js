import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Chat.css';
import { TopBar } from './TopBar/TopBar';
import {getContacts, getMessages, sendMessage} from '../service/mySystem';
import { useAuthProvider } from '../auth/auth';
import SideBar from "./SideBar";
import {ToastContainer} from "react-toastify";

export function WebSocketChat(props) {
    const navigate = useNavigate();
    const auth = useAuthProvider();
    const token = auth.getToken();
    const [webSocket, setWebSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [userList, setUserList] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [otherTeamName, setOtherTeamName] = useState('');
    const [isUserConnected, setIsUserConnected] = useState(false);
    const urlParams = new URLSearchParams(window.location.search);
    const [targetUser, setTargetUser] = useState(() => {
        return urlParams.has('targetId') ? urlParams.get('targetId') : '0';
    });
    const [currentContact, setCurrentContact] = useState(() => {
        return urlParams.has('contactId') ? urlParams.get('contactId') : '0';
    });
    const chatRef = useRef(null);
    const [yourMessages, setYourMessages] = useState([])
    const [oldMessages, setOldMessages] = useState([])
    const teamId = props.getTeamId;
    useEffect(() => {
        pollForNewMessages()
        console.log("pulling for data");
    }, [])
    useEffect(() => {

        const socket = new WebSocket('ws://localhost:4567/chat');

        // on open cargar todos los mensajes en las listas receivedMessages y sentMessages.
        socket.onopen = () => {
            console.log('WebSocket connection opened');
            if (!isUserConnected) {
                const messageJSON = {
                    sender: props.getTeamId,
                };
                socket.send(JSON.stringify(messageJSON));

                setIsUserConnected(true);
            }

        };

        socket.onmessage = (event) => {
            updateChat(event);
        };
        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };
        setWebSocket(socket);
        return () => {
            socket.close();
        };
    }, []);



    function pollForNewMessages(){
        getMessages(token, currentContact, (response) => {
            setOldMessages(response);
        })
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            const messageJSON = {
                sender: props.getTeamId,
                receiver: targetUser,
                content: message,
            };
            console.log(otherTeamName)

            // Send message via WebSocket
            webSocket.send(JSON.stringify(messageJSON));
            //HACER FORMA DE VERIFICAR Q FUÉ ENVIADO.
            // Save message in the database
            const messageData = {
                team_id: teamId,
                contact_id: currentContact,
                text: message,
                date: getTodayUtcTZFormat()
            };

            sendMessage(token, messageData, () => {
                setMessage('');
            });
        }
    };

    function getTodayUtcTZFormat() {
        return new Date().toISOString();
    }
    const updateChat = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received data:', { ...data.userMessage, contact: targetUser }); // {isCurrentUser: false, sender: '1', message: 'hola', timestamp: '22:25:54'}
        console.log('Data: ' + data.userList)
        if(data.userList.lenght >1){
            if (data.userList[0] === props.getTeamId) {
                setYourMessages((prevChat) => [...prevChat, { ...data.userMessage, contact: data.userList[1] }]);
            }
            else {
                setYourMessages((prevChat) => [...prevChat, { ...data.userMessage, contact: data.userList[0] }]);
            }
        }
        else{
            setYourMessages((prevChat) => [...prevChat, { ...data.userMessage, contact: targetUser }]);
        }
        setChat((prevChat) => [...prevChat, data.userMessage]);
        setUserList(data.userList);
    };

    useEffect(() => {
        if (chatRef.current) {
            const chatContainer = chatRef.current;
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [chat]);

    const goToContact = (id, contactId) => {
        // ES LITERALMENTE IRRELEVANTE LO QUE DICE EL URL, YO ME HAGO EL Q LO CAMBIO PARA REINICIAR
        // LA PAGINA AL CAMBIAR DE usuario y que no me aparezcan mensajes vacíos. Resolver bien en el futuro.
        setTargetUser(id);
        setCurrentContact(contactId);
        const url = `/webSocketChat?contactId=${contactId}`;
        const allowed = validateUserAccess(url); // Check if the user is allowed to access the URL
        if (allowed) {
            window.location.href = `/webSocketChat?contactId=${contactId}&targetId=${id}`
        } else {
            // Redirect to an unauthorized page or display an error message
            alert('Unauthorized access!');
        }
    };

    //todo
    const validateUserAccess = (url) => {
        return true;
    };

    useEffect(() => {
        getContacts(token, props.getTeamId, (contacts) => {
            setContacts(contacts);
        });
    }, [props.getTeamId, token]);

    return (
        <div>
            <SideBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}></SideBar>
            <TopBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId} />
            <div className="chat-container">
                {/*Contacts*/}
                <div className="contacts">
                    {contacts.length === 0 && (
                        <div style={{ alignItems: 'center' }}>
                            <p>You don't have any contacts</p>
                        </div>
                    )}
                    {contacts.map((contact) => (
                        <div key={contact.id}>
                            <ul>
                                <li
                                    className={`contact ${currentContact === contact.id.toString() ? 'active' : ''}`}
                                    onClick={() => goToContact(contact.team2.id, contact.id)}
                                >
                                    {contact.team2.name.charAt(0).toUpperCase() + contact.team2.name.substring(1).toLowerCase()}
                                </li>
                            </ul>
                            {contact.id === currentContact && setOtherTeamName(contact.team2.name)}
                        </div>
                    ))}
                </div>
                {/*Chat*/}
                {targetUser !== '0' && (
                    <div className={"conversation"}>
                        <div className="user-bar">
                            <div className="name">
                                {/*This aint workin*/}
                                <span>{otherTeamName}</span>
                            </div>
                        </div>
                        <div className="conversation-container messages-display" id="chat" ref={chatRef} style={{ zIndex: '3' }}>

                            {oldMessages.length === 0 && yourMessages.length === 0 && (
                                <div style={{ alignItems: "center", fontFamily: "Tiro Gurmukhi" }}>
                                    <p>There are no messages in this chat</p>
                                </div>
                            )}
                            {oldMessages.length > 0 && (
                                    <div>
                                        {oldMessages.map((message)=>(
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
                            {yourMessages.length > 0 && (
                                <div>
                                    {yourMessages.map((message, index) => {
                                        const { sender, message: content, timestamp, contact } = message;
                                        const [hour, minute] = timestamp.split(':');
                                        return (
                                            <div
                                                key={index}
                                                className={`message ${sender === props.getTeamId ? 'sent' : 'received'}`}
                                            >
                                                {sender === props.getTeamId && contact === targetUser && (
                                                    <div>
                                                        <span>{content}</span>
                                                        <span className="metadata"><span className="time">{hour}:{minute}</span></span>
                                                    </div>
                                                )}

                                                {sender === targetUser && (
                                                    <div>
                                                        <span>{content}</span>
                                                        <span className="metadata"><span className="time">{hour}:{minute}</span></span>
                                                    </div>
                                                )}

                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {/*Input*/}
                <div className="conversation-compose">
                    <input
                        className="input-msg"
                        placeholder="Type your message"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button className="send" onClick={handleSendMessage}>
                        <div className="circle">
                            <img src={require("../images/sendIcon.png")} alt="send-icon" />
                        </div>
                    </button>
                </div>
            </div>
            <ToastContainer /> {/* Mover el ToastContainer aquí */}
        </div>
    );
}

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
    const [contactsId, setContactsId] = useState([])
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
            console.log("Type of the id is: " + typeof props.getTeamId)
            if (!isUserConnected) {
                const messageJSON = {
                    sender: props.getTeamId.toString(),
                };
                socket.send(JSON.stringify(messageJSON));

                setIsUserConnected(true);
            }

        };

        socket.onerror = (errorEvent) => {
            console.error("WebSocket error:", errorEvent);
        };

        socket.onmessage = (event) => {
            updateChat(event);
            console.log("contactsid: ")
            console.log(contactsId); //(river, depo == 1, 2) (river, depo, pincha ==1,2,3)
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
                sender: props.getTeamId.toString(),
                receiver: targetUser,
                content: message,
            };
            // Send message via WebSocket
            console.log("id " +messageJSON)
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
        if(data.userList.length >1){
            if (data.userList[0] === props.getTeamId.toString()) {
                setYourMessages((prevChat) => [...prevChat, { ...data.userMessage, contact: data.userList[1] }]);
            }
            else {
                setYourMessages((prevChat) => [...prevChat, { ...data.userMessage, contact: data.userList[0] }]);
            }
        }
        else{
            setYourMessages((prevChat) => [...prevChat, { ...data.userMessage, contact: targetUser }]);
        }
        if(!contactsId.includes(data.userList[1]) && !contactsId.includes(data.userList[0])){
        }
        console.log("contactsid: ")
        console.log(contactsId); //(river, depo == 1, 2) (river, depo, pincha ==1,2,3)
        // en el update chat puedo actualizar la lista de contactos.
        setChat((prevChat) => [...prevChat, data.userMessage]);
        setUserList(data.userList);
    };
    /*const updateChat = (event) => {
  const data = JSON.parse(event.data);
  const { userMessage, userList } = data;

  // Update the chat history
  setChat((prevChat) => [...prevChat, userMessage]);

  // Check if the current contact is in the user list
  const currentContactExists = userList.includes(currentContact);

  // Update the user list
  setUserList(userList);

  // If the current contact is not in the user list, update the current contact to the first user in the list
  if (!currentContactExists && userList.length > 0) {
    setCurrentContact(userList[0]);
  }
};
*/

    useEffect(() => {
        if (chatRef.current) {
            const chatContainer = chatRef.current;
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [chat]);

    const goToContact = (id, contactId) => {

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
        getContacts(token, props.getTeamId.toString(), (contacts) => {
            setContacts(contacts);
            const contactsIds = contacts.map((contact) => contact.team2.id);
            setContactsId(contactsIds);


        });
    }, [props.getTeamId.toString(), token]);

    const updateContactsList = () => {
        getContacts(token, props.getTeamId.toString(), (contacts) => {
            setContacts(contacts);
            const contactsIds = contacts.map((contact) => contact.team2.id);
            setContactsId(contactsIds);
        });
    };
    return (
        <div>
            <SideBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}></SideBar>
            <TopBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId} />
            <div className="chat-container">
                {/*Contacts*/}
                <div className="contacts" style={{zIndex:"2"}}>
                    {contacts.length === 0 && (
                        <div style={{ alignItems: 'center'}}>
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

                        <div className="conversation-container messages-display" id="chat" ref={chatRef} style={{ zIndex: '3' }}>

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
                                            >
                                                {sender === props.getTeamId.toString() && contact === targetUser && (
                                                    <div className={`message ${sender === props.getTeamId.toString() ? 'sent' : 'received'}`}>
                                                        <span>{content}</span>
                                                        <span className="metadata"><span className="time">{hour}:{minute}</span></span>
                                                    </div>
                                                )}
                                                {sender === targetUser && (
                                                    <div className={`message ${sender === props.getTeamId.toString() ? 'sent' : 'received'}`}>
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

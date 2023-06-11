import React, { useState, useEffect } from 'react';
import "../css/Chat.css"
export const WebSocketChat = () => {
    const [webSocket, setWebSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [userList, setUserList] = useState([]);
    const [currentUser, setCurrentUser] = useState('');

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:4567/chat");

        socket.onopen = () => {
            console.log("WebSocket connection opened");
        };

        socket.onmessage = (event) => {
            updateChat(event);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        setWebSocket(socket);

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = () => {
        if (message.trim() !== '') {
            webSocket.send(message);
            setMessage('');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    const updateChat = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received data:', data); // Debugging statement
        setChat((prevChat) => [...prevChat, data.userMessage]);
        setUserList(data.userList);
    };

    return (
        <div>
            <div id="chatControls">
                <input
                    id="message"
                    placeholder="Type your message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button id="send" onClick={sendMessage}>Send</button>
            </div>
            <ul id="userlist">
                {userList.map((user, index) => (
                    <li key={index}>{user}</li>
                ))}
            </ul>
            <div id="chat">
                {/*Por ahora, y solo para el parcial, voy a usar esta tramoya increible llamada dangerouslySetInnerHTML*/}
                {/*Como podrán deducir, es increiblemente peligrosa*/}
                {chat.map((message, index) => (
                    <div
                        key={index}

                        className={`message ${message.includes('current-user') ? 'current-user' : 'other-user'}`}
                        dangerouslySetInnerHTML={{ __html: message }}
                    />
                ))}
            </div>
        </div>
    );
};

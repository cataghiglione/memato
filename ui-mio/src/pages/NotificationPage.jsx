import "../css/Notifications.css";
import {useEffect, useState} from "react";
import * as React from "react";
import {useNavigate} from "react-router";
import {useAuthProvider} from "../auth/auth";
import {getNotifications, updateNotification} from "../service/mySystem";
import {TopBar} from "./TopBar/TopBar";

export function NotificationPage(props){
    const navigate = useNavigate();
    const auth = useAuthProvider();
    const token = auth.getToken();
    const [notifications, setNotifications] = useState([''])
    useEffect(() => {
            getNotifications(token, (notifications) => {
                setNotifications(notifications)
            })
        },
        [token]
    )
    function goToConfirmationsPage() {
        navigate("/pendingConfirmations")
    }

    function goToMessages() {
        navigate("/chat")
    }

    const changeStatusOpened = async (id) => {
        await updateNotification(token, id, () => {
            getNotifications(token, (notifications) => {
                setNotifications(notifications)
            })
        })
    }

    return(
        <div>
            <TopBar toggleTeamId={props.toggleTeamId} getTeamId={props.getTeamId}/>
            <div className={"notification-page"}>
                <h1>Notifications Page</h1>
                {notifications.length === 0 &&(
                    <div className={"noNotification"}>
                        You don't have any notifications
                    </div>
                )}
                {notifications.map((notification) => (
                    <div className={"notification"}>
                        <div className={"content"}>{notification.message}</div>
                        <br/>
                        {notification.code_id === 0 && (
                            <div>
                                <button className={"button"} onClick={() => goToConfirmationsPage()}>Don't forget to confirm</button>
                                <button className={"button"} onClick={() => goToMessages()}>Send a message</button>
                            </div>
                        )}
                        {notification.code_id === 1 && (
                            <div>
                                <button className={"button"} onClick={() => goToConfirmationsPage()}>Don't forget to confirm</button>
                            </div>
                        )}
                        {notification.code_id === 3 && (
                            <div>
                                <button className={"button"}>See pending matches</button>
                            </div>
                        )}
                        {notification.opened && (
                            <div>
                                <button className={"icon"}>
                                    <img style={{ width: 22, height: "auto"}} src={require("../images/tickGreenIcon.jpg")} alt={"Logo"}/>
                                </button>
                            </div>)}
                        {!notification.opened && (
                            <div>
                                <button className={"icon"} onClick={() => changeStatusOpened(notification.id)}>
                                    <img style={{ width: 22, height: "auto"}} src={require("../images/tickBlackIcon.jpg")} alt={"Logo"}/>
                                </button>
                            </div>)}
                    </div>
                ))}
            </div>
        </div>
    );
}
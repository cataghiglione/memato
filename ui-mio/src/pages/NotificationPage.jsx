import "../css/Notifications.css";
import {useEffect, useState} from "react";
import * as React from "react";
import {useNavigate} from "react-router";
import {useAuthProvider} from "../auth/auth";
import {getNotifications, updateNotification, newContact} from "../service/mySystem";
import {TopBar} from "./TopBar/TopBar";
import SideBar from "./SideBar";

export function NotificationPage(props) {
    const navigate = useNavigate();
    const auth = useAuthProvider();
    const token = auth.getToken();
    const teamId = props.getTeamId;
    const [notifications, setNotifications] = useState([''])
    useEffect(() => {
            getNotifications(token, (notifications) => {
                setNotifications(notifications)
            })
        },
        [token]
    )

    function goToConfirmationsPage(id) {
        changeStatusOpened(id).then(r =>
            navigate("/pendingConfirmations"))
    }

    const goToMessages= async (id, notification_id) =>{
        newContact(token, {
            team1_id: teamId,
            team2_id: id
        },(res) => {
            console.log(res);
            changeStatusOpened(notification_id);
            navigate(`/chat?contactId=${res}`)
        },
        )
    }

    const changeStatusOpened = (id) => {
        updateNotification(token, id, () => {
            getNotifications(token, (notifications) => {
                setNotifications(notifications)
            })
        })
    }

    return (
        <div>
            <SideBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}></SideBar>
            <TopBar toggleTeamId={props.toggleTeamId} getTeamId={props.getTeamId}/>
            <div className={"notification-page"}>
                <h1>Notifications Page</h1>
                {notifications.length === 0 && (
                    <div className={"noNotification"}>
                        You don't have any notifications
                    </div>
                )}
                {(notifications.length > 0) &&  (
                    <div>
                {notifications.map((notification) => (
                    <div className={"notification"}>
                        <div className={"content"}>{notification.message}</div>
                        <br/>
                        {notification.code_id === 0 && (
                            <div>
                                <button className={"button"} onClick={() => goToConfirmationsPage()}>Don't forget to
                                    confirm
                                </button>
                                <button className={"button"} onClick={() => goToMessages(notification.team_id, notification.id)}>Send a message</button>
                            </div>
                        )}
                        {notification.code_id === 1 && (
                            <div>
                                <button className={"button"} onClick={() => goToConfirmationsPage()}>Don't forget to
                                    confirm
                                </button>
                            </div>
                        )}
                        {notification.code_id === 2 && (
                            <div>
                                <button className={"button"} onClick={() => goToMessages(notification.team_id)}>Send a message
                                </button>
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
                    </div>)}
            </div>
        </div>
    );
}
import "../css/Notifications.scss";
import {useEffect, useState} from "react";
import * as React from "react";
import {useNavigate} from "react-router";
import {useAuthProvider} from "../auth/auth";
import {getNotifications, updateNotification, newContact} from "../service/mySystem";
import {TopBar} from "./TopBar/TopBar";
import {ToastContainer} from "react-toastify";
import SideBar from "./SideBar";

export function NotificationPage(props) {
    const navigate = useNavigate();
    const auth = useAuthProvider();
    const token = auth.getToken();
    const team_id = props.team_id;
    const [notifications, setNotifications] = useState([''])
    useEffect(() => {
            getNotifications(token, (notifications) => {
                setNotifications(notifications)
            })
        },
        [token]
    )

    function goToConfirmationsPage(team_id, id) {
        props.toggleTeamId(team_id);
        changeStatusOpened(id);
        navigate(`/currentSearches`)
    }
    function goToMessages(id, team_id, other_team_id) {
        props.toggleTeamId(team_id)
        changeStatusOpened(id)
        findOrCreateContact(team_id, other_team_id)
    }
    function findOrCreateContact(team_id, otherTeamId) {
        newContact(token, {
                team1_id: team_id,
                team2_id: otherTeamId
            }, (res) => {
                console.log(res)
                navigate(`/webSocketChat?contactId=${res}&targetId=${otherTeamId}`)
            },
            () => {
                // TODO when error callback happens it takes you only to the /chat, without throwing the error on console
                console.log('Contact already exists!')
                navigate("/webSocketChat")
            }
        )
    }

    const changeStatusOpened = (id) => {
        updateNotification(token, id, () => {
            getNotifications(token, (notifications) => {
                setNotifications(notifications)
            })
        })
    }

    function goToFindRival(team_id, id, search_id) {
        props.toggleTeamId(team_id);
        changeStatusOpened(id);
        navigate(`/findRival?id=${search_id}`)
    }
    function goToPendingMatches(id, team_id) {
        props.toggleTeamId(team_id);
        changeStatusOpened(id);
        navigate(`/myConfirmations`)
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
                                <button className={"button"} onClick={() => goToConfirmationsPage(notification.team_id, notification.id)}>Don't forget to
                                    confirm
                                </button>
                                <button className={"button"} onClick={() => goToMessages(notification.id, notification.team_id, notification.other_team_id)}>Send a message</button>
                            </div>
                        )}
                        {notification.code_id === 1 && (
                            <div>
                                <button className={"button"} onClick={() => goToConfirmationsPage(notification.team_id, notification.id)}>Don't forget to
                                    confirm
                                </button>
                            </div>
                        )}
                        {notification.code_id === 2 && (
                            <div>
                                <button className={"button"} onClick={() => goToMessages(notification.id, notification.team_id, notification.other_team_id)}>Send a message
                                </button>
                            </div>
                        )}
                        {notification.code_id === 3 && (
                            <div>
                                <button className={"button"} onClick={() => goToPendingMatches(notification.id, notification.team_id)}>
                                    See pending matches</button>
                                {console.log(notification)}
                            </div>
                        )}
                        {notification.code_id === 5 && (
                            <div>
                                <button className={"button"} onClick={() => goToFindRival(notification.team_id, notification.id, notification.search_id)}>Find Rival</button>
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
            <ToastContainer/> {/* Mover el ToastContainer aquí */}
        </div>
    );
}
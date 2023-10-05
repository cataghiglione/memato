import "../../css/Notifications.scss";
import {useEffect, useState} from "react";
import * as React from "react";
import {useLocation, useNavigate} from "react-router";
import {useAuthProvider} from "../../auth/auth";
import {getNotifications, getPendingNotifications, newContact, updateNotification} from "../../service/mySystem";

export function NotificationsCenter(props){
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuthProvider();
    const token = auth.getToken();
    const [notifications, setNotifications] = useState([''])
    useEffect(() => {
            getPendingNotifications(token, (notifications) => {
                setNotifications(notifications)
            })
        }, [token]
    )

    function goToConfirmationsPage(team_id, id) {
        props.toggleTeamId(team_id);
        changeStatusOpened(id);
        navigate(`/currentSearches`)
    }
    function goToFindRival(team_id, id, search_id) {
        props.toggleTeamId(team_id);
        changeStatusOpened(id);
        navigate(`/findRival?id=${search_id}`)
    }

    function goToMessages(id, team_id, other_team_id) {
        props.toggleTeamId(team_id)
        changeStatusOpened(id)
        findOrCreateContact(team_id, other_team_id)
    }

    function seeAllNotifications() {
        if(location.pathname=== "/notificationPage"){
            props.changeVisible()
        }
        navigate("/notificationPage");
    }
    const changeStatusOpened = (id) => {
        updateNotification(token, id, () => {
            getNotifications(token, (notifications) => {
                setNotifications(notifications)
            })
        })
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

    function goToPendingMatches(id, team_id, other_team_id) {
        props.toggleTeamId(team_id)
        changeStatusOpened(id)
        navigate(`/myConfirmations`)
    }

    return(
        <body>
        <div className={"popover-notifications"}>
            <h1>  </h1>
            <br/>
            <h3> Pending Notifications </h3>
            <br/>
            <button className={"view-all"} onClick={() => seeAllNotifications()}>
                See all the notifications
            </button>
            <br/><br/>
            {notifications.length === 0 &&(
                <div className={"notifications-list"}>
                    <div className={"popover-notification"} style={{height: "10vh", width: "48vh", textAlign:"center" }}>
                        You don't have any pending notifications.
                    </div>
                </div>
            )}

            {notifications.length !== 0 && (
                <div className={"notifications-list"}>
                    {notifications.map((notification) => (
                        <div className={"popover-notification"}>
                            {notification.message}
                            <br/>
                            {notification.code_id === 0 && (
                                <div>
                                    <button className={"button"} onClick={() => goToConfirmationsPage(notification.team_id, notification.id)}>
                                        Don't forget to confirm
                                    </button>
                                    <button className={"button"} onClick={() => goToMessages(notification.id, notification.team_id, notification.other_team_id)}>
                                        Send a message</button>
                                </div>
                            )}
                            {notification.code_id === 1 && (
                                <div>
                                    <button className={"button"} onClick={() => goToConfirmationsPage(notification.team_id, notification.id)}>
                                        Don't forget to confirm
                                    </button>
                                </div>
                            )}
                            {notification.code_id === 2 && (
                                <div>
                                    <button className={"button"} onClick={() => goToMessages(notification.id, notification.team_id, notification.other_team_id)}>
                                        Send a message </button>
                                </div>
                            )}
                            {notification.code_id === 3 && (
                                <div>
                                    <button className={"button"} onClick={() => goToPendingMatches(notification.id, notification.team_id, notification.other_team_id)}>
                                        See pending matches</button>
                                </div>
                            )}
                            {notification.code_id === 5 && (
                                <div>
                                    <button className={"button"} onClick={() => goToFindRival(notification.team_id, notification.id, notification.search_id)}>
                                        Find Rival</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

        </div>
        </body>
    );
}
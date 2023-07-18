import "../../css/Notifications.scss";
import {useEffect, useState} from "react";
import * as React from "react";
import {useLocation, useNavigate} from "react-router";
import {useAuthProvider} from "../../auth/auth";
import {getNotifications, getPendingNotifications, updateNotification} from "../../service/mySystem";

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

    function goToConfirmationsPage(id) {
        changeStatusOpened(id).then(r =>
            navigate("/pendingConfirmations"))
    }

    function goToMessages(id) {
        changeStatusOpened(id).then(r => navigate("/chat"))
    }

    function seeAllNotifications() {
        if(location.pathname=== "/notificationPage"){
            props.changeVisible()
        }
        navigate("/notificationPage");
    }
    const changeStatusOpened = async (id) => {
        updateNotification(token, id)
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
                <div className={"popover-notification"} style={{border: "1px solid lightgray"}}>
                    You don't have any pending notifications.
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
                                    <button className={"popover-notificationButton"} onClick={() => goToConfirmationsPage(notification.id)}>Don't forget to
                                        confirm
                                    </button>
                                    <button className={"popover-notificationButton"} onClick={() => goToMessages(notification.id)}>Send a message</button>
                                </div>
                            )}
                            {notification.code_id === 1 && (
                                <div>
                                    <button className={"popover-notificationButton"} onClick={() => goToConfirmationsPage(notification.id)}>Don't forget to
                                        confirm
                                    </button>
                                </div>
                            )}
                            {notification.code_id === 2 && (
                                <div>
                                    <button className={"popover-notificationButton"} onClick={() => goToMessages(notification.id)}>Send a message</button>
                                </div>
                            )}

                            {notification.code_id === 3 && (
                                <div>
                                    <button className={"popover-notificationButton"}>See pending matches</button>
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

import "../../css/Notifications.css";
import {useEffect, useState} from "react";
import * as React from "react";
import {useLocation, useNavigate} from "react-router";
import {useAuthProvider} from "../../auth/auth";
import {getPendingNotifications} from "../../service/mySystem";

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
        },
        [token]
    )

    function goToConfirmationsPage() {
        navigate("/pendingConfirmations")
    }

    function goToMessages() {
        navigate("/chat")
    }

    function seeAllNotifications() {
        if(location.pathname=== "/notificationPage"){
            props.changeVisible()
        }
        navigate("/notificationPage");
    }

    return(
        <div className={"popover-notifications"}>
            {console.log(notifications)}
            {notifications.length === 0 &&(
                <div className={"notification"}>
                    You don't have any pending notifications.
                </div>
            )}

            {notifications.length !== 0 && (
                <div>
                    {notifications.map((notification) => (
                        <div className={"notification"}>
                            {notification.message}
                            <br/>
                            {notification.code_id === 0 && (
                                <div>
                                    <button className={"button"} onClick={() => goToConfirmationsPage()}>Don't forget to
                                        confirm
                                    </button>
                                    <button className={"button"} onClick={() => goToMessages()}>Send a message</button>
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
                                    <button className={"button"} onClick={() => goToMessages()}>Send a message</button>
                                </div>
                            )}

                            {notification.code_id === 3 && (
                                <div>
                                    <button className={"button"}>See pending matches</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <div>
                <div>
                    <br/>
                    <button className={"view-all"} onClick={() => seeAllNotifications()}>See all the notifications</button>
                </div>
            </div>
        </div>
    );
}

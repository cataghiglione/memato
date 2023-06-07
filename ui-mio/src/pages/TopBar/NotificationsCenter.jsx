import "../../css/Notifications.css";
import {useEffect, useState} from "react";
import * as React from "react";
import {useLocation, useNavigate} from "react-router";
import {useAuthProvider} from "../../auth/auth";
import {getNotifications} from "../../service/mySystem";

export function NotificationsCenter(props){
    const [visible, setVisible] = useState(false);
    const [pageChange, setPageChange] = useState(['']);
    const navigate = useNavigate();
    const location = useLocation();
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

    const toggleCenter = () =>{
        setVisible(!visible);
    }
    const togglePage=(event)=>{
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setPageChange(selectedOptions);
        if(location.pathname===selectedOptions[0]){
            toggleCenter();
            setPageChange([""]);
        }
        navigate(selectedOptions[0]);
    }

    function goToConfirmationsPage() {
        navigate("/pendingConfirmations")
    }

    function goToMessages() {
        return undefined;
    }

    return(
        <div>
            <button className={"showCenter"} onClick={toggleCenter}>
                <img style={{ width: 22, height: "auto"}} src={require("../../images/bell.png")} alt={"Logo"}/>
            </button>
            {(visible && props.canBeVisible) &&
                (
                    <div className={"side-bar-notifications"}>
                        {notifications.map((notification) => (
                            <div className={"option"}>
                                {notification.message}
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
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    );
}

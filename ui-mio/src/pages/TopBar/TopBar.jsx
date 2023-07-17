import React, {useState} from 'react';
import "../../css/Home.scss"
import "../../css/PickTeam.scss"
import {getTeam, listTeams} from "../../service/mySystem";
import {useAuthProvider} from "../../auth/auth";
import {MenuSideBar} from "./MenuSideBar";
import {useLocation, useNavigate} from "react-router";
import {NotificationsCenter} from "./NotificationsCenter";
import {ToastContainer} from "react-toastify";

function goToNewTeam(){
    window.location.href = "/newTeam"
}
function goToHome() {
    window.location.href = "/home"
}
export function TopBar(props) {
    const auth = useAuthProvider()
    const token = auth.getToken()
    const navigate = useNavigate()
    const location = useLocation();

    const [teams, setTeams] = useState([])
    const [actualTeam, setActualTeam] = useState('')
    const [visible, setVisible] = useState(false)
    const [menuVisible, setMenuVisible] = useState(false)
    const [notifVisible, setNotifVisible] = useState(false)
    const [once, setOnce] = useState(true);

    const getTeamMethod = () => {
        getTeam(token, props.getTeamId, (actualTeam) => setActualTeam(actualTeam));
        listTeams(token, (teams) => setTeams(teams));
        setOnce(false);
    }

    const togglePickTeam = () => {
        setVisible(!visible);
    }

    const goToPickTeam = () => {
        if(location.pathname==="/pickTeam"){}
        else{navigate("/pickTeam")}
    }

    const toggleMenuCenter = () =>{
        setMenuVisible(!menuVisible);
        if(notifVisible){
            toggleNotificationCenter()
        }
    }
    const toggleNotificationCenter = () =>{
        setNotifVisible(!notifVisible);
        if(menuVisible){
            toggleMenuCenter()
        }
    }

    return (
        <div>
            {once && getTeamMethod()}
            <div className={"top-bar"} style={{backgroundColor: 204257}}>

                <img className={"top-bar-logo"} onClick={goToHome} style={{width: 250, height: "auto"}} src={require("../../images/logoRM/logoRM_letra.png")} alt={"Logo"}/>

                <div className={"team-dropdown"}>
                    {!(props.getTeamId === 0) &&
                    <button className={"team-dropdown-btn"} onClick={togglePickTeam}>
                        {actualTeam.sport} {actualTeam.quantity}: {actualTeam.name}
                        <img style={{width: 22, height: "auto"}} src={require("../../images/dropdown-1.png")}
                             alt={"Logo"}/>
                    </button>}
                    {visible && goToPickTeam()}
                </div>
                {/*<br/>*/}
                {/*<button className={"showNotificationCenter"} onClick={toggleNotificationCenter}>*/}
                {/*    <img style={{ width: 25, height: "auto"}} src={require("../../images/bell.png")}/>*/}
                {/*</button>*/}
                <button className={"showMenu"} onClick={toggleMenuCenter}>
                    <img style={{ width: 25, height: "auto"}} src={require("../../images/sideBarIcon.png")}/>
                </button>
                {menuVisible && (
                    <div>
                        <MenuSideBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId} changeVisible = {() => setMenuVisible(false)}/>
                    </div>
                )}
                {(notifVisible && parseInt(props.getTeamId) !== 0) && (
                    <div>
                        <NotificationsCenter changeVisible = {() => setNotifVisible(false)}/>
                    </div>
                )}
                {(parseInt(props.getTeamId) !== 0) && (
                    <div>
                        <button className={"showNotificationCenter"} onClick={toggleNotificationCenter}>
                            <img style={{ width: 22, height: "auto"}} src={require("../../images/bell.png")}/>
                        </button>
                    </div>
                )}
                {/*<ToastContainer/> /!* Mover el ToastContainer aquí *!/*/}

            </div>
        </div>
    )
}
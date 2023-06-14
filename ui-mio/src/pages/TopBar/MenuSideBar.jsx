import "../../css/sideBar.scss";
import {useState} from "react";
import * as React from "react";
import {useLocation, useNavigate} from "react-router";
import {useAuthProvider} from "../../auth/auth";
import {signOut} from "../../service/mySystem";
import {Search} from "react-bootstrap-icons";

export function MenuSideBar(props){
    const [pageChange, setPageChange] = useState(['']);
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuthProvider();
    const token = auth.getToken();

    const togglePage=(event)=>{
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setPageChange(selectedOptions);
        if(location.pathname===selectedOptions[0]){
            props.changeVisible()
            setPageChange([""]);
        }
        navigate(selectedOptions[0]);
    }


    function signOutMethod(){
        signOut(token, navigate("/"))
        auth.removeToken();
        props.toggleTeamId(0);
    }

    return(
        <div className={"side-bar"}>
            <select id="Menu" multiple={true} className={"select"} value={pageChange} onChange={togglePage} style={{width: "100%"}}>

                {props.getTeamId !== 0 && <option className={"option"} key={"/findRival"} value="/findRival"> Find Rival</option>}
                {props.getTeamId !== 0 && <option className={"option"} key={"/currentSearches"} value="/currentSearches">Current Searches</option>}
                {props.getTeamId !== 0 && <option className={"option"} key={"/pendingConfirmations"} value="/pendingConfirmations">Pending Confirmations</option>}
                {props.getTeamId !== 0 && <option className={"option"} key={"/myConfirmations"} value="/myConfirmations">My Confirmations</option>}
                {props.getTeamId !== 0 && <option className={"option"} key={"/chat"} value="/chat">Chat</option>}
                {props.getTeamId !== 0 && <option className={"option"} key={"/newTeam"} value="/newTeam">New Team</option>}
                {props.getTeamId !== 0 && <option className={"option"} key={"/editTeam"} value="/editTeam">Team Settings</option>}
                <option className={"option"} key={"/user"} value="/user">Profile</option>
            </select>

            {/*<br/><br/>*/}
            <button className={"signOut-option"} onClick={signOutMethod} value="Sign Out">Sign Out</button>
        </div>
    );
}

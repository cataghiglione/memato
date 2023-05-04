import "../../css/sideBar.css";
import {useState} from "react";
import * as React from "react";
import {useLocation, useNavigate} from "react-router";
import {useAuthProvider} from "../../auth/auth";
import {signOut} from "../../service/mySystem";

export function MenuSideBar(props){
    const [visible, setVisible] = useState(false);
    const [pageChange, setPageChange] = useState(['']);
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuthProvider();
    const token = auth.getToken();

    const toggleMenu = () =>{
        setVisible(!visible);
    }
    const togglePage=(event)=>{
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setPageChange(selectedOptions);
        if(location.pathname===selectedOptions[0]){
            toggleMenu();
            setPageChange([""]);
        }
        navigate(selectedOptions[0]).then();
    }


    function signOutMethod(){
        signOut(token, navigate("/"))
        auth.removeToken();
    }

    return(
        <div>
            <button className={"Menu"} onClick={toggleMenu}>
                <img style={{ width: 22, height: "auto"}} src={require("../../images/sideBarIcon.png")}/>
            </button>
            {visible &&
                (
                    <div className={"side-bar"}>
                        <select id="Menu" multiple={true} className={"select"} value={pageChange} onChange={togglePage}>
                            {props.getTeamId !== 0 && <option className={"option"} key={"/editTeam"} value="/editTeam">Team Settings</option>}
                            {props.getTeamId !== 0 && <option className={"option"} key={"/findRival"} value="/findRival">Find Rival</option>}
                            {props.getTeamId !== 0 && <option className={"option"} key={"/newTeam"} value="/newTeam">New Team</option>}
                            <option className={"option"} key={"/user"} value="/user">Profile</option>
                        </select>
                        {/*<br/><br/>*/}
                        <button className={"signOut-option"} onClick={signOutMethod} value="Sign Out">Sign Out</button>
                    </div>
                )
            }
        </div>
    );
}

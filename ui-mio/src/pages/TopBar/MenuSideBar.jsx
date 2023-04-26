import "../../css/Home.css";
import {useState} from "react";
import * as React from "react";
import {useLocation, useNavigate} from "react-router";

export function MenuSideBar(props){
    const [visible, setVisible] = useState(false);
    const [pageChange, setPageChange] = useState(['']);
    const history = useNavigate();
    const location = useLocation();
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
        history(selectedOptions[0]).then();
    }
    const menuForm = () =>{
        if(visible){
            return(
                <div>
                    <select className={"custom-select"} id="Menu" multiple={true} value={pageChange} onChange={togglePage}>
                        {props.getTeamId !== 0 && (
                            <div>
                                <option className={"custom-select-option"} value="/editTeam">Team Settings</option>
                                <option className={"custom-select-option"} value="/findRival">Find Rival</option>
                                <option className={"custom-select-option"} value="/newTeam">New Team</option>
                            </div>
                        )}
                        <option className={"custom-select-option"} value="/settings">Settings</option>
                    </select>
                </div>
            )
        }
    }
    return(
        <div>
            <button className={"Menu"} onClick={toggleMenu}>
                <img style={{ width: 22, height: "auto"}} src={require("../../images/sideBarIcon.png")}/>
            </button>
            {visible &&
                (
                    <div>
                        <select className={"custom-select"} id="Menu" multiple={true} value={pageChange} onChange={togglePage}>
                            {props.getTeamId !== 0 && <option className={"custom-select-option"} value="/editTeam">Team Settings</option>}
                            {props.getTeamId !== 0 && <option className={"custom-select-option"} value="/findRival">Find Rival</option>}
                            {props.getTeamId !== 0 && <option className={"custom-select-option"} value="/newTeam">New Team</option>}
                            <option className={"custom-select-option"} value="/user">Profile</option>
                        </select>
                    </div>
                )
            }
        </div>
    );
}


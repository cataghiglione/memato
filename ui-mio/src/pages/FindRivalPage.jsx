import React, {Component, useEffect, useState} from 'react';
import "../css/FindRival.css"
import {useNavigate} from "react-router";
import {useMySystem} from "../service/mySystem";
import {useAuthProvider} from "../auth/auth";
import {useSearchParams} from "react-router-dom";
import DatePicker, {CalendarContainer} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Dropdown} from "bootstrap";


function goToNewTeam() {
    window.location.href = "/newTeam"
}

function goToHome() {
    window.location.href = "/user"
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
function findRival(){

}

export default function FindRivalPage() {
    const [date, setDate] = useState(new Date());
    const mySystem = useMySystem()
    const auth = useAuthProvider()
    const token = auth.getToken();
    const [time, setTime] = useState('')

    const handleSubmit = async e => {

    }
    const requestRivals = (user) => {

    }
    const timeChange = (event) => {
        setTime(event.target.value)
    }
    const MyContainer = ({ className, children }) => {
        return (
            <div style={{ padding: "16px", background: "green", color: "#fff" }}>
                <CalendarContainer className={className}>
                    <div style={{ background: "transparent" }}>
                    </div>
                    <div style={{ position: "relative" }}>{children}</div>
                </CalendarContainer>
            </div>
        );
    };
    return (

        <div>
            <div className={"logo"}>
                <img style={{width: 218, height: "auto"}} src={require("../images/logo_solo_letras.png")} alt={"Logo"}/>
            </div>

            <div className={"containerPrincipal"}>
                <DatePicker
                    showIcon
                    selected={date}
                    onChange={date => setDate(date)}
                    calendarContainer={MyContainer}

                />
                You've selected
                <br/>
                Day: {date.getDate()}
                <br/>
                Month: {date.getMonth()}

            </div>
            <div className={"time_select"}>
                <p>Select your time of preference!</p>
                <select id="time" required onChange={setTime}>
                    <option disabled={true} value="">
                        Time of day...
                    </option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Night">Night</option>
                    <option value="No preference">No preference</option>
                </select>
            </div>
            <div className={"zone"}>
                <p>Your team's zone is...</p>
                <p></p>


            </div>
            <button className={"findRivalButton"} onClick={findRival}> Find Rival!</button>
        </div>


    )
}


// React.useEffect(()=>{
//     async function getTeams(){
//         const response = await fetch('http://localhost:4326/findRival',{
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Bearer ' + token
//             }});
//         const body = await response.json();
//         setItems(body.results.map(({name})=>({label: name, value: name})));
//         setLoading(false);
//     }
//     getTeams();
// },[]);

// <select disabled={loading}
//         value={value}
//         onChange={e => setValue(e.currentTarget.value)}>
// <select>
//     {teams.map(({ label, value }) => (
//         <option key={value} value={value}>
//             {label}
//         </option>
//     ))}
//
// </select>
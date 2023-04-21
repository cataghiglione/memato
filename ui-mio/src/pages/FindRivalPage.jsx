import React, {Component, useEffect, useState} from 'react';
import "../css/FindRival.css"
import {useLocation, useNavigate} from "react-router";
import {findRival, getTeam} from "../service/mySystem";
import {useAuthProvider} from "../auth/auth";
import {useSearchParams} from "react-router-dom";

import DatePicker, {CalendarContainer} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Dropdown} from "bootstrap";
import {TeamDropdown} from "./TeamDropdown";
import {BingMap} from "./BingMap";
import {forEach} from "react-bootstrap/ElementChildren";


function goToNewTeam() {
    window.location.href = "/newTeam"
}


function goToUserInfo() {
    window.location.href = "/user"
}

function goToHome() {
    window.location.href = "/home"
}

function goToPickTeam() {
    window.location.href = "/pickTeam"
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
export function FindRivalPage(props){
    const auth = useAuthProvider()
    const token = auth.getToken();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState(undefined)

    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('')

    const [rivalMenuOpen, setRivalMenuOpen] = useState(false);

    const [zone, setZone] = useState([])
    const [showPopup, setShowPopup] = useState(false);
    const [changeLocationButton, setChangeLocationButton] = useState('Select location');
    const [selectedLocation, setSelectedLocation] = useState("")

    function handleSelectLocation() {
        if(showPopup === false)
            setShowPopup(true);
        else
            setShowPopup(false);
    }

    const handleInfoboxesWithPushPins = (infoboxesWithPushPinsData) => {
        setChangeLocationButton('Change Location');
        setZone(infoboxesWithPushPinsData[0].location);
        printSelectedLocation(infoboxesWithPushPinsData[0].location);
    };

    const printSelectedLocation = (location) => {
        const [lat, long] = location;
        if (long && lat) {
            setSelectedLocation(`Latitude: ${lat}, Longitude: ${long}`);
        }
    };

    const [teams, setTeams] = useState([]);
    const [team, setTeam] = useState('');
    const location = useLocation();
    const params = new URLSearchParams(location.search)
    const id = params.get("id");


    // con esto lee los params
    // const searchParams = useSearchParams();
    // // con este lee el paramentro de "id"
    // const id = searchParams.get("id")

    // aca va al mySystem para agarrar los != teams
    useEffect(() => {
        getTeam(token, id, (team) => setTeam(team));
    }, [])
    // aca va al mySystem para agarrar el team

    const openAndFindRivals = async e => {
        setRivalMenuOpen(true);
    }


    const handleSubmit = async e => {
        e.preventDefault();
        findRival(id,{
            date:date,
            time:time,
            latitude: zone[0].toString(),
            longitude: zone[1].toString()
        })
    }
    const findRival = (id, search) => {
        findRival(token, id, search, (teams) => {
                setTeams(teams)
            },
            () => {
                setErrorMsg('Search already exists!')
            })
    }
    const requestRivals = (user) => {

    }
    const timeChange = (event) => {
        setTime(event.target.value)
    }
    const MyContainer = ({className, children}) => {
        return (
            <div style={{padding: "16px", background: "green", color: "#fff"}}>
                <CalendarContainer className={className}>
                    <div style={{background: "transparent"}}>
                    </div>
                    <div style={{position: "relative"}}>{children}</div>
                </CalendarContainer>
            </div>
        );
    };
    return (

        <div>
            <TeamDropdown getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}/>
            <div className={"logo"}>
                <img style={{width: 218, height: "auto"}} src={require("../images/logo_solo_letras.png")} alt={"Logo"}/>
            </div>
            <div className={"sports_image"}>
                <img style={{width: 218, height: "auto"}} src={require("../images/varios_deportes.png")}
                     alt={"deportes"}/>
            </div>
            <div className={"mirror_sports_image"}>
                <img style={{width: 218, height: "auto"}} src={require("../images/varios_deportes.png")}
                     alt={"deportes"}/>
            </div>

            <div className="team_name">
                You've chosen {team.name}
                <br/>
                Sport: {team.sport}
            </div>
            <form onSubmit={handleSubmit}>


                <div className={"containerPrincipal"}>
                    Choose a day to play:
                    <DatePicker
                        showIcon
                        selected={date}
                        onChange={date => setDate(date)}
                        calendarContainer={MyContainer}

                    />


                </div>
                <div className={"time_select"}>
                    <p>Select your time of preference!</p>
                    <select id="time" required onChange={timeChange} value={time}>
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
                    <p>Select your preferred zone: </p>
                    <p>{selectedLocation}</p>
                    <button onClick={handleSelectLocation}>{changeLocationButton}</button>
                    {showPopup && (
                        <div className="popup">
                            <BingMap
                                onInfoboxesWithPushPinsChange={handleInfoboxesWithPushPins}
                            />
                            <button id="confirmLoc" onClick={handleSelectLocation}>Confirm location</button>
                        </div>
                    )}


                </div>
                <div>
                    <div className={"title"}>
                        Teams searching for rivals:
                    </div>


                </div>


                <button className={"findRivalButton"} id="submit" type="submit" onClick={openAndFindRivals}> Find
                    Rival!
                </button>
            </form>
            {(rivalMenuOpen & teams.length>0) &&
                <select className={"team-select"} multiple={true} onChange={playMatch}>
                    {teams.map(team =>
                            <option className={"team-select-option"} style={{ textTransform: 'capitalize'}} value={team.id}>
                                nombre: {team.name}, deporte: {team.sport}, categoria: {team.group} </option>
                        // <p>nombre = {team.name}    deporte = {team.sport} </p>
                        // <option>{team.name}</option>

                    )}
                </select>}
            {teams.length === 0 &&
                <p className={"noTeamSearch"}>There are currently no teams searching for rivals with your preferences</p>
            }


            <button className={"goToPickTeamButton"} onClick={goToPickTeam}> Change Team</button>
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
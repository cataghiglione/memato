import React, {useEffect, useState} from 'react';
import "../css/FindRival.css"
import "../css/Home.css"
import {useNavigate} from "react-router";
import {findRival, getTeam, newMatch, possibleSearchCandidates} from "../service/mySystem";
import {useAuthProvider} from "../auth/auth";

import DatePicker, {CalendarContainer} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {TopBar} from "./TopBar/TopBar";
import {BingMap} from "./BingMap"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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

export function FindRivalPage(props) {
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

    function handleSelectLocation(e) {
        e.preventDefault(); // Prevent form submission
        if (showPopup === false)
            setShowPopup(true);
        else
            setShowPopup(false);
    }


    const popUpMessage = () => {
        toast.success('Request sent!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
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

    const [searches, setSearches] = useState([]);
    const [team, setTeam] = useState('');
    const [searchId, setSearchId] = useState(0)
    const teamId = props.getTeamId;
    const [noSearchesCandidates, setNoSearchesCandidates] = useState("There are currently no teams searching for rivals with your preferences")


    // con esto lee los params
    // const searchParams = useSearchParams();
    // // con este lee el paramentro de "id"
    // const id = searchParams.get("id")

    // aca va al mySystem para agarrar los != teams
    useEffect(() => {
        getTeam(token, teamId, (team) => setTeam(team));
    }, [teamId, token])
    // aca va al mySystem para agarrar el team

    const openAndFindRivals = async e => {
        setRivalMenuOpen(true);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        await findRivalMethod({
            date: date,
            time: time,
            latitude: zone[0].toString(),
            longitude: zone[1].toString()
        })
    }
    const findRivalMethod = (search) => {
        if (rivalMenuOpen) {
            findRival(token, teamId, search, (res) => {
                    toast.success('Search is now active!', {containerId: 'toast-container',
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    console.log(res)
                    setSearches(res.searches)
                    setSearchId(res.searchId)
                },
                () => {
                    setErrorMsg('Search already exists!')
                })
        }
    }

    const playButton = async (id) => {
        await newMatch(token, {
                candidate_search_id: id,
                searchId: searchId
            },
            async (res) => {
                toast.success('Request sent!', {containerId: 'toast-container',
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                console.log(res)
                await possibleSearchCandidates(token, searchId, (searches) => {
                    setSearches(searches)
                    if (searches.length === 0) {
                        setNoSearchesCandidates("There are currently no more teams searching for rivals with your preferences");
                    }
                    console.log(searches)
                },)
            },
            () => {
                console.log('A match with this searches already exists!')
            }
        )

    }

    // const requestRivals = (user) => {
    //
    // }
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
            <TopBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}/>
            {/*<div className={"logo"}>*/}
            {/*    <img style={{width: 218, height: "auto"}} src={require("../images/logo_solo_letras.png")} alt={"Logo"}/>*/}
            {/*</div>*/}
            <div className={"sports_image"}>
                <img style={{width: 218, height: "auto"}} src={require("../images/varios_deportes.png")}
                     alt={"deportes"}/>
            </div>
            <br/>
            <div className={"mirror_sports_image"}>
                <img style={{width: 218, height: "auto"}} src={require("../images/varios_deportes.png")}
                     alt={"deportes"}/>
            </div>
            <br/>
            <div className="team_name">
                You've chosen {team.name}
                <br/>
                Sport: {team.sport}
            </div>
            <form onSubmit={rivalMenuOpen && handleSubmit}>

                <div className={"datePicker"}>
                    Choose a day to play:
                    <DatePicker
                        showIcon
                        selected={date}
                        dateFormat="dd/MM/yyyy"
                        onChange={date => setDate(date)}
                        minDate={new Date()}
                        showDisabledMonthNavigation
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
                    <button className={"greenButton"} onClick={handleSelectLocation}>{changeLocationButton}</button>
                    {showPopup && (
                        <div className="popup">
                            <BingMap
                                onInfoboxesWithPushPinsChange={handleInfoboxesWithPushPins}
                            />
                            <button id="confirmLoc" onClick={handleSelectLocation}>Confirm location</button>
                        </div>
                    )}


                </div>


                <button className={"findRivalButton"} id="submit" type="submit" onClick={openAndFindRivals}> Find
                    Rival!
                </button>
            </form>
            {(rivalMenuOpen && searches.length > 0) &&
                <div>
                    <div className={"title"}>
                        Teams searching for rivals:
                    </div>


                    {/*    <select className={"team-select"} multiple={true} onChange={playMatch}>*/}
                    {/*{teams.map(team =>*/}
                    {/*    <option className={"team-select-option"} style={{textTransform: 'capitalize'}} value={team.id}>*/}
                    {/*    nombre: {team.name}, deporte: {team.sport}, categoria: {team.group} </option>*/}
                    {/*    // <p>nombre = {team.name}    deporte = {team.sport} </p>*/}
                    {/*    // <option>{team.name}</option>*/}

                    {/*    )*/}
                    {/*}*/}
                    {/*    </select>*/}


                    {/*<div style={{display: 'flex', flexWrap: 'wrap', position: "relative"}}>*/}
                    <div className={"searches-list"}>
                        {searches.map((search) => (
                            <div>
                                <div className={"team-select"}>
                                    <div className={"team-select.info"}>
                                        <span style={{fontWeight: 'bold', marginLeft: '5px', marginBottom: '15px'}}> Team name: {search.team.name.charAt(0).toUpperCase() + search.team.name.substring(1).toLowerCase()}</span>
                                        <p style={{marginLeft: '5px', marginBottom: '15px'}}> Age
                                            group: {search.team.age_group}</p>
                                    </div>
                                    <br/><br/>
                                    <div>
                                        <button className={"button-play"} onClick={async () => await playButton(search.id)}>
                                            Play
                                        </button>

                                    </div>
                                </div>
                                <br/>
                            </div>
                        ))}

                        {/*<TextWithButton text = {team.name}/>))}*/}
                    </div>
                </div>
            }
            {(rivalMenuOpen && searches.length === 0) &&(

                <p className={"noTeamSearch"}>{noSearchesCandidates}</p>)
            }
            <ToastContainer /> {/* Mover el ToastContainer aquí */}



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
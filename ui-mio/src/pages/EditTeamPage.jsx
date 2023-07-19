import React, {Component, useEffect, useState} from 'react';
import {useAuthProvider} from "../auth/auth";
import {useSearchParams} from "react-router-dom";
import "../css/EditTeam.scss"
import { getTeam, updateTeam, deleteTeam} from "../service/mySystem";
import {useLocation} from "react-router";
import {useNavigate} from "react-router";
import {TopBar} from "./TopBar/TopBar";
import {ToastContainer} from "react-toastify";
import SideBar from "./SideBar";
import {Icon} from "@iconify/react/dist/iconify";
import {BingMap} from "./BingMap";

function goToPickTeam() {
    window.location.href = "/pickTeam"
}
export function EditTeamPage(props) {
    const auth = useAuthProvider()
    const token = auth.getToken();
    const location = useLocation();
    const id = props.getTeamId;
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [errorMsg, setErrorMsg] = useState(undefined)
    const isOk = searchParams.get("ok")
    const [changeLocationButton, setChangeLocationButton] = useState('Change location');

    const [locationName, setLocationName] = useState("")
    const [sport, setSport] = useState('')
    const [quant_Players, setQuant_player] = useState('')
    const [age_group, setAge_group] = useState('')
    // const [zone, setZone] = useState('')
    const [name, setName] = useState('')
    const [team, setTeam] = useState('');
    const [newZone, setNewZone] = useState([])
    const [zone, setZone] = useState([])
    const [selectedLocation, setSelectedLocation] = useState("")


    function handleSelectLocation(e) {
        e.preventDefault(); // Prevent form submission
        setShowPopup(!showPopup);
    }
    useEffect(() => {
        getTeam(token, props.getTeamId, (team) => {
            setTeam(team);
            // printSelectedLocation([team.latitude, team.longitude]);
        });
    }, [props.getTeamId, token, locationName]);

    useEffect(() => {
        setSport(team.sport);
        setQuant_player(team.quantity);
        setName(team.name);
        // setZone(team.zone)
        setAge_group(team.age_group)
    }, [team]);

    const isEmpty = value => value === null || value === undefined || value === '';

    const apiKey = 'ApqYZq8IsmnPRxOON1m_mY9eGEZqjDawW2cleubNdcVT5CbVMU8snXUF4qku9DcW'; // Replace with your Bing Maps API key

    function getLocationName(lat, long, apiKey) {
        const url = `http://dev.virtualearth.net/REST/v1/Locations/${lat},${long}?o=xml&key=${apiKey}`;
        fetch(url)
            .then((response) => response.text())
            .then((data) => {
                // Parse the XML response
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "text/xml");

                // Extract the address name
                const nameElement = xmlDoc.querySelector("Name");
                const name = nameElement ? nameElement.textContent : "Location Name Not Found";
                setLocationName(name.toString());
                console.log(name);
                console.log(locationName);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }


    const handleSubmit = async e => {
        e.preventDefault();

        if (isEmpty(name)){setName(team.name)
            console.log("entre a este if")}
        // if (isEmpty(zone)){setZone(team.zone)}
        if (isEmpty(sport)){setSport( team.sport)}
        if(isEmpty(quant_Players)){setQuant_player(team.quantity)}
        if(isEmpty(age_group)){setAge_group(team.age_group)}
        console.log("no entre al error")
        console.log(zone[0])
        console.log(zone[1])
        saveChanges({
            sport: sport || team.sport,
            quantity: quant_Players || team.quantity,
            age_group: age_group || team.age_group,
            // zone: zone || team.zone,
            name: name || team.name,
            latitude: zone[0],
            longitude: zone[1]
        })
    }

    const resetForm = () => {
        setName(team.name);
        setZone(team.zone);
        setAge_group(team.age_group);
        setSport(team.sport);
        setQuant_player(team.quantity);
    };


    const saveChanges = (form) => {
        console.log("estoy en save changes")
        updateTeam(token,id,
            form,
            () => navigate("/pickTeam?ok=true"),
            () => {
                setErrorMsg('An error ocurred')
                navigate("/pickTeam?ok=false")
            }
        )
    }
    const handleDeleteClick = () => {
        if (window.confirm('Are you sure you want to delete this team?')) {
            console.log("entre a borrar")
            deleteTeam(token,id,()=>navigate("/pickTeam?ok=true"),()=>{setErrorMsg('An error ocurred')
                navigate("/pickTeam?ok=false")})
        }
        else {
            goToPickTeam()
        }
    }
    const handleGoToPickTeam = () => {
        resetForm();
        goToPickTeam();
    };


    const sportChange = (event) => {
        setSport(event.target.value)
    }
    const quant_PlayersChange = (event) => {
        setQuant_player(event.target.value)
    }
    const groupChange = (event) => {
        setAge_group(event.target.value)
    }
    // const zoneChange = (event) => {
    //     setZone(event.target.value)
    // }

    const nameChange = (event) => {
        setName(event.target.value)
    }

    function newTeamRequest() {
        console.log("Im requesting a new Team!");
    }

    if (isOk) {
        resetForm();
    }


    const teamNameStyle = {
        fontSize: 40,
        textTransform: 'capitalize'

    };
    const sportAndQuantityStyle = {
        fontSize: 30,
        textTransform: 'capitalize'
    };
    const handleInfoboxesWithPushPins = (infoboxesWithPushPinsData) => {
        setChangeLocationButton('Change Location');
        setNewZone(infoboxesWithPushPinsData[0].location);
        printSelectedLocation(infoboxesWithPushPinsData[0].location);
    };

    function confirmZone() {
        setZone(newZone);
        // printSelectedLocation(newZone);
        setShowPopup(false);
    }
    const printSelectedLocation = (location) => {
        const [lat, long] = location;

        if (long && lat) {
            setSelectedLocation(`Latitude: ${lat}, Longitude: ${long}`);
        }
        // setZone([lat, long]);
        getLocationName(lat, long, apiKey);

    };
    const [showPopup, setShowPopup] = useState(false);
    return (
        <div>
            <SideBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}></SideBar>
            <TopBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}/>
            <div className={"editTeamContainer"}>

                {errorMsg && <div className="alert alert-danger" role="alert">{errorMsg}</div>}
                {isOk && <div className="alert alert-success" role="alert">Changes saved</div>}
                {/*<div className={"logo"}>*/}
                {/*    <img style={{width: 150, height: "auto"}} src={require("../images/logo_solo_letras.png")} alt={"Logo"}/>*/}
                {/*</div>*/}
                <div className={"team_name"} style={teamNameStyle}>
                    {team.name}
                </div>
                <br/>
                <div className={"sport_and_quantity"} style={sportAndQuantityStyle}>
                    {team.sport} {team.quantity}
                </div>


                <div>


                    <form onSubmit={handleSubmit}>
                        <br/>
                        <div className={"edit-team-name"}>
                            <p>Team name: <input type="Name"
                                                 id="Name"
                                                 placeholder="Name"
                                                 name="Name"
                                                 value={name}
                                                 onChange={nameChange}/></p>
                        </div>
                        {/*<div>*/}
                        {/*    <input*/}
                        {/*        type="zone"*/}
                        {/*        id="zone"*/}
                        {/*        placeholder="Zone"*/}
                        {/*        name="zone"*/}
                        {/*        value={zone}*/}
                        {/*        onChange={zoneChange}/>*/}
                        {/*</div>*/}
                        <div className={"edit-age-group"}>
                            <br/>
                            <p>Group:  <select id="age_group" required onChange={groupChange} value={age_group}>
                                <option  value=""></option>
                                <option value="Young">Young</option>
                                <option value="Adults">Adults</option>
                            </select></p>
                        </div>

                        <div className={"edit-sport"}>
                            <br/>
                            <p>Sport: <select id="sport" required onChange={sportChange} value={sport}>
                                <option value=""></option>
                                <option value="Football">Football</option>
                                <option value="Padel">Padel</option>
                            </select></p>
                            <br/>
                        </div>
                        {sport === "Football" &&
                            (
                                <div className={"edit-quantity"}>
                                    <p>Quantity<select id="Quantity" required onChange={quant_PlayersChange} value={quant_Players}>
                                        <option  value=""></option>
                                        <option value="11">11</option>
                                        <option value="7">7</option>
                                        <option value="5">5</option>
                                    </select></p>
                                </div>
                            )
                        }
                        {sport === "Padel" &&
                            (
                                <div className={"edit-quantity"}>
                                    <p>Quantity: <select id="Quantity" required onChange={quant_PlayersChange} defaultValue={team.quantity}>
                                        <option value=""></option>
                                        <option value="2">2</option>
                                        <option value="1">1</option>
                                    </select></p>
                                </div>
                            )
                        }
                        <div className={"zone"} style={{top:"380px", left: "605px"}}>
                            {changeLocationButton === 'Select location' && <p>Select your preferred zone: </p>}
                            {changeLocationButton !== 'Select location' && <p>Your preferred zone: {locationName}</p>}
                            <button className={"selectLocationButton"} onClick={handleSelectLocation}> <Icon style ={{left:"-30px", top: "-5px", fontSize: "20"}} className="input-icon-log" icon="mi:location" /> {changeLocationButton} </button>
                            {showPopup && (
                                <div className="popupFR">
                                    <BingMap
                                        onInfoboxesWithPushPinsChange={handleInfoboxesWithPushPins}
                                    />
                                    {(zone !== newZone && newZone.length !== 0) && (
                                        <div>
                                            <button className={"confirmLocation"} id="confirmLoc" onClick={()=>confirmZone()}>Confirm location</button>
                                        </div>
                                    )}
                                    <button className={"goBackSelLoc"} onClick={handleSelectLocation}>Go back</button>
                                </div>
                            )}
                        </div>
                        <div>
                            {/*<button type="submit" className={"signUpButton"}>Sign up</button>*/}
                            <button id="submit" type="submit" className={"saveChangesButton"} style={{right: "550px"}} onClick={() => newTeamRequest()}>Save Changes</button>
                        </div>
                        <div>
                            <button className={"goBackButton"} onClick={handleGoToPickTeam}>Return to Pick Team</button>
                        </div>
                    </form>
                    <br/>
                    <div>
                        <button className={"delete-button"} onClick={handleDeleteClick}>Delete team</button>
                    </div>


                </div>

            </div>
        </div>
    )
}
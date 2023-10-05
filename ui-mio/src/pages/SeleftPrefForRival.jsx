import React, {useEffect, useState} from 'react';
import "../css/FindRival.scss"
import "../css/Home.scss"
import SideBar from "./SideBar";
import {useNavigate} from "react-router";
import {findRival, getTeam, newMatch, possibleSearchCandidates, getSearch} from "../service/mySystem";
import {useAuthProvider} from "../auth/auth";
import DatePicker, {CalendarContainer} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {TopBar} from "./TopBar/TopBar";
import {BingMap} from "./BingMap"
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Icon} from "@iconify/react";
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.css';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {useSearchParams} from "react-router-dom";
import { addWeeks } from 'date-fns';


// import '@mobiscroll/react/dist/css/mobiscroll.min.css';
// import { Datepicker } from '@mobiscroll/react';

export function SelectPrefForRival(props) {
    const auth = useAuthProvider()
    const token = auth.getToken();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState(undefined)
    const [searchParams] = useSearchParams();
    const searchId = searchParams.get('id');


    const [date, setDate] = useState(new Date());
    const [averageAge, setAverageAge] = useState(25);
    const [checked, setChecked] = React.useState(false);


    const [rivalMenuOpen, setRivalMenuOpen] = useState(false);

    const [zone, setZone] = useState([])
    const [newZone, setNewZone] = useState([])

    const [showPopup, setShowPopup] = useState(false);
    const [changeLocationButton, setChangeLocationButton] = useState('Change location');
    const [selectedLocation, setSelectedLocation] = useState("")
    const [locationName, setLocationName] = useState("")


    const [selectedTimes, setSelectedTimes] = useState([]);
    const [finalSelectedTimes, setFinalSelectedTimes] = useState([]);
    const [defaultTimes, setDefaultTimes] = useState([]);

    const [team, setTeam] = useState('');
    const teamId = props.getTeamId;

    const[amountWeeks,setAmountWeeks]=useState(0);
    const[weeksOpen,setWeeksOpen]=useState(false);

    const apiKey = 'ApqYZq8IsmnPRxOON1m_mY9eGEZqjDawW2cleubNdcVT5CbVMU8snXUF4qku9DcW'; // Replace with your Bing Maps API key

    function getLocationName(lat, long, apiKey) {
        const url = `http://dev.virtualearth.net/REST/v1/Locations/${lat},${long}?o=xml&key=${apiKey}`;
        console.log("called", lat, long, apiKey);
        fetch(url)
            .then((response) => response.text())
            .then((data) => {
                console.log("Acá");
                console.log(data);
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

    const printSelectedLocation = (location) => {
        const [lat, long] = location;

        if (long && lat) {
            setSelectedLocation(`Latitude: ${lat}, Longitude: ${long}`);
        }
        setZone([lat, long]);
        getLocationName(lat, long, apiKey);

    };


    const options = [{label: "8:00-9:00", value: "8:00-9:00"},
        {label: "9:00-10:00", value: "9:00-10:00"}, {label: "10:00-11:00", value: "10:00-11:00"},
        {label: "11:00-12:00", value: "11:00-12:00"},
        {label: "12:00-13:00", value: "12:00-13:00"},
        {label: "13:00-14:00", value: "13:00-14:00"},
        {label: "14:00-15:00", value: "14:00-15:00"},
        {label: "15:00-16:00", value: "15:00-16:00"},
        {label: "16:00-17:00", value: "16:00-17:00"},
        {label: "17:00-18:00", value: "17:00-18:00"},
        {label: "18:00-19:00", value: "18:00-19:00"},
        {label: "19:00-20:00", value: "19:00-20:00"},
        {label: "20:00-21:00", value: "20:00-21:00"},
        {label: "21:00-22:00", value: "21:00-22:00"},
        {label: "22:00-23:00", value: "22:00-23:00"},
        {label: "23:00-00:00", value: "23:00-00:00"}
    ]
    const weekOptions=[{label:"1 week",value:1},{label:"2 weeks", value:2},{label:"3 weeks",value:3},{label:"4 weeks",value:4}]
    // con esto lee los params
    // const searchParams = useSearchParams();
    // // con este lee el paramentro de "id"
    // const id = searchParams.get("id")

    // aca va al mySystem para agarrar los != teams
    useEffect((callbackfn, thisArg) => {
        getTeam(token, teamId, (team) => {
            setTeam(team);

            printSelectedLocation([team.latitude, team.longitude]);
            console.log(team.latitude)
        }, [teamId, token, locationName]);

        if(searchId !== null || searchId !== ""){
            getSearch(token, searchId, (res)=>{
                console.log(res);
                setAverageAge(res.averageAge);
                // setDate(new Date(res.d ate.year, res.date.month, res.date.date))
                setSelectedLocation(`Longitude: ${res.longitude} Latitude: ${res.latitude}`)
                // setFinalSelectedTimes(res.time.intervals)
                // setSelectedTimes(res.time.intervals)
                for (let i = 0; selectedTimes.length !== res.time.intervals.length; i++) {
                    console.log(i);
                    for (let j = 0; j < options.length; j++) {
                        console.log(j);
                        if (options[j].value === res.time.intervals[i]) {
                            selectedTimes.push(options[j]);
                            break;
                        }
                    }
                }
                console.log(defaultTimes);
                setChecked(res.isRecurring)
                setZone([res.longitude, res.latitude])
                setNewZone([res.longitude, res.latitude])
                setChangeLocationButton('Change Location');
            })
        }
    }, [teamId, token])
    // aca va al mySystem para agarrar el team

    const openAndFindRivals = async e => {
        setRivalMenuOpen(true);
    }

    useEffect(() => {
        setFinalSelectedTimes(selectedTimes.map(option => option.value));
    }, [selectedTimes]);

    function handleSelectLocation(e) {
        e.preventDefault(); // Prevent form submission
        setShowPopup(!showPopup);
    }

    const handleInfoboxesWithPushPins = (infoboxesWithPushPinsData) => {
        setChangeLocationButton('Change Location');
        setNewZone(infoboxesWithPushPinsData[0].location);
    };


    const generateDatesArray = () => {
        const dates = [];
        if (date) {
            dates.push(date);
            for (let i = 1; i <= amountWeeks.value; i++) {
                const weekStartDate = addWeeks(date, i);
                dates.push(weekStartDate);
            }
        }
        return dates;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalValues = selectedTimes.map(option => option.value)
        setFinalSelectedTimes(finalValues)
        if(!date || !finalSelectedTimes || !zone || !averageAge){
            toast.error('Please fill out all the required fields', {
                position: "top-center",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        else{
            await findRivalMethod({
                date: generateDatesArray(),
                time: finalSelectedTimes,
                latitude: zone[0].toString(),
                longitude: zone[1].toString(),
                age:averageAge,
                isRecurring:checked
            })
        }
    }
    const handleCheckedBox = (event) => {
        setChecked(event.target.checked);
        setWeeksOpen(!weeksOpen);
    };
    const findRivalMethod = async (search) => {
        if (rivalMenuOpen) {
            await findRival(token, teamId, search, (res) => {
                    toast.success('Search is now active!', {
                        containerId: 'toast-container',
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
                    navigate(`/findRival?id=${res}`)
                },
                (res) => {
                    toast.info('Search is already active!', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                },
                () => {
                    toast.error('Something went wrong', {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        }
                    )
                })
        }
    }

    const MyContainer = ({className, children}) => {
        return (
            <div className={"calendarContainer"}>
                <CalendarContainer className={className}>
                    <div style={{background: "transparent"}}>
                    </div>
                    <div style={{position: "relative"}}>{children}</div>
                </CalendarContainer>
            </div>
        );
    };
    function valuetext(value) {
        return `${value}`;
    }
    const handleAverageAgeChange = (event, value) => {
        setAverageAge(value);
    };
    const marks = [
        {
            value: 18,
            label: '18',
        },
        {
            value: 25,
            label: '25',
        },
        {
            value: 35,
            label: '35',
        },
        {value:45,label:'45'},
        {
            value: 55,
            label: '55',
        },
        {
            value: 65,
            label: '65',
        },
        {
            value: 75,
            label: '75',
        },
        {
            value: 85,
            label: '85',
        },
        {
            value: 95,
            label: '95',
        },
    ];



    function confirmZone() {
        setZone(newZone);
        printSelectedLocation(newZone);
        setShowPopup(false);
    }

    return (
        <div>
            <SideBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}></SideBar>
            <TopBar popupOpen = {showPopup} getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}/>
            {/*<div className={"sports_image"}>*/}
            {/*    <img style={{width: 218, height: "auto"}} src={require("../images/logoRM/logoRM_persona.png")} alt={"deportes"}/>*/}
            {/*</div>*/}

            {/*<div className={"mirror_sports_image"}>*/}
            {/*    <img style={{width: 218, height: "auto"}} src={require("../images/logoRM/logoRM_persona.png")} alt={"deportes"}/>*/}
            {/*</div>*/}

            <div className={"containerPrincipalFindRival"}>
                <div className="team_name_FR">
                    <br/>
                    You've chosen {team.name}
                    <br/>
                    Sport: {team.sport}
                </div>
                <br/>
                <form onSubmit={rivalMenuOpen && handleSubmit}>
                    <div className={"datePicker"}>
                        Choose a day to play:
                        <br/><br/>
                        <DatePicker
                            showIcon
                            selected={date}
                            dateFormat="dd/MM/yyyy"
                            onChange={date => setDate(date)}
                            minDate={new Date()}
                            showDisabledMonthNavigation
                            calendarContainer={MyContainer}
                        />
                        <Icon style ={{left:"-25px", top: "-40px", fontSize: "20"}} className="input-icon-log" icon="radix-icons:calendar" />
                    </div>
                    <div className={"time_select_container"}>
                        <div className={"time_select"}>
                            <p>Select your time intervals of preference!</p>
                            <br/>
                            <Select
                                options={options}
                                value={selectedTimes}
                                onChange={setSelectedTimes}
                                defaultValues={defaultTimes}
                                isMulti
                            />
                            <Icon style ={{left:"-25px", top: "50px", fontSize: "20px", position: "absolute"}} className="input-icon-log" icon="ion:time-outline" />
                        </div>
                    </div>
                    <div className={"ageSlider"}>
                        Average age:
                        <br/><br/><br/>
                        <Box sx={{ width: 300 }}>
                            <Slider
                                aria-label="Always visible"
                                defaultValue={25}
                                getAriaValueText={valuetext}
                                marks={marks}
                                min={18}
                                max={100}
                                value={averageAge}
                                onChange={handleAverageAgeChange}
                                valueLabelDisplay="on"
                            />
                        </Box>
                        <Icon style ={{left:"-30px", top: "55px", fontSize: "20px", position: "absolute"}} className="input-icon-log" icon="streamline:interface-time-hour-glass-hourglass-loading-measure-clock-time" />
                    </div>
                    {!weeksOpen && (
                        <div className={"checkboxRecurrent"}>
                            <FormGroup>
                                <FormControlLabel control=
                                                      {<Checkbox checked={checked}
                                                                 onChange={handleCheckedBox} />}
                                                  label="Recurrent search" />
                            </FormGroup>
                        </div>
                    )}
                    {weeksOpen &&(
                        <div>
                            <div className={"checkboxRecurrent"} style={{left:"575px"}}>
                                <FormGroup>
                                    <FormControlLabel control=
                                                          {<Checkbox checked={checked}
                                                                     onChange={handleCheckedBox} />}
                                                      label="Recurrent search" />
                                </FormGroup>
                            </div>
                            <div className={"selectRecurrent"}>
                                <Select
                                    options={weekOptions}
                                    value={amountWeeks}
                                    onChange={setAmountWeeks}></Select>
                            </div>
                        </div>
                    )}


                    <div className={"zone"}>
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
                                        <button className={"confirmLocation"} id="confirmLoc" onClick={confirmZone}>Confirm location</button>
                                    </div>
                                )}
                                <button className={"goBackSelLoc"} onClick={handleSelectLocation}>Go back</button>
                            </div>
                        )}
                    </div>


                    <button className={"findRivalButton"} id="submit" type="submit" onClick={openAndFindRivals}> Find rival!
                    </button>
                </form>
                <ToastContainer/> {/* Mover el ToastContainer aquí */}
            </div>
        </div>
    )
}

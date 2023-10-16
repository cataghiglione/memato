import React, {useEffect, useState} from 'react';
import "../css/FindRival.scss"
import "../css/Home.scss"
import SideBar from "./SideBar";
import {useNavigate} from "react-router";
import {getSearch, getTeam, newMatch, possibleSearchCandidates} from "../service/mySystem";
import {useAuthProvider} from "../auth/auth";
import DatePicker, {CalendarContainer} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {TopBar} from "./TopBar/TopBar";
import {BingMap} from "./BingMap"
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import {useSearchParams} from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';



export function FindRivalPage(props) {
    const auth = useAuthProvider()
    const token = auth.getToken();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchId = searchParams.get('id');

    const [date, setDate] = useState("");
    const [averageAge, setAverageAge] = useState(25);
    const [checked, setChecked] = React.useState(false);

    const [selectedLocation, setSelectedLocation] = useState("")
    const [isLoading,setIsLoading] = useState(false);
    const [finalSelectedTimes, setFinalSelectedTimes] = useState("");

    const [searches, setSearches] = useState([]);
    const [team, setTeam] = useState('');
    const teamId = props.getTeamId;
    const [noSearchesCandidates, setNoSearchesCandidates] = useState("There are currently no teams searching for rivals with your preferences")

    // con esto lee los params
    // const searchParams = useSearchParams();
    // // con este lee el paramentro de "id"
    // const id = searchParams.get("id")

    // aca va al mySystem para agarrar los != teams
    useEffect(() => {
        getTeam(token, props.getTeamId, (team) => {
            setTeam(team);
        });

        if(searchId !== "0"){
            possibleSearchCandidates(token, searchId, (res)=>{
                setSearches(res.searches)
            })
            getSearch(token, searchId, (res)=>{
                console.log(res);
                setAverageAge(res.averageAge);
                setDate(`${res.date.day.toString()}/${(res.date.month+1).toString()}/${(res.date.year+1900).toString()}`)
                setSelectedLocation(`Longitude: ${res.longitude} Latitude: ${res.latitude}`)
                getLocationName(res.latitude, res.longitude, apiKey);
                setFinalSelectedTimes(res.time.intervals.join(", "))
            })
        }
    }, [searchId, teamId, token])

    // aca va al mySystem para agarrar el team
    const closeRivalMenu = async e => {
        navigate(`/selectPreferences?id=${searchId}`)
    }

    const [locationName, setLocationName] = useState("");
    const apiKey = 'ApqYZq8IsmnPRxOON1m_mY9eGEZqjDawW2cleubNdcVT5CbVMU8snXUF4qku9DcW';


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



    const playButton = async (id) => {
        setIsLoading(true);
        await newMatch(token, {
                candidate_search_id: id,
                searchId: searchId
            },
            async (res) => {
                toast.success('Request sent!', {
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
                await possibleSearchCandidates(token, searchId, (searches) => {
                    setSearches(searches.searches)
                    if (searches.length === 0) {
                        setNoSearchesCandidates("There are currently no more teams searching for rivals with your preferences");
                    }
                    console.log(searches)
                },)
                setIsLoading(false);

            },
            () => {
                setIsLoading(false);
                console.log('A match with this searches already exists!')
            }
        )


    }


    function handleGoBackClick() {
        window.history.back();
    }

    function goToCurrentSearches() {
        navigate("/currentSearches")
    }

    function goToNewSearch() {
        navigate("/selectPreferences")
    }

    return (
        <div>
            <SideBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}></SideBar>
            <TopBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}/>


            {(searchId === null || searchId === "0") && (
                <div className="popUpContainer">
                    <div className={"popUpContainer1"}>
                        <IconButton className={"popUpCloseButton"} aria-label="delete" onClick={() => handleGoBackClick()}>
                            <CloseIcon />
                        </IconButton>
                        <br/><br/>
                        Do you want to find rivals with a current search or a new search?
                        <br/>
                        <button className={"popUpButton"} onClick={() => goToCurrentSearches()}>Go to current search</button>
                        <button className={"popUpButton"} onClick={() => goToNewSearch()}> Create a new search</button>
                    </div>
                </div>
            )}
            {isLoading && (
                <div className={"spinner"}>
                <Spinner animation={"border"}/>
                </div>
            )}
            {!isLoading &&(

            <div className={"containerPrincipalFindRival"}>

                {(searchId !== null && searchId !== "0") && (
                    <div>
                        <div className="team_name_FR"><br/>
                            You've chosen {team.name}
                            <br/>
                            Sport: {team.sport}
                        </div>
                        <br/>
                        <div className={"finalDate"}>
                            Day: {date}
                        </div>

                        <br/>
                        <div className={"finalTime"}>
                            Time(s): {finalSelectedTimes}
                        </div>

                        <br/>
                        <div className={"finalAgeGroup"}>
                            Average age group: {averageAge}
                        </div>

                        <br/>
                        <div className={"finalZone"}>
                            Zone: {locationName}
                        </div>
                    </div>
                )}
                {(searches.length > 0) &&
                    <div>
                        <div className={"title"}>
                            Teams searching for rivals:
                        </div>
                        <div className={"searches-list"}>
                            {searches.map((search) => (
                                <div>
                                    <div className={"team-select"}>
                                        <div className={"team-select.info"}>
                                            <span style={{fontWeight: 'bold', marginLeft: '5px', marginBottom: '15px'}}> Team name: {search.search.team.name.charAt(0).toUpperCase() + search.search.team.name.substring(1).toLowerCase()}</span>
                                            <p style={{marginLeft: '5px', marginBottom: '15px'}}> Age
                                                group: {search.search.team.age_group}</p>
                                            <p style={{marginLeft: '5px', marginBottom: '15px'}}> Time(s) in common:
                                                {search.times.join(", ")}</p>
                                            <p style={{marginLeft: '5px', marginBottom: '15px'}}> Day:
                                                {search.search.date.day}/{search.search.date.month+1}</p>
                                            <p style={{marginLeft: '5px', marginBottom: '15px'}}> Age Average:
                                                {search.search.averageAge}</p>
                                        </div>
                                        <br/><br/>
                                        <div>
                                            <button className={"button-play"}
                                                    onClick={async () => await playButton(search.search.id)}>
                                                Play
                                            </button>

                                        </div>
                                    </div>
                                    <br/>
                                </div>
                            ))}
                        </div>
                    </div>
                }
                {(searches.length === 0 && searchId !== "0" && searchId !== null) && (

                    <p className={"noTeamSearch"}>{noSearchesCandidates}</p>)
                }
            </div>
                )}
            <ToastContainer/> {/* Mover el ToastContainer aquí */}
        </div>
    )
}
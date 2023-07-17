import React, {useEffect, useState} from 'react';
import {useAuthProvider} from "../auth/auth";

import "../css/CurrentSearches.scss"
import {currentSearches, deleteSearch, getTeam} from "../service/mySystem";
import {TopBar} from "./TopBar/TopBar";
import {ToastContainer} from "react-toastify";

export function CurrentSearchesPage(props) {
    const auth = useAuthProvider()
    const token = auth.getToken();
    const team_id = props.getTeamId;
    const [popupMsg, setPopupMsg] = useState('');

    function goToHome() {
        window.location.href = "/home"
    }
    const [searches, setSearches] = useState([]);
    const[recurringSearches,setRecurringSearches]=useState([])
    const[team, setTeam]=useState('');
    const[selectedSearch, setSelectedSearch]=useState('');
   /* const [mapState, setMapState] = useState(false) */
  /*  const [teamSelectedLoc, setTeamSelectedLoc] = useState([0,0])
    const [pushpin, setPushpin] = useState([])
    const [locationHandle, setLocationHandle] = useState("")
*/

    //Aca agregue un const que es RecurringSearches, en este estan solamente las busquedas recurrentes, hice esto
    //porque me parecia que en una busqueda normal, necesitas saber el dia (tipo el numerito) y el mes, pero en
    //una busqueda recurrente necesitas saber el dia de la semana, porque con el numerito no vas a adivinar que
    //dia de la semana pusiste, aparte serian infinitos numeritos.
    useEffect(() => {
        currentSearches(token,team_id, (searches) => {
            setSearches(searches.searches)
            setRecurringSearches(searches.recurringSearches)
        });
    }, [])

    useEffect(() => {
        getTeam(token,team_id, (team) => setTeam(team));
    }, [token, team_id])

    const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
        return (
            <div>
                <p>{message}</p>
                <button className={"confirmationButton"} onClick={onConfirm}>Confirm</button>
                <button className={"cancelDeleteButton"} onClick={onCancel}>Cancel</button>
            </div>
        );
    };
    const [showConfirmation, setShowConfirmation] = useState(false);


    const handleDeleteClick = (search) => {
        setShowConfirmation(true);
        setSelectedSearch(search);
    };
    const handleCancel = () => {
        setShowConfirmation(false);
    };
    const handleConfirm = () => {
        deleteSearch(
            token,
            selectedSearch.id,
            () => {
                setPopupMsg('Delete successful');
                setTimeout(() => {
                    setPopupMsg('');
                }, 180);
                currentSearches(token, team_id,(searches) => {
                    setSearches(searches.searches)
                    setRecurringSearches(searches.recurringSearches)
                });
            },
            (error) => {
                setPopupMsg('Error');
                setTimeout(() => {
                    setPopupMsg('');
                }, 180);
            }
        );
        setShowConfirmation(false);
    };


    // const handleDeleteClick = (search) => {
    //     if (window.confirm('Are you sure you want to delete this search?')) {
    //         deleteSearch(
    //             token,
    //             search.id,
    //             () => {
    //                 setPopupMsg('Delete succesfull')
    //                 setTimeout(() => {
    //                     setPopupMsg('');
    //                 }, 180);
    //                 currentSearches(token, (searches)=>setSearches(searches));
    //             },
    //             (error) => {
    //                 setPopupMsg('Error')
    //                 setTimeout(() => {
    //                     setPopupMsg('');
    //                 }, 180);
    //             }
    //         )
    //     }
    // }

    const handleGoBackClick=()=>{
        window.location.href = "/findRival"

    }

 /*   function OpenCloseMap(e){

        if (mapState === false){
            setMapState(true);
        }
        else{
            setMapState(false);
        }
        console.log(teamSelectedLoc)
    }*/
    return (
        <div>

            {popupMsg !=="" && <div className="searches-popup">{popupMsg}</div>}
            {showConfirmation === true && (
                <div className={"popup"}>
                    <div className={"popup-1"}>
                        <ConfirmationDialog
                            message="Are you sure you want to delete this search?"
                            onConfirm={handleConfirm}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>
            )}

            <TopBar toggleTeamId = {props.toggleTeamId}    getTeamId={props.getTeamId}/>

            <div className={"containerSearchPage"}>
                <div>
                    {searches.length > 0 && (
                        <div>
                            <br/>
                            <div className={"hasSearchesTitle"}>
                                {team.name}'s current searches
                            </div>
                            <br/>
                            {searches.map((search) => (
                                <div className={"searchesContainer"}>
                                    <div key={search.id}>
                                        <p className={"search-info"}>Time(s): {search.times.join(", ")}</p>
                                        <p className={"search-info"}>Day: {search.day}/{search.month + 1}</p>
                                    </div>
                                   {/* <button className={"delete-search-button"} style={{left:"50%"}} onClick={() => {OpenCloseMap(); setTeamSelectedLoc([search.latitude, search.longitude])}}>
                                        <PinMapFill />
                                    </button>*/}

                                    <button className={"delete-search-button"} onClick={() => handleDeleteClick(search)}>
                                        <i className={"bi bi-trash"}></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {searches.length===0 && (
                    <div>
                        <br/>
                        <div className={"noSearchesTitle"}>
                            You don't have any active searches
                        </div>
                        <br/><br/>
                        <div className={"refereeImageSearches"}>
                            <img style={{width: 218, height: "auto"}} src={require("../images/referee.png")}
                                 alt={"referee"}/>
                        </div>
                        <br/><br/><br/><br/>
                        <button className={"goToUserButton"} onClick={handleGoBackClick}>Find a new rival!</button>
                    </div>
                )}


            </div>
            <ToastContainer/> {/* Mover el ToastContainer aquí */}
        </div>


    )


}

/*
{mapState &&
                    <div className="popup" style={{top: "30%"}}>
                        <BingMap
                            infoboxesWithPushPins = {
                                {"location": [teamSelectedLoc.latitude, teamSelectedLoc.longitude],
                                "addHandler":"mouseover",
                                "infoboxOption": { title: 'Your location'},
                                "pushPinOption":{ title: 'Your location', description: 'Pushpin' },
                                "infoboxAddHandler": {"type" : "click", callback: this.callBackMethod },
                                "pushPinAddHandler": {"type" : "click", callback: this.callBackMethod }}}
                        />
                        <button onClick={OpenCloseMap}>Close Map</button>
                    </div>
}}

                ----------------

                const newInfoboxesWithPushPins = [{
                "location": [teamSelectedLoc.latitude, teamSelectedLoc.longitude],
                "addHandler":"mouseover",
                "infoboxOption": { title: 'Your location'},
                "pushPinOption":{ title: 'Your location', description: 'Pushpin' },
                "infoboxAddHandler": {"type" : "click", callback: this.callBackMethod },
                "pushPinAddHandler": {"type" : "click", callback: this.callBackMethod }
            }]
            setPushpin(newInfoboxesWithPushPins)
            setLocationHandle(JSON.stringify(teamSelectedLoc))
*/
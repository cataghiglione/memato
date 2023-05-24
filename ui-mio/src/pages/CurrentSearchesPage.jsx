import React, {Component, useEffect, useState} from 'react';
import {useAuthProvider} from "../auth/auth";
import {useSearchParams} from "react-router-dom";
import {useNavigate} from "react-router";
/*import {PinMapFill} from "react-bootstrap-icons";*/

import "../css/CurrentSearches.css"
import {currentSearches, deleteSearch} from "../service/mySystem";
import {TopBar} from "./TopBar/TopBar";
/*import {BingMap} from "./BingMap";*/


export function CurrentSearchesPage(props) {
    // const fetchTeams=(search)=>{
    //     useEffect(()=>{
    //         getTeam(token,search.teamId,()=>)
    //
    //     })
    // }
    const auth = useAuthProvider()
    const token = auth.getToken();
    const team_id = props.getTeamId;
    const [popupMsg, setPopupMsg] = useState('');
    function goToHome() {
        window.location.href = "/home"
    }
    const [searches, setSearches] = useState([]);
    const[selectedSearch, setSelectedSearch]=useState('');
   /* const [mapState, setMapState] = useState(false) */
  /*  const [teamSelectedLoc, setTeamSelectedLoc] = useState([0,0])
    const [pushpin, setPushpin] = useState([])
    const [locationHandle, setLocationHandle] = useState("")
*/
    useEffect(() => {
        currentSearches(token,team_id, (searches) => setSearches(searches));
    }, [])


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
    const handleConfirm = async () => {
        await deleteSearch(
            token,
            selectedSearch.id,
            () => {
                setPopupMsg('Delete successful');
                setTimeout(() => {
                    setPopupMsg('');
                }, 180);
                currentSearches(token, team_id,(searches) => setSearches(searches));
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
        goToHome()

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
            <div>
                {popupMsg !=="" && <div className="searches-popup">{popupMsg}</div>}

            </div>
            <div className={"confirmationMenu"}>
                {showConfirmation && (
                    <ConfirmationDialog
                        message="Are you sure you want to delete this search?"
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                    />
                )}
            </div>

            <TopBar toggleTeamId = {props.toggleTeamId}    getTeamId={props.getTeamId}/>

            <div className={"containerPrincipal"}>
                <div>
                    {searches.length > 0 && (
                        <div>
                            <div className={"searchesTitle"} style={{top: "-20%"}}>
                                Your team's current searches
                            </div>
                            {searches.map((search) => (
                                <div className={"searchesContainer"}>
                                    <div key={search.id}>
                                        <p className={"search-info"}>Team: {search.team.name}</p>
                                        <p className={"search-info"}>Time: {search.time}</p>
                                        <p className={"search-info"}>Day: {search.day}/{search.month + 1}</p>
                                    </div>
                                   {/* <button className={"delete-search-button"} style={{left:"50%"}} onClick={() => {OpenCloseMap(); setTeamSelectedLoc([search.latitude, search.longitude])}}>
                                        <PinMapFill />
                                    </button>*/}
                                    <button className={"delete-search-button"} onClick={() => handleDeleteClick(search)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {searches.length===0 && (
                    <div>
                        <div className={"noActiveSearches"}>
                            You don't have any active searches
                        </div>
                        <button className={"goToUserButton"} onClick={handleGoBackClick}>Select a team</button>
                    </div>
                )}


            </div>

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
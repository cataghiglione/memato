import React, {Component, useEffect, useState} from 'react';
import {useAuthProvider} from "../auth/auth";
import {useSearchParams} from "react-router-dom";


import "../css/CurrentSearches.css"
import {currentSearches, deleteSearch} from "../service/mySystem";


export const CurrentSearchesPage = () => {
    // const fetchTeams=(search)=>{
    //     useEffect(()=>{
    //         getTeam(token,search.teamId,()=>)
    //
    //     })
    // }
    const auth = useAuthProvider()
    const token = auth.getToken();
    const [popupMsg, setPopupMsg] = useState('');
    function goToHome() {
        window.location.href = "/home"
    }


    const [searches, setSearches] = useState([]);
    useEffect(() => {
        currentSearches(token, (searches) => setSearches(searches));
    }, [])
    const handleDeleteClick = (search) => {
        if (window.confirm('Are you sure you want to delete this search?')) {
            console.log("entre a delete")
            deleteSearch(token, search.id, ()=>{
                setPopupMsg('Delete succesfull')
                setTimeout(() => {
                    setPopupMsg('');
                }, 3000);
                }, setPopupMsg('Error')
            )
        }
    }
    const handleGoBackClick=()=>{
        goToHome()

    }


    return (
        <div>
            <div className={"logo"}>
                <img style={{width: 218, height: "auto"}} src={require("../images/logo_solo_letras.png")} alt={"Logo"}/>
            </div>
            <div>
                {popupMsg && <div className="searches-popup">{popupMsg}</div>}

            </div>


            <div className={"containerPrincipal"}>
                {console.log(searches.length)}
                <div>
                    {searches.length > 0 && (
                        <div>
                            <div className={"searchesTitle"}>
                                Your current searches
                            </div>
                            {searches.map((search) => (
                                <div className={"searchesContainer"}>
                                    <div key={search.id}>
                                        <p className={"search-info"}>Team: {search.team.name}</p>
                                        <p className={"search-info"}>Time: {search.time}</p>
                                        <p className={"search-info"}>Day: {search.day}/{search.month + 1}</p>
                                    </div>
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
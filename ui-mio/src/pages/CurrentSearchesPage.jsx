import React, {Component, useEffect, useState} from 'react';
import {useMySystem} from "../service/mySystem";
import {useAuthProvider} from "../auth/auth";
import {useSearchParams} from "react-router-dom";
import "../css/FindRival.css"
import "../css/Home.css";
import {currentSearches} from "../service/mySystem";


export const CurrentSearchesPage = () =>{
    const auth = useAuthProvider()
    const token = auth.getToken();

    const[searches, setSearches]=useState([]);
    useEffect(() => {
        currentSearches(token,  (searches) => setSearches(searches));
    }, [])


    return(
        <div>
        <div className={"logo"}>
            <img style={{width: 218, height: "auto"}} src={require("../images/logo_solo_letras.png")} alt={"Logo"}/>
        </div>

        <div className={"containerPrincipal"}>
            Your current searches
        </div>
            <div>



            </div>

        </div>


    )


}
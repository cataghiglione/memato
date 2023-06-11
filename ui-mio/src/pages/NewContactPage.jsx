import React, {Component, useEffect, useState} from 'react';
import "../css/FindRival.css"
import "../css/Home.css"
import {useLocation, useNavigate} from "react-router";
import {findRival, getTeam, newMatch} from "../service/mySystem";
import {useAuthProvider} from "../auth/auth";
import {useSearchParams} from "react-router-dom";

import DatePicker, {CalendarContainer} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Dropdown} from "bootstrap";
import {TopBar} from "./TopBar/TopBar";
import {BingMap} from "./BingMap";
import {forEach} from "react-bootstrap/ElementChildren";


function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

export function NewContact(props) {
    const auth = useAuthProvider()
    const token = auth.getToken();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState(undefined)


    const [rivalMenuOpen, setRivalMenuOpen] = useState(false);




    const [searches, setSearches] = useState([]);
    const [team, setTeam] = useState('');
    const [searchId, setSearchId] = useState(0)
    const id = props.getTeamId;


    // con esto lee los params
    // const searchParams = useSearchParams();
    // // con este lee el paramentro de "id"
    // const id = searchParams.get("id")

    // aca va al mySystem para agarrar los != teams
    useEffect(() => {
        getTeam(token, id, (team) => setTeam(team));
    }, [])
    // aca va al mySystem para agarrar el team


    const handleSubmit = async e => {
        e.preventDefault();
        findRivalMethod(id, {
        })
    }
    const findRivalMethod = (id, search) => {
        if (rivalMenuOpen) {
            findRival(token, id, search, (res) => {
                    console.log(res)
                    setSearches(res.searches)
                    setSearchId(res.searchId)
                },
                () => {
                    setErrorMsg('Search already exists!')
                })
        }
    }

    function playButton(id) {
        newMatch(token, {
                candidate_search_id:id,
                searchId: searchId
            }, (res)=>{
                console.log(res)
            },
            ()=>{
                console.log('A match with this searches already exists!')
            }
        )
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
    function Box (name, puntuality) {
        return(
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    // justifyContent: 'flex-end',
                    // alignItems: 'flex-end',
                    height: 'auto',
                    padding: '10px',
                    border: '1px solid black',
                    borderRadius: '5px',
                    margin: '5px',
                    backgroundColor: 'white',
                    position: 'absolute'
                }}
            >
                <span style={{fontWeight: 'bold', marginBottom: '5px'}}>{name}</span>
                <p style={{marginBottom: '10px'}}>{puntuality}</p>
                <button
                    style={{
                        border: '1px solid black',
                        borderRadius: '5px',
                        padding: '5px',
                        margin: '5px',
                        backgroundColor: 'white',
                        color: 'black',
                    }}
                >
                    Play
                </button>
            </div>
        )
    }

    return (

        <div>
            <TopBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}/>
            <br/>
            <div className="team_name">
                You've chosen {team.name}
                <br/>
                Sport: {team.sport}
            </div>
            
        </div>

    )
}

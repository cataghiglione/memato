import React, {Component, useEffect, useState} from 'react';
import {useAuthProvider} from "../auth/auth";
import {TopBar} from "./TopBar/TopBar";
import {getConfirmedMatches, getPendingConfirmations, getTeam} from "../service/mySystem";
import { MapInReactFunction} from "./MapInReact";
import "../css/MyConfirmations.scss"
import {Box, List, ListItem, ListItemText, ListItemIcon, ListItemButton} from '@mui/material'
import PlaceIcon from '@mui/icons-material/Place';
import { Header, Icon } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

// import Map from "./ReactGoogleMap"; // Importa el componente Map desde MapInReact.js
import MapContainer from "./GoogleMaps"
import "bootstrap/dist/css/bootstrap.min.css";
import {ToastContainer} from "react-toastify";


export function MyConfirmationsPage(props) {
    const auth = useAuthProvider()
    const token = auth.getToken();
    const id = props.getTeamId;

    const [team, setTeam] = useState('');
    let [confirmedMatches, setConfirmedMatches] = useState([]);
    const [selectedItem, setSelectedItem] = useState({latitude: 0, longitude: 0});

    useEffect(() => {
        getTeam(token, id, (team) => setTeam(team));
    }, [token, id])

    useEffect(() => {
            getConfirmedMatches(token, id, (matches) => {
                    setConfirmedMatches(matches)
                }, (matches) => {
                    // TODO ERROR CALLBACK
                }
            )
        }
        ,
        [id, token]
    )

    function goToFindRival() {
        window.location.href = "/findRival"

    }

    function showInfo(e, selectedItem) {
        setSelectedItem(selectedItem);
        console.log(selectedItem);
    }

    const MatchesList = props => {
        return (
            <div className="matches-list">
                {props.items.map((item, index) => {
                    return (


                        <Box sx={{width: '400px', bgcolor: 'efefef'}}>
                            <List>
                                <ListItem>
                                    <ListItemButton onClick={(e) => props.onClick(e, item)}>
                                    <ListItemIcon>
                                        <PlaceIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Rival: '+item.rival.name}   secondary={'Time: ' + item.time + ' ' +'Date: '+ item.day + '/' + item.month  }
                                    ></ListItemText>
                                    <li
                                        key={index}
                                        onClick={(e) => props.onClick(e, item)}
                                    >
                                    </li>
                                    </ListItemButton>

                                </ListItem>
                            </List>
                        </Box>
                        // <div className={"list-group"}>
                        //     <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
                        //
                        //         <li
                        //             key={index}
                        //             className="list-group-item"
                        //             onClick={(e) => props.onClick(e, item)}
                        //         >
                        //             {item.rival.name}
                        //         </li>
                        //     </a>
                        // </div>
                    );
                })}
            </div>);};


    return (

        <div>
            <TopBar toggleTeamId={props.toggleTeamId} getTeamId={props.getTeamId}/>
            <div>
                <div className={"content"}>
                    {confirmedMatches.length > 0 && (
                        // <Map>
                        // </Map>
                        <div className="row">
                            <div className="col-md-8">
                                <div className="map-container">
                                    <MapContainer
                                        center={{lat: -34.45676114698318, lng: -58.85862904287449}}
                                        defaultZoom={10}
                                        data={confirmedMatches}
                                        selectedItem={selectedItem}
                                        margin={[50, 50, 50, 50]}
                                    />
                                </div>
                            </div>
                            <div className={"headerContainer"}>
                                <Header as='h2' icon>
                                    <Icon name='soccer' />
                                    Confirmed Matches
                                    <Header.Subheader>
                                        Here is a list of {team.name}'s confirmed matches
                                    </Header.Subheader>
                                </Header>
                            </div>
                            <div className="matches-list">
                                <MatchesList items={confirmedMatches} onClick={showInfo}/>
                            </div>

                        </div>
                    )}
                </div>
                {(confirmedMatches.length === 0) && (
                    <div>
                        <br/>
                        <div className={"noConfirmedMatchesTitle"}>
                            {team.name}'s confirmations
                        </div>
                        <div className={"refereePicture"}>
                            <img style={{width: 218, height: "auto"}} src={require("../images/referee.png")}
                                 alt={"referee"}/>
                        </div>
                        <div className={"noMatchesTitle"}>
                            {team.name} does not have any confirmed matches!
                        </div>
                        <div className={"findRivalText"}>
                            Find a new rival now!
                        </div>
                        <div>
                            <button className={"findRivalB"} id="submit" type="submit" onClick={goToFindRival}> Find
                                Rival!
                            </button>
                        </div>

                    </div>
                )}
            </div>
            <ToastContainer/> {/* Mover el ToastContainer aquí */}
        </div>

    )


}
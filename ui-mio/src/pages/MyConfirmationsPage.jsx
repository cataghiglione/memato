import React, { Component, useEffect, useState, useRef } from 'react';
import { useAuthProvider } from "../auth/auth";
import { TopBar } from "./TopBar/TopBar";
import { getConfirmedMatches, getPendingConfirmations, getTeam } from "../service/mySystem";
import { Box, List, ListItem, ListItemText, ListItemIcon, ListItemButton } from '@mui/material'
import PlaceIcon from '@mui/icons-material/Place';
import SportsSoccerOutlinedIcon from '@mui/icons-material/SportsSoccerOutlined';
import { Header, Icon } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import "../css/MyConfirmations.scss"
// import MapContainer from "./GoogleMaps"
import "bootstrap/dist/css/bootstrap.min.css";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { Icon as LeafletIcon } from 'leaflet'
import SideBar from "./SideBar";
import {ToastContainer} from "react-toastify";


export function MyConfirmationsPage(props) {
    const auth = useAuthProvider();
    const token = auth.getToken();
    const id = props.getTeamId;

    const [team, setTeam] = useState('');
    const [confirmedMatches, setConfirmedMatches] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedMarkerPosition, setSelectedMarkerPosition] = useState(null);
    const [marker, setMarker] = useState(null);
    const [zoom, setZoom] = useState(10);
    const [center, setCenter] = useState([-34.45866, -58.9142]);
    const markerRefs = useRef([]);

    useEffect(() => {
        getTeam(token, id, (team) => setTeam(team));
    }, [token, id]);

    useEffect(() => {
        getConfirmedMatches(
            token,
            id,
            (matches) => {
                setConfirmedMatches(matches);
            },
            (matches) => {
                // TODO ERROR CALLBACK
            }
        );
    }, [id, token]);

    function goToFindRival() {
        window.location.href = '/findRival';
    }

    function handleItemClick(item) {
        setSelectedItem(item);
        setSelectedMarkerPosition([item.latitude, item.longitude]);
        clickAction(item.id, item.latitude, item.longitude); // Call the clickAction function to set the marker and map position
    }

    const openPopup = (marker, id) => {
        if (marker && marker.leafletElement) {
            marker.leafletElement.openPopup();
        }
    };

    const clickAction = (id, lat, lng) => {
        setMarker(id);
        setZoom(10);
        setCenter([lat, lng]);
        setTimeout(() => {
            markerRefs.current[id]?.openPopup();
        }, 100);
    };

    const MatchesList = (props) => {
        return (
            <div className="matches-list">
                {props.items.map((item) => (
                    <Box sx={{ width: '400px', bgcolor: 'efefef' }} key={item.id}>
                        <List>
                            <ListItem key={item.id}>
                                <ListItemButton onClick={() => handleItemClick(item)}> {/* Pass the item to the handleItemClick function */}
                                    <ListItemIcon>
                                        <PlaceIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={'Rival: ' + item.rival.name}
                                        secondary={'Time: ' + item.time.join(', ') + ' ' + 'Date: ' + item.day + '/' + (item.month+1)}
                                    />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                ))}
            </div>
        );
    };

    return (
        <div>
            <SideBar getTeamId={props.getTeamId} toggleTeamId={props.toggleTeamId}></SideBar>
            <TopBar toggleTeamId={props.toggleTeamId} getTeamId={props.getTeamId} />
            <div>
                <div className={'content'}>
                    {confirmedMatches.length > 0 ? (
                        <div className="row">
                            <div className="col-md-8">
                                <div className="map-container">
                                    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false}>
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        {confirmedMatches.map((match, index) => (
                                            <Marker
                                                key={index}
                                                position={[match.latitude, match.longitude]}
                                                icon={new LeafletIcon({
                                                    iconUrl: markerIconPng,
                                                    iconSize: [25, 41],
                                                    iconAnchor: [12, 41],
                                                })}
                                                ref={ref => markerRefs.current[match.id] = ref}
                                            >
                                                {selectedItem === match && (
                                                    <Popup>
                                                        Rival: {match.rival.name} <br /> Time(s): {match.time.join(", ")} <br/> Date: {match.day}/{match.month +1}
                                                    </Popup>
                                                )}
                                            </Marker>
                                        ))}
                                    </MapContainer>
                                </div>
                            </div>
                            <div className={'headerContainer'}>
                                <Header as="h2" icon>
                                    <Icon name="trophy" circular/>
                                    <Header.Subheader>
                                        Here is a list of {team.name}'s confirmed matches
                                    </Header.Subheader>
                                </Header>
                            </div>
                            <div className="matches-list">
                                <MatchesList items={confirmedMatches} />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <br />
                            <div className={'noConfirmedMatchesTitle'}>{team.name}'s confirmations</div>
                            <div className={'refereePicture'}>
                                <img style={{ width: 218, height: 'auto' }} src={require('../images/referee.png')} alt={'referee'} />
                            </div>
                            <div className={'noMatchesTitle'}>{team.name} does not have any confirmed matches!</div>
                            <div className={'findRivalText'}>Find a new rival now!</div>
                            <div>
                                <button className={'findRivalB'} id="submit" type="submit" onClick={goToFindRival}>
                                    Find Rival!
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer/> {/* Mover el ToastContainer aquí */}
        </div>
    );
}


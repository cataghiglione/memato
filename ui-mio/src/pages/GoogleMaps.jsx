import React from "react";
import ReactDOM from "react-dom";
import { Map, Marker, InfoWindow, GoogleApiWrapper } from "google-maps-react";
// import GoogleMapReact from "google-map-react"
// import {Paper, Typography, useMediaQuery} from "@material-ui/core";
// import LocationOutlinedIcon from "@material-ui/icons/LocationOnOutlined"

export function MapContainer(props) {
    const data = props.data;
    console.log(data)
    console.log("selectedItem:", props.selectedItem);

    const style = {
        maxWidth: "650px",
        height: "550px",
        overflowX: "hidden",
        overflowY: "hidden"
    };
    const containerStyle = {
        maxWidth: "650px",
        height: "550px"
    };


    return (
        <div  id="googleMaps" >
            <Map style={style} containerStyle = {containerStyle}
                google={props.google}
                className={"map"}
                zoom={props.zoom}
                initialCenter={props.center}
            >
                {data.map(item => (
                    <Marker
                        // key={item.id}
                        // title={item.name}
                        // name={item.name}
                        // position={{ lat: item.lat, lng: item.lng }}
                        key={item.id}
                        title={item.rival.name} // Accede al nombre del equipo rival desde el objeto ConfirmedMatch
                        name={item.rival.name} // Accede al nombre del equipo rival desde el objeto ConfirmedMatch
                        position={{ lat: item.latitude, lng: item.longitude }}
                    />
                ))}

                <InfoWindow
                    visible={true}
                    position={{
                        lat: props.selectedItem.latitude,
                        lng: props.selectedItem.longitude
                    }}
                >
                    <div>
                        {props.selectedItem && props.selectedItem.rival && props.selectedItem.rival.name && (
                            <h4>
                                Rival: {props.selectedItem.rival.name}
                                <br/>
                                <span style={{ fontSize: "smaller" }}>{props.selectedItem.time}</span>
                                <br/>
                                <span style={{ fontSize: "smaller" }}>{props.selectedItem.day}/{props.selectedItem.month}</span>


                            </h4>


                        )}
                    </div>
                </InfoWindow>
            </Map>
        </div>
    );
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyDpnzSNLu4HG4nhCpYf4aWrNnqmDJnHwFY"
})(MapContainer);


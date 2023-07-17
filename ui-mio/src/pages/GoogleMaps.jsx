// import React from "react";
// import ReactDOM from "react-dom";
// import { Map, Marker, InfoWindow, GoogleApiWrapper } from "google-maps-react";
// // import GoogleMapReact from "google-map-react"
// // import {Paper, Typography, useMediaQuery} from "@material-ui/core";
// // import LocationOutlinedIcon from "@material-ui/icons/LocationOnOutlined"
//
// export function MapContainer(props) {
//     const data = props.data;
//     console.log(data)
//     console.log("selectedItem:", props.selectedItem);
//
//     const style = {
//         maxWidth: "650px",
//         height: "550px",
//         overflowX: "hidden",
//         overflowY: "hidden"
//     };
//     const containerStyle = {
//         maxWidth: "650px",
//         height: "550px"
//     };
//
//
//     return (
//         <div  id="googleMaps" >
//             <Map style={style} containerStyle = {containerStyle}
//                 google={props.google}
//                 className={"map"}
//                 zoom={props.zoom}
//                 initialCenter={props.center}
//             >
//                 {data.map(item => (
//                     <Marker
//                         // key={item.id}
//                         // title={item.name}
//                         // name={item.name}
//                         // position={{ lat: item.lat, lng: item.lng }}
//                         key={item.id}
//                         title={item.rival.name} // Accede al nombre del equipo rival desde el objeto ConfirmedMatch
//                         name={item.rival.name} // Accede al nombre del equipo rival desde el objeto ConfirmedMatch
//                         position={{ lat: item.latitude, lng: item.longitude }}
//                     />
//                 ))}
//
//                 <InfoWindow
//                     visible={true}
//                     position={{
//                         lat: props.selectedItem.latitude,
//                         lng: props.selectedItem.longitude
//                     }}
//                 >
//                     <div>
//                         {props.selectedItem && props.selectedItem.rival && props.selectedItem.rival.name && (
//                             <h4>
//                                 Rival: {props.selectedItem.rival.name}
//                                 <br/>
//                                 <span style={{ fontSize: "smaller" }}>{props.selectedItem.time}</span>
//                                 <br/>
//                                 <span style={{ fontSize: "smaller" }}>{props.selectedItem.day}/{props.selectedItem.month}</span>
//
//
//                             </h4>
//
//
//                         )}
//                     </div>
//                 </InfoWindow>
//             </Map>
//         </div>
//     );
// }
// import React, {useEffect, useState} from "react";
// import GoogleMapReact from "google-map-react";
// import "../css/MyConfirmations.css"
// import { Loader } from "google-maps-api-loader";
//
//
//
//
//
//
// export function MapContainer(props) {
//     const data = props.data;
//     console.log(data);
//     const [googleMaps, setGoogleMaps] = useState(null);
//
//
//     useEffect(() => {
//         const loader = new Loader({
//             apiKey: props.apiKey,
//             version: "weekly",
//             libraries: ["places"],
//         });
//
//         loader.load().then((google) => {
//             setGoogleMaps(google.maps);
//         });
//     }, [props.apiKey]);
//
//
//     const mapStyle = {
//         width: "1050px",
//         height: "650px",
//         overflow:"hidden"
//     };
//     const InfoWindow = ({ position, children }) => (
//         <div className="info-window" style={{ position: "absolute", left: position.lng, top: position.lat }}>
//             <div className="info-window-content">
//                 {children}
//             </div>
//         </div>
//     );
//     const handleApiLoaded = (map, maps) => {
//         // Aquí puedes realizar operaciones adicionales después de que se haya cargado la API de Google Maps
//         // Por ejemplo, agregar marcadores o personalizar el mapa
//         if (googleMaps) {
//             data.forEach((item) => {
//                 new googleMaps.Marker({
//                     position: { lat: item.latitude, lng: item.longitude },
//                     map: map,
//                     title: item.rival.name,
//                 });
//             });
//         }
//     };
//     const Marker = props => {
//         return <>
//             <div className="pin"></div>
//         </>
//     }
//
//     return (
//         <div id="googleMaps" style={mapStyle}>
//             <Loader apiKey={props.apiKey} libraries={["places"]}>
//                 {(google) => (
//                     <GoogleMapReact
//                         bootstrapURLKeys={{ key: props.apiKey }}
//                         defaultCenter={props.center}
//                         defaultZoom={props.zoom}
//                         yesIWantToUseGoogleMapApiInternals
//                         onGoogleApiLoaded={({ map, maps }) =>
//                             handleApiLoaded(map, maps)
//                         }
//                         googleMapLoader={Loader}
//                     >
//                 {data.map((item) => (
//                     <Marker
//                         key={item.id}
//                         title={item.rival.name}
//                         // name={item.rival.name}
//                         lat={item.latitude}
//                         lng={item.longitude}
//                         fixed={true}
//                     />
//                 ))}
//
//                 {props.selectedItem && (
//                     <InfoWindow
//                         position={{
//                             lat: props.selectedItem.latitude,
//                             lng: props.selectedItem.longitude
//                         }}
//                         options={{ pixelOffset: { width: 0, height: -30 } }}
//                     >
//                         <div>
//                             <h4>
//                                 Rival: {props.selectedItem.rival?.name||""}
//                                 <br />
//                                 <span style={{ fontSize: "smaller" }}>{props.selectedItem.time}</span>
//                                 <br />
//                                 <span style={{ fontSize: "smaller" }}>
//                   {props.selectedItem.day}/{props.selectedItem.month}
//                 </span>
//                             </h4>
//                         </div>
//                     </InfoWindow>
//                 )}
//             </GoogleMapReact>)}
//             </Loader>
//         </div>
//     );
// }
//
// export default MapContainer;



// export default GoogleApiWrapper({
//     apiKey: "AIzaSyDpnzSNLu4HG4nhCpYf4aWrNnqmDJnHwFY"
// })(MapContainer);
// import React from "react";
// import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
//
// export function MapContainer(props) {
//     const data = props.data;
//
//     console.log(data);
//     console.log("selectedItem:", props.selectedItem);
//
//     const style = {
//         width: "650px",
//         height: "550px",
//         overflowX: "hidden",
//         overflowY: "hidden",
//
//     };
//
//     const containerStyle = {
//         maxWidth: "650px",
//         height: "550px",
//     };
//
//     return (
//         <div id="googleMaps" >
//             <GoogleMap
//                 mapContainerStyle={containerStyle}
//                 center={props.center}
//                 zoom={props.zoom}
//                 google={props.google}
//
//             >
//                 {data.map((item) => (
//                     <Marker
//                         key={item.id}
//                         title={item.rival.name}
//                         name={item.rival.name}
//                         position={{ lat: item.latitude, lng: item.longitude }}
//                     />
//                 ))}
//
//                 <InfoWindow
//                     position={{
//                         lat: props.selectedItem.latitude,
//                         lng: props.selectedItem.longitude,
//                     }}
//                 >
//                     <div>
//                         {props.selectedItem &&
//                             props.selectedItem.rival &&
//                             props.selectedItem.rival.name && (
//                                 <h4>
//                                     Rival: {props.selectedItem.rival.name}
//                                     <br />
//                                     <span style={{ fontSize: "smaller" }}>
//                     {props.selectedItem.time}
//                   </span>
//                                     <br />
//                                     <span style={{ fontSize: "smaller" }}>
//                     {props.selectedItem.day}/{props.selectedItem.month}
//                   </span>
//                                 </h4>
//                             )}
//                     </div>
//                 </InfoWindow>
//             </GoogleMap>
//         </div>
//     );
// }
// export default MapContainer;



        // <div class={"map-container"}>
        //     <ReactMapGL
        //         {...viewport}
        //         mapboxAccessToken={"pk.eyJ1IjoiY2F0YWdoaWdsaW9uZSIsImEiOiJjbGswMjN1bXEwaGc0M2V0NWd0NWtzNnp1In0.CPkIQxV_K36apF7d06iEuA"}
        //         onViewportChange={(viewport) => setViewport(viewport)}
        //         width="100%"
        //         height="100%"
        //         mapStyle =  "mapbox://styles/mapbox/streets-v11"
        //         interactive={true}
        //         scrollZoom={true}
        //
        //     >
        //         {data.map((item) => (
        //             <Marker
        //                 key={item.id}
        //                 latitude={item.latitude}
        //                 longitude={item.longitude}
        //                 offsetLeft={-20}
        //                 offsetTop={-10}
        //
        //             >
        //                 <div
        //                     className="marker"
        //                     onClick={() => setSelectedMarker(item)}
        //                 ></div>
        //              </Marker>
        //         ))}
        //
        //         {selectedMarker && (
        //             <Popup
        //                 latitude={selectedMarker.latitude}
        //                 longitude={selectedMarker.longitude}
        //                 onClose={() => setSelectedMarker(null)}
        //             >
        //                 <div>
        //                     {selectedMarker.rival && selectedMarker.rival.name && (
        //                         <h4>
        //                             Rival: {selectedMarker.rival.name}
        //                             <br />
        //                             <span style={{ fontSize: "smaller" }}>
        //             {selectedMarker.time}
        //           </span>
        //                             <br />
        //                             <span style={{ fontSize: "smaller" }}>
        //             {selectedMarker.day}/{selectedMarker.month}
        //           </span>
        //                         </h4>
        //                     )}
        //                 </div>
        //             </Popup>
        //         )}
        //     </ReactMapGL>
        // </div>




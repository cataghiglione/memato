import React, { useState } from 'react';
import ReactBingmaps from "../components";
import '../css/BingMap.css';


export function MapInReactFunction(props) {
    const [isVisible, setIsVisible] = useState(true);
    const [bingmapKey, setBingmapKey] = useState("ApqYZq8IsmnPRxOON1m_mY9eGEZqjDawW2cleubNdcVT5CbVMU8snXUF4qku9DcW");
    const [searchInput, setSearchInput] = useState("");
    const [showDetails, setShowDetails] = useState(false);
    const [getLocationHandledData, setGetLocationHandledData] = useState("");
    const [polyline, setPolyline] = useState({
        "location": [[13.0827, 80.2707], [13.0827, 80.1907]],
        "option": { strokeColor: 'blue', strokeThickness: 10, strokeDashArray: [1, 2, 5, 10] }
    });

    const generatePinsForConfirmedMatches = (confirmedMatches) => {
        const pushPins = confirmedMatches.map((match) => {
            const latitude = match.latitude;
            const longitude = match.longitude;
            return {
                location: [latitude, longitude],
                addHandler: "mouseover",
                infoboxOption: { title: 'Match info', description: `Rival: ${match.rival.name} , Time: ${match.time}, Date: ${match.day}/${match.month}/${match.year + 1900}` },
                pushPinOption: { title: 'Match details', description: 'Pushpin' }
            };
        });

        setPushPins(pushPins);
    };

    const callBackMethod = (event) => {
        setShowDetails(true);
        setSelectedMatch(event);
    };

    const showMatchDetails = (e) => {
        const matchDetails = e.target.metadata;
        setShowDetails(true);
        setSelectedMatch(matchDetails);
    };

    const closeMatchDetails = () => {
        setShowDetails(false);
        setSelectedMatch(null);
    };

    const handleSubmit = (event) => {
        if (searchInput !== null && searchInput !== "") {
            setBoundary({
                "search": searchInput,
                "polygonStyle": {
                    fillColor: 'rgba(161,224,255,0.4)',
                    strokeColor: '#a495b2',
                    strokeThickness: 2
                },
                "option": {
                    entityType: 'PopulatedPlace'
                }
            });
        }
        event.preventDefault();
    };

    const [pushPins, setPushPins] = useState([]);
    const [boundary, setBoundary] = useState(null);
    const [selectedMatch, setSelectedMatch] = useState(null);

    const handleConfirmedMatchesUpdate = (prevConfirmedMatches) => {
        if (props.confirmedMatches !== prevConfirmedMatches) {
            generatePinsForConfirmedMatches(props.confirmedMatches);
        }
    };

    useState(() => {
        generatePinsForConfirmedMatches(props.confirmedMatches);
    }, []);

    useState(() => {
        handleConfirmedMatchesUpdate();
    }, [props.confirmedMatches]);

    return (
        <div>
            {isVisible && (
                <div>
                    <div className="map-one" style={{ height: "800px" }}>
                        <ReactBingmaps
                            className="customClass"
                            id="six"
                            center={[-34.45676114698318, -58.85862904287449]}
                            bingmapKey={bingmapKey}
                            boundary={boundary}
                            infoboxesWithPushPins={pushPins}
                        >
                        </ReactBingmaps>
                        {showDetails && (
                            <div className="match-details">
                                <p>Match Details:</p>
                                <p>{JSON.stringify(selectedMatch)}</p>
                                <button onClick={closeMatchDetails}>Close</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}


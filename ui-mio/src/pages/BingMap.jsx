import React, { Component } from 'react';
import ReactBingmaps from "../components";
import '../css/BingMap.css';

export class BingMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible : true,
            bingmapKey: "ApqYZq8IsmnPRxOON1m_mY9eGEZqjDawW2cleubNdcVT5CbVMU8snXUF4qku9DcW", //Don't use this key in your environment.
            infoboxesWithPushPins: "",
            searchInput: "", // Future implementation
            getLocationHandledData: "",
        };
        this.UndoPinSelected = this.UndoPinSelected.bind(this);
    }

    handleSubmit(event){
        if(this.state.searchInput !== null && this.state.searchInput !== ""){
            this.setState({
                boundary: {
                    "search" : this.state.searchInput,
                    "polygonStyle" :{
                        fillColor: 'rgba(161,224,255,0.4)',
                        strokeColor: '#a495b2',
                        strokeThickness: 2
                    },
                    "option":{
                        entityType: 'PopulatedPlace'
                    }
                }
            })
        }
        event.preventDefault();
    }
    GetLocationHandled(location){
        this.setState({
            getLocationHandledData: JSON.stringify(location),
        });
        if(this.state.infoboxesWithPushPins === ""){
            this.setState({infoboxesWithPushPins: [
                    {
                        "location": [location.latitude, location.longitude],
                        "addHandler":"mouseover", //on mouseover the pushpin, infobox shown
                        "infoboxOption": { title: 'Your location'},
                        "pushPinOption":{ title: 'Your location', description: 'Pushpin' },
                        "infoboxAddHandler": {"type" : "click", callback: this.callBackMethod },
                        "pushPinAddHandler": {"type" : "click", callback: this.callBackMethod }
                    }
                ]},() => {
                if (this.props.onInfoboxesWithPushPinsChange) {
                    this.props.onInfoboxesWithPushPinsChange(this.state.infoboxesWithPushPins);
                }
            });
        }
        else{console.log("Pin selected already")}
    }
    GetEventHandled(callbackData){
        console.log(callbackData);
    }

    UndoPinSelected(){
        //it works, you can move the pin if you click anywhere else but it doesnt erase the pin until you click
        this.setState({infoboxesWithPushPins: ""});
    }

    render() {
        return (
            <div>
                {this.state.isVisible && (<div>
                    <div className = "map-one">
                        SELECT THE LOCATION OF YOUR TEAM
                        <br></br>
                        <button onClick={this.UndoPinSelected}>Change location</button>
                        <br></br>
                        (By pressing "change location" the current location mantains itself until you press on the new location)
                        <ReactBingmaps
                            id = "seven"
                            className = "customClass"
                            center = {[13.0827, 80.2707]}
                            bingmapKey = {this.state.bingmapKey}
                            getLocation = {
                                {addHandler: "click", callback:this.GetLocationHandled.bind(this), }
                            }
                            infoboxesWithPushPins={this.state.infoboxesWithPushPins}
                        >
                        </ReactBingmaps>
                        {/*<button onClick={goToFindRival}>Confirm location</button>*/}
                    </div>
                </div>)}
            </div>
        );
    }
}


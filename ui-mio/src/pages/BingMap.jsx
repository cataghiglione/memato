import React, { Component } from 'react';
import ReactBingmaps from "../components";
import '../css/BingMap.css';

export class BingMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible : true,
            bingmapKey: "ApqYZq8IsmnPRxOON1m_mY9eGEZqjDawW2cleubNdcVT5CbVMU8snXUF4qku9DcW",
            infoboxesWithPushPins: [],
            searchInput: "",
            getLocationHandledData: "",
            searchForm: false,
        };
        this.UndoPinSelected = this.UndoPinSelected.bind(this);
    }

    handleSubmit(event){
        event.preventDefault();
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
    }
    GetLocationHandled(location) {
        const newInfoboxesWithPushPins = [{
            "location": [location.latitude, location.longitude],
            "addHandler":"mouseover",
            "infoboxOption": { title: 'Your location'},
            "pushPinOption":{ title: 'Your location', description: 'Pushpin' },
            "infoboxAddHandler": {"type" : "click", callback: this.callBackMethod },
            "pushPinAddHandler": {"type" : "click", callback: this.callBackMethod }
        }];

        this.setState({
            infoboxesWithPushPins: newInfoboxesWithPushPins,
            getLocationHandledData: JSON.stringify(location),
        }, () => {
            if (this.props.onInfoboxesWithPushPinsChange) {
                this.props.onInfoboxesWithPushPinsChange(this.state.infoboxesWithPushPins);
            }
        });
    }

    GetEventHandled(callbackData){
        console.log(callbackData);
    }

    UndoPinSelected(){
        //it works, you can move the pin if you click anywhere else but it doesnt erase the pin until you click
        this.setState({infoboxesWithPushPins: []});
    }


    render() {
        return (
            <div>
                {this.state.isVisible && (<div>
                    <div className = "map-one">
                       {/* SELECT THE LOCATION OF YOUR TEAM
                        <br></br>*/}
                        {/*BUSCADOR: */}
                        <span style={{'display':'inline-block'}}>
                              <form onSubmit={this.handleSubmit.bind(this)}>
                                <input type="text" placeholder="search place, pin, city"
                                       onChange={(event)=>{this.setState({searchInput:event.target.value})}}
                                       value={this.state.searchInput}>
                                </input>
                                <input type="submit" value="Search" />
                              </form>
                        </span>
                        <ReactBingmaps
                            id = "seven"
                            className = "customClass"
                            center = {[-34.45676114698318, -58.85862904287449]}
                            bingmapKey = {this.state.bingmapKey}
                            getLocation = {
                                {addHandler: "click", callback:this.GetLocationHandled.bind(this), }
                            }
                            infoboxesWithPushPins={this.state.infoboxesWithPushPins}
                            boundary = {this.state.boundary}
                        >
                        </ReactBingmaps>
                    </div>
                </div>)}
            </div>
        );
    }
}


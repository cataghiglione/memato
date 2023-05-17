import React, { Component } from 'react';
import ReactBingmaps from "../components";
import '../css/BingMap.css';

export class MapInReact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible : true,
            bingmapKey: "ApqYZq8IsmnPRxOON1m_mY9eGEZqjDawW2cleubNdcVT5CbVMU8snXUF4qku9DcW",
            searchInput: "",
            getLocationHandledData: "",
            polyline: {
                "location": [[13.0827, 80.2707],[13.0827, 80.1907]],
                "option": { strokeColor: 'blue', strokeThickness: 10, strokeDashArray: [1, 2, 5, 10] }
            }
        }
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
            getLocationHandledData: JSON.stringify(location)
        });
    }
    GetEventHandled(callbackData){
        console.log(callbackData);
    }
    render() {
        return (
            <div>
                {this.state.isVisible && (
                    <div>
                        <div className = "map-one" style={{height: "800px"}}>
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
                                className = "customClass"
                                id = "six"
                                center = {[-34.45676114698318, -58.85862904287449]}
                                bingmapKey = {this.state.bingmapKey}
                                boundary = {this.state.boundary}
                            >
                            </ReactBingmaps>
                    </div>
                </div>)}
            </div>
        );
    }
}

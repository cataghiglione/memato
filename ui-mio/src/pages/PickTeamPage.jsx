import React, {Component} from 'react';
import "../css/Start.css"
export class PickTeamPage extends Component {

    goToNewTeam(){
        window.location.href = "/newTeam"
    }
    // goToTeam(name){
    //     window.location.href = "/team/:name"
    // }
    componentDidMount() {
        document.body.style.backgroundColor = "#c3c9c7";
    }
    render() {
        return (
            <div className={"PrincipalPageTeam"}>
                {/*<button className={"pickTeamButton"} onClick={this.goToTeam()}>Log in</button>*/}
                <br></br>
                <br></br>
                <br></br>
                <button className={"newTeamButton"} onClick={this.goToNewTeam}>New Team</button>
            </div>
        );
    }
}
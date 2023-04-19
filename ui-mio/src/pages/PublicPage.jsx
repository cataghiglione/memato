import React, {Component} from 'react';
import "../css/Start.css"
export class PublicPage extends Component {

    goToLogin(){
        window.location.href = "/login"
    }

    goToSignUp(){
        window.location.href = "/register"
    }
    componentDidMount() {
        document.body.style.backgroundColor = "#c3c9c7";
    }
    render() {
        return (
            <div className={"mainContainer"}>

                <button className={"logInButton"} onClick={this.goToLogin}>Log in</button>
                <br></br>
                <br></br>
                <br></br>
                <button className={"signUpButton"} onClick={this.goToSignUp}>Sign up</button>
            </div>
        );
    }
}
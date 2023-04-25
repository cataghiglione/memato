import "../../css/Home.css";
import {Component} from "react";
import * as React from "react";
import {useLocation, useNavigate} from "react-router";

class MenuSideBar extends Component{
    constructor(props) {
        super(props);
        this.state = { visible: false, pageChange: [''] };
        this.toggleMenu = this.toggleMenu.bind(this);
        this.togglePage = this.togglePage.bind(this);
    }
    toggleMenu() {
        this.setState({ visible: !this.state.visible });
    }
    togglePage(event){
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        this.setState({ pageChange: selectedOptions });
        if(this.props.location.pathname===selectedOptions[0]){
            this.toggleMenu();
            this.setState({ pageChange: [""]});
        }
        this.props.history(selectedOptions[0]).then();
    }
    menuForm(){
        if(this.state.visible){
            return(
                <div>
                    <select className={"custom-select"} id="Menu" multiple={true} value={this.state.pageChange} onChange={this.togglePage}>
                        <option className={"custom-select-option"} value="/editTeam">Team specs</option>
                        <option className={"custom-select-option"} value="/findRival">Find Rival</option>
                        <option className={"custom-select-option"} value="/newTeam">New Team</option>
                        <option className={"custom-select-option"} value="/settings">Settings</option>
                    </select>
                </div>
            )
        }
    }

    render() {
        return(
            <div>
                <button className={"Menu"} onClick={this.toggleMenu}>
                    <img style={{ width: 22, height: "auto"}} src={require("../../images/sideBarIcon.png")}/>
                </button>
                {this.state.visible &&
                    this.menuForm()
                }
            </div>
        );
    }
}

export default function MenuSidebarWrapper() {
    const history = useNavigate();
    const location = useLocation();
    return <MenuSideBar history={history} location={location}/>;
}

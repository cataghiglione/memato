import "../css/Home.css";
import {Component} from "react";
import * as React from "react";
import {useNavigate} from "react-router";

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
        this.props.history(selectedOptions[0]).then();
    }
    menuForm(){
        if(this.state.visible){
            return(
                <div>
                    <select className={"custom-select"} id="Menu" multiple={true} value={this.state.pageChange} onChange={this.togglePage}>
                        <option className={"custom-select-option"} value="/home">Home</option>
                        <option className={"custom-select-option"} value="/user">User</option>
                        <option className={"custom-select-option"} value="/pickTeam">Pick Team</option>
                        <option className={"custom-select-option"} value="/newTeam">New Team</option>
                        <option className={"custom-select-option"} value="/findRival">Find Rival</option>
                    </select>
                </div>
            )
        }
    }

    render() {
        return (
            <div className="menu-sidebar">
                <button className={"Menu"} onClick={this.toggleMenu}>
                    <img style={{ width: 22, height: "auto"}} src={require("../images/sideBarIcon.png")} alt={"Logo"}/>
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
    return <MenuSideBar history={history} />;
}

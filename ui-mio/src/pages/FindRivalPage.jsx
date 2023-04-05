import React, {Component, useEffect, useState} from 'react';
import "../css/Home.css"
import {useNavigate} from "react-router";
import {useMySystem} from "../service/mySystem";
import {useAuthProvider} from "../auth/auth";
import {useSearchParams} from "react-router-dom";
import {HomePage} from "./HomePage";
// import {Button} from 'reactstrap';
// import DropdownButton from 'react-bootstrap/DropdownButton';
// import {Dropdown} from "react-bootstrap";

// export default (props) => {
//     return <Button color="danger">Danger!</Button>;
// };

function goToNewTeam() {
    window.location.href = "/newTeam"
}

function goToHome() {
    window.location.href = "/user"
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

export const FindRivalPage = () => {
    const navigate = useNavigate()
    const mySystem = useMySystem()
    const auth = useAuthProvider()

    const token = auth.getToken();
    const [teams, setTeams] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const isOk = searchParams.get("ok")

    const [menuOpen, setMenuOpen] = useState(false);
    const[pickTeamOpen, setPickTeamOpen] = useState(false)
    const [pageChange, setPageChange] = useState("Home");
    useEffect(() => {
        mySystem.listTeams(token, (teams) => setTeams(teams));
    }, [])

    const changePage = (event) => {
        setPageChange(event.target.value);
    }

    return (
        <div>
            <button className={"Menu"} id="submit" type="submit" onClick={() => setMenuOpen(!menuOpen)}>
                <img style={{width: 22, height: "auto"}} src={require("../images/sideBarIcon.png")} alt={"Logo"}/>
            </button>
            {isOk && <div className="alert alert-success" role="alert">Team created</div>}
            {isOk && sleep(500)}
            {menuOpen &&
                <select className={"custom-select"} id="Menu" multiple={true} onChange={changePage}>
                    <option className={"custom-select-option"} value="Home">Home</option>
                    <option className={"custom-select-option"} value="User">User</option>
                    <option className={"custom-select-option"} value="Pick Team">Pick Team</option>
                    <option className={"custom-select-option"} value="New Team">New Team</option>
                    <option className={"custom-select-option"} value="Find Rival">Find Rival</option>

                </select>
            }

            <div className="containerPrincipal">
                <img style={{width: 218, height: "auto", left:50}} src={require("../images/RivalMatch_logoRecortado.png")}
                     alt={"Logo"}/>
                {pageChange === "User" && HomePage.goToUserInfo()}
                {pageChange === "Pick Team" && HomePage.goToPickTeam()}
                {pageChange === "New Team" && goToHome()}
                <h1>Pick your team to find a new rival!</h1>

                {/*<div className="dropdown">*/}
                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                            aria-expanded="false" onClick={()=> setPickTeamOpen(!pickTeamOpen)}>
                        Choose a Team:
                    </button>
                {pickTeamOpen &&
                    <select name="teams" id="teams" className="form-select" aria-label="Default select example" multiple={true}>
                        { teams.map(team => <option value={team.name}>{team.name}</option>) }
                    </select>
                }
                    {/*<ul className="dropdown-menu">*/}
                    {/*    {teams.map(team => <li><a className="dropdown-item" href="#">{team.name}</a></li>)}*/}
                    {/*</ul>*/}
                {/*</div>*/}

                {/*<label htmlFor="teams">Choose a team:</label>*/}



                {/*<DropdownButton*/}
                {/*    variant="secondary"*/}
                {/*    menuVariant="dark"*/}
                {/*    title="Team"*/}
                {/*    className="mt-2"*/}
                {/*>*/}
                {/*    <div className="list-group">*/}

                {/*        <button type="button" className="list-group-item list-group-item-action">*/}
                {/*            {teams.map(team=>{ {team.name}})}*/}
                {/*        </button>*/}

                {/*    </div>*/}
                            {/*<select className={''}>*/}
                            {/*    {teams.map(team =>*/}
                            {/*        // <p>nombre = {team.name}    deporte = {team.sport} </p>*/}
                            {/*        <option><Dropdown.Item>{team.name}</Dropdown.Item></option>*/}

                            {/*    )}*/}
                            {/*</select>*/}

                {/*</DropdownButton>*/}
                {/*<div style={{marginLeft: 650}}>*/}
                {/*    <Dropdown>*/}

                {/*        <Dropdown.Toggle variant="success" id="dropdown-basic">*/}
                {/*            Team*/}
                {/*        </Dropdown.Toggle>*/}

                {/*        <Dropdown.Menu>*/}
                {/*            <Dropdown.Item>{teams.map(team =><option>{team.name}</option>)}</Dropdown.Item>*/}
                {/*        </Dropdown.Menu>*/}

                {/*    </Dropdown>*/}
                {/*</div>*/}
                {console.log(teams)}
                <div style={{justifyContent: "center", alignItems: "center", position: "absolute", bottom: -250}}>
                    <p></p>
                    <p>No teams yet? Create a new one!</p>
                    <button data-toggle="button" aria-pressed="true" active color="success" outline
                            className={"newTeamButton"} onClick={goToNewTeam}>New Team</button>
                </div>
            </div>
        </div>
    )
}


// React.useEffect(()=>{
//     async function getTeams(){
//         const response = await fetch('http://localhost:4326/findRival',{
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Bearer ' + token
//             }});
//         const body = await response.json();
//         setItems(body.results.map(({name})=>({label: name, value: name})));
//         setLoading(false);
//     }
//     getTeams();
// },[]);

// <select disabled={loading}
//         value={value}
//         onChange={e => setValue(e.currentTarget.value)}>
// <select>
//     {teams.map(({ label, value }) => (
//         <option key={value} value={value}>
//             {label}
//         </option>
//     ))}
//
// </select>
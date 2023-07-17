import React, {useState} from 'react';
import {Sidebar, Menu, MenuItem, SidebarFooter} from 'react-pro-sidebar';
import {Link} from 'react-router-dom';
import "../css/Home.scss";
import {useLocation, useNavigate} from "react-router";


import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import SportsSoccerOutlinedIcon from '@mui/icons-material/SportsSoccerOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import {useAuthProvider} from "../auth/auth";
import {signOut} from "../service/mySystem";

export function MySidebar(props) {
    const [collapsed, setCollapsed] = useState(true);
    const handleSidebarToggle = () => {
        setCollapsed(!collapsed);
    };
    const auth = useAuthProvider();
    const token = auth.getToken();
    const navigate = useNavigate();

    function signOutMethod() {
        signOut(token, navigate("/"))
        auth.removeToken();
        props.toggleTeamId(0);
    }

    return (
        <div className={"proSidebar"}>
            <Sidebar  collapsed={collapsed} rtl={false} backgroundColor={"white"}>
                <Menu>
                    <MenuItem
                        icon={<MenuOutlinedIcon/>}
                        onClick={() => {
                            handleSidebarToggle();
                        }}
                        style={{textAlign: "center"}}
                    >
                        {""}
                        Rival Match
                    </MenuItem>
                    <MenuItem icon={<PermIdentityOutlinedIcon/>}>
                        <Link to="/user" style={{color: 'black'}}>Profile </Link>
                    </MenuItem>
                    {props.getTeamId !== 0 && (
                        <>
                            <MenuItem icon={<EmojiEventsOutlinedIcon/>}>
                                <Link to="/findRival" style={{color: 'black'}}>Find Rival</Link>
                            </MenuItem>
                            <MenuItem icon={<PendingActionsOutlinedIcon/>}>
                                <Link to="/currentSearches" style={{color: 'black'}}>Pending Confirmations</Link>
                            </MenuItem>
                            <MenuItem icon={<SportsSoccerOutlinedIcon/>}>
                                <Link to="/myConfirmations" style={{color: 'black'}}>My Confirmed Matches</Link>
                            </MenuItem>
                            <MenuItem icon={<QuestionAnswerOutlinedIcon/>}>
                                <Link to="/chat" style={{color: 'black'}}>Chat</Link>
                            </MenuItem>
                            <MenuItem icon={<GroupAddOutlinedIcon/>}>
                                <Link to="/newTeam" style={{color: 'black'}}>New Team</Link>
                            </MenuItem>
                            <MenuItem icon={<EditOutlinedIcon/>}>
                                <Link to="/editTeam" style={{color: 'black'}}>Edit Team</Link>
                            </MenuItem>
                            <MenuItem icon={<NotificationsNoneOutlinedIcon/>}>
                                <Link to="/notificationPage" style={{color: 'black'}}>
                                    Notifications</Link>
                            </MenuItem>
                            <MenuItem disabled></MenuItem>
                            <MenuItem disabled></MenuItem>
                            <MenuItem disabled></MenuItem>
                            <MenuItem disabled></MenuItem>
                            <MenuItem disabled></MenuItem>
                            <MenuItem disabled></MenuItem>
                            <MenuItem disabled></MenuItem>
                        </>)}
                    {props.getTeamId === 0 &&(
                        <>
                            <MenuItem disabled></MenuItem>
                            <MenuItem disabled></MenuItem>
                            <MenuItem disabled></MenuItem>
                            <MenuItem disabled></MenuItem>
                            <MenuItem disabled></MenuItem>
                            <MenuItem disabled></MenuItem>
                            <MenuItem disabled></MenuItem>
                            <MenuItem disabled></MenuItem>
                            <MenuItem disabled></MenuItem>
                            <MenuItem disabled></MenuItem>
                            <MenuItem disabled></MenuItem>
                            <MenuItem disabled></MenuItem>
                            <MenuItem disabled></MenuItem>
                            <MenuItem disabled></MenuItem>
                        </>
                    )}

                    <div className="sidebar-bottom">
                        <MenuItem icon={<LogoutOutlinedIcon/>} onClick={signOutMethod}>
                            Logout
                        </MenuItem>
                    </div>
                </Menu>

            </Sidebar>
        </div>
    );
}

export default MySidebar;

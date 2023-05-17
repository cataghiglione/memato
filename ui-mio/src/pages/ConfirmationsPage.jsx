import React, {Component, useEffect, useState} from 'react';
import {useAuthProvider} from "../auth/auth";
import {useSearchParams} from "react-router-dom";
import {useNavigate} from "react-router";

import {TopBar} from "./TopBar/TopBar";

export function ConfirmationsPage(props){
    const auth = useAuthProvider()
    const token = auth.getToken();

}
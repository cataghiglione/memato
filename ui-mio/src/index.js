import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";

// Made slight changes to solve reactdom not being supported anymore for react 18; fer
const rootElement = document.getElementById('root');
const root = ReactDOMClient.createRoot(rootElement);
    root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </React.StrictMode>,
)
;

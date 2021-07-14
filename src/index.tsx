import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./components/App";
import {Provider} from "react-redux";
import {store} from "riux/lib/reduxboilerplate/store";

const renderApp = () => {
    ReactDOM.render((
        <Provider store={store} >
            <App />
        </Provider>
    ), document.getElementById("root"));
};

renderApp();

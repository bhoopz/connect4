import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import RoomJoinPage from "./RoomJoinPage";
import RoomCreatePage from "./RoomCreatePage"
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory } from "react-router-dom";
function App(props) {
    return (<Router>
        <div className="center">

<HomePage />
</div>
    </Router>);
}

render(
    <App />,
    document.getElementById('app')
  );
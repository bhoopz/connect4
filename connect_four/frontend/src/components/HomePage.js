import React, { Component } from "react";
import { render } from "react-dom";
import RoomJoinPage from "./RoomJoinPage";
import RoomCreatePage from "./RoomCreatePage"
import Room from "./Room"
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

export default function HomePage(props) {
    return (<Router>
        <Switch>
            <Route exact path="/">
                <p>This is a home page</p>
            </Route>
            <Route path="/player/join" component={RoomJoinPage}>
            </Route>
            <Route path="/player/create" component={RoomCreatePage}>
            </Route>
            <Route path="/player/room/:roomCode" component={Room}>
            </Route>
        </Switch>
        </Router>);
}


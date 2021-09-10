import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import RoomJoinPage from "./RoomJoinPage";
import RoomCreatePage from "./RoomCreatePage"

function App(props) {
    return (<div className="center">
    <HomePage />
    </div>);
}

render(
    <App />,
    document.getElementById('app')
  );
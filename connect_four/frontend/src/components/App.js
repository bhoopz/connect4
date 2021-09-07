import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import RoomJoinPage from "./RoomJoinPage";
import RoomCreatePage from "./RoomCreatePage"

function App(props) {
    return (<>
    <HomePage />
    </>);
}

render(
    <App />,
    document.getElementById('app')
  );
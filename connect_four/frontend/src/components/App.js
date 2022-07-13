import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import { BrowserRouter as Router } from "react-router-dom";
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
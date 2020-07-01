import React from "react";
import {
  HashRouter as Router,
  Route,
  // Switch,
  Redirect,
} from "react-router-dom";

import Home from "../page/layout-home";
import { AnimatedSwitch as Switch } from "react-router-transition";

export default function RouterRelation() {
  return (
    <Router basename="/">
      <Switch
        atEnter={{ opacity: 0 }}
        atLeave={{ opacity: 0 }}
        atActive={{ opacity: 1 }}
        className="switch-wrapper"
      >
        <Route exact path="/" component={Home} />
        <Route path="/home" component={Home} />
        <Redirect to="/home" />
      </Switch>
    </Router>
  );
}

import React from "react";
import {
  HashRouter as Router,
  Route,
  // Switch,
  Redirect,
} from "react-router-dom";

import Home from "../page/layout-home";
import Add from "../page/layout-add";
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
        <Route path="/index" component={Home} />
        <Route path="/add" component={Add} />
        <Redirect to="/index" />
      </Switch>
    </Router>
  );
}

/*
 * @Author: junjie.lean
 * @Date: 2020-07-07 15:26:55
 * @Last Modified by:   junjie.lean
 * @Last Modified time: 2020-07-07 15:26:55
 */

import React from "react";
import { HashRouter as Router, Route, Redirect } from "react-router-dom";

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
        <Route path="/index" component={Home} />
        <Redirect to="/index" />
      </Switch>
    </Router>
  );
}

import { Switch, Route } from "react-router-dom";
function Routes() {
  return (
    <Switch>
      <Route exact path="/"></Route>

      <Route exact path="/cadastro"></Route>
    </Switch>
  );
}

export default Routes;

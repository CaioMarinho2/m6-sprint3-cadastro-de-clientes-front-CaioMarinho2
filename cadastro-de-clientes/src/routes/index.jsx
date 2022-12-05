import { Switch, Route } from "react-router-dom";
import CadastroPage from "../pages/cadastro";
import LoginPage from "../pages/login";
function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <LoginPage />
      </Route>

      <Route exact path="/cadastro">
        <CadastroPage />
      </Route>
    </Switch>
  );
}

export default Routes;

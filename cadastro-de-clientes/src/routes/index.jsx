import { Switch, Route } from "react-router-dom";
import CadastroPage from "../pages/cadastro";
import HomePage from "../pages/home";
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

      <Route exact path="/inicio">
        <HomePage/>
      </Route>

      <Route exact path="/editar">
    
      </Route>
      
    </Switch>
  );
}

export default Routes;

import ListaContatos from "../../components/ListaContatos";
import { useHistory } from "react-router-dom";
import "./index.css";
import { useContext } from "react";
import api from "../../services/api";
import { userListContext } from "../../providers/userList";

function HomePage() {
  const UserId = localStorage.getItem("@CadastroClientes:id");
  const { setUser } = useContext(userListContext);
  const token = localStorage.getItem("@CadastroClientes:token");
  const history = useHistory();
  return (
    <main className="mainHome">
      <header>
        <h1>Pagina Inicial</h1>
        <button
          className="sair"
          onClick={() => {
            history.push("/");
            localStorage.clear();
          }}
        >
          Sair
        </button>
      </header>

      <div className="listContainer">
        <button
          className="edit"
          onClick={() => {
            api
              .get(`/users/profile/${UserId}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((response) => {
                setUser(response.data);

                history.push("/editar");
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        >
          Editar Perfil
        </button>
        <ListaContatos />
      </div>
    </main>
  );
}
export default HomePage;

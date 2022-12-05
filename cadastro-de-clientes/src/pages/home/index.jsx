import ListaContatos from "../../components/ListaContatos";
import { useHistory } from "react-router-dom";
import "./index.css";

function HomePage() {
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
          sair
        </button>
      </header>

      <div className="listContainer">
        <button className="edit" onClick={() => history.push()}>
          Editar Perfil
        </button>
        <ListaContatos />
      </div>
    </main>
  );
}
export default HomePage;

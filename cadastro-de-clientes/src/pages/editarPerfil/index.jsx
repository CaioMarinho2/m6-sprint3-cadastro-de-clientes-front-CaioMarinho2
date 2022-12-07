import FormEdit from "../../components/FormEdit";
import { useHistory } from "react-router-dom";
import "./index.css";
import api from "../../services/api";
import { toast } from "react-toastify";

function EditarPerfil() {
  const history = useHistory();
  const UserId = localStorage.getItem("@CadastroClientes:id");
  const token = localStorage.getItem("@CadastroClientes:token");
  return (
    <main className="mainEdit">
      <h1 className="editPerfil">Editar Perfil</h1>

      <FormEdit />
      <button
        className="buttonBack"
        onClick={() => {
          history.push("/inicio");
        }}
      >
        Voltar
      </button>

      <button
        className="deletarPerfil"
        onClick={() => {
          api
            .delete(`/users/delete/${UserId}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              localStorage.clear();
              toast.success("Conta apagada com sucesso!");
              history.push("/");
            })
            .catch((error) => {
              toast.error("Algo deu errado, tente novamente mais tarde!");
              console.log(error);
            });
        }}
      >
        Deletar Perfil
      </button>
    </main>
  );
}

export default EditarPerfil;

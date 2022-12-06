import FormEdit from "../../components/FormEdit";
import { useHistory } from "react-router-dom";
import "./index.css";

function EditarPerfil() {
    const history = useHistory();

  return (
    <main className="mainEdit">
      <h1 className="editPerfil">Editar Perfil</h1>
    
      <FormEdit/>
      <button className="buttonBack" onClick={()=>{
        history.push("/inicio")
      }}>Voltar</button>
     
    </main>
  );
}

export default EditarPerfil;

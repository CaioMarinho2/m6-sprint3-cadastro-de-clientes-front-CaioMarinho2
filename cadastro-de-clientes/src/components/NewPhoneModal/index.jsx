import Modal from "react-modal";
import "./index.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../services/api";
import { toast } from "react-toastify";

Modal.setAppElement("#root");
function ModalNewPhone({ modalOpen, abrirFecharModal,owner,id, edit, }) {
  let UserId = localStorage.getItem("@CadastroClientes:id");
  const token = localStorage.getItem("@CadastroClientes:token");

  if(owner==="contato"){
    UserId= id
  }
  console.log(id)

  function editFunction(){
    if(edit){
        return "Editar"
    }
    return "Cadastrar"
  }

  const formSchema = yup.object().shape({
  
    phone: yup
      .string()
      .required("Telefone obrigatório")
      .matches(
        /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/,
        "Os telefones devem ser válidos e conter o ddd antes do número"
      )
      ,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  function registerTech(data) {
    console.log(data)
    const objectRequest = {
        phones: [data.phone],
      };
      if(edit){
        console.log()
        api
        .patch(`/phones/update/${id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
            window.location.reload()
            console.log(response);
            abrirFecharModal();
  
            toast.success("Contato cadastrada com sucesso!");
         
        })
        .catch((error) => {toast.error("Algo deu errado, tente novamente mais tarde!")  
       console.log(error)
      });
      }
      else{

          api
            .post(`/phones/create/${UserId}`, objectRequest, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                window.location.reload()
                console.log(response);
                abrirFecharModal();
      
                toast.success("Contato cadastrada com sucesso!");
             
            })
            .catch((error) => {toast.error("Algo deu errado, tente novamente mais tarde!")  
           console.log(error)
          });
    }
  }

  return (
    <Modal
      isOpen={modalOpen}
      onRequestClose={abrirFecharModal}
      className="ModalPhone"
      overlayClassName="Overlay"
    >
      <div className="closeModal">
        <h6 className="cadastroContact">{editFunction()} novo Telefone</h6>
      </div>
      <form className="formModal" onSubmit={handleSubmit(registerTech)}>
        <div className="inputsContact">
        
          <label className="labelContact" htmlFor="statusNewContact">
          Telefone
          </label>

          <input
            className="inputNewContact"
            id="nameNewContact"
            {...register("phone")}
       
          />
          <p className="errorModal"> {errors.phones?.message}</p>
        </div>

        <button className="cadastroContactBnt" type="submit">
            
        {editFunction()} Telefone
        </button>
      </form>
    </Modal>
  );
}
export default ModalNewPhone;
import Modal from "react-modal";
import "./index.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../services/api";
import { toast } from "react-toastify";

Modal.setAppElement("#root");
function ModalNewEmail({ modalOpen, abrirFecharModal, id }) {
  const token = localStorage.getItem("@CadastroClientes:token");

  const formSchema = yup.object().shape({
    email: yup
      .string()
      .required("Email obrigatório")
      .email("É necessário um email válido")
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
    console.log(data);
    const objectRequest = {
      emails: [data.email],
    };

    api
      .post(`/emails/create/${id}`, objectRequest, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        window.location.reload();
        console.log(response);
        abrirFecharModal();

        toast.success("Email cadastrada com sucesso!");
      })
      .catch((error) => {
        toast.error("Algo deu errado, tente novamente mais tarde!");
        console.log(error);
      });
  }

  return (
    <Modal
      isOpen={modalOpen}
      onRequestClose={abrirFecharModal}
      className="ModalPhone"
      overlayClassName="Overlay"
    >
      <div className="closeModal">
        <h6 className="cadastroContact">Cadastrar novo Email</h6>
      </div>
      <form className="formModal" onSubmit={handleSubmit(registerTech)}>
        <div className="inputsContact">
          <label className="labelContact" htmlFor="statusNewContact">
            Email
          </label>

          <input
            className="inputNewContact"
            id="nameNewContact"
            {...register("email")}
          />
          <p className="errorModal"> {errors.phones?.message}</p>
        </div>

        <button className="cadastroContactBnt" type="submit">
          Novo Email
        </button>
      </form>
    </Modal>
  );
}
export default ModalNewEmail;

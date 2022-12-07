import Modal from "react-modal";
import "./index.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../services/api";
import { toast } from "react-toastify";
import { userListContext } from "../../providers/userList";
import { useContext } from "react";

Modal.setAppElement("#root");
function ModalNewContact({ modalOpen, abrirFecharModal }) {
  const UserId = localStorage.getItem("@CadastroClientes:id");
  const token = localStorage.getItem("@CadastroClientes:token");
  const { setUserList } = useContext(userListContext);

  const formSchema = yup.object().shape({
    name: yup.string().required("Nome do contato é obrigatório"),
    emails: yup.string().required("Email obrigatório").email("Email inválido "),
    phones: yup
      .string()
      .required("Telefone obrigatório")
      .matches(
        /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/,
        "Os telefones devem ser válidos e conter o ddd antes do número"
      )
      .required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  function registerContact(data) {
    const objectRequest = {
      name: data.name,
      emails: [data.emails],
      phones: [data.phones],
    };
    api
      .post(`/contacts/create/${UserId}`, objectRequest, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        api
          .get(`/users/profile/${UserId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            setUserList(response.data.contacts);
          })
          .catch((error) => {
            console.log(error);
          });

        abrirFecharModal();

        toast.success("Contato cadastrado com sucesso!");
      })
      .catch((error) => {
        toast.error("Algo deu errado, tente novamente mais tarde!");
      });
  }

  return (
    <Modal
      isOpen={modalOpen}
      onRequestClose={abrirFecharModal}
      className="Modal"
      overlayClassName="Overlay"
    >
      <div className="closeModal">
        <h6 className="cadastroContact">Cadastrar novo contato</h6>
      </div>
      <form className="formModal" onSubmit={handleSubmit(registerContact)}>
        <div className="inputsContact">
          <label className="labelContact" htmlFor="nameNewContact">
            Nome
          </label>
          <input
            className="inputNewContact"
            id="nameNewContact"
            {...register("name")}
          />
          <p className="errorModal"> {errors.name?.message}</p>

          <label className="labelContact" htmlFor="statusNewContact">
            Email
          </label>

          <input
            className="inputNewContact"
            id="nameNewContact"
            {...register("emails")}
          />
          <p className="errorModal"> {errors.emails?.message}</p>

          <label className="labelContact" htmlFor="statusNewContact">
            Telefone
          </label>

          <input
            className="inputNewContact"
            id="nameNewContact"
            {...register("phones")}
          />
          <p className="errorModal"> {errors.phones?.message}</p>
        </div>

        <button className="cadastroContactBnt" type="submit">
          Cadastrar Contato
        </button>
      </form>
    </Modal>
  );
}
export default ModalNewContact;

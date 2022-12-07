import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../services/api";
import { toast } from "react-toastify";
import { userListContext } from "../../providers/userList";
import { useContext } from "react";

Modal.setAppElement("#root");
function ModalNewEmail({ modalOpen, abrirFecharModal, id, edit, email }) {
  const token = localStorage.getItem("@CadastroClientes:token");
  const { setUserList, setUser } = useContext(userListContext);
  const UserIdGet = localStorage.getItem("@CadastroClientes:id");

  function editFunction() {
    if (edit) {
      return "Editar";
    }
    return "Cadastrar";
  }

  function emailFunction() {
    if (email) {
      return email;
    }
  }

  const formSchema = yup.object().shape({
    email: yup
      .string()
      .required("Email obrigatório")
      .email("É necessário um email válido"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  function registerEmail(data) {
    const objectRequest = {
      emails: [data.email],
    };
    if (edit) {
      api
        .patch(`/emails/update/${id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const UserIdGet = localStorage.getItem("@CadastroClientes:id");
          api
            .get(`/users/profile/${UserIdGet}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              setUserList(response.data.contacts);
              setUser(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
          abrirFecharModal();

          toast.success("Email editado com sucesso!");
        })
        .catch((error) => {
          toast.error("Algo deu errado, tente novamente mais tarde!");
        });
    } else {
      api
        .post(`/emails/create/${id}`, objectRequest, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          api
            .get(`/users/profile/${UserIdGet}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              setUserList(response.data.contacts);
              setUser(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
          abrirFecharModal();

          toast.success("Email cadastrado com sucesso!");
        })
        .catch((error) => {
          toast.error("Algo deu errado, tente novamente mais tarde!");
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
        <h6 className="cadastroContact">{editFunction()} novo Email</h6>
      </div>
      <form className="formModal" onSubmit={handleSubmit(registerEmail)}>
        <div className="inputsContact">
          <label className="labelContact" htmlFor="statusNewContact">
            Email
          </label>

          <input
            className="inputNewContact"
            id="nameNewContact"
            defaultValue={emailFunction()}
            {...register("email")}
          />
          <p className="errorModal"> {errors.email?.message}</p>
        </div>

        <button className="cadastroContactBnt" type="submit">
          Novo Email
        </button>
      </form>
    </Modal>
  );
}
export default ModalNewEmail;

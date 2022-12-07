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
function ModalNewPhone({
  modalOpen,
  abrirFecharModal,
  owner,
  id,
  edit,
  phone,
}) {
  let UserId = localStorage.getItem("@CadastroClientes:id");
  const token = localStorage.getItem("@CadastroClientes:token");
  const { setUserList, setUser } = useContext(userListContext);

  if (owner === "contato") {
    UserId = id;
  }
  console.log(id);
  console.log(phone);

  function editFunction() {
    if (edit) {
      return "Editar";
    }
    return "Cadastrar";
  }

  function phoneFunction() {
    if (phone) {
      return phone;
    }
  }

  const formSchema = yup.object().shape({
    phone: yup
      .string()
      .required("Telefone obrigatório")
      .matches(
        /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/,
        "Os telefones devem ser válidos e conter o ddd antes do número"
      ),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  function EditPhoneOrCreate(data) {
    console.log(data);
    const objectRequest = {
      phones: [data.phone],
    };
    if (edit) {
      console.log();
      api
        .patch(`/phones/update/${id}`, data, {
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
              console.log(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
          abrirFecharModal();

          toast.success("Telefone Editado com sucesso!");
        })
        .catch((error) => {
          toast.error("Algo deu errado, tente novamente mais tarde!");
          console.log(error);
        });
    } else {
      api
        .post(`/phones/create/${UserId}`, objectRequest, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          const UserIdGet = localStorage.getItem("@CadastroClientes:id");
          api
            .get(`/users/profile/${UserIdGet}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              setUserList(response.data.contacts);
              console.log(response.data.contacts);
            })
            .catch((error) => {
              console.log(error);
            });
          abrirFecharModal();

          toast.success("Telefone cadastrado com sucesso!");
        })
        .catch((error) => {
          toast.error("Algo deu errado, tente novamente mais tarde!");
          console.log(error);
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
      <form className="formModal" onSubmit={handleSubmit(EditPhoneOrCreate)}>
        <div className="inputsContact">
          <label className="labelContact" htmlFor="statusNewContact">
            Telefone
          </label>

          <input
            className="inputNewContact"
            id="nameNewContact"
            defaultValue={phoneFunction()}
            {...register("phone")}
          />
          <p className="errorModal"> {errors.phone?.message}</p>
        </div>

        <button className="cadastroContactBnt" type="submit">
          {editFunction()} Telefone
        </button>
      </form>
    </Modal>
  );
}
export default ModalNewPhone;

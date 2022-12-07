import Modal from "react-modal";
import "./index.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../services/api";
import { toast } from "react-toastify";
import ModalNewPhone from "../NewPhoneModal";
import { useContext, useState } from "react";
import ModalNewEmail from "../NewEmailModal";
import { userListContext } from "../../providers/userList";

Modal.setAppElement("#root");

function ModalEditContact({
  modalOpen,
  abrirFecharModal,
  id,
  emails,
  phones,
  name,
}) {
  const token = localStorage.getItem("@CadastroClientes:token");
  const UserId = localStorage.getItem("@CadastroClientes:id");
  const [modalOpenNewPhoneEdit, setModalOpenEditNewPhoneEdit] = useState(false);
  const [modalOpenNewEmailEdit, setModalOpenEditNewEmailEdit] = useState(false);
  const { setUserList, setUser } = useContext(userListContext);
  const [idEdit, setIdEdit] = useState("");
  const [phoneUser, setPhoneUser] = useState("");

  const [idEditEmail, setIdEditEmail] = useState("");
  const [emailUser, setEmailUser] = useState("");

  const formSchema = yup.object().shape({
    name: yup.string().required("Nome do contato é obrigatório"),
  });

  function abrirFecharModalNewPhoneEdit() {
    setModalOpenEditNewPhoneEdit(!modalOpenNewPhoneEdit);
  }

  function abrirFecharModalNewEmailEdit() {
    setModalOpenEditNewEmailEdit(!modalOpenNewEmailEdit);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  function EditContact(data) {
    api
      .patch(`/contacts/update/${id}`, data, {
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

        toast.success("Contato edita com sucesso!");
      })
      .catch((error) => {
        toast.error("Algo deu errado, tente novamente mais tarde!");
      });
  }

  return (
    <Modal
      isOpen={modalOpen}
      onRequestClose={abrirFecharModal}
      className="ModalEditContact"
      overlayClassName="Overlay"
    >
      <div className="closeModal">
        <h6 className="cadastroContact">Editar contato</h6>
      </div>
      <form className="formModal" onSubmit={handleSubmit(EditContact)}>
        <div className="inputsContact">
          <label className="labelContact" htmlFor="nameNewContact">
            Nome
          </label>
          <input
            className="inputNewContact"
            defaultValue={name}
            id="nameNewContact"
            {...register("name")}
          />
          <p className="error"> {errors.name?.message}</p>
          <button className="cadastroContactBnt" type="submit">
            Editar Contato
          </button>
        </div>
      </form>
      <div className="phonesAndEmailArea">
        {phones.map(({ phone, id }, index) => {
          return (
            <div key={index} className="editOrDelete">
              <label className="labelContact" htmlFor="nameNewContact">
                Telefone {index + 1}
              </label>
              <p className="inputNewContact">{phone}</p>

              <div className="buttonsEditOrDelete">
                <button
                  className="deleteButton"
                  onClick={() => {
                    api
                      .delete(`/phones/delete/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                      })
                      .then((response) => {
                        api
                          .get(`/users/profile/${UserId}`, {
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
                        toast.success("Telefone Deletado com sucesso!");
                      })
                      .catch((error) => {
                        toast.error(
                          "Algo deu errado, tente novamente mais tarde!"
                        );
                      });
                  }}
                >
                  Deletar telefone {index + 1}
                </button>
                <button
                  className="editButton"
                  onClick={() => {
                    setIdEdit(id);
                    setPhoneUser(phone);
                    abrirFecharModalNewPhoneEdit();
                  }}
                >
                  Editar telefone {index + 1}
                </button>

                {modalOpenNewPhoneEdit && (
                  <ModalNewPhone
                    modalOpen={modalOpenNewPhoneEdit}
                    abrirFecharModal={abrirFecharModalNewPhoneEdit}
                    id={idEdit}
                    edit={true}
                    phone={phoneUser}
                  />
                )}
              </div>
            </div>
          );
        })}

        {emails.map(({ email, id }, index) => {
          return (
            <div key={index} className="editOrDelete">
              <label className="labelContact" htmlFor="nameNewContact">
                Email {index + 1}
              </label>
              <p className="inputNewContact">{email}</p>
              <div className="buttonsEditOrDelete">
                <button
                  className="deleteButton"
                  onClick={() => {
                    api
                      .delete(`/emails/delete/${id}`, {
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

                        toast.success("Contato editado com sucesso!");
                      })
                      .catch((error) => {
                        toast.error(
                          "Algo deu errado, tente novamente mais tarde!"
                        );
                      });
                  }}
                >
                  Deletar Email {index + 1}
                </button>
                <button
                  className="editButton"
                  onClick={() => {
                    setIdEditEmail(id);
                    setEmailUser(email);
                    abrirFecharModalNewEmailEdit();
                  }}
                >
                  Editar Email {index + 1}
                </button>

                {modalOpenNewEmailEdit && (
                  <ModalNewEmail
                    modalOpen={modalOpenNewEmailEdit}
                    abrirFecharModal={abrirFecharModalNewEmailEdit}
                    id={idEditEmail}
                    edit={true}
                    email={emailUser}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
export default ModalEditContact;

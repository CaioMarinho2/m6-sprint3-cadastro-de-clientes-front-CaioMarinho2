import { toast } from "react-toastify";
import api from "../../services/api";
import ModalNewPhone from "../NewPhoneModal";
import { useContext, useState } from "react";
import "./index.css";
import ModalNewEmail from "../NewEmailModal";
import ModalEditContact from "../EditContactModal";
import { userListContext } from "../../providers/userList";

function ContactCard({ id, name, emails, phones }) {
  const token = localStorage.getItem("@CadastroClientes:token");
  const {  setUserList } = useContext(userListContext);
  const UserId = localStorage.getItem("@CadastroClientes:id");
  const [modalOpenNewPhone, setModalOpenEditNewPhone] = useState(false);
  const [modalOpenNewEmail, setModalOpenEditNewEmail] = useState(false);
  const [modalOpenEditContact, setModalOpenEditContact] = useState(false);

  function abrirFecharModalEditContact() {
    setModalOpenEditContact(!modalOpenEditContact);
  }

  function abrirFecharModalNewPhone() {
    setModalOpenEditNewPhone(!modalOpenNewPhone);
  }

  function abrirFecharModalNewEmail() {
    setModalOpenEditNewEmail(!modalOpenNewEmail);
  }

  return (
    <li className="contact">
      <h3 className="contactName">{name}</h3>
      <div className="userCardContainer">
        <div>
          <h4 className="Titles">Emails</h4>
          {emails.map(({ email }, index) => {
            return (
              <p className="email" key={index}>
                {"Email"} {index + 1}: {email}
              </p>
            );
          })}
        </div>
        <div>
          <h3 className="Titles">Telefones</h3>
          {phones.map(({ phone }, index) => {
            return (
              <p className="phone" key={index}>
                {"Telefone"} {index + 1}: {phone}
              </p>
            );
          })}
        </div>
      </div>
      <div className="buttons">
        <div>
          <button
            className="buttonsContacts"
            onClick={abrirFecharModalEditContact}
          >
            Editar
          </button>
          {modalOpenEditContact && (
            <ModalEditContact
              modalOpen={modalOpenEditContact}
              abrirFecharModal={abrirFecharModalEditContact}
              id={id}
              phones={phones}
              emails={emails}
              name={name}
  
            />
          )}
          <button
            className="buttonsContacts"
            onClick={() => {
              api
                .delete(`/contacts/delete/${id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then( (response) => {
                  console.log(response);
                   
                       
                  api
                  .get(`/users/profile/${UserId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  })
                  .then((response) => {
                      setUserList(response.data.contacts);
                    console.log(response.data.contacts);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
          
  

                  
                   toast.success("Contato apagado com sucesso!");
                })
                .catch((error) => {
                  toast.error("Algo deu errado, tente novamente mais tarde!");
                  console.log(error);
                });
            }}
          >
            Apagar
          </button>
        </div>

        <button className="buttonsContacts" onClick={abrirFecharModalNewPhone}>
          Adicionar Numero
        </button>
        {modalOpenNewPhone && (
          <ModalNewPhone
            modalOpen={modalOpenNewPhone}
            abrirFecharModal={abrirFecharModalNewPhone}
            owner="contato"
            id={id}
          />
        )}
        <button className="buttonsContacts" onClick={abrirFecharModalNewEmail}>
          Adicionar Email
        </button>
        {modalOpenNewEmail && (
          <ModalNewEmail
            modalOpen={modalOpenNewEmail}
            abrirFecharModal={abrirFecharModalNewEmail}
            id={id}
          />
        )}
      </div>
    </li>
  );
}
export default ContactCard;

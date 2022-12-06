import { useEffect, useState } from "react";
import api from "../../services/api";
import ContactCard from "../ContactCard";
import ModalNewContact from "../NewContactModal";
import "./index.css";

function ListaContatos() {
  const UserId = localStorage.getItem("@CadastroClientes:id");
  const token = localStorage.getItem("@CadastroClientes:token");
  const [contactsList, setContactsList] = useState([]);
  const [modalOpenNewContact, setModalOpenEditNewContact] = useState(false);

  function abrirFecharModalNewContact() {
    setModalOpenEditNewContact(!modalOpenNewContact);
  }
  
  useEffect(() => {
    api
      .get(`/users/profile/${UserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setContactsList(response.data.contacts);
        console.log(response.data.contacts);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [UserId, token]);

  function contactsListRender() {
    if (contactsList.length === 0) {
      return <h3 className="noContacts">Você ainda não possui nenhum contato</h3>;
    }
    return (
      <ul className="contactsList">
        {contactsList.map(({ id, name, emails, phones }) => {
          return (
            <ContactCard
              key={id}
              id={id}
              name={name}
              emails={emails}
              phones={phones}
            />
          );
        })}
      </ul>
    );
  }

  return (
    <section className="sectionContacts">
      <button className="AddContatos" onClick={abrirFecharModalNewContact}>
        Adicionar um contato
      </button>
      {modalOpenNewContact && <ModalNewContact modalOpen={modalOpenNewContact} abrirFecharModal={abrirFecharModalNewContact} />}
      
      <h2 className="contactsTitle">Contatos</h2>
      {contactsListRender()}
    </section>
  );
}
export default ListaContatos;

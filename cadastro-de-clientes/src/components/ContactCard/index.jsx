import "./index.css";

function ContactCard({ id, name, emails, phones }) {
  return (
    <li className="contact">
      <h3 className="contactName">{name}</h3>
      <div>
        <div>
          <h4 className="Titles">Emails</h4>
          {emails.map(({ email }, index) => {
            return (
              <p className="email" key={id}>
                {"Email"} {index + 1}: {email}
              </p>
            );
          })}
        </div>
        <div>
          <h3 className="Titles">Telefones</h3>
          {phones.map(({ phone }, index) => {
            return (
              <p className="phone" key={id}>
                {"Telefone"} {index + 1}: {phone}
              </p>
            );
          })}
        </div>
      </div>
      <div className="buttons">
        <div>
          <button className="buttonsContacts">Editar</button>
          <button className="buttonsContacts">Apagar</button>
        </div>

        <button className="buttonsContacts">Adicionar Numero</button>
        <button className="buttonsContacts">Adicionar Email</button>
      </div>
    </li>
  );
}
export default ContactCard;

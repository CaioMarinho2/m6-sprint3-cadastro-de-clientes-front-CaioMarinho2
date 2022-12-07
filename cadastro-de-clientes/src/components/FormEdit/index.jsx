import { useContext, useEffect, useState } from "react";
import api from "../../services/api";
import "./index.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import ModalNewPhone from "../NewPhoneModal";
import { userListContext } from "../../providers/userList";

function FormEdit() {
  const UserId = localStorage.getItem("@CadastroClientes:id");
  const token = localStorage.getItem("@CadastroClientes:token");
  const [modalOpenNewPhone, setModalOpenEditNewPhone] = useState(false);
  const [modalOpenNewPhoneEdit, setModalOpenEditNewPhoneEdit] = useState(false);
  const { user, setUser } = useContext(userListContext);

  const [idEdit, setIdEdit] = useState("");
  const [phoneUser, setPhoneUser] = useState("");

  function abrirFecharModalNewPhone() {
    setModalOpenEditNewPhone(!modalOpenNewPhone);
  }

  function abrirFecharModalNewPhoneEdit() {
    setModalOpenEditNewPhoneEdit(!modalOpenNewPhoneEdit);
  }

  const history = useHistory();

  const formSchema = yup.object().shape({
    name: yup.string(),
    email: yup.string().email("Email inválido "),
    password: yup.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  function edit(newInfos) {
    console.log(newInfos);
    api
      .patch(`/users/update/${UserId}`, newInfos, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        history.push("/inicio");
        toast.success("Usuário Editado");
      })
      .catch((err) => {
        if (
          err.response.data.message === "there is no valid data to be changed"
        ) {
          return toast.error("Error,nenhum dado para ser alterado");
        }
        if (err.response.data.message === "Email already in use") {
          return toast.error("Error,email já está em uso");
        }

        return toast.error("Algo deu errado, tente novamente mais tarde");
      });
  }

  useEffect(() => {
    api
      .get(`/users/profile/${UserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [UserId, token, setUser]);
  return (
    <>
      <form className="formEdit" onSubmit={handleSubmit(edit)}>
        <div className="divLabel">
          <label className="labelFormEdit">Nome</label>
          <input
            className="editInput"
            defaultValue={user.name}
            {...register("name")}
          ></input>
          <p className="error"> {errors.name?.message}</p>
        </div>
        <div className="divLabel">
          <label className="labelFormEdit">Email</label>
          <input
            className="editInput"
            defaultValue={user.email}
            {...register("email")}
          ></input>
          <p className="error"> {errors.email?.message}</p>
        </div>
        <div className="divLabel">
          <label className="labelFormEdit">Senha</label>
          <input
            className="editInput"
            type="password"
            {...register("password")}
          ></input>
          <p className="error"> {errors.password?.message}</p>
        </div>
        <div className="editButtonContainer">
          <button className="buttonForm" type="submit">
            Confirmar edição de Perfil
          </button>
        </div>
      </form>
      <h2 className="editTelefoneArea">Editar Telefones</h2>
      {user.phones?.map(({ phone, id }, index) => {
        return (
          <div key={id} className="divLabel">
            <label className="labelFormEdit">
              {"Telefone"} {index + 1}
            </label>
            <p className="phoneEdit" key={id}>
              {phone}
            </p>
            <div>
              <button
                className="editTelefoneButton"
                onClick={() => {
                  setIdEdit(id);
                  setPhoneUser(phone);
                  abrirFecharModalNewPhoneEdit();
                }}
              >
                Editar
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
              <button
                className="deleteTelefoneButton"
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
                          setUser(response.data);
                          console.log(response.data);
                        })
                        .catch((error) => {
                          console.log(error);
                        });

                      console.log(response);
                      toast.success("Telefone apagado com sucesso!");
                    })
                    .catch((error) => {
                      toast.error(
                        "Algo deu errado, tente novamente mais tarde!"
                      );
                      console.log(error);
                    });
                }}
              >
                Deletar
              </button>
            </div>
          </div>
        );
      })}
      <button className="newTelefoneButton" onClick={abrirFecharModalNewPhone}>
        Adicionar Telefone
      </button>
      {modalOpenNewPhone && (
        <ModalNewPhone
          modalOpen={modalOpenNewPhone}
          abrirFecharModal={abrirFecharModalNewPhone}
        />
      )}
    </>
  );
}

export default FormEdit;

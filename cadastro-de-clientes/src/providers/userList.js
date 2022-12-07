import { createContext, useEffect } from "react";
import { useState } from "react";
import api from "../services/api";

export const userListContext = createContext([]);

export const UserListProvider = ({ children }) => {
  const UserId = localStorage.getItem("@CadastroClientes:id");
  const token = localStorage.getItem("@CadastroClientes:token");
  const [user, setUser] = useState({});
  const [userList, setUserList] = useState([]);

  function requisição() {
    api
      .get(`/users/profile/${UserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUserList(response.data.contacts);
        setUser(response.data)
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    return userList;
  }

  useEffect(() => {
    requisição();
  }, []);

  return (
    <userListContext.Provider value={{ userList, setUserList, user, setUser }}>
      {children}
    </userListContext.Provider>
  );
};

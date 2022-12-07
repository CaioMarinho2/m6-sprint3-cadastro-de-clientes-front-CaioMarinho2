import "./index.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

function FormLogin() {
  const formSchema = yup.object().shape({
    email: yup.string().required("Email obrigatório").email("Email inválido "),
    password: yup.string().required("Senha obrigatória"),
  });

  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  function login(userInfos) {
    api
      .post("/login/users", userInfos)
      .then((response) => {
        localStorage.setItem("@CadastroClientes:token", response.data.token);
        localStorage.setItem("@CadastroClientes:id", response.data.id);

        history.push("/inicio");
        toast.success("Bem-vindo!");
      })
      .catch((error) => {
        toast.error("Erro ao logar, Email ou Senha incorretas!");
      });
  }

  return (
    <section className="sectionLogin">
      <div className="loginFormArea">
        <form className="loginform" onSubmit={handleSubmit(login)}>
          <div className="h1Container">
            <h1 className="login">Login</h1>
          </div>
          <div className="formAreas">
            <label className="formLabel" htmlFor="email">
              Email
            </label>
            <input
              placeholder=" Digite aqui seu Email"
              id="email"
              className="formInput"
              {...register("email")}
            ></input>
            <p className="error"> {errors.email?.message}</p>
          </div>

          <div className="formAreas">
            <label className="formLabel" htmlFor="senha">
              Senha
            </label>
            <input
              type="password"
              placeholder=" Digite aqui sua Senha"
              id="senha"
              className="formInput"
              {...register("password")}
            ></input>
            <p className="error"> {errors.password?.message}</p>
          </div>

          <button className="Entrar" type="submit">
            Entrar
          </button>
        </form>
        <div>
          <p className="semConta">
            Ainda não possui uma conta? <a href="/cadastro">Cadastre-se!</a>{" "}
          </p>
        </div>
      </div>
    </section>
  );
}
export default FormLogin;

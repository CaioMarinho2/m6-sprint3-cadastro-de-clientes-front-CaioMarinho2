import "./index.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

function FormCadastro() {
  const history = useHistory();

  const formSchema = yup.object().shape({
    name: yup.string().required("nome obrigatório"),
    email: yup.string().required("Email obrigatório").email("Email inválido "),
    password: yup.string().required("Senha obrigatória"),
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

  function Cadastro(userInfos) {
    const objectRequest = {
      name: userInfos.name,
      email: userInfos.email,
      password: userInfos.password,
      phones: [userInfos.phones],
    };

    api
      .post("/users/create", objectRequest)
      .then(() => {
        toast.success("Cadastro feito com sucesso");
        history.push("/");
      })
      .catch((error) => {
        if (error.response.data.message === "Email already exists") {
          return toast.error("Email já cadastrado");
        }
        toast.error("Algo deu errado, tente novamente mais tarde");
      });
  }

  return (
    <section className="sectionCadastro">
      <div className="cadastroFormArea">
        <form className="Cadastroform" onSubmit={handleSubmit(Cadastro)}>
          <div className="h1Container">
            <h1 className="cadastro">Crie sua conta</h1>
          </div>
          <div className="formAreas">
            <label className="formLabel" htmlFor="nome">
              Nome
            </label>
            <input
              placeholder=" Digite aqui seu Nome"
              id="nome"
              className="formInput"
              {...register("name")}
            ></input>
            <p className="error"> {errors.name?.message}</p>
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

          <div className="formAreas">
            <label className="formLabel" htmlFor="senha">
              Telefone
            </label>
            <input
              placeholder=" Digite aqui seu Telefone"
              id="senha"
              className="formInput"
              {...register("phones")}
            ></input>

            <p className="error"> {errors.phones?.message}</p>
          </div>

          <button className="cadastrar" type="submit">
            Cadastrar
          </button>
        </form>
        <div>
          <p className="semConta">
            Já possui uma conta? <a href="/">Entrar!</a>{" "}
          </p>
        </div>
      </div>
    </section>
  );
}
export default FormCadastro;

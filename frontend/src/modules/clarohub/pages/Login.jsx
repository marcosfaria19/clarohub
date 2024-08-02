import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/axios";
import Button from "../../shared/components/Buttons";
import Input from "../../shared/components/Input";
import Select from "../../shared/components/Select";

function Login({ setToken }) {
  const [credencial, setCredencial] = useState("");
  const [senha, setSenha] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleCredencialChange = (e) => {
    const uppercasedValue = e.target.value.toUpperCase();
    setCredencial(uppercasedValue);
  };

  const handleSenhaChange = (e) => {
    setSenha(e.target.value);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/login", {
        LOGIN: credencial,
        senha: senha,
      });

      const token = response.data.token;
      if (typeof token === "string" && token.trim() !== "") {
        setToken(token);
        navigate("/home");
      } else {
        setLoginError("Erro ao obter o token de autenticação.");
      }
    } catch (err) {
      console.error("Login falhou", err);
      if (err.response && err.response.status === 401) {
        const message = err.response.data.message;
        if (message === "Nome de usuário ou senha inválidos") {
          setLoginError("Senha incorreta");
        } else if (
          message ===
          "Você ainda não cadastrou uma senha, registre uma senha para entrar"
        ) {
          setShowPasswordModal(true);
        }
      } else if (err.response && err.response.status === 404) {
        setLoginError(
          "Credencial não autorizada, solicitar acesso aos administradores"
        );
      } else {
        setLoginError("Erro ao realizar o login");
      }
    }
  };

  const handleRegisterSubmit = async () => {
    try {
      const response = await axiosInstance.put("/register", {
        LOGIN: credencial,
        senha: senha,
      });

      setShowPasswordModal(false);

      // Após registrar a senha, pode tentar fazer login novamente
      handleLoginSubmit({ preventDefault: () => {} });
    } catch (err) {
      console.error("Erro ao registrar senha", err);
      if (err.response && err.response.status === 401) {
        setLoginError(
          "Usuário sem permissão de acesso, solicitar ao administrador"
        );
      } else if (err.response && err.response.status === 400) {
        setLoginError("Este usuário já possui uma senha cadastrada");
      } else {
        setLoginError("Erro ao registrar a senha");
      }
    }
  };

  const handleModalClose = () => {
    setShowPasswordModal(false);
    setLoginError("");
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-base-200">
      <div className="flex w-full h-screen">
        <div className="w-1/2 login-bg flex flex-col justify-center items-center text-white text-center relative bg-cover bg-center">
          <h1 className="text-4xl font-bold">Bem vindo(a)!</h1>
          <p className="mt-2 text-lg">
            Por favor, insira suas credenciais para acessar.
          </p>
          <img
            src="claro.png"
            alt="Logo"
            className="absolute w-1/6 left-4 bottom-4"
          />
        </div>
        <div className="w-1/2 h-full flex flex-col justify-center items-center bg-[#fafafa]">
          <h1 className="font-poppins text-5xl font-bold mb-20 text-gray-900">
            Claro Hub
          </h1>
          <form className="w-full px-36" onSubmit={handleLoginSubmit}>
            <h2 className="mb-8 text-3xl font-bold text-gray-900">Login</h2>
            <div className="mb-3 relative">
              <Input
                type="text"
                className="w-full h-14"
                label="Credencial"
                value={credencial}
                onChange={handleCredencialChange}
                required
              />
            </div>
            <div className="mb-3 relative">
              <Input
                type="password"
                className="w-full h-14"
                label="Senha"
                value={senha}
                onChange={handleSenhaChange}
                required
              />
            </div>
            <div className="loginError min-h-[20px] text-left mb-2 pl-2">
              {loginError && (
                <p className="text-red-500 text-sm">{loginError}</p>
              )}
            </div>
            <Button variant="primary" className="w-full">
              Entrar
            </Button>
          </form>
        </div>
      </div>
      {/* Modal para registrar senha */}
      <div className={`modal ${showPasswordModal ? "modal-open" : ""}`}>
        <div className="modal-box">
          <div className="modal-header">
            <h2 className="text-2xl">Cadastrar senha</h2>
          </div>
          <div className="modal-body">
            <p>
              Parece ser seu primeiro acesso. Gostaria de registrar essa senha?
            </p>
          </div>
          <div className="modal-footer flex">
            <button className="btn" onClick={handleModalClose}>
              Voltar
            </button>
            <button className="btn" onClick={handleRegisterSubmit}>
              Registrar senha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

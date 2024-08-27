import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "services/axios";
import Input from "modules/shared/components/Input";
import { Button } from "modules/shared/components/ui/button";

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
          "Credencial não autorizada, solicitar acesso aos administradores",
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
          "Usuário sem permissão de acesso, solicitar ao administrador",
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
    <div className="bg-base-200 h-screen w-full overflow-hidden">
      <div className="flex h-screen w-full">
        <div className="login-bg relative flex w-1/2 flex-col items-center justify-center bg-cover bg-center text-center text-white">
          <h1 className="text-4xl font-bold">Bem vindo(a)!</h1>
          <p className="mt-2 text-lg">
            Por favor, insira suas credenciais para acessar.
          </p>
          <img
            src="claro.png"
            alt="Logo"
            className="absolute bottom-4 left-4 w-1/6"
          />
        </div>
        <div className="flex h-full w-1/2 flex-col items-center justify-center bg-[#fafafa]">
          <h1 className="font-poppins mb-20 text-5xl font-bold text-gray-900">
            Claro Hub
          </h1>
          <form className="w-full px-36" onSubmit={handleLoginSubmit}>
            <h2 className="mb-8 text-3xl font-bold text-gray-900">Login</h2>
            <div className="relative mb-3">
              <Input
                type="text"
                className="h-14 w-full"
                label="Credencial"
                value={credencial}
                onChange={handleCredencialChange}
                required
              />
            </div>
            <div className="relative mb-3">
              <Input
                type="password"
                className="h-14 w-full"
                label="Senha"
                value={senha}
                onChange={handleSenhaChange}
                required
              />
            </div>
            <div className="loginError mb-2 min-h-[20px] pl-2 text-left">
              {loginError && (
                <p className="text-sm text-red-500">{loginError}</p>
              )}
            </div>
            <Button className="w-full">Entrar</Button>
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

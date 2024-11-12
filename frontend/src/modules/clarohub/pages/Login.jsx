import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "services/axios";
import { Input } from "modules/shared/components/ui/input";
import { Button } from "modules/shared/components/ui/button";
import { Toaster, toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "modules/shared/components/ui/dialog";
import { AuthContext } from "modules/shared/contexts/AuthContext";

function Login() {
  const { setToken } = useContext(AuthContext);
  const [credencial, setCredencial] = useState("");
  const [senha, setSenha] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
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
        setToken(token); // Setando token via contexto
        navigate("/home");
      } else {
        toast.error("Erro ao obter o token de autenticação.");
      }
    } catch (err) {
      console.error("Login falhou", err);
      if (err.response && err.response.status === 401) {
        const message = err.response.data.message;
        if (message === "Nome de usuário ou senha inválidos") {
          toast.error("Senha incorreta");
        } else if (
          message ===
          "Você ainda não cadastrou uma senha, registre uma senha para entrar"
        ) {
          setShowPasswordModal(true);
        }
      } else if (err.response && err.response.status === 404) {
        toast.error(
          "Credencial não autorizada, solicitar acesso aos administradores",
        );
      } else {
        toast.error("Erro ao realizar o login");
      }
    }
  };

  const handleRegisterSubmit = async () => {
    try {
      await axiosInstance.put("/register", {
        LOGIN: credencial,
        senha: senha,
      });

      setShowPasswordModal(false);
      handleLoginSubmit({ preventDefault: () => {} });
    } catch (err) {
      console.error("Erro ao registrar senha", err);
      if (err.response && err.response.status === 401) {
        toast.error(
          "Usuário sem permissão de acesso, solicitar ao administrador",
        );
      } else if (err.response && err.response.status === 400) {
        toast.error("Este usuário já possui uma senha cadastrada");
      } else {
        toast.error("Erro ao registrar a senha");
      }
    }
  };

  const handleModalClose = () => {
    setShowPasswordModal(false);
  };

  return (
    <div className="flex h-screen w-full select-none flex-col overflow-hidden md:flex-row">
      <Toaster />
      <div className="login-bg relative flex flex-1 flex-col items-center justify-center bg-cover bg-center text-center text-foreground">
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
      <div className="flex flex-1 flex-col items-center justify-center p-4 md:p-8">
        <h1 className="font-poppins mb-8 text-3xl font-bold text-gray-900 md:text-5xl">
          Claro Hub
        </h1>
        <form className="w-full max-w-md px-4" onSubmit={handleLoginSubmit}>
          <h2 className="mb-8 text-2xl font-bold">Login</h2>
          <div className="relative mb-4">
            <Input
              floating
              variant="login"
              type="text"
              className="h-12 w-full"
              label="Credencial"
              value={credencial}
              onChange={handleCredencialChange}
              required
            />
          </div>
          <div className="relative mb-4">
            <Input
              floating
              variant="login"
              type="password"
              className="h-12 w-full"
              label="Senha"
              value={senha}
              onChange={handleSenhaChange}
              required
            />
          </div>
          <Button className="w-full py-3">Entrar</Button>
        </form>
      </div>
      {/* Modal para registrar senha */}
      <Dialog open={showPasswordModal} onOpenChange={handleModalClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar senha</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p>
              Parece ser seu primeiro acesso. Gostaria de registrar essa senha?
            </p>
          </DialogDescription>
          <DialogFooter>
            <Button variant="secondary" onClick={handleModalClose}>
              Voltar
            </Button>
            <Button variant="primary" onClick={handleRegisterSubmit}>
              Registrar senha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Login;

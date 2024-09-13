import { useState, useEffect } from "react";
import axiosInstance from "services/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "modules/shared/components/ui/dialog";
import { Button } from "modules/shared/components/ui/button";
import { Input } from "modules/shared/components/ui/input";
import { Label } from "modules/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";

const AddUsuario = ({
  show,
  handleClose,
  handleSave,
  currentItem,
  handleChange,
  isEditMode,
}) => {
  const [gestores, setGestores] = useState([]);
  const permissions = ["guest", "basic", "manager", "admin"];

  useEffect(() => {
    const fetchGestores = async () => {
      try {
        const response = await axiosInstance.get(`/users/managers`);
        setGestores(response.data);
      } catch (error) {
        console.error("Erro ao buscar gestores do backend:", error);
      }
    };

    fetchGestores();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  const handleResetPassword = async () => {
    try {
      await axiosInstance.patch(`/users/${currentItem._id}/reset-password`);
      alert("Senha resetada com sucesso!");
    } catch (error) {
      console.error("Erro ao resetar a senha:", error);
      alert("Erro ao resetar a senha.");
    }
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Usuário" : "Adicionar Usuário"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="formCredencial">Credencial</Label>
              <Input
                type="text"
                placeholder="Digite o login"
                name="LOGIN"
                value={currentItem.LOGIN}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="formNome">Nome</Label>
              <Input
                type="text"
                placeholder="Digite o nome"
                name="NOME"
                value={currentItem.NOME}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="formGestor">Gestor</Label>
              <Select
                name="GESTOR"
                value={currentItem.GESTOR}
                onValueChange={(value) =>
                  handleChange({ target: { name: "GESTOR", value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o gestor" />
                </SelectTrigger>
                <SelectContent>
                  {gestores.map((gestor, index) => (
                    <SelectItem key={index} value={gestor}>
                      {gestor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="formPermissao">Permissão</Label>
              <div className="flex gap-2">
                {permissions.map((permission) => {
                  let icon;
                  switch (permission) {
                    case "guest":
                      icon = <i className="bi bi-person-fill"></i>;
                      break;
                    case "basic":
                      icon = <i className="bi bi-person-fill"></i>;
                      break;
                    case "manager":
                      icon = <i className="bi bi-bar-chart-fill"></i>;
                      break;
                    case "admin":
                      icon = <i className="bi bi-shield-shaded"></i>;
                      break;
                    default:
                      icon = <i></i>;
                  }

                  return (
                    <Button
                      key={permission}
                      variant={
                        currentItem.PERMISSOES === permission
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        handleChange({
                          target: { name: "PERMISSOES", value: permission },
                        })
                      }
                    >
                      {icon}{" "}
                      {permission.charAt(0).toUpperCase() + permission.slice(1)}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </form>
        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSave}>
            {isEditMode ? "Salvar" : "Adicionar"}
          </Button>
          {isEditMode && (
            <Button variant="destructive" onClick={handleResetPassword}>
              Resetar Senha
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUsuario;

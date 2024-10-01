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
import { toast } from "sonner";
import { UserIcon, UserCheck, BarChart3Icon, ShieldIcon } from "lucide-react";

const AddUsuario = ({
  show,
  handleClose,
  handleSave,
  currentItem,
  handleChange,
  isEditMode,
}) => {
  const [gestores, setGestores] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState(
    currentItem.PERMISSOES || "",
  );
  const permissions = [
    { value: "guest", icon: UserIcon, color: "bg-gray-600 hover:bg-gray-700" },
    {
      value: "basic",
      icon: UserCheck,
      color: "bg-primary",
    },
    {
      value: "manager",
      icon: BarChart3Icon,
      color: "bg-destructive hover:bg-destructive/90",
    },
    {
      value: "admin",
      icon: ShieldIcon,
      color: "bg-gray-800 hover:bg-gray-900 border",
    },
  ];

  <div className="outline-"></div>;
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

  useEffect(() => {
    setSelectedPermission(currentItem.PERMISSOES || "");
  }, [currentItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  const handleResetPassword = async () => {
    try {
      await axiosInstance.patch(`/users/${currentItem._id}/reset-password`);
      toast.success("Senha resetada com sucesso!");
    } catch (error) {
      console.error("Erro ao resetar a senha:", error);
      toast.error("Erro ao resetar a senha.");
    }
  };

  const handlePermissionChange = (permission) => {
    setSelectedPermission(permission);
    handleChange({
      target: { name: "PERMISSOES", value: permission },
    });
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
              <Label htmlFor="formCredencial" className="mb-3">
                Credencial
              </Label>
              <Input
                type="text"
                placeholder="Digite o login"
                name="LOGIN"
                value={currentItem.LOGIN}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="formNome" className="mb-3">
                Nome
              </Label>
              <Input
                type="text"
                placeholder="Digite o nome"
                name="NOME"
                value={currentItem.NOME}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="formGestor" className="mb-3">
                Gestor
              </Label>
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
              <Label htmlFor="formPermissao" className="mb-3">
                Permissão
              </Label>
              <div className="mb-5 flex gap-2">
                {permissions.map((permission) => {
                  const Icon = permission.icon;
                  return (
                    <Button
                      key={permission.value}
                      type="button"
                      className={`flex-1 ${
                        selectedPermission === permission.value
                          ? `${permission.color} text-white`
                          : "bg-secondary/50 hover:bg-secondary/90"
                      }`}
                      onClick={() => handlePermissionChange(permission.value)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {permission.value.charAt(0).toUpperCase() +
                        permission.value.slice(1)}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </form>
        <DialogFooter className="flex sm:justify-between">
          {isEditMode && (
            <Button variant="destructive" onClick={handleResetPassword}>
              Resetar Senha
            </Button>
          )}
          <div className="ml-auto flex space-x-2">
            <Button type="button" onClick={handleSave}>
              {isEditMode ? "Salvar" : "Adicionar"}
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUsuario;

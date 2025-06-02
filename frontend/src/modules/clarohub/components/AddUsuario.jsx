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
import { Checkbox } from "modules/shared/components/ui/checkbox";

const AddUsuario = ({
  show,
  handleClose,
  handleSave,
  currentItem,
  handleChange,
  isEditMode,
}) => {
  const [projects, setProjects] = useState([]);
  const [gestores, setGestores] = useState([]);
  const [selectedRolesAdicionais, setSelectedRolesAdicionais] = useState(
    currentItem.ROLES_ADICIONAIS || [],
  );
  const [selectedPermission, setSelectedPermission] = useState(
    currentItem.PERMISSOES || "",
  );
  const permissions = [
    { value: "guest", icon: UserIcon, color: "bg-gray-700" },
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
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get("/flow/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    setSelectedPermission(currentItem.PERMISSOES || "");
    setSelectedRolesAdicionais(currentItem.ROLES_ADICIONAIS || []);
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
              <Label htmlFor="formProjeto" className="mb-3">
                Tipo de Projeto
              </Label>
              <Select
                name="project"
                value={currentItem.project?._id || ""}
                onValueChange={(_id) =>
                  handleChange({
                    target: {
                      name: "project",
                      value: {
                        _id,
                        name: projects.find((project) => project._id === _id)
                          ?.name,
                      },
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o projeto que está alocado" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-3">Permissões Adicionais</Label>
              <div className="flex flex-col gap-2">
                {["flow_upload"].map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox
                      id={role}
                      checked={selectedRolesAdicionais.includes(role)}
                      onCheckedChange={(checked) => {
                        const updatedRoles = checked
                          ? [...selectedRolesAdicionais, role]
                          : selectedRolesAdicionais.filter((r) => r !== role);
                        setSelectedRolesAdicionais(updatedRoles);
                        handleChange({
                          target: {
                            name: "ROLES_ADICIONAIS",
                            value: updatedRoles,
                          },
                        });
                      }}
                    />
                    <Label htmlFor={role} className="capitalize">
                      {role.replace(/_/g, " ")}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="formPermissao" className="mb-3">
                Acesso
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
                          : "bg-gray-500 hover:bg-gray-600/90"
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
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSave}>
              {isEditMode ? "Salvar" : "Adicionar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUsuario;

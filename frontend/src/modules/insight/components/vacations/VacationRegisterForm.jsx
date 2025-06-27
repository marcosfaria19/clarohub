import React, { useState, useEffect, useMemo } from "react";
import { useUsers, useManagers } from "modules/claroflow/hooks/useUsers";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";
import { Textarea } from "modules/shared/components/ui/textarea";
import { Switch } from "modules/shared/components/ui/switch";
import { Badge } from "modules/shared/components/ui/badge";
import { toast } from "sonner";
import { Save, RefreshCw, User, Calendar } from "lucide-react";
import axiosInstance from "services/axios";
import LoadingSpinner from "modules/clarospark/components/LoadingSpinner";

export default function VacationRegisterForm({
  userId = null,
  onSuccess = null,
}) {
  const {
    users,
    loading: usersLoading,
    error: usersError,
    addUserToCache,
    updateUserInCache,
    invalidateUsersCache,
  } = useUsers();

  const {
    managers,
    loading: managersLoading,
    error: managersError,
  } = useManagers();

  const [formData, setFormData] = useState({
    NOME: "",
    LOGIN: "",
    department: "",
    GESTOR: "",
    PERMISSOES: "user",
    ROLES_ADICIONAIS: [],
    active: true,
    onVacation: false,
    vacationStart: "",
    vacationEnd: "",
    vacationNotes: "",
    project: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Busca dados do usuário se estiver editando
  const currentUser = useMemo(() => {
    if (!userId || !users) return null;
    return users.find((user) => user._id === userId);
  }, [userId, users]);

  // Carrega dados do usuário no formulário quando estiver editando
  useEffect(() => {
    if (currentUser) {
      setFormData({
        NOME: currentUser.NOME || "",
        LOGIN: currentUser.LOGIN || "",
        department: currentUser.department || "",
        GESTOR: currentUser.GESTOR || "",
        PERMISSOES: currentUser.PERMISSOES || "user",
        ROLES_ADICIONAIS: currentUser.ROLES_ADICIONAIS || [],
        active: currentUser.active !== false,
        onVacation: currentUser.onVacation || false,
        vacationStart: currentUser.vacationStart || "",
        vacationEnd: currentUser.vacationEnd || "",
        vacationNotes: currentUser.vacationNotes || "",
        project: currentUser.project || null,
      });
      setIsEditing(true);
    }
  }, [currentUser]);

  // Departamentos únicos dos usuários existentes
  const departments = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];

    const uniqueDepartments = [
      ...new Set(users.map((user) => user.department).filter(Boolean)),
    ];

    return uniqueDepartments.sort();
  }, [users]);

  // Projetos únicos dos usuários existentes
  const projects = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];

    const uniqueProjects = users
      .map((user) => user.project)
      .filter(Boolean)
      .reduce((acc, project) => {
        if (!acc.find((p) => p._id === project._id)) {
          acc.push(project);
        }
        return acc;
      }, []);

    return uniqueProjects.sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRoleToggle = (role) => {
    setFormData((prev) => ({
      ...prev,
      ROLES_ADICIONAIS: prev.ROLES_ADICIONAIS.includes(role)
        ? prev.ROLES_ADICIONAIS.filter((r) => r !== role)
        : [...prev.ROLES_ADICIONAIS, role],
    }));
  };

  const validateForm = () => {
    if (!formData.NOME.trim()) {
      toast.error("Nome é obrigatório");
      return false;
    }

    if (!formData.LOGIN.trim()) {
      toast.error("Login é obrigatório");
      return false;
    }

    if (formData.onVacation) {
      if (!formData.vacationStart) {
        toast.error("Data de início das férias é obrigatória");
        return false;
      }
      if (!formData.vacationEnd) {
        toast.error("Data de fim das férias é obrigatória");
        return false;
      }
      if (new Date(formData.vacationStart) >= new Date(formData.vacationEnd)) {
        toast.error("Data de fim deve ser posterior à data de início");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submitData = { ...formData };

      // Remove campos de férias se não estiver de férias
      if (!submitData.onVacation) {
        delete submitData.vacationStart;
        delete submitData.vacationEnd;
        delete submitData.vacationNotes;
      }

      let response;

      if (isEditing) {
        // Atualizar usuário existente
        response = await axiosInstance.put(`/users/${userId}`, submitData);

        // Atualizar cache local (optimistic update)
        updateUserInCache(userId, submitData);

        toast.success("Usuário atualizado com sucesso!");
      } else {
        // Criar novo usuário
        response = await axiosInstance.post("/users", submitData);

        // Adicionar ao cache local (optimistic update)
        const newUser = { _id: response.data._id, ...submitData };
        addUserToCache(newUser);

        toast.success("Usuário cadastrado com sucesso!");

        // Limpar formulário após criação
        setFormData({
          NOME: "",
          LOGIN: "",
          department: "",
          GESTOR: "",
          PERMISSOES: "user",
          ROLES_ADICIONAIS: [],
          active: true,
          onVacation: false,
          vacationStart: "",
          vacationEnd: "",
          vacationNotes: "",
          project: null,
        });
      }

      // Revalidar cache para garantir consistência
      await invalidateUsersCache();

      // Callback de sucesso se fornecido
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);

      const errorMessage =
        error.response?.data?.message ||
        (isEditing ? "Erro ao atualizar usuário" : "Erro ao cadastrar usuário");

      toast.error(errorMessage);

      // Reverter cache em caso de erro
      if (isEditing) {
        updateUserInCache(userId, currentUser);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await invalidateUsersCache();
      toast.success("Dados atualizados!");
    } catch (error) {
      toast.error("Erro ao atualizar dados");
    }
  };

  if (usersLoading && !users.length) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (usersError) {
    return (
      <Card className="m-4">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="mb-4 text-destructive">{usersError}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {isEditing ? "Editar Usuário" : "Cadastrar Novo Usuário"}
            </CardTitle>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar Dados
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.NOME}
                  onChange={(e) => handleInputChange("NOME", e.target.value)}
                  placeholder="Digite o nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login">Login *</Label>
                <Input
                  id="login"
                  value={formData.LOGIN}
                  onChange={(e) => handleInputChange("LOGIN", e.target.value)}
                  placeholder="Digite o login"
                  required
                />
              </div>
            </div>

            {/* Departamento e Gestor */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    handleInputChange("department", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gestor">Gestor</Label>
                <Select
                  value={formData.GESTOR}
                  onValueChange={(value) => handleInputChange("GESTOR", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o gestor" />
                  </SelectTrigger>
                  <SelectContent>
                    {managersLoading ? (
                      <SelectItem value="" disabled>
                        Carregando...
                      </SelectItem>
                    ) : managersError ? (
                      <SelectItem value="" disabled>
                        Erro ao carregar gestores
                      </SelectItem>
                    ) : (
                      managers.map((manager) => (
                        <SelectItem key={manager} value={manager}>
                          {manager}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Projeto e Permissões */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="project">Projeto</Label>
                <Select
                  value={formData.project?._id || ""}
                  onValueChange={(value) => {
                    const selectedProject = projects.find(
                      (p) => p._id === value,
                    );
                    handleInputChange("project", selectedProject || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum projeto</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project._id} value={project._id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="permissoes">Permissões</Label>
                <Select
                  value={formData.PERMISSOES}
                  onValueChange={(value) =>
                    handleInputChange("PERMISSOES", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Roles Adicionais */}
            <div className="space-y-2">
              <Label>Roles Adicionais</Label>
              <div className="flex flex-wrap gap-2">
                {["supervisor", "flow_upload", "manager", "analyst"].map(
                  (role) => (
                    <Badge
                      key={role}
                      variant={
                        formData.ROLES_ADICIONAIS.includes(role)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => handleRoleToggle(role)}
                    >
                      {role}
                    </Badge>
                  ),
                )}
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    handleInputChange("active", checked)
                  }
                />
                <Label htmlFor="active">Usuário Ativo</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="onVacation"
                  checked={formData.onVacation}
                  onCheckedChange={(checked) =>
                    handleInputChange("onVacation", checked)
                  }
                />
                <Label htmlFor="onVacation">Em Férias</Label>
              </div>
            </div>

            {/* Informações de Férias */}
            {formData.onVacation && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-4 w-4" />
                    Informações de Férias
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="vacationStart">Data de Início *</Label>
                      <Input
                        id="vacationStart"
                        type="date"
                        value={formData.vacationStart}
                        onChange={(e) =>
                          handleInputChange("vacationStart", e.target.value)
                        }
                        required={formData.onVacation}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vacationEnd">Data de Fim *</Label>
                      <Input
                        id="vacationEnd"
                        type="date"
                        value={formData.vacationEnd}
                        onChange={(e) =>
                          handleInputChange("vacationEnd", e.target.value)
                        }
                        required={formData.onVacation}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vacationNotes">Observações</Label>
                    <Textarea
                      id="vacationNotes"
                      value={formData.vacationNotes}
                      onChange={(e) =>
                        handleInputChange("vacationNotes", e.target.value)
                      }
                      placeholder="Observações sobre as férias..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botões de Ação */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 md:flex-none"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Atualizando..." : "Cadastrando..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? "Atualizar Usuário" : "Cadastrar Usuário"}
                  </>
                )}
              </Button>

              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      NOME: "",
                      LOGIN: "",
                      department: "",
                      GESTOR: "",
                      PERMISSOES: "user",
                      ROLES_ADICIONAIS: [],
                      active: true,
                      onVacation: false,
                      vacationStart: "",
                      vacationEnd: "",
                      vacationNotes: "",
                      project: null,
                    });
                    setIsEditing(false);
                  }}
                >
                  Novo Usuário
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

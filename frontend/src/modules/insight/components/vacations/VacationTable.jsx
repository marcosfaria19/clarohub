import React, { useMemo, useState } from "react";

import { useUsers } from "modules/claroflow/hooks/useUsers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "modules/shared/components/ui/table";
import { Button } from "modules/shared/components/ui/button";
import { Input } from "modules/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import { Badge } from "modules/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";
import { Search, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import LoadingSpinner from "modules/clarospark/components/LoadingSpinner";

export default function VacationTable() {
  const {
    users,
    loading,
    error,

    isValidating,
    invalidateUsersCache,
  } = useUsers();

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    department: "all",
  });

  // Função para atualizar dados manualmente
  const handleRefresh = async () => {
    try {
      await invalidateUsersCache();
      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar dados");
    }
  };

  // Filtros aplicados aos usuários
  const filteredUsers = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];

    return users.filter((user) => {
      const matchesSearch =
        user.NOME?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.LOGIN?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "active" && user.active) ||
        (filters.status === "inactive" && !user.active);

      const matchesDepartment =
        filters.department === "all" || user.department === filters.department;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [users, filters]);

  // Departamentos únicos para o filtro
  const departments = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];

    const uniqueDepartments = [
      ...new Set(users.map((user) => user.department).filter(Boolean)),
    ];

    return uniqueDepartments;
  }, [users]);

  // Estatísticas dos usuários
  const stats = useMemo(() => {
    if (!users || !Array.isArray(users)) {
      return { total: 0, active: 0, onVacation: 0 };
    }

    return {
      total: users.length,
      active: users.filter((user) => user.active).length,
      onVacation: users.filter((user) => user.onVacation).length,
    };
  }, [users]);

  // Função para exportar dados
  const handleExport = () => {
    try {
      const csvContent = [
        ["Nome", "Login", "Departamento", "Status", "Férias"].join(","),
        ...filteredUsers.map((user) =>
          [
            user.NOME || "",
            user.LOGIN || "",
            user.department || "",
            user.active ? "Ativo" : "Inativo",
            user.onVacation ? "Sim" : "Não",
          ].join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `usuarios_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Dados exportados com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar dados");
    }
  };

  if (loading && !users.length) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="m-4">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="mb-4 text-destructive">{error}</p>
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
    <div className="space-y-6 p-4">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Usuários Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Em Férias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.onVacation}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles de filtro e ações */}
      <Card>
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <CardTitle>Gerenciamento de Usuários</CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={isValidating}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${isValidating ? "animate-spin" : ""}`}
                />
                Atualizar
              </Button>
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filtros */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou login..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="pl-10"
              />
            </div>

            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.department}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, department: value }))
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Departamentos</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabela */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Login</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Férias</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center">
                      {filters.search ||
                      filters.status !== "all" ||
                      filters.department !== "all"
                        ? "Nenhum usuário encontrado com os filtros aplicados."
                        : "Nenhum usuário encontrado."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        {user.NOME || "N/A"}
                      </TableCell>
                      <TableCell>{user.LOGIN || "N/A"}</TableCell>
                      <TableCell>{user.department || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={user.active ? "default" : "secondary"}>
                          {user.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.onVacation ? "destructive" : "outline"}
                        >
                          {user.onVacation ? "Sim" : "Não"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm">
                            Detalhes
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Indicador de carregamento durante revalidação */}
          {isValidating && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Atualizando dados...
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

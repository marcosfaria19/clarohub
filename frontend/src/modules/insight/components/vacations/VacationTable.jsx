import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "modules/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import { Button } from "modules/shared/components/ui/button";
import { AlertCircle } from "lucide-react";
import { formatDateRange } from "modules/insight/utils/vacationUtils";
import {
  capitalizeFirstLetters,
  formatUserName,
} from "modules/shared/utils/formatUsername";
import { useUsers } from "modules/claroflow/hooks/useUsers";
import { Badge } from "modules/shared/components/ui/badge";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";

const VacationTable = ({
  vacations = [],
  onEditVacation,
  onDeleteVacation,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [showNoVacations, setShowNoVacations] = useState(false);
  const { users, loading: usersLoading } = useUsers();

  const usersWithoutVacations = useMemo(() => {
    const vacationUserIds = new Set(vacations.map((v) => v.employeeId));
    return users.filter((user) => !vacationUserIds.has(user._id));
  }, [users, vacations]);

  const filteredVacations = useMemo(() => {
    let filtered = vacations;

    if (searchTerm) {
      filtered = filtered.filter(
        (vacation) =>
          vacation.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vacation.gestor?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (companyFilter === "procisa") {
      filtered = filtered.filter((vacation) => vacation.login?.startsWith("Z"));
    } else if (companyFilter === "claro") {
      filtered = filtered.filter(
        (vacation) => !vacation.login?.startsWith("Z"),
      );
    }

    return filtered;
  }, [vacations, searchTerm, companyFilter]);

  const displayData = useMemo(() => {
    if (showNoVacations) {
      return usersWithoutVacations.map((user) => ({
        _id: user._id,
        nome: user.NOME,
        gestor: user.GESTOR,
        login: user.LOGIN,
        noVacation: true,
      }));
    }
    return filteredVacations;
  }, [filteredVacations, usersWithoutVacations, showNoVacations]);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: "nome",
        header: "Colaborador",
        cell: ({ row }) => capitalizeFirstLetters(row.original.nome),
      },
      {
        accessorKey: "gestor",
        header: "Gestor",
        cell: ({ row }) => formatUserName(row.original.gestor),
      },
      {
        accessorKey: "login",
        header: "Empresa",
        cell: ({ row }) => (
          <Badge
            variant={row.original.login?.startsWith("Z") ? "basic" : "manager"}
          >
            {row.original.login?.startsWith("Z") ? "Procisa" : "Claro"}
          </Badge>
        ),
      },
    ];

    if (!showNoVacations) {
      baseColumns.push({
        accessorKey: "periodo",
        header: "Período",
        cell: ({ row }) =>
          row.original.noVacation
            ? "-"
            : formatDateRange(row.original.startDate, row.original.endDate),
      });
    }

    return baseColumns;
  }, [showNoVacations]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="mb-1">Férias Registradas</CardTitle>
            <CardDescription>
              Visualize e gerencie as férias dos colaboradores
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={showNoVacations ? "default" : "outline"}
              size="sm"
              onClick={() => setShowNoVacations(!showNoVacations)}
            >
              {showNoVacations ? "Mostrar Férias" : "Sem Férias"}
            </Button>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="procisa">Procisa</SelectItem>
                <SelectItem value="claro">Claro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {displayData.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <AlertCircle className="mb-2 h-10 w-10 text-muted-foreground/50" />
            <h3 className="font-medium">Nenhum registro encontrado</h3>
            <p className="text-sm text-muted-foreground">
              Tente ajustar os filtros de busca
            </p>
          </div>
        ) : (
          <TabelaPadrao
            columns={columns}
            data={displayData}
            actions
            onEdit={onEditVacation}
            onDelete={onDeleteVacation}
            filterInput={true}
            pagination={true}
            isLoading={usersLoading}
            columnFilter={false}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default VacationTable;

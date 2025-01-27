import React, { useEffect, useState } from "react";
import { Button } from "modules/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "modules/shared/components/ui/dialog";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "modules/shared/components/ui/avatar";
import {
  formatUserName,
  capitalizeFirstLetters,
} from "modules/shared/utils/formatUsername";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Badge } from "modules/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import { regionals } from "../utils/projectNames";
import { Separator } from "modules/shared/components/ui/separator";
import { useUserAssignments } from "../hooks/useUserAssignments";

export default function UserCard({
  id,
  NOME,
  GESTOR,
  avatar,
  onSave,
  assignments,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDemandas, setSelectedDemandas] = useState([]);
  const [regionalPrimaria, setRegionalPrimaria] = useState("");
  const [regionalSecundaria, setRegionalSecundaria] = useState("");
  const {
    project,
    assignments: userAssignments,
    updateAssignments,
  } = useUserAssignments(id);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDemandaToggle = (demandaId) => {
    setSelectedDemandas((prev) =>
      prev.includes(demandaId)
        ? prev.filter((id) => id !== demandaId)
        : [...prev, demandaId],
    );
  };

  // Inicializar as demandas associadas quando o modal abrir
  useEffect(() => {
    if (isModalOpen) {
      setSelectedDemandas(userAssignments.map((assignment) => assignment._id));
    }
  }, [isModalOpen, userAssignments]);

  // Função para alocar a demanda
  const handleSave = async () => {
    // Prepare the assignments data with only necessary fields
    const assignmentsData = selectedDemandas.map((demandaId) => {
      const demanda = assignments.find((a) => a._id === demandaId); // Find the assignment by ID
      return {
        _id: demanda._id, // Only the _id
        name: demanda.name, // Only the name
      };
    });

    // Chama a função do hook para atualizar os assignments
    await updateAssignments(assignmentsData);

    // Chama a função onSave, caso fornecida
    onSave?.({
      id,
      NOME,
      GESTOR,
      avatar,
      demandas: selectedDemandas,
      regionalPrimaria,
      regionalSecundaria,
    });

    handleCloseModal();
  };

  const name = formatUserName(NOME);

  return (
    <>
      <div
        className="relative h-20 w-full max-w-md cursor-pointer rounded-lg bg-card-spark p-4"
        onClick={handleCardClick}
      >
        <div className="absolute bottom-5 flex items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <h4 className="ml-3 text-sm font-semibold">{name}</h4>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[90vh] bg-card-spark sm:max-w-[600px]">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl font-semibold">
              Detalhes do Colaborador
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4 text-foreground">
            <div className="space-y-6">
              {/* Demandas Section */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Demandas Associadas</h4>
                <div className="flex flex-wrap gap-2">
                  {assignments.map((assignment) => (
                    <Badge
                      key={assignment._id}
                      className={`cursor-pointer transition-all hover:opacity-80 ${
                        selectedDemandas.includes(assignment._id)
                          ? "bg-accent opacity-100"
                          : "opacity-40"
                      }`}
                      onClick={() => handleDemandaToggle(assignment._id)}
                    >
                      {assignment.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Regionais Section */}
              <div className="m-1 grid gap-4 pb-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Regional Primária
                  </label>
                  <Select
                    value={regionalPrimaria}
                    onValueChange={setRegionalPrimaria}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a regional" />
                    </SelectTrigger>
                    <SelectContent>
                      {regionals.map((regional) => (
                        <SelectItem key={regional} value={regional}>
                          {regional}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Regional Secundária
                  </label>
                  <Select
                    value={regionalSecundaria}
                    onValueChange={setRegionalSecundaria}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a regional" />
                    </SelectTrigger>
                    <SelectContent>
                      {regionals.map((regional) => (
                        <SelectItem key={regional} value={regional}>
                          {regional}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </ScrollArea>

          <Separator />
          <DialogFooter className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4 sm:space-x-4">
              <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{name[0]}</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <p className="truncate text-sm font-semibold text-muted-foreground">
                  {capitalizeFirstLetters(NOME)}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  Gestor: {capitalizeFirstLetters(GESTOR)}
                </p>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex w-full flex-col space-y-2 sm:w-auto sm:flex-row sm:space-x-2 sm:space-y-0">
              <Button
                variant="primary"
                className="w-full sm:w-auto"
                onClick={handleSave}
              >
                Salvar
              </Button>
              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={handleCloseModal}
              >
                Fechar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

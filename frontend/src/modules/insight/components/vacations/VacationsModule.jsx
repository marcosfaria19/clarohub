import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import VacationCalendar from "./VacationCalendar";
import VacationRegisterForm from "./VacationRegisterForm";
import VacationTimeline from "./VacationTimeline";
import VacationTable from "./VacationTable";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "modules/shared/components/ui/tabs";
import { CalendarDays, List, Plus, Table as TableIcon } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import { toast } from "sonner";

import { useVacations } from "modules/insight/hooks/useVacations";
import DeleteConfirmationModal from "modules/shared/components/DeleteConfirmationModal";

const VacationsModule = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [vacationToDelete, setVacationToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    vacations,
    loading,
    scheduleVacation,
    updateVacation,
    deleteVacation,
  } = useVacations();

  const handleVacationSuccess = useCallback(() => {
    toast.success("Férias agendadas com sucesso", {
      description: "O período de férias foi registrado no sistema.",
    });
  }, []);

  const handleDeleteVacation = useCallback(async () => {
    if (!vacationToDelete) return;
    try {
      await deleteVacation(vacationToDelete._id);
      toast.success("Férias excluídas com sucesso", {
        description: "O registro de férias foi removido do sistema.",
      });
      setVacationToDelete(null);
    } catch (error) {
      toast.error("Erro ao excluir férias", {
        description: "Ocorreu um erro ao tentar excluir as férias.",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  }, [deleteVacation, vacationToDelete]);

  const handleDeleteConfirmation = useCallback((vacation) => {
    setVacationToDelete(vacation);
    setIsDeleteDialogOpen(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
    >
      <div>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestão de Férias</h1>
            <p className="text-muted-foreground">
              Gerencie e visualize as férias da equipe
            </p>
          </div>
          <VacationRegisterForm
            trigger={
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Agendar Férias
              </Button>
            }
            scheduleVacation={scheduleVacation}
            loading={loading}
            vacations={vacations}
            onSuccess={handleVacationSuccess}
          />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              Calendário
            </TabsTrigger>
            <TabsTrigger value="overview" className="gap-2">
              <List className="h-4 w-4" />
              Férias Próximas
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-2">
              <TableIcon className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              <div className="lg:col-span-3">
                <VacationTimeline vacations={vacations} loading={loading} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <VacationCalendar
              vacations={vacations}
              loading={loading}
              onUpdate={updateVacation}
              onDelete={handleDeleteConfirmation}
            />
          </TabsContent>

          <TabsContent value="table">
            <VacationTable
              vacations={vacations}
              onDeleteVacation={handleDeleteConfirmation}
            />
          </TabsContent>
        </Tabs>

        <DeleteConfirmationModal
          show={isDeleteDialogOpen}
          handleClose={() => setIsDeleteDialogOpen(false)}
          handleDeleteConfirm={handleDeleteVacation}
        />
      </div>
    </motion.div>
  );
};

export default VacationsModule;

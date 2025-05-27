import { useState } from "react";
import { motion } from "framer-motion";
import VacationCalendar from "./VacationCalendar";
import VacationForm from "./VacationForm";
import VacationBalanceCard from "./VacationBalanceCard";
import VacationTimeline from "./VacationTimeline";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "modules/shared/components/ui/tabs";
import { CalendarDays, List, Plus } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";

import { useVacations } from "modules/insight/hooks/useVacations";

const VacationsModule = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState();

  const {
    vacations,
    loading,
    error,
    scheduleVacation,
    updateVacation,
    deleteVacation,
  } = useVacations();

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
          <VacationForm
            trigger={
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Agendar Férias
              </Button>
            }
            scheduleVacation={scheduleVacation}
            loading={loading}
            vacations={vacations}
          />
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-destructive/15 p-3 text-destructive">
            {error}
          </div>
        )}

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              Calendário
            </TabsTrigger>
            <TabsTrigger value="overview" className="gap-2">
              <List className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <VacationTimeline vacations={vacations} loading={loading} />
              </div>
              <div>
                <VacationBalanceCard
                  employeeId={selectedEmployeeId}
                  onEmployeeChange={setSelectedEmployeeId}
                  vacations={vacations}
                  loading={loading}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <VacationCalendar
              vacations={vacations}
              loading={loading}
              onUpdate={updateVacation}
              onDelete={deleteVacation}
            />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default VacationsModule;

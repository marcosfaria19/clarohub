import React, { useState } from "react";
import { motion } from "framer-motion";
import VacationCalendar from "./VacationCalendar";
import VacationForm from "./VacationForm";
import VacationOverviewCard from "./VacationOverviewCard";
import VacationTimeline from "./VacationTimeline";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "modules/shared/components/ui/tabs";

import { useVacations } from "modules/insight/hooks/useVacations";

const VacationsModule = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState();

  // Use the new hook instead of the VacationContext
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
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="mb-1 text-2xl font-bold">Gestão de Férias</h2>
            <p className="text-muted-foreground">
              Visualize e gerencie as férias da equipe
            </p>
          </div>
        </div>
        <VacationForm
          className="mt-4 sm:mt-0"
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <VacationCalendar
                vacations={vacations}
                loading={loading}
                onUpdate={updateVacation}
                onDelete={deleteVacation}
              />
            </div>

            <div>
              <VacationTimeline vacations={vacations} loading={loading} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <VacationOverviewCard
              employeeId={selectedEmployeeId}
              onEmployeeChange={setSelectedEmployeeId}
              vacations={vacations}
              loading={loading}
            />

            <VacationTimeline
              limit={5}
              vacations={vacations}
              loading={loading}
            />
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default VacationsModule;

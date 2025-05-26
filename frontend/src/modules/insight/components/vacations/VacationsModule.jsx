import React, { useState } from "react";
import { motion } from "framer-motion";
import { VacationProvider } from "./VacationContext";
import VacationCalendar from "./VacationCalendar";
import VacationForm from "./VacationForm";
import VacationApprovalFlow from "./VacationApprovalFlow";
import VacationOverviewCard from "./VacationOverviewCard";
import VacationTimeline from "./VacationTimeline";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "modules/shared/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";
import { CalendarDaysIcon } from "lucide-react";

const VacationsModule = ({ className = "" }) => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(undefined);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <VacationProvider>
      <motion.div
        className={`mx-auto flex min-h-full w-full flex-col bg-background p-6 text-foreground ${className}`}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CalendarDaysIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="mb-1 text-2xl font-bold">Gestão de Férias</h2>
              <p className="text-muted-foreground">
                Visualize e gerencie as férias da equipe
              </p>
            </div>
          </div>
          <VacationForm className="mt-4 sm:mt-0" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="approval">Aprovações</TabsTrigger>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-0">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <VacationCalendar />
              </div>

              <div>
                <VacationTimeline />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="approval" className="mt-0">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <VacationApprovalFlow />

              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Aprovações</CardTitle>
                  <CardDescription>
                    Visualize o histórico de aprovações e rejeições
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-[300px] flex-col items-center justify-center text-center text-muted-foreground">
                    <p className="text-sm">Funcionalidade em desenvolvimento</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <VacationOverviewCard
                employeeId={selectedEmployeeId}
                onEmployeeChange={setSelectedEmployeeId}
              />

              <VacationTimeline limit={5} />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </VacationProvider>
  );
};

export default VacationsModule;

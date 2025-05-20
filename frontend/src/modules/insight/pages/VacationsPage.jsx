import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "modules/shared/components/ui/tabs";
import NewVacationForm from "../components/vacations/NewVacationForm";
import VacationCalendar from "../components/vacations/VacationCalendar";
import VacationList from "../components/vacations/VacationList";
import PendingVacations from "../components/vacations/PendingVacations";
import ApprovedVacations from "../components/vacations/ApprovedVacations";

const VacationsPage = () => {
  const [date, setDate] = useState(new Date());
  const [year, setYear] = useState("2024");
  const [activeTab, setActiveTab] = useState("calendar");

  // Mock data for employees
  const employees = [
    { id: 1, name: "Bruno Araujo", department: "Engineering" },
    { id: 2, name: "Daniel Silva", department: "Design" },
    { id: 3, name: "Eduardo Filho", department: "Marketing" },
    { id: 4, name: "Geovana T.", department: "HR" },
    { id: 5, name: "Isis Lopes", department: "Finance" },
    { id: 6, name: "João Pereira", department: "Engineering" },
    { id: 7, name: "Karla Mendes", department: "Product" },
    { id: 8, name: "Lucas Costa", department: "Sales" },
  ];

  // Mock data for vacations
  const [vacations, setVacations] = useState([
    {
      id: 1,
      employee: "Bruno Araujo",
      department: "Engineering",
      startDate: new Date(2024, 6, 15),
      endDate: new Date(2024, 6, 30),
      status: "approved",
      color: "bg-green-500",
      notes: "Annual leave",
    },
    {
      id: 2,
      employee: "Daniel Silva",
      department: "Design",
      startDate: new Date(2024, 7, 1),
      endDate: new Date(2024, 7, 15),
      status: "pending",
      color: "bg-yellow-500",
      notes: "Summer vacation",
    },
    {
      id: 3,
      employee: "Eduardo Filho",
      department: "Marketing",
      startDate: new Date(2024, 7, 20),
      endDate: new Date(2024, 8, 5),
      status: "approved",
      color: "bg-green-500",
      notes: "Family trip",
    },
    {
      id: 4,
      employee: "Geovana T.",
      department: "HR",
      startDate: new Date(2024, 8, 10),
      endDate: new Date(2024, 8, 25),
      status: "pending",
      color: "bg-yellow-500",
      notes: "Personal time",
    },
    {
      id: 5,
      employee: "Isis Lopes",
      department: "Finance",
      startDate: new Date(2024, 9, 1),
      endDate: new Date(2024, 9, 15),
      status: "approved",
      color: "bg-green-500",
      notes: "Conference attendance",
    },
  ]);

  const handleAddVacation = (formData) => {
    const newId =
      vacations.length > 0 ? Math.max(...vacations.map((v) => v.id)) + 1 : 1;
    const employeeData = employees.find((e) => e.name === formData.employee);

    const newVacationEntry = {
      id: newId,
      employee: formData.employee,
      department: employeeData?.department || "Not specified",
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: "pending",
      color: "bg-yellow-500",
      notes: formData.notes || "",
    };

    setVacations([...vacations, newVacationEntry]);
  };

  const handleApproveVacation = (id) => {
    setVacations(
      vacations.map((vacation) =>
        vacation.id === id
          ? { ...vacation, status: "approved", color: "bg-green-500" }
          : vacation,
      ),
    );
  };

  const handleRejectVacation = (id) => {
    setVacations(vacations.filter((vacation) => vacation.id !== id));
  };

  const getVacationsByStatus = (status) => {
    return vacations.filter((vacation) => vacation.status === status);
  };

  return (
    <div className="mx-auto flex min-h-full w-full flex-col bg-background p-10 text-foreground">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-bold">Calendário de Férias</h2>
          <p className="text-muted-foreground">
            Visualize e gerencie as férias da equipe
          </p>
        </div>
        <NewVacationForm
          employees={employees}
          onAddVacation={handleAddVacation}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <VacationCalendar
                vacations={vacations}
                date={date}
                setDate={setDate}
                year={year}
                setYear={setYear}
              />
            </div>

            <div>
              <VacationList
                vacations={vacations}
                onApprove={handleApproveVacation}
                onReject={handleRejectVacation}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PendingVacations
              vacations={getVacationsByStatus("pending")}
              onApprove={handleApproveVacation}
              onReject={handleRejectVacation}
            />
            <ApprovedVacations vacations={getVacationsByStatus("approved")} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VacationsPage;

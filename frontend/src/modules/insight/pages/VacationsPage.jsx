import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import { Button } from "modules/shared/components/ui/button";
import { CalendarIcon, UserIcon } from "lucide-react";
import { Calendar } from "modules/shared/components/ui/calendar";

const VacationsPage = () => {
  const [date, setDate] = useState(new Date());
  const [year, setYear] = useState("2024");

  // Mock data for vacations
  const vacations = [
    {
      id: 1,
      employee: "Bruno Araujo",
      startDate: new Date(2024, 6, 15),
      endDate: new Date(2024, 6, 30),
      status: "approved",
      color: "bg-primary",
    },
    {
      id: 2,
      employee: "Daniel Silva",
      startDate: new Date(2024, 7, 1),
      endDate: new Date(2024, 7, 15),
      status: "pending",
      color: "bg-warning",
    },
    {
      id: 3,
      employee: "Eduardo Filho",
      startDate: new Date(2024, 7, 20),
      endDate: new Date(2024, 8, 5),
      status: "approved",
      color: "bg-success",
    },
    {
      id: 4,
      employee: "Geovana T.",
      startDate: new Date(2024, 8, 10),
      endDate: new Date(2024, 8, 25),
      status: "pending",
      color: "bg-warning",
    },
    {
      id: 5,
      employee: "Isis Lopes",
      startDate: new Date(2024, 9, 1),
      endDate: new Date(2024, 9, 15),
      status: "approved",
      color: "bg-accent",
    },
  ];

  // Function to check if a date is within a vacation period
  const isDateInVacation = (date) => {
    const d = new Date(date).setHours(0, 0, 0, 0);
    return vacations.find(
      (vacation) =>
        d >= vacation.startDate.setHours(0, 0, 0, 0) &&
        d <= vacation.endDate.setHours(0, 0, 0, 0),
    );
  };

  // Custom day renderer for the calendar
  const renderDay = (day, _value, dayProps) => {
    const vacation = isDateInVacation(day);

    if (vacation) {
      return (
        <div
          {...dayProps}
          className={`relative ${dayProps.className} ${vacation.color} rounded-md text-primary-foreground`}
        >
          {new Date(day).getDate()}
          <div className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full bg-white"></div>
        </div>
      );
    }

    return <div {...dayProps}>{new Date(day).getDate()}</div>;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold">Calendário de Férias</h2>
        <p className="text-muted-foreground">
          Visualize e gerencie as férias da equipe
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Calendário</CardTitle>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                components={{
                  Day: renderDay,
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Férias Agendadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[500px] space-y-4 overflow-auto pr-2">
                {vacations.map((vacation) => (
                  <div
                    key={vacation.id}
                    className="rounded-lg bg-secondary p-3"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-8 w-8 rounded-full ${vacation.color} flex items-center justify-center`}
                        >
                          <UserIcon className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="font-medium text-card-foreground">
                          {vacation.employee}
                        </span>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          vacation.status === "approved"
                            ? "bg-success text-success-foreground"
                            : "bg-warning text-warning-foreground"
                        }`}
                      >
                        {vacation.status === "approved"
                          ? "Aprovado"
                          : "Pendente"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        {formatDate(vacation.startDate)} -{" "}
                        {formatDate(vacation.endDate)}
                      </span>
                    </div>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default VacationsPage;

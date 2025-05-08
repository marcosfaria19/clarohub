import { useState } from "react";
import { Calendar } from "modules/shared/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "modules/shared/components/ui/tooltip";

const VacationCalendar = ({ vacations, date, setDate, year, setYear }) => {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth().toString(),
  );

  // Function to check if a date is within a vacation period
  const getVacationsForDate = (date) => {
    if (!date) return [];
    const d = new Date(date).setHours(0, 0, 0, 0);
    return vacations.filter(
      (vacation) =>
        d >= new Date(vacation.startDate).setHours(0, 0, 0, 0) &&
        d <= new Date(vacation.endDate).setHours(0, 0, 0, 0),
    );
  };

  // Custom day renderer for the calendar
  const renderDay = (day) => {
    if (!(day instanceof Date) || isNaN(day)) return null;

    const dateVacations = getVacationsForDate(day);

    if (dateVacations.length > 0) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`relative ${dateVacations[0].color} flex h-full w-full items-center justify-center rounded-md text-white`}
              >
                {day.getDate()}
                {dateVacations.length > 1 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {dateVacations.length}
                  </span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-2">
                {dateVacations.map((vacation) => (
                  <div key={vacation.id} className="text-xs">
                    <div className="font-semibold">{vacation.employee}</div>
                    <div className="text-muted-foreground">
                      {formatDateRange(vacation.startDate, vacation.endDate)}
                    </div>
                    {vacation.notes && (
                      <div className="italic">{vacation.notes}</div>
                    )}
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return <div>{day.getDate()}</div>;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const formatDateRange = (start, end) => {
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    const newDate = new Date(date);
    newDate.setMonth(Number.parseInt(value));
    setDate(newDate);
  };

  const months = [
    { value: "0", label: "Janeiro" },
    { value: "1", label: "Fevereiro" },
    { value: "2", label: "Março" },
    { value: "3", label: "Abril" },
    { value: "4", label: "Maio" },
    { value: "5", label: "Junho" },
    { value: "6", label: "Julho" },
    { value: "7", label: "Agosto" },
    { value: "8", label: "Setembro" },
    { value: "9", label: "Outubro" },
    { value: "10", label: "Novembro" },
    { value: "11", label: "Dezembro" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Calendário</CardTitle>
        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          renderDay={renderDay}
        />
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Aprovado</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs">Pendente</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Passe o mouse sobre as datas para ver detalhes
        </div>
      </CardFooter>
    </Card>
  );
};

export default VacationCalendar;

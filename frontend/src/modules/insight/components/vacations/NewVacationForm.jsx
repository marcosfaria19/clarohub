import { useState } from "react";
import { Button } from "modules/shared/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { FormLabel } from "modules/shared/components/ui/form";
import { Input } from "modules/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "modules/shared/components/ui/popover";
import { Calendar } from "modules/shared/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "modules/shared/components/ui/dialog";
import { PlusIcon } from "lucide-react";

const NewVacationForm = ({ employees, onAddVacation }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee: "",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    notes: "",
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddVacation(formData);
    setOpen(false);
    // Reset form
    setFormData({
      employee: "",
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
      notes: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 sm:mt-0" size="sm">
          <PlusIcon className="mr-2 h-4 w-4" />
          Agendar Férias
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agendar Novas Férias</DialogTitle>
          <DialogDescription>
            Preencha os detalhes para agendar férias para um membro da equipe.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <FormLabel htmlFor="employee">Funcionário</FormLabel>
              <Select
                value={formData.employee}
                onValueChange={(value) =>
                  setFormData({ ...formData, employee: value })
                }
              >
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Selecione um funcionário" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.name}>
                      {employee.name} - {employee.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <FormLabel htmlFor="startDate">Data Inicial</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDate(formData.startDate)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) =>
                        setFormData({ ...formData, startDate: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <FormLabel htmlFor="endDate">Data Final</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDate(formData.endDate)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) =>
                        setFormData({ ...formData, endDate: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid gap-2">
              <FormLabel htmlFor="notes">Observações</FormLabel>
              <Input
                id="notes"
                placeholder="Adicione observações (opcional)"
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!formData.employee}>
              Agendar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewVacationForm;

import { useEffect, useState } from "react";
import axiosInstance from "services/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "modules/shared/components/ui/dialog";
import { Button } from "modules/shared/components/ui/button";
import { Input } from "modules/shared/components/ui/input";
import { Label } from "modules/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";

export default function AddNetFacil({
  show,
  handleClose,
  handleSave,
  currentItem,
  handleChange,
  isEditMode,
}) {
  const [sgdOptions, setSgdOptions] = useState([]);

  useEffect(() => {
    const fetchSgdOptions = async () => {
      try {
        const response = await axiosInstance.get("/netfacilsgd");
        const uniqueSgds = [
          ...new Set(response.data.map((item) => item.ID_SGD)),
        ];
        setSgdOptions(uniqueSgds);
      } catch (error) {
        console.error("Erro ao buscar dados do SGD:", error);
      }
    };
    fetchSgdOptions();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  const handleMultiSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value,
    );
    handleChange({ target: { name: e.target.name, value: selectedOptions } });
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Código" : "Adicionar Novo Código"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-3 space-y-3">
              <Label htmlFor="formId">ID</Label>
              <Input
                type="number"
                id="formId"
                name="ID"
                value={currentItem.ID}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 space-y-3">
              <Label htmlFor="formTratativa">TRATATIVA</Label>
              <Select
                name="TRATATIVA"
                value={currentItem.TRATATIVA}
                onValueChange={(value) =>
                  handleChange({ target: { name: "TRATATIVA", value } })
                }
              >
                <SelectTrigger id="formTratativa">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {["TAP", "NAP", "MDU"].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-3 space-y-3">
              <Label htmlFor="formTipo">TIPO</Label>
              <Select
                name="TIPO"
                value={currentItem.TIPO}
                onValueChange={(value) =>
                  handleChange({ target: { name: "TIPO", value } })
                }
              >
                <SelectTrigger id="formTipo">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "TP1",
                    "TP2",
                    "TP3",
                    "VT1",
                    "VT2",
                    "VT3",
                    "NP1",
                    "NP2",
                    "NP3",
                    "MD1",
                    "MD3",
                    "SAR",
                  ].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-3 space-y-3">
              <Label htmlFor="formAberturaFechamento">
                ABERTURA/FECHAMENTO
              </Label>
              <Select
                name="ABERTURA/FECHAMENTO"
                value={currentItem["ABERTURA/FECHAMENTO"]}
                onValueChange={(value) =>
                  handleChange({
                    target: { name: "ABERTURA/FECHAMENTO", value },
                  })
                }
              >
                <SelectTrigger id="formAberturaFechamento">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {["ABERTURA", "FECHAMENTO"].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-3 space-y-3">
              <Label htmlFor="formNetsms">NETSMS</Label>
              <Input
                type="text"
                id="formNetsms"
                name="NETSMS"
                value={currentItem.NETSMS}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 space-y-3">
              <Label htmlFor="formTextoPadrao">TEXTO PADRÃO</Label>
              <Input
                type="text"
                id="formTextoPadrao"
                name="TEXTO PADRAO"
                value={currentItem["TEXTO PADRAO"]}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 space-y-3">
              <Label htmlFor="formObs">OBS Obrigatório</Label>
              <Select
                name="OBS"
                value={currentItem.OBS}
                onValueChange={(value) =>
                  handleChange({ target: { name: "OBS", value } })
                }
              >
                <SelectTrigger id="formObs">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {["Sim", "Não"].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-3 space-y-3">
              <Label htmlFor="formIncidente">Incidente Obrigatório</Label>
              <Select
                name="INCIDENTE"
                value={currentItem.INCIDENTE}
                onValueChange={(value) =>
                  handleChange({ target: { name: "INCIDENTE", value } })
                }
              >
                <SelectTrigger id="formIncidente">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {["Sim", "Não"].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 mb-3 space-y-3">
              <Label htmlFor="formSgd">Fechamento SGD</Label>
              <select
                id="formSgd"
                name="SGD"
                value={currentItem.SGD || []}
                onChange={handleMultiSelectChange}
                multiple
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition duration-200 ease-in focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {sgdOptions.map((id) => (
                  <option
                    key={id}
                    value={id}
                    className="px-2 py-1 [&:checked]:bg-primary [&:checked]:text-primary-foreground [&:selected]:bg-primary"
                  >
                    {id}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
        <DialogFooter className="space-x-2">
          <Button type="submit" onClick={handleSave}>
            {isEditMode ? "Salvar" : "Adicionar"}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

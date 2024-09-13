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

const AddNetSMSFacil = ({
  show,
  handleClose,
  handleSave,
  currentItem,
  handleChange,
  isEditMode,
}) => {
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
    handleChange({
      target: {
        name: e.target.name,
        value: selectedOptions,
      },
    });
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Código" : "Adicionar Novo Código"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="formId">ID</Label>
              <Input
                type="number"
                name="ID"
                value={currentItem.ID}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="formTratativa">TRATATIVA</Label>
              <Select
                name="TRATATIVA"
                value={currentItem.TRATATIVA}
                onValueChange={(value) =>
                  handleChange({ target: { name: "TRATATIVA", value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TAP">TAP</SelectItem>
                  <SelectItem value="NAP">NAP</SelectItem>
                  <SelectItem value="MDU">MDU</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="formTipo">TIPO</Label>
              <Select
                name="TIPO"
                value={currentItem.TIPO}
                onValueChange={(value) =>
                  handleChange({ target: { name: "TIPO", value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TP1">TP1</SelectItem>
                  <SelectItem value="TP2">TP2</SelectItem>
                  <SelectItem value="TP3">TP3</SelectItem>
                  <SelectItem value="VT1">VT1</SelectItem>
                  <SelectItem value="VT2">VT2</SelectItem>
                  <SelectItem value="VT3">VT3</SelectItem>
                  <SelectItem value="NP1">NP1</SelectItem>
                  <SelectItem value="NP2">NP2</SelectItem>
                  <SelectItem value="NP3">NP3</SelectItem>
                  <SelectItem value="MD1">MD1</SelectItem>
                  <SelectItem value="MD3">MD3</SelectItem>
                  <SelectItem value="SAR">SAR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
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
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ABERTURA">ABERTURA</SelectItem>
                  <SelectItem value="FECHAMENTO">FECHAMENTO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="formNetsms">NETSMS</Label>
              <Input
                type="text"
                name="NETSMS"
                value={currentItem.NETSMS}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="formTextoPadrao">TEXTO PADRÃO</Label>
              <Input
                type="text"
                name="TEXTO PADRAO"
                value={currentItem["TEXTO PADRAO"]}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="formObs">OBS Obrigatório</Label>
              <Select
                name="OBS"
                value={currentItem.OBS}
                onValueChange={(value) =>
                  handleChange({ target: { name: "OBS", value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sim">Sim</SelectItem>
                  <SelectItem value="Não">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="formIncidente">Incidente Obrigatório</Label>
              <Select
                name="INCIDENTE"
                value={currentItem.INCIDENTE}
                onValueChange={(value) =>
                  handleChange({ target: { name: "INCIDENTE", value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sim">Sim</SelectItem>
                  <SelectItem value="Não">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="formSgd">Fechamento SGD</Label>
              <select
                name="SGD"
                value={currentItem.SGD || []}
                onChange={handleMultiSelectChange}
                multiple
                className="w-full rounded-md border border-gray-300 p-2"
              >
                {sgdOptions.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSave}>
            {isEditMode ? "Salvar" : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNetSMSFacil;

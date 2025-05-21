import React from "react";
import { Input } from "modules/shared/components/ui/input";
import { Button } from "modules/shared/components/ui/button";
import { Label } from "modules/shared/components/ui/label";
import { CheckIcon, BookOpenCheck } from "lucide-react";

export default function StepInserirCodigo({
  currentStep,
  codigo,
  setCodigo,
  codigoErro,
  setCodigoErro,
  data,
  setFormData,
  setItem,
  setShowIncidenteField,
  setShowObservacaoField,
  setCurrentStep,
  setTabelaConsulta,
}) {
  if (currentStep !== 0) return null;

  const handleCodigoSubmit = () => {
    const foundItem = data.find((item) => item.ID === codigo);
    if (foundItem) {
      setFormData({
        tratativa: foundItem.TRATATIVA,
        tipo: foundItem.TIPO,
        aberturaFechamento: foundItem["ABERTURA/FECHAMENTO"],
        netSMS: foundItem.NETSMS,
        textoPadrao: foundItem["TEXTO PADRAO"],
        incidente: "",
        observacao: "",
      });
      setItem(foundItem);
      setShowIncidenteField(foundItem.INCIDENTE === "Sim");
      setShowObservacaoField(foundItem.OBS === "Sim");
      setCodigoErro(false);
      setCurrentStep(1);
    } else {
      setCodigo("");
      setCodigoErro(true);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-start space-y-4">
      <div className="w-full max-w-xs">
        <Label htmlFor="codigo" className="mb-2 block">
          Código
        </Label>
        <div className="flex gap-2">
          <Input
            id="codigo"
            className={`${codigoErro ? "border-destructive" : ""} w-[120px] flex-1`}
            placeholder="Exemplo: 123"
            value={codigo}
            maxLength={3}
            onChange={(e) => {
              setCodigo(e.target.value);
              setCodigoErro(false);
            }}
          />
          <Button onClick={handleCodigoSubmit} size="icon">
            <CheckIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full max-w-xs text-foreground/60 hover:bg-secondary"
        onClick={() => setTabelaConsulta(true)}
      >
        <BookOpenCheck className="mr-2 h-4 w-4" />
        Consultar Tabela
      </Button>
      <Button
        variant="secondary"
        className="w-full max-w-xs"
        onClick={() => setCurrentStep(1)}
      >
        Escolher manualmente
      </Button>
    </div>
  );
}

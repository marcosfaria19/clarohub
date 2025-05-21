import React from "react";
import { Input } from "modules/shared/components/ui/input";
import { Button } from "modules/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import { Loader2, Zap, ArrowRight } from "lucide-react";

export default function StepPreencherDados({
  currentStep,
  formData,
  setFormData,
  data,
  getOptions,
  findItem,
  showIncidenteField,
  showObservacaoField,
  setShowIncidenteField,
  setShowObservacaoField,
  userName,
  gestor,
  setTextoPadraoConcatenado,
  setItem,
  setCurrentStep,
  isLoading,
  setIsLoading,
}) {
  if (currentStep !== 1) return null;

  const handleTextoPadraoChange = (value) => {
    setFormData({ ...formData, textoPadrao: value });

    const item = findItem({ ...formData, textoPadrao: value });
    if (item) {
      setShowIncidenteField(item.INCIDENTE === "Sim");
      setShowObservacaoField(item.OBS === "Sim");
    } else {
      setShowIncidenteField(false);
      setShowObservacaoField(false);
    }
  };

  const handleGenerateText = () => {
    setIsLoading(true);
    const item = findItem(formData);
    if (item) {
      let texto = `${item.ID} - ${formData.textoPadrao} ${formData.incidente}`;
      if (formData.observacao.trim()) texto += `\nOBS: ${formData.observacao}`;
      texto += `\n\n${userName} // ${gestor}`;
      setTextoPadraoConcatenado(texto);
      setItem(item);
      navigator.clipboard.writeText(texto);
      setCurrentStep(2);
    }
    setIsLoading(false);
  };

  const removerAcentos = (event) => {
    const value = event.target.value
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Z0-9\s]/g, "");
    setFormData({ ...formData, observacao: value });
  };

  return (
    <div className="flex flex-col space-y-4">
      <Select
        value={formData.tratativa}
        onValueChange={(value) =>
          setFormData({ ...formData, tratativa: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Tratativa" />
        </SelectTrigger>
        <SelectContent>
          {getOptions("TRATATIVA").map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={formData.tipo}
        onValueChange={(value) => setFormData({ ...formData, tipo: value })}
        disabled={!formData.tratativa}
      >
        <SelectTrigger>
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          {[
            ...new Set(
              data
                .filter((d) => d.TRATATIVA === formData.tratativa)
                .map((d) => d.TIPO),
            ),
          ].map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={formData.aberturaFechamento}
        onValueChange={(value) =>
          setFormData({ ...formData, aberturaFechamento: value })
        }
        disabled={!formData.tipo}
      >
        <SelectTrigger>
          <SelectValue placeholder="Abertura/Fechamento" />
        </SelectTrigger>
        <SelectContent>
          {[
            ...new Set(
              data
                .filter(
                  (d) =>
                    d.TRATATIVA === formData.tratativa &&
                    d.TIPO === formData.tipo,
                )
                .map((d) => d["ABERTURA/FECHAMENTO"]),
            ),
          ].map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={formData.netSMS}
        onValueChange={(value) => setFormData({ ...formData, netSMS: value })}
        disabled={!formData.aberturaFechamento}
      >
        <SelectTrigger>
          <SelectValue placeholder="NetSMS" />
        </SelectTrigger>
        <SelectContent>
          {[
            ...new Set(
              data
                .filter(
                  (d) =>
                    d.TRATATIVA === formData.tratativa &&
                    d.TIPO === formData.tipo &&
                    d["ABERTURA/FECHAMENTO"] === formData.aberturaFechamento,
                )
                .map((d) => d.NETSMS),
            ),
          ].map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={formData.textoPadrao}
        onValueChange={handleTextoPadraoChange}
        disabled={!formData.netSMS}
      >
        <SelectTrigger>
          <SelectValue placeholder="Texto Padrão" />
        </SelectTrigger>
        <SelectContent>
          {[
            ...new Set(
              data
                .filter(
                  (d) =>
                    d.TRATATIVA === formData.tratativa &&
                    d.TIPO === formData.tipo &&
                    d["ABERTURA/FECHAMENTO"] === formData.aberturaFechamento &&
                    d.NETSMS === formData.netSMS,
                )
                .map((d) => d["TEXTO PADRAO"]),
            ),
          ].map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showIncidenteField && (
        <Input
          placeholder="ID/Incidente"
          value={formData.incidente}
          onChange={(e) =>
            setFormData({ ...formData, incidente: e.target.value })
          }
        />
      )}
      <Input
        placeholder={showObservacaoField ? "Observação" : "Opcional"}
        value={formData.observacao}
        onChange={removerAcentos}
      />
      <Button
        onClick={handleGenerateText}
        className="mt-6 w-full gap-2"
        size="lg"
        disabled={
          !formData.textoPadrao ||
          (showIncidenteField && !formData.incidente.trim()) ||
          (showObservacaoField && !formData.observacao.trim()) ||
          isLoading
        }
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Zap className="h-5 w-5" />
        )}
        Gerar e copiar texto
        <ArrowRight className="ml-auto h-5 w-5" />
      </Button>
    </div>
  );
}

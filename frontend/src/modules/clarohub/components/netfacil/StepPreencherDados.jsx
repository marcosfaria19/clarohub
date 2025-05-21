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
import { Loader2, Zap, ArrowRight, ClipboardPenIcon } from "lucide-react";

export default function StepPreencherDados({
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
      <div className="mb-4 flex gap-2 self-start">
        <ClipboardPenIcon className="h-6 w-6 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Preencher Dados
        </h2>
      </div>
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
          placeholder="Insira o ID/Incidente"
          value={formData.incidente}
          className={
            showIncidenteField && !formData.incidente
              ? "ring-2 ring-primary"
              : ""
          }
          onChange={(e) =>
            setFormData({ ...formData, incidente: e.target.value })
          }
        />
      )}
      <Input
        placeholder={
          showObservacaoField ? "Insira uma observação" : "Observação opcional"
        }
        value={formData.observacao}
        className={
          showObservacaoField && !formData.observacao
            ? "ring-2 ring-primary"
            : ""
        }
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
          <Zap className="h-5 w-5 animate-pulse" />
        )}
        Gerar e copiar texto
        <ArrowRight className="absolute right-10 h-5 w-5 animate-pulse" />
      </Button>
    </div>
  );
}

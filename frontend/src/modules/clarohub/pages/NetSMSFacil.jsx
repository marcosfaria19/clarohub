import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "modules/shared/components/ui/button";
import { Card, CardContent } from "modules/shared/components/ui/card";
import { Textarea } from "modules/shared/components/ui/textarea";
import {
  Loader2,
  FileIcon,
  Sparkles,
  ArrowRight,
  Copy,
  UploadCloud,
  Atom,
  Zap,
  CheckCircle2,
  Hexagon,
  RefreshCw,
  BookOpenCheck,
  CheckIcon,
  CopyIcon,
  RotateCcwIcon,
  Hash,
  ClipboardPen,
} from "lucide-react";
import axiosInstance from "services/axios";
import { toast } from "sonner";
import Container from "modules/shared/components/ui/container";
import appHeaderInfo from "modules/shared/utils/appHeaderInfo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import { Input } from "modules/shared/components/ui/input";
import TabelaNetFacil from "modules/clarohub/components/TabelaNetFacil";
import { Label } from "modules/shared/components/ui/label";
import TabelaFechamentoSGD from "../components/TabelaFechamentoSGD";

export default function NetSMSFacil({ userName, gestor }) {
  const [data, setData] = useState([]);
  const [tratativa, setTratativa] = useState("");
  const [tipo, setTipo] = useState("");
  const [aberturaFechamento, setAberturaFechamento] = useState("");
  const [netSMS, setNetSMS] = useState("");
  const [textoPadrao, setTextoPadrao] = useState("");
  const [textoPadraoConcatenado, setTextoPadraoConcatenado] = useState("");
  const [codigo, setCodigo] = useState("");
  const [observacao, setObservacao] = useState("");
  const [incidente, setIncidente] = useState("");
  const [showIncidenteField, setShowIncidenteField] = useState(false);
  const [showObservacaoField, setShowObservacaoField] = useState(false);
  const [tabelaConsulta, setTabelaConsulta] = useState(false);
  const [codigoErro, setCodigoErro] = useState(false);
  const [item, setItem] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/netsmsfacil");
        setData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast.error("Falha ao carregar dados. Por favor, tente novamente.");
      }
    };
    fetchData();
  }, []);

  const getOptions = (field) => {
    return Array.from(new Set(data.map((item) => item[field]))).filter(Boolean);
  };

  const handleReset = () => {
    setTratativa("");
    setTipo("");
    setAberturaFechamento("");
    setNetSMS("");
    setTextoPadrao("");
    setCodigo("");
    setIncidente("");
    setObservacao("");
    setTextoPadraoConcatenado("");
    setShowIncidenteField(false);
    setShowObservacaoField(false);
    setCodigoErro(false);
    setItem(null);
    setCurrentStep(0);
  };

  const handleGenerateText = () => {
    setIsLoading(true);
    const selectedItem = data.find(
      (item) =>
        item.TRATATIVA === tratativa &&
        item.TIPO === tipo &&
        item["ABERTURA/FECHAMENTO"] === aberturaFechamento &&
        item.NETSMS === netSMS &&
        item["TEXTO PADRAO"] === textoPadrao,
    );

    if (selectedItem) {
      let textoPadraoConcatenado = `${selectedItem.ID} - ${textoPadrao} ${incidente}`;
      if (observacao.trim()) {
        textoPadraoConcatenado += `\nOBS: ${observacao}`;
      }
      textoPadraoConcatenado += `\n\n${userName} // ${gestor}`;

      setTextoPadraoConcatenado(textoPadraoConcatenado);
      toast.success("Texto copiado para a área de transferência.");
      navigator.clipboard.writeText(textoPadraoConcatenado);
      setCurrentStep(2);
    }
    setIsLoading(false);
  };

  const handleTextoPadraoChange = (value) => {
    setTextoPadrao(value);

    const item = data.find((item) => item["TEXTO PADRAO"] === value);
    if (item) {
      setShowIncidenteField(item.INCIDENTE === "Sim");
      setShowObservacaoField(item.OBS === "Sim");
    } else {
      setShowIncidenteField(false);
      setShowObservacaoField(false);
    }
  };

  const handleCodigoSubmit = () => {
    handleReset();
    const foundItem = data.find((item) => item.ID === codigo);
    if (foundItem) {
      setCodigo(codigo);
      setItem(foundItem);
      setTratativa(foundItem.TRATATIVA);
      setTipo(foundItem.TIPO);
      setAberturaFechamento(foundItem["ABERTURA/FECHAMENTO"]);
      setNetSMS(foundItem.NETSMS);
      setTextoPadrao(foundItem["TEXTO PADRAO"]);
      setShowIncidenteField(foundItem.INCIDENTE === "Sim");
      setShowObservacaoField(foundItem.OBS === "Sim");
      setCodigoErro(false);
      setCurrentStep(1);
    } else {
      setCodigo("");
      setCodigoErro(true);
      toast.error("Código incorreto");
    }
  };

  const abrirTabelaConsulta = () => {
    setTabelaConsulta(true);
  };

  const fecharTabelaConsulta = () => {
    setTabelaConsulta(false);
  };

  const removerAcentos = (event) => {
    const value = event.target.value
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Z0-9\s]/g, "");
    setObservacao(value);
  };

  return (
    <Container>
      <div className="relative mb-11 text-center">
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-primary/30 blur-3xl"></div>
        <img
          src={appHeaderInfo["/netfacil"].icon}
          alt="Net SMS Fácil Icon"
          className="mx-auto mb-6 h-20 w-20 text-primary"
        />
        <h1 className="relative text-4xl font-bold tracking-tight text-foreground">
          Net SMS Fácil
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Gerador de texto padrão para Net SMS
        </p>
      </div>

      <Card className="relative mx-auto mb-12 max-w-full overflow-hidden border-primary/20 bg-background/50 shadow-2xl backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-card/15"></div>

        <CardContent className="relative p-8">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: 0, title: "Inserir Código", icon: Hash },
              { step: 1, title: "Preencher Dados", icon: ClipboardPen },
              { step: 2, title: "Resultado", icon: Sparkles },
            ].map(({ step, title, icon: Icon }) => (
              <div
                key={step}
                className={`flex flex-1 transform flex-col transition-all duration-500 ${
                  currentStep === step ? "opacity-100" : "opacity-50"
                }`}
              >
                <div className="relative flex h-full flex-col rounded-xl border-2 border-primary/40 bg-card/70 p-6 backdrop-blur-sm">
                  <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary),0.1),rgba(255,255,255,0))]"></div>

                  <div className="mb-4 flex items-center gap-2">
                    <Icon className="h-6 w-6 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">
                      {title}
                    </h2>
                  </div>

                  {step === 0 && (
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
                        onClick={abrirTabelaConsulta}
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
                  )}

                  {step === 1 && (
                    <div className="flex flex-1 flex-col space-y-4">
                      <Select value={tratativa} onValueChange={setTratativa}>
                        <SelectTrigger id="tratativa">
                          <SelectValue placeholder="Selecione a Tratativa" />
                        </SelectTrigger>
                        <SelectContent>
                          {getOptions("TRATATIVA").map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={tipo}
                        onValueChange={setTipo}
                        disabled={!tratativa}
                      >
                        <SelectTrigger id="tipo">
                          <SelectValue placeholder="Selecione o Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {getOptions("TIPO")
                            .filter((option) =>
                              data.some(
                                (item) =>
                                  item.TRATATIVA === tratativa &&
                                  item.TIPO === option,
                              ),
                            )
                            .map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={aberturaFechamento}
                        onValueChange={setAberturaFechamento}
                        disabled={!tipo}
                      >
                        <SelectTrigger id="aberturaFechamento">
                          <SelectValue placeholder="Selecione Abertura/Fechamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {getOptions("ABERTURA/FECHAMENTO")
                            .filter((option) =>
                              data.some(
                                (item) =>
                                  item.TRATATIVA === tratativa &&
                                  item.TIPO === tipo &&
                                  item["ABERTURA/FECHAMENTO"] === option,
                              ),
                            )
                            .map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={netSMS}
                        onValueChange={setNetSMS}
                        disabled={!aberturaFechamento}
                      >
                        <SelectTrigger id="netsms">
                          <SelectValue placeholder="Selecione NetSMS" />
                        </SelectTrigger>
                        <SelectContent>
                          {getOptions("NETSMS")
                            .filter((option) =>
                              data.some(
                                (item) =>
                                  item.TRATATIVA === tratativa &&
                                  item.TIPO === tipo &&
                                  item["ABERTURA/FECHAMENTO"] ===
                                    aberturaFechamento &&
                                  item.NETSMS === option,
                              ),
                            )
                            .map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={textoPadrao}
                        onValueChange={handleTextoPadraoChange}
                        disabled={!netSMS}
                      >
                        <SelectTrigger id="textoPadrao">
                          <SelectValue placeholder="Selecione o Texto Padrão" />
                        </SelectTrigger>
                        <SelectContent>
                          {getOptions("TEXTO PADRAO")
                            .filter((option) =>
                              data.some(
                                (item) =>
                                  item.TRATATIVA === tratativa &&
                                  item.TIPO === tipo &&
                                  item["ABERTURA/FECHAMENTO"] ===
                                    aberturaFechamento &&
                                  item.NETSMS === netSMS &&
                                  item["TEXTO PADRAO"] === option,
                              ),
                            )
                            .map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      {showIncidenteField && (
                        <Input
                          id="incidente"
                          type="text"
                          autoComplete="off"
                          value={incidente}
                          onChange={(e) => setIncidente(e.target.value)}
                          className={
                            showIncidenteField && !incidente
                              ? "ring-2 ring-primary"
                              : ""
                          }
                          placeholder="Insira o número do incidente"
                        />
                      )}

                      <Input
                        id="observacao"
                        type="text"
                        value={observacao}
                        onChange={removerAcentos}
                        className={
                          showObservacaoField && !observacao
                            ? "ring-2 ring-primary"
                            : ""
                        }
                        placeholder={
                          showObservacaoField
                            ? "Insira sua observação"
                            : "Opcional"
                        }
                      />

                      <Button
                        onClick={handleGenerateText}
                        className="relative mt-6 w-full gap-2"
                        size="lg"
                        disabled={
                          !textoPadrao ||
                          (showIncidenteField && !incidente.trim()) ||
                          (showObservacaoField && !observacao.trim()) ||
                          isLoading
                        }
                      >
                        {isLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <Zap className="h-5 w-5" />
                            Gerar e copiar texto
                          </>
                        )}
                        <ArrowRight className="absolute right-4 h-5 w-5 animate-pulse" />
                      </Button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="flex flex-1 flex-col items-center justify-center">
                      {textoPadraoConcatenado ? (
                        <div className="mt-8 flex w-full flex-col items-center gap-6 text-center text-sm">
                          <CheckCircle2 className="h-16 w-16 text-green-600" />
                          <span className="flex items-center gap-2 font-semibold text-green-600">
                            <span>
                              <strong>Sucesso! </strong>
                              <br /> Dados copiados para a área de transferência
                            </span>
                          </span>

                          <Textarea
                            readOnly
                            className="h-40 w-full resize-none text-sm"
                            value={textoPadraoConcatenado}
                          />

                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => {
                              navigator.clipboard
                                .writeText(textoPadraoConcatenado)
                                .then(() => {
                                  toast.success(
                                    "Texto copiado para a área de transferência com sucesso.",
                                  );
                                })
                                .catch((error) => {
                                  toast.error(
                                    "Falha ao copiar o texto para a área de transferência.",
                                  );
                                });
                            }}
                          >
                            <Copy className="h-4 w-4" />
                            Copiar novamente
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center">
                          <Sparkles className="mb-4 h-16 w-16 text-primary" />
                          <p className="text-sm text-muted-foreground">
                            Aguardando dados processados...
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            {[0, 1, 2].map((step) => (
              <Hexagon
                key={step}
                className={`mx-1 h-4 w-4 transition-all ${
                  currentStep >= step
                    ? "fill-primary text-primary"
                    : "text-primary/20"
                }`}
              />
            ))}
          </div>

          {currentStep === 2 && textoPadraoConcatenado && (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleReset}
                className="gap-2"
                variant="outline"
                size="lg"
              >
                <RefreshCw className="h-5 w-5" />
                Iniciar Nova Geração
              </Button>
            </div>
          )}

          <TabelaNetFacil
            isOpen={tabelaConsulta}
            onRequestClose={fecharTabelaConsulta}
          />
        </CardContent>
      </Card>
    </Container>
  );
}

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import { Button } from "modules/shared/components/ui/button";
import { Input } from "modules/shared/components/ui/input";
import axiosInstance from "services/axios";
import { toast } from "sonner";
import Container from "modules/shared/components/ui/container";
import { CheckIcon, CopyIcon, RotateCcwIcon } from "lucide-react";
import TabelaNetFacil from "modules/clarohub/components/TabelaNetFacil";
import { Label } from "modules/shared/components/ui/label";
import TabelaFechamentoSGD from "../components/TabelaFechamentoSGD";
import { Textarea } from "modules/shared/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/netsmsfacil");
        setData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
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
  };

  const handleGenerateText = () => {
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
    }
  };

  const handleTextoPadraoChange = (value) => {
    setTextoPadrao(value);

    const item = data.find((item) => item["TEXTO PADRAO"] === value);
    console.log(item);
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
      <Card>
        <CardHeader>Net Fácil</CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex w-20 flex-col">
                <Input
                  className={`w-full ${codigoErro ? "border-destructive" : ""}`}
                  placeholder="Código"
                  value={codigo}
                  maxLength={3}
                  onChange={(e) => {
                    setCodigo(e.target.value);
                    setCodigoErro(false);
                  }}
                />
              </div>

              <Button onClick={handleCodigoSubmit}>
                <CheckIcon className="w-4" />
              </Button>
            </div>

            <Button
              variant="secondary"
              className="h-10 w-12"
              onClick={abrirTabelaConsulta}
            >
              <span className="text-lg font-normal">?</span>
            </Button>
          </div>

          <TabelaNetFacil
            isOpen={tabelaConsulta}
            onRequestClose={fecharTabelaConsulta}
          />
          <Label htmlFor="tratativa" className="mb-3 mt-5">
            Tratativa
          </Label>
          <Select value={tratativa} onValueChange={setTratativa}>
            <SelectTrigger>
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

          <Label htmlFor="tipo" className="mb-3 mt-5">
            Tipo
          </Label>
          <Select value={tipo} onValueChange={setTipo} disabled={!tratativa}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o Tipo" />
            </SelectTrigger>
            <SelectContent>
              {getOptions("TIPO")
                .filter((option) =>
                  data.some(
                    (item) =>
                      item.TRATATIVA === tratativa && item.TIPO === option,
                  ),
                )
                .map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Label htmlFor="aberturaFechamento" className="mb-3 mt-5">
            Abertura/Fechamento
          </Label>
          <Select
            value={aberturaFechamento}
            onValueChange={setAberturaFechamento}
            disabled={!tipo}
          >
            <SelectTrigger>
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

          <Label htmlFor="netsms" className="mb-3 mt-5">
            NetSMS
          </Label>
          <Select
            value={netSMS}
            onValueChange={setNetSMS}
            disabled={!aberturaFechamento}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione NetSMS" />
            </SelectTrigger>
            <SelectContent>
              {getOptions("NETSMS")
                .filter((option) =>
                  data.some(
                    (item) =>
                      item.TRATATIVA === tratativa &&
                      item.TIPO === tipo &&
                      item["ABERTURA/FECHAMENTO"] === aberturaFechamento &&
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

          <Label htmlFor="textoPadrao" className="mb-3 mt-5">
            Texto Padrão
          </Label>
          <Select
            value={textoPadrao}
            onValueChange={handleTextoPadraoChange}
            disabled={!netSMS}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o Texto Padrão" />
            </SelectTrigger>
            <SelectContent>
              {getOptions("TEXTO PADRAO")
                .filter((option) =>
                  data.some(
                    (item) =>
                      item.TRATATIVA === tratativa &&
                      item.TIPO === tipo &&
                      item["ABERTURA/FECHAMENTO"] === aberturaFechamento &&
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
            <>
              <Label htmlFor="incidente" className="mb-2 mt-4">
                Incidente
              </Label>
              <Input
                type="text"
                value={incidente}
                onChange={(e) => setIncidente(e.target.value)}
                className={
                  showIncidenteField && !incidente ? "ring-1 ring-primary" : ""
                }
                placeholder="Por favor insira um incidente"
              />
            </>
          )}

          <Label htmlFor="observacao" className="mb-2 mt-4">
            Observação
          </Label>
          <Input
            type="text"
            value={observacao}
            onChange={removerAcentos}
            className={
              showObservacaoField && !observacao ? "ring-1 ring-primary" : ""
            }
            placeholder={
              showObservacaoField ? "Por favor insira uma observação" : ""
            }
          />

          <div className="mt-4 flex space-x-2">
            <Button
              onClick={handleGenerateText}
              disabled={
                !textoPadrao ||
                (showIncidenteField && !incidente.trim()) ||
                (showObservacaoField && !observacao.trim())
              }
            >
              <CopyIcon className="mr-2 w-4" />
              Gerar e copiar texto
            </Button>
            <Button onClick={handleReset} variant="destructive">
              <RotateCcwIcon className="mr-2 w-4" />
              Reiniciar
            </Button>
          </div>

          {textoPadraoConcatenado && (
            <>
              <TabelaFechamentoSGD item={item} />
              <div className="mt-10">
                <p className="mb-5 font-semibold">Texto Padrão:</p>
                <Textarea
                  className="h-40 overflow-hidden"
                  value={textoPadraoConcatenado}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

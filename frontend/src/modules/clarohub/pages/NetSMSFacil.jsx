import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import TabelaNetFacil from "modules/clarohub/components/TabelaNetFacil";
import axiosInstance from "services/axios";
import { Button } from "modules/shared/components/ui/button";
import { Input } from "modules/shared/components/ui/input";
import { Label } from "modules/shared/components/ui/label";
import { Select } from "modules/shared/components/ui/select";
import { Textarea } from "modules/shared/components/ui/textarea";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "modules/shared/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "modules/shared/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";
import {
  CheckIcon,
  MessageCircleQuestionIcon,
  RefreshCcwIcon,
} from "lucide-react";
import Container from "modules/shared/components/ui/container";

const NetSMSFacil = () => {
  const [data, setData] = useState([]);
  const [showIncidenteField, setShowIncidenteField] = useState(false);
  const [showObservacaoField, setShowObservacaoField] = useState(false);
  const [concatenatedText, setConcatenatedText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [tabelaConsulta, setTabelaConsulta] = useState(false);
  const [sgdData, setSgdData] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      codigo: "",
      tratativa: "",
      tipo: "",
      aberturaFechamento: "",
      netsms: "",
      textoPadrao: "",
      incidente: "",
      observacao: "",
    },
  });

  const watchAllFields = watch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/netsmsfacil`);
        setData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, []);

  const findSelectedItem = (codigo) => {
    const codigoNumber = String(codigo);
    return data.find((item) => String(item.ID) === codigoNumber);
  };

  const handleCodigoSubmit = () => {
    const item = findSelectedItem(watchAllFields.codigo);
    if (item) {
      reset({
        codigo: watchAllFields.codigo,
        tratativa: item.TRATATIVA,
        tipo: item.TIPO,
        aberturaFechamento: item["ABERTURA/FECHAMENTO"],
        netsms: item.NETSMS,
        textoPadrao: `${item.ID} - ${item["TEXTO PADRAO"]}`,
      });
      setShowIncidenteField(item.INCIDENTE === "Sim");
      setShowObservacaoField(item.OBS === "Sim");
    } else {
      reset();
    }
  };

  const removerAcentos = (value) => {
    return value
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Z0-9\s]/g, "");
  };

  const onSubmit = async (formData) => {
    const item = findSelectedItem(formData.codigo);
    if (item) {
      let textoPadraoConcatenado = formData.textoPadrao;
      const usuarioAtual = localStorage.getItem("userName");
      const nomeGestor = localStorage.getItem("gestor");

      textoPadraoConcatenado += formData.incidente
        ? ` ${formData.incidente}`
        : "";
      textoPadraoConcatenado += formData.observacao
        ? `\nOBS: ${formData.observacao}`
        : "";
      textoPadraoConcatenado += `\n\n${usuarioAtual} // ${nomeGestor}`;

      setConcatenatedText(textoPadraoConcatenado);
      navigator.clipboard.writeText(textoPadraoConcatenado);
      setShowAlert(true);

      try {
        const sgdResponse = await axiosInstance.get(`/netfacilsgd`);
        const allSgdData = sgdResponse.data;
        const sgdIds = item?.SGD.map(Number) || [];
        const filteredSgdData = allSgdData.filter((item) =>
          sgdIds.includes(item.ID_SGD),
        );
        setSgdData(filteredSgdData);
      } catch (err) {
        console.error("Erro ao buscar dados SGD:", err);
      }
    }
  };

  const filterData = (conditions) => {
    return data.filter((item) =>
      conditions.every(([field, value]) => item[field] === value),
    );
  };

  const getUniqueValues = (field, conditions = []) => {
    const filteredData = filterData(conditions);
    return [...new Set(filteredData.map((item) => item[field]))];
  };

  return (
    <Container>
      <h2 className="select-none text-3xl font-semibold text-foreground sm:mb-8 md:mb-10 lg:mb-12">
        Net Fácil
      </h2>
      <Card className="w-full py-10">
        <CardContent>
          <div className="mb-4 flex space-x-2">
            <Input
              className="w-20"
              placeholder="Cód."
              maxLength={3}
              {...register("codigo", { required: true })}
            />
            <Button onClick={handleCodigoSubmit}>
              <CheckIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setTabelaConsulta(true)}>
              <MessageCircleQuestionIcon className="h-4 w-4" />
            </Button>
          </div>

          <TabelaNetFacil
            isOpen={tabelaConsulta}
            onRequestClose={() => setTabelaConsulta(false)}
          />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="tratativa">Tratativa</Label>
              <Select
                {...register("tratativa", { required: true })}
                onValueChange={(value) => setValue("tratativa", value)}
              >
                <option value="">Selecione</option>
                {getUniqueValues("TRATATIVA").map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
              {errors.tratativa && (
                <span className="text-red-500">Este campo é obrigatório</span>
              )}
            </div>

            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                {...register("tipo", { required: true })}
                onValueChange={(value) => setValue("tipo", value)}
                disabled={!watchAllFields.tratativa}
              >
                <option value="">Selecione</option>
                {getUniqueValues("TIPO", [
                  ["TRATATIVA", watchAllFields.tratativa],
                ]).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
              {errors.tipo && (
                <span className="text-red-500">Este campo é obrigatório</span>
              )}
            </div>

            <div>
              <Label htmlFor="aberturaFechamento">Abertura/Fechamento</Label>
              <Select
                {...register("aberturaFechamento", { required: true })}
                onValueChange={(value) => setValue("aberturaFechamento", value)}
                disabled={!watchAllFields.tipo}
              >
                <option value="">Selecione</option>
                {getUniqueValues("ABERTURA/FECHAMENTO", [
                  ["TIPO", watchAllFields.tipo],
                  ["TRATATIVA", watchAllFields.tratativa],
                ]).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
              {errors.aberturaFechamento && (
                <span className="text-red-500">Este campo é obrigatório</span>
              )}
            </div>

            <div>
              <Label htmlFor="netsms">NetSMS</Label>
              <Select
                {...register("netsms", { required: true })}
                onValueChange={(value) => setValue("netsms", value)}
                disabled={!watchAllFields.aberturaFechamento}
              >
                <option value="">Selecione</option>
                {getUniqueValues("NETSMS", [
                  ["ABERTURA/FECHAMENTO", watchAllFields.aberturaFechamento],
                  ["TIPO", watchAllFields.tipo],
                  ["TRATATIVA", watchAllFields.tratativa],
                ]).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
              {errors.netsms && (
                <span className="text-red-500">Este campo é obrigatório</span>
              )}
            </div>

            <div>
              <Label htmlFor="textoPadrao">Texto Padrão</Label>
              <Select
                {...register("textoPadrao", { required: true })}
                onValueChange={(value) => {
                  setValue("textoPadrao", value);
                  const item = findSelectedItem(watchAllFields.codigo);
                  if (item) {
                    setShowIncidenteField(item.INCIDENTE === "Sim");
                    setShowObservacaoField(item.OBS === "Sim");
                  }
                }}
                disabled={!watchAllFields.netsms}
              >
                <option value="">Selecione</option>
                {filterData([
                  ["NETSMS", watchAllFields.netsms],
                  ["ABERTURA/FECHAMENTO", watchAllFields.aberturaFechamento],
                  ["TIPO", watchAllFields.tipo],
                  ["TRATATIVA", watchAllFields.tratativa],
                ]).map((item) => (
                  <option
                    key={item.ID}
                    value={`${item.ID} - ${item["TEXTO PADRAO"]}`}
                  >
                    {`${item.ID} - ${item["TEXTO PADRAO"]}`}
                  </option>
                ))}
              </Select>
              {errors.textoPadrao && (
                <span className="text-red-500">Este campo é obrigatório</span>
              )}
            </div>

            {showIncidenteField && (
              <div>
                <Label htmlFor="incidente">Incidente</Label>
                <Input
                  {...register("incidente", { required: true })}
                  onChange={(e) =>
                    setValue("incidente", removerAcentos(e.target.value))
                  }
                  placeholder="Por favor insira um incidente"
                />
                {errors.incidente && (
                  <span className="text-red-500">Este campo é obrigatório</span>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="observacao">Observação</Label>
              <Input
                {...register("observacao", { required: showObservacaoField })}
                onChange={(e) =>
                  setValue("observacao", removerAcentos(e.target.value))
                }
                placeholder={
                  showObservacaoField ? "Por favor insira uma observação" : ""
                }
              />
              {errors.observacao && (
                <span className="text-red-500">Este campo é obrigatório</span>
              )}
            </div>

            <div className="flex space-x-2">
              <Button type="submit">TESTE</Button>
              <Button variant="destructive" onClick={() => reset()}>
                <RefreshCcwIcon className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {showAlert && (
            <Alert className="mt-4">
              <AlertTitle>Sucesso</AlertTitle>
              <AlertDescription>
                O texto foi copiado para a área de transferência com sucesso.
                {sgdData.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-semibold">Fechamentos SGD:</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fila</TableHead>
                          <TableHead>Seleção</TableHead>
                          <TableHead>Motivo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sgdData.map((item) => (
                          <TableRow key={item.ID_SGD}>
                            <TableCell>{item.FILA}</TableCell>
                            <TableCell>{item.SELECAO}</TableCell>
                            <TableCell>{item.MOTIVO}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {concatenatedText && (
            <div className="mt-4">
              <Label htmlFor="concatenatedText">Texto Padrão:</Label>
              <Textarea
                id="concatenatedText"
                value={concatenatedText}
                readOnly
                rows={5}
                className="mt-1"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default NetSMSFacil;

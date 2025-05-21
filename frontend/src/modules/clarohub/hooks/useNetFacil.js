import { useEffect, useMemo, useState } from "react";
import axiosInstance from "services/axios";
import { toast } from "sonner";

export default function useNetFacil({ userName, gestor }) {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    tratativa: "",
    tipo: "",
    aberturaFechamento: "",
    netSMS: "",
    textoPadrao: "",
    incidente: "",
    observacao: "",
  });
  const [codigo, setCodigo] = useState("");
  const [codigoErro, setCodigoErro] = useState(false);
  const [item, setItem] = useState(null);
  const [textoPadraoConcatenado, setTextoPadraoConcatenado] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [showIncidenteField, setShowIncidenteField] = useState(false);
  const [showObservacaoField, setShowObservacaoField] = useState(false);
  const [tabelaConsulta, setTabelaConsulta] = useState(false);
  const [showSGDTable, setShowSGDTable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("/netsmsfacil")
      .then((res) => setData(res.data))
      .catch(() => toast.error("Falha ao carregar dados."));
  }, []);

  const getOptions = useMemo(() => {
    return (field) =>
      [...new Set(data.map((item) => item[field]))].filter(Boolean);
  }, [data]);

  const findItem = (fields) => {
    return data.find(
      (item) =>
        item.TRATATIVA === fields.tratativa &&
        item.TIPO === fields.tipo &&
        item["ABERTURA/FECHAMENTO"] === fields.aberturaFechamento &&
        item.NETSMS === fields.netSMS &&
        item["TEXTO PADRAO"] === fields.textoPadrao,
    );
  };

  const handleReset = () => {
    setFormData({
      tratativa: "",
      tipo: "",
      aberturaFechamento: "",
      netSMS: "",
      textoPadrao: "",
      incidente: "",
      observacao: "",
    });
    setCodigo("");
    setItem(null);
    setTextoPadraoConcatenado("");
    setShowIncidenteField(false);
    setShowObservacaoField(false);
    setCodigoErro(false);
    setCurrentStep(0);
    navigator.clipboard.writeText("");
  };

  const fecharTabelaConsulta = () => setTabelaConsulta(false);

  return {
    data,
    formData,
    setFormData,
    codigo,
    setCodigo,
    codigoErro,
    setCodigoErro,
    item,
    setItem,
    textoPadraoConcatenado,
    setTextoPadraoConcatenado,
    currentStep,
    setCurrentStep,
    showIncidenteField,
    setShowIncidenteField,
    showObservacaoField,
    setShowObservacaoField,
    tabelaConsulta,
    setTabelaConsulta,
    showSGDTable,
    setShowSGDTable,
    isLoading,
    setIsLoading,
    userName,
    gestor,
    getOptions,
    findItem,
    handleReset,
    fecharTabelaConsulta,
  };
}

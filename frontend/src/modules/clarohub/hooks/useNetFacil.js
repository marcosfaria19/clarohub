import { useMemo, useState, useContext, useEffect } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import { SWR_KEYS } from "services/swrConfig";

export default function useNetFacil() {
  const { user } = useContext(AuthContext);
  const gestor = user.gestor;
  const userName = user.userName;

  // SWR para buscar dados do NetFacil
  const { data: rawData, isLoading: swrLoading } = useSWR(
    SWR_KEYS.NETFACIL_DATA,
    {
      onError: () => toast.error("Falha ao carregar dados."),
      // Cache mais agressivo para dados que raramente mudam
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  // Processar dados baseado no usuário (mantendo lógica original)
  const data = useMemo(() => {
    if (!rawData) return [];

    const fetchedData = rawData;
    const projectName = user?.project?.name;
    const isManager = user?.permissoes !== "basic";

    if (projectName && !isManager) {
      const hasMatchingTratativa = fetchedData.some(
        (item) => item.TRATATIVA === projectName,
      );

      if (hasMatchingTratativa) {
        return fetchedData.filter((item) => item.TRATATIVA === projectName);
      } else {
        return fetchedData;
      }
    } else {
      return fetchedData;
    }
  }, [rawData, user]);

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

  // Atualizar formData quando dados carregam e usuário tem projeto específico
  useEffect(() => {
    const projectName = user?.project?.name;
    const isManager = user?.permissoes !== "basic";

    if (projectName && !isManager && data.length > 0) {
      const hasMatchingTratativa = data.some(
        (item) => item.TRATATIVA === projectName,
      );

      if (hasMatchingTratativa) {
        setFormData((prev) => ({
          ...prev,
          tratativa: projectName,
        }));
      }
    }
  }, [data, user]);

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
    isLoading: swrLoading || isLoading,
    setIsLoading,
    getOptions,
    findItem,
    handleReset,
    fecharTabelaConsulta,
    userName,
    gestor,
  };
}

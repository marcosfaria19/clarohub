import { useEffect, useMemo, useState, useContext, useCallback } from "react";
import axiosInstance from "services/axios";
import { toast } from "sonner";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useCache } from "modules/shared/contexts/CacheContext";

/**
 * Hook otimizado para NetFacil com cache inteligente
 *
 * Mantém exatamente a mesma interface do hook original useNetFacil
 * Adiciona cache compartilhado com TTL de 1 hora
 */
export default function useNetFacilOptimized() {
  const { user } = useContext(AuthContext);
  const cache = useCache();

  const gestor = user.gestor;
  const userName = user.userName;

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

  // Função para buscar dados do NetFacil
  const fetchNetFacilData = useCallback(
    async (forceRefresh = false) => {
      try {
        setIsLoading(true);

        // Verifica cache primeiro (se não for refresh forçado)
        if (!forceRefresh) {
          const cachedData = cache.get("netfacil");
          if (cachedData) {
            setIsLoading(false);
            return cachedData;
          }
        }

        // Busca da API
        const response = await axiosInstance.get("/netsmsfacil");
        const fetchedData = response.data;

        // Armazena no cache
        cache.set("netfacil", fetchedData);

        setIsLoading(false);
        return fetchedData;
      } catch (err) {
        setIsLoading(false);
        toast.error("Falha ao carregar dados.");
        console.error("Erro ao buscar dados NetFacil:", err);
        return [];
      }
    },
    [cache],
  );

  // Effect para carregar dados na montagem ou mudança do usuário
  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchNetFacilData();

      if (fetchedData && fetchedData.length > 0) {
        const projectName = user?.project?.name;
        const isManager = user?.permissoes !== "basic";

        if (projectName && !isManager) {
          const hasMatchingTratativa = fetchedData.some(
            (item) => item.TRATATIVA === projectName,
          );

          if (hasMatchingTratativa) {
            setData(
              fetchedData.filter((item) => item.TRATATIVA === projectName),
            );
            setFormData((prev) => ({
              ...prev,
              tratativa: projectName,
            }));
          } else {
            setData(fetchedData);
          }
        } else {
          setData(fetchedData);
        }
      }
    };

    loadData();
  }, [user, fetchNetFacilData]);

  // Memoização das opções (mantém a mesma lógica original)
  const getOptions = useMemo(() => {
    return (field) =>
      [...new Set(data.map((item) => item[field]))].filter(Boolean);
  }, [data]);

  // Função para encontrar item (mantém a mesma lógica original)
  const findItem = useCallback(
    (fields) => {
      return data.find(
        (item) =>
          item.TRATATIVA === fields.tratativa &&
          item.TIPO === fields.tipo &&
          item["ABERTURA/FECHAMENTO"] === fields.aberturaFechamento &&
          item.NETSMS === fields.netSMS &&
          item["TEXTO PADRAO"] === fields.textoPadrao,
      );
    },
    [data],
  );

  // Função para reset (mantém a mesma lógica original)
  const handleReset = useCallback(() => {
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
  }, []);

  // Função para fechar tabela de consulta (mantém a mesma lógica original)
  const fecharTabelaConsulta = useCallback(() => {
    setTabelaConsulta(false);
  }, []);

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
    getOptions,
    findItem,
    handleReset,
    fecharTabelaConsulta,
    userName,
    gestor,
  };
}

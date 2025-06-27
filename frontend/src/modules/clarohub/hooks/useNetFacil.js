import { useEffect, useMemo, useState, useContext } from "react";
import axiosInstance from "services/axios";
import { toast } from "sonner";
import { AuthContext } from "modules/shared/contexts/AuthContext";

export default function useNetFacil() {
  const { user } = useContext(AuthContext);
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

  useEffect(() => {
    axiosInstance
      .get("/netsmsfacil")
      .then((res) => {
        const fetchedData = res.data;
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
      })
      .catch(() => toast.error("Falha ao carregar dados."));
  }, [user]);

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
    getOptions,
    findItem,
    handleReset,
    fecharTabelaConsulta,
    userName,
    gestor,
  };
}

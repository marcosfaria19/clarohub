const { parseCustomDateFromExcel } = require("../utils/formatarData");

module.exports = function mduParser(rawData, cidadeMap, project, assignment) {
  // Colunas esperadas e filtro de fila por assignment.name
  const spec = {
    Análise: {
      required: ["IDDEMANDA", "COD_OPERADORA", "ENDERECO_VISTORIA", "FILA"],
      filaValues: ["Ocorrências PRJ", "Pedidos GED"],
    },
    ["Validação Vistoria"]: {
      required: ["IDDEMANDA", "COD_OPERADORA", "ENDERECO_VISTORIA", "FILA"],
      filaValues: ["Retorno Vistoria", "Validação Vistoria"],
    },
  };

  const cfg = spec[assignment.name];
  if (!cfg)
    throw new Error(
      `Sem configuração de parser para assignment ${assignment.name}`
    );

  // Validar colunas
  if (rawData.length > 0) {
    const missing = cfg.required.filter((c) => !(c in rawData[0]));
    if (missing.length) {
      throw new Error(
        `Colunas faltantes para ${assignment.name}: ${missing.join(", ")}`
      );
    }
  }

  // Processar rows válidos
  return (
    rawData
      /* Filtros para itens não tratados ainda pela equipe de MDU */
      .filter((row) => {
        row.COD_BAIXA !== 209;
      })
      .filter((row) => {
        row.TIPO_DEMANDA !== "Empresarial" &&
          row.TIPO_DEMANDA !== "Inteligência de Mercado" &&
          row.TIPO_DEMANDA !== "Projeto F";
      })

      /* Filtro para filas padrão da demanda e endereços não vazios */
      .filter((row) => cfg.filaValues.includes(row.FILA?.trim()))
      .filter((row) => row.ENDERECO_VISTORIA?.trim())

      .map((row) => {
        const codOper = (row.COD_OPERADORA || row.COD_OPERADORA_NODE)
          .toString()
          .trim();
        const city = cidadeMap.get(codOper) || {};

        // Transformação de data do excel em data sem hh/mm/ss, para correta ordenação de prioridades
        const rawDate = row.DATA_INICIO
          ? parseCustomDateFromExcel(row.DATA_INICIO)
          : null;

        const createdAt = rawDate
          ? new Date(
              rawDate.getFullYear(),
              rawDate.getMonth(),
              rawDate.getDate()
            )
          : null;

        return {
          IDDEMANDA: row.IDDEMANDA,
          COD_OPERADORA: codOper,
          ENDERECO_VISTORIA: row.ENDERECO_VISTORIA,
          ...city,
          project: { _id: project._id, name: project.name },
          status: { _id: assignment._id, name: assignment.name },
          assignedTo: null,
          updatedAt: new Date(),
          createdAt,
          history: [],
        };
      })
  );
};

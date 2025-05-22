const { parseCustomDateFromExcel } = require("../utils/formatarData");

module.exports = function mduParser(rawData, cidadeMap, project, assignment) {
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
  if (!cfg) {
    throw new Error(
      `Sem configuração de parser para assignment ${assignment.name}`
    );
  }

  if (rawData.length > 0) {
    const missing = cfg.required.filter((c) => !(c in rawData[0]));
    if (missing.length) {
      throw new Error(
        `Colunas faltantes para ${assignment.name}: ${missing.join(", ")}`
      );
    }
  }

  let filtered = rawData;

  filtered = filtered.filter((row) => row.COD_BAIXA !== 209);

  filtered = filtered.filter(
    (row) =>
      row.TIPO_DEMANDA !== "Empresarial" &&
      row.TIPO_DEMANDA !== "Inteligência de Mercado" &&
      row.TIPO_DEMANDA !== "Projeto F"
  );

  filtered = filtered.filter((row) =>
    cfg.filaValues.includes(row.FILA?.trim())
  );

  filtered = filtered.filter((row) => row.ENDERECO_VISTORIA?.trim());

  return filtered.map((row) => {
    const codOper = (row.COD_OPERADORA || row.COD_OPERADORA_NODE)
      .toString()
      .trim();
    const city = cidadeMap.get(codOper) || {};

    const rawDate = row.DATA_INICIO
      ? parseCustomDateFromExcel(row.DATA_INICIO)
      : null;

    const createdAt = rawDate
      ? new Date(rawDate.getFullYear(), rawDate.getMonth(), rawDate.getDate())
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
  });
};

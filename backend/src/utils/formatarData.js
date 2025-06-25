// Função para formatar a data numérica (como Excel faz)
const formatarData = (dataNumerica) => {
  // Converter a data numérica para objeto de data
  const data = new Date((dataNumerica - 25569) * 86400 * 1000);

  // Extrair dia, mês, ano, hora, minuto e segundo
  const dia = data.getDate().toString().padStart(2, "0");
  const mes = (data.getMonth() + 1).toString().padStart(2, "0");
  const ano = data.getFullYear();
  const horas = data.getHours().toString().padStart(2, "0");
  const minutos = data.getMinutes().toString().padStart(2, "0");

  // Retornar a data formatada
  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
};

// Função para converter string de data no formato "dd/MM/yyyy HH:mm:ss" para Date com horas zeradas 00:00:00

function parseCustomDateFromExcel(value) {
  if (value == null) return null;

  let utc; // Date em UTC depois da leitura bruta

  /* ----- 1. detectar formato de entrada ----- */
  if (value instanceof Date && !isNaN(value)) {
    // já é Date (vindo de cellDates: true) → assume que é UTC
    utc = value;
  } else if (typeof value === "number" && !isNaN(value)) {
    // número-série do Excel: dias desde 1899-12-30
    utc = new Date((value - 25569) * 86400 * 1000);
    // Excel traz a hora “como está” na planilha (UTC-3) → converte p/ UTC
    utc = new Date(utc.getTime() - 3 * 60 * 60 * 1000);
  } else if (typeof value === "string") {
    // "dd/mm/aaaa [hh:mm[:ss]]"
    const [datePart, timePart = "00:00:00"] = value.trim().split(/\s+/);
    const [d, m, y] = datePart.split(/[\/\-]/).map(Number);
    const [h = 0, min = 0, s = 0] = timePart.split(":").map(Number);
    // cria já em UTC, somando +3 h (UTC = BRT + 3)
    utc = new Date(Date.UTC(y, m - 1, d, h + 3, min, s));
  } else {
    return null; // formato inesperado
  }

  /* ----- 2. zerar para meia-noite BRT (03:00 UTC) ----- */
  return new Date(
    Date.UTC(
      utc.getUTCFullYear(),
      utc.getUTCMonth(),
      utc.getUTCDate(),
      3,
      0,
      0 // 03:00 UTC = 00:00 BRT
    )
  );
}

module.exports = { formatarData, parseCustomDateFromExcel };

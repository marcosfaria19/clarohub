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

// Função para converter string de data no formato "dd/MM/yyyy HH:mm:ss" para Date

function parseCustomDateFromExcel(dateNum) {
  // Converter o número do Excel para milissegundos
  const excelDate = new Date((dateNum - 25569) * 86400 * 1000);

  // Adicionar 3 horas para transformar de horário de Brasília para UTC
  const utcDate = new Date(excelDate.getTime() + 3 * 60 * 60 * 1000);

  return utcDate;
}

module.exports = { formatarData, parseCustomDateFromExcel };

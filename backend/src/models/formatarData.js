// Função para formatar a data
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

module.exports = formatarData;

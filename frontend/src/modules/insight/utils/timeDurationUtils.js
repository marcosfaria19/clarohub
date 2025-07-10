export function formatDuration(ms) {
  if (ms < 0) return "Inválido";
  if (ms === 0) return "00m 00s";

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Formata os segundos com 2 dígitos (00)
  const formattedSeconds = String(seconds % 60).padStart(2, "0");

  // Formata os minutos com 2 dígitos (00)
  const formattedMinutes = String(minutes % 60).padStart(2, "0");

  const parts = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours % 24 > 0) parts.push(`${hours % 24}h`);

  // Sempre mostra minutos e segundos no formato 00m 00s
  parts.push(`${formattedMinutes}m ${formattedSeconds}s`);

  return parts.join(" ");
}

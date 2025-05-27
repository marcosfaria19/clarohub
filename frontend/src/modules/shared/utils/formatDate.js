import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (date, withTime = true) => {
  const pattern = withTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy";
  return format(new Date(date), pattern, { locale: ptBR });
};

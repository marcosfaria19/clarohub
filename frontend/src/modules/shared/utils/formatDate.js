import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (date) =>
  format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR });

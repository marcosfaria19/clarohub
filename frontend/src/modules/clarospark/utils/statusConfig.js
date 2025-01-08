const statusConfig = {
  "Em Análise": {
    color:
      "bg-warning text-warning-foreground hover:bg-warning/80 hover:text-warning-foreground/80",
    /* icon: "🕒", */
  },
  Aprovada: {
    color:
      "bg-success text-success-foreground hover:bg-success/80 hover:text-success-foreground/80",
    /* icon: "✅", */
  },
  "Em Andamento": {
    color: "bg-[#6598ff] text-[#0030cc] hover:opacity-80 duration-200",
  },
  Arquivada: {
    color:
      "bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:text-destructive-foreground/80",
    /* icon: "📝", */
  },
};

<div className="hover:opacity-80"></div>;
export default statusConfig;

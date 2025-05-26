// Dados para o KPI Card de tempo médio de fila
export const queueTimeData = {
  title: "Tempo Médio de Fila",
  value: 3.5,
  unit: "horas",
  deviation: 0.8,
  trend: "down",
  trendValue: 12,
  previousValue: 4.0,
  icon: "clock",
};

// Dados para o KPI Card de volume por período
export const volumeData = {
  title: "Volume por Período",
  value: 247,
  unit: "demandas",
  trend: "up",
  trendValue: 15,
  previousValue: 215,
  period: "semana",
  icon: "chart-bar",
};

// Dados para o gráfico combinado de desempenho da equipe
export const teamPerformanceData = [
  { period: "Seg", demandas: 45, tempoMedio: 2.5 },
  { period: "Ter", demandas: 52, tempoMedio: 3.2 },
  { period: "Qua", demandas: 38, tempoMedio: 4.1 },
  { period: "Qui", demandas: 65, tempoMedio: 2.8 },
  { period: "Sex", demandas: 48, tempoMedio: 3.5 },
  { period: "Sáb", demandas: 22, tempoMedio: 2.2 },
  { period: "Dom", demandas: 15, tempoMedio: 1.8 },
];

// Dados para o heatmap de comparação de colaboradores
export const teamHeatmapData = [
  { colaborador: "Ana Silva", metrica: "Tempo Médio", valor: 2.1 },
  { colaborador: "Ana Silva", metrica: "Volume", valor: 85 },
  { colaborador: "Ana Silva", metrica: "Satisfação", valor: 92 },
  { colaborador: "Ana Silva", metrica: "Qualidade", valor: 88 },

  { colaborador: "Bruno Costa", metrica: "Tempo Médio", valor: 3.2 },
  { colaborador: "Bruno Costa", metrica: "Volume", valor: 65 },
  { colaborador: "Bruno Costa", metrica: "Satisfação", valor: 95 },
  { colaborador: "Bruno Costa", metrica: "Qualidade", valor: 90 },

  { colaborador: "Carla Mendes", metrica: "Tempo Médio", valor: 2.8 },
  { colaborador: "Carla Mendes", metrica: "Volume", valor: 72 },
  { colaborador: "Carla Mendes", metrica: "Satisfação", valor: 88 },
  { colaborador: "Carla Mendes", metrica: "Qualidade", valor: 85 },

  { colaborador: "Daniel Oliveira", metrica: "Tempo Médio", valor: 2.5 },
  { colaborador: "Daniel Oliveira", metrica: "Volume", valor: 78 },
  { colaborador: "Daniel Oliveira", metrica: "Satisfação", valor: 90 },
  { colaborador: "Daniel Oliveira", metrica: "Qualidade", valor: 92 },

  { colaborador: "Elena Santos", metrica: "Tempo Médio", valor: 3.0 },
  { colaborador: "Elena Santos", metrica: "Volume", valor: 70 },
  { colaborador: "Elena Santos", metrica: "Satisfação", valor: 87 },
  { colaborador: "Elena Santos", metrica: "Qualidade", valor: 89 },
];

// Dados para o gráfico de radar de performance individual
export const radarData = [
  { subject: "Velocidade", colaborador: 85, equipe: 70 },
  { subject: "Qualidade", colaborador: 90, equipe: 85 },
  { subject: "Volume", colaborador: 75, equipe: 80 },
  { subject: "Satisfação", colaborador: 95, equipe: 88 },
  { subject: "Complexidade", colaborador: 80, equipe: 75 },
  { subject: "Comunicação", colaborador: 88, equipe: 82 },
];

// Dados para a tabela de status das demandas
export const demandStatusData = [
  {
    id: "DEM-001",
    titulo: "Implementação de API REST",
    responsavel: "Ana Silva",
    prioridade: "Alta",
    status: "Em Progresso",
    dataInicio: "2025-05-15",
    prazo: "2025-05-25",
    progresso: 65,
  },
  {
    id: "DEM-002",
    titulo: "Correção de bugs no módulo de pagamento",
    responsavel: "Bruno Costa",
    prioridade: "Crítica",
    status: "Em Progresso",
    dataInicio: "2025-05-18",
    prazo: "2025-05-24",
    progresso: 40,
  },
  {
    id: "DEM-003",
    titulo: "Atualização da documentação",
    responsavel: "Carla Mendes",
    prioridade: "Baixa",
    status: "Finalizada",
    dataInicio: "2025-05-10",
    prazo: "2025-05-20",
    progresso: 100,
  },
  {
    id: "DEM-004",
    titulo: "Implementação de autenticação OAuth",
    responsavel: "Daniel Oliveira",
    prioridade: "Média",
    status: "Em Fila",
    dataInicio: "",
    prazo: "2025-06-05",
    progresso: 0,
  },
  {
    id: "DEM-005",
    titulo: "Otimização de consultas SQL",
    responsavel: "Elena Santos",
    prioridade: "Alta",
    status: "Em Progresso",
    dataInicio: "2025-05-19",
    prazo: "2025-05-30",
    progresso: 25,
  },
  {
    id: "DEM-006",
    titulo: "Implementação de testes unitários",
    responsavel: "Ana Silva",
    prioridade: "Média",
    status: "Finalizada",
    dataInicio: "2025-05-05",
    prazo: "2025-05-15",
    progresso: 100,
  },
  {
    id: "DEM-007",
    titulo: "Refatoração do módulo de relatórios",
    responsavel: "Bruno Costa",
    prioridade: "Baixa",
    status: "Em Fila",
    dataInicio: "",
    prazo: "2025-06-10",
    progresso: 0,
  },
  {
    id: "DEM-008",
    titulo: "Integração com sistema de pagamentos",
    responsavel: "Carla Mendes",
    prioridade: "Alta",
    status: "Em Progresso",
    dataInicio: "2025-05-20",
    prazo: "2025-06-01",
    progresso: 15,
  },
];

// Dados para o resumo de status das demandas
export const demandStatusSummary = {
  total: 45,
  emFila: 12,
  emProgresso: 18,
  finalizadas: 15,
  atrasadas: 5,
};

// Lista de membros da equipe
export const teamMembers = [
  {
    id: 1,
    nome: "Ana Silva",
    cargo: "Desenvolvedor Sênior",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    nome: "Bruno Costa",
    cargo: "Desenvolvedor Pleno",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    nome: "Carla Mendes",
    cargo: "Desenvolvedor Júnior",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    nome: "Daniel Oliveira",
    cargo: "Analista de QA",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    nome: "Elena Santos",
    cargo: "DevOps Engineer",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
];

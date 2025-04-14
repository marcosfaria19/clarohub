import EmployeeProductivity from "../components/EmployeeProductivity";
import VacationOverview from "../components/VacationOverview";
import TeamPerformance from "../components/TeamPerformance";
import UpcomingVacations from "../components/UpcomingVacations";

const Dashboard = () => {
  return (
    <>
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold">Dashboard de Gerenciamento</h2>
        <p className="text-muted-foreground">
          Acompanhe a produtividade e férias da sua equipe
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <EmployeeProductivity />
        <VacationOverview />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <TeamPerformance />
        </div>
        <div>
          <UpcomingVacations />
        </div>
      </div>
    </>
  );
};

export default Dashboard;

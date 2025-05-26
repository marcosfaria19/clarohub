import DemandDashboard from "../components/dashboard/DemandDashboard";

const Dashboard = () => {
  return (
    <div className="mx-auto flex min-h-full w-full flex-col bg-background p-10 text-foreground">
      <DemandDashboard />
    </div>
  );
};

export default Dashboard;

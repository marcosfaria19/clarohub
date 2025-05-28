import DashboardModule from "../components/dashboard/DashboardModule";

const DashboardPage = () => {
  return (
    <div className="mx-auto flex min-h-full w-full flex-col bg-background p-10 text-foreground">
      <DashboardModule />
    </div>
  );
};

export default DashboardPage;

import TasksModule from "../components/dashboard/TasksModule";

const TasksPage = () => {
  return (
    <div className="mx-auto flex min-h-full w-full flex-col bg-background p-10 text-foreground">
      <TasksModule />
    </div>
  );
};

export default TasksPage;

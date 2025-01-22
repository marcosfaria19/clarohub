import React, { useState, useContext, useEffect } from "react";
import UserCard from "./UserCard";
import { useUsers } from "../hooks/useUsers";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useUserAssignments } from "../hooks/useUserAssignments";

import LoadingSpinner from "modules/clarospark/components/LoadingSpinner";
import useProjects from "../hooks/useProjects";

export default function FlowBoard() {
  const [activeSubject, setActiveSubject] = useState("Equipe");
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const { user } = useContext(AuthContext);
  const userId = user?.userId;
  const { project, loading: assignmentsLoading } = useUserAssignments(userId);
  const {
    loading: projectsLoading,
    error: projectsError,
    fetchAssignments,
  } = useProjects();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAssignments = async () => {
      if (project?._id) {
        console.log(project._id);
        try {
          const fetchedAssignments = await fetchAssignments(project._id);
          setAssignments(fetchedAssignments);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    loadAssignments();
  }, [project, fetchAssignments]);

  if (loading || usersLoading || assignmentsLoading || projectsLoading) {
    return <LoadingSpinner />;
  }

  if (error || usersError || projectsError) {
    return <div>Erro: {error || usersError || projectsError}</div>;
  }

  const filteredUsers = (users || []).filter(
    (user) => user.project?._id === project?._id,
  );

  const allSubjects = ["Equipe", ...assignments.map((a) => a.name)];

  const renderSubjectTabs = () => (
    <div className="scrollbar-spark mb-4 flex overflow-x-auto rounded-lg">
      {allSubjects.map((subject) => (
        <button
          key={subject}
          className={`whitespace-nowrap px-4 py-2 ${
            activeSubject === subject
              ? "bg-accent text-menu-foreground"
              : "bg-menu text-menu-foreground"
          }`}
          onClick={() => setActiveSubject(subject)}
        >
          {subject}
        </button>
      ))}
    </div>
  );

  const renderContent = (subject) => {
    if (subject === "Equipe") {
      if (filteredUsers.length === 0)
        return <div>Nenhum usuário encontrado para este projeto.</div>;

      return (
        <div className="space-y-5">
          {filteredUsers.map((user) => (
            <UserCard key={user._id} {...user} />
          ))}
        </div>
      );
    }

    // Caso contrário, renderiza os users por assignment
    const assignment = assignments.find((a) => a.name === subject);

    if (assignment) {
      const assignedUsers = users.filter((user) =>
        assignment.assignedUsers.includes(user._id),
      );

      if (assignedUsers.length === 0) {
        return <div>Nenhum usuário atribuído a esta tarefa.</div>;
      }

      return (
        <div className="space-y-5">
          {assignedUsers.map((user) => (
            <UserCard key={user._id} {...user} />
          ))}
        </div>
      );
    }

    return <div>Conteúdo para {subject}</div>;
  };

  return (
    <div className="select-none">
      {/* Mobile view */}
      <div className="lg:hidden">
        {renderSubjectTabs()}
        <div className="max-h-[75vh] overflow-y-auto">
          <div className="mt-4 space-y-5 p-4">
            {renderContent(activeSubject)}
          </div>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden h-[75vh] lg:flex">
        {allSubjects.map((subject, index) => {
          return (
            <div
              key={subject}
              className="flex flex-col bg-board"
              style={{ flex: `1 1 ${100 / allSubjects.length}%` }}
            >
              <div className="relative flex h-20 items-center justify-center bg-board-title text-menu-foreground">
                <h2 className="text-center text-xl font-medium antialiased">
                  {subject}
                </h2>
                {index !== 0 && (
                  <div className="absolute bottom-0 left-0 top-0 w-[1px] bg-white/50"></div>
                )}
              </div>
              <div className="bg-board py-2" />
              <div className="flex-1 overflow-y-auto p-5">
                {renderContent(subject)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

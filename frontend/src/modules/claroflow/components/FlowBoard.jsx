import React, { useState, useContext, useEffect, useRef } from "react";
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
    fetchProjects,
  } = useProjects();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchProjectsRef = useRef(fetchProjects);

  // Atualizar a ref sempre que fetchProjects mudar
  useEffect(() => {
    fetchProjectsRef.current = fetchProjects;
  }, [fetchProjects]);

  // Usar a ref para chamar fetchProjects
  useEffect(() => {
    fetchProjectsRef.current();
  }, []);

  useEffect(() => {
    const loadAssignments = async () => {
      if (project?._id) {
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

  const handleAssignmentChange = async () => {
    await fetchProjectsRef.current();
  };

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
            <UserCard
              key={user._id}
              id={user._id}
              NOME={user.NOME}
              GESTOR={user.GESTOR}
              avatar={user.avatar}
              assignments={assignments}
              onAssignmentChange={handleAssignmentChange}
            />
          ))}
        </div>
      );
    }

    // Caso contrário, renderiza os users por assignment
    const assignment = assignments.find((a) => a.name === subject);

    if (assignment) {
      const assignedUsers = filteredUsers.filter((user) => {
        // Garantir que assignedUsers seja um array, mesmo que esteja undefined
        const assignedUsers = assignment.assignedUsers || [];

        // Verificando se o usuário está alocado
        const isAllocated =
          Array.isArray(assignedUsers) && assignedUsers.includes(user._id);

        return isAllocated;
      });

      if (assignedUsers.length === 0) {
        return <div>Nenhum usuário atribuído a esta tarefa.</div>;
      }

      return (
        <div className="space-y-5">
          {assignedUsers.map((user) => (
            <UserCard
              key={user._id}
              id={user._id}
              NOME={user.NOME}
              GESTOR={user.GESTOR}
              avatar={user.avatar}
              assignments={assignments}
              onAssignmentChange={handleAssignmentChange}
            />
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
      <div className="hidden h-[75vh] drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)] lg:flex">
        {allSubjects.map((subject, index) => {
          return (
            <div
              key={subject}
              className={`flex flex-col bg-board ${
                index === 0 ? "rounded-l-lg" : ""
              } ${index === allSubjects.length - 1 ? "rounded-r-lg" : ""}`}
              style={{ flex: `1 1 ${100 / allSubjects.length}%` }}
            >
              <div className="relative flex h-20 items-center justify-center bg-board-title text-menu-foreground drop-shadow-[0_3px_3px_rgba(0,0,0,0.25)]">
                <h2 className="text-center text-xl font-medium antialiased">
                  {subject}
                </h2>
                {index !== 0 && (
                  <div className="absolute bottom-4 left-[-2px] top-4 w-[1px] bg-white/50"></div>
                )}
              </div>
              {index !== allSubjects.length - 1 && (
                <div className="absolute bottom-5 right-[1px] top-32 w-[1px] bg-foreground/30"></div>
              )}
              <div className="bg-board py-2" />
              <div
                className={`scrollbar-spark flex-1 overflow-y-auto bg-board ${
                  index === 0 ? "rounded-bl-lg" : ""
                } ${index === allSubjects.length - 1 ? "rounded-br-lg" : ""}`}
              >
                <div className="flex-1 overflow-y-auto p-5">
                  {renderContent(subject)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

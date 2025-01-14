import React, { useState, useMemo } from "react";
import UserCard from "./UserCard";
import { useUsers } from "../hooks/useUsers";

export default function FlowBoard() {
  const { users, loading, error } = useUsers();
  const [activeSubject, setActiveSubject] = useState("Todos");

  const subjects = useMemo(() => {
    const allSubjects = users.map((user) => user.GESTOR);
    return ["Todos", ...new Set(allSubjects)];
  }, [users]);

  const filteredUsers = useMemo(() => {
    if (activeSubject === "Todos") {
      return users;
    }
    return users.filter((user) => user.GESTOR === activeSubject);
  }, [users, activeSubject]);

  const renderSubjectTabs = () => (
    <div className="scrollbar-spark mb-4 flex overflow-x-auto rounded-lg">
      {subjects.map((subject) => (
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

  if (loading) {
    return <div>Carregando usuários...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div className="tour-FlowBoard select-none">
      {/* Mobile view */}
      <div className="lg:hidden">
        {renderSubjectTabs()}
        <div className="max-h-[75vh] overflow-y-auto">
          <div className="mt-4 space-y-5 p-4">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} {...user} />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden h-[75vh] lg:flex">
        {subjects.map((subject, index) => (
          <div
            key={subject}
            className="flex flex-col bg-board"
            style={{ flex: `1 1 ${100 / subjects.length}%` }}
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
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-5 p-5">
                {filteredUsers
                  .filter(
                    (user) => subject === "Todos" || user.GESTOR === subject,
                  )
                  .map((user) => (
                    <UserCard key={user.id} {...user} />
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

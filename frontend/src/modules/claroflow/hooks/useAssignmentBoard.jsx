import { useState, useEffect, useMemo } from "react";
import { formatUserName } from "modules/shared/utils/formatUsername";

export const useAssignmentBoard = ({ project, getUsersByProjectId }) => {
  const [demands, setDemands] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const projectUsers = useMemo(() => {
    return project ? getUsersByProjectId(project._id) : [];
  }, [project, getUsersByProjectId]);

  const members = useMemo(
    () =>
      projectUsers
        .map((user) => ({
          ...user,
          id: user._id,
          name: formatUserName(user.NOME),
          avatar: user.avatar,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [projectUsers],
  );

  const filteredMembers = useMemo(
    () =>
      members.filter((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [members, searchQuery],
  );

  const activeMember = useMemo(
    () => members.find((m) => m.id === activeId),
    [members, activeId],
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return {
    demands,
    setDemands,
    members,
    filteredMembers,
    activeMember,
    searchQuery,
    setSearchQuery,
    isMobile,
    activeId,
    setActiveId,
  };
};

import React, { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "modules/shared/components/ui/avatar";
import { Button } from "modules/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "modules/shared/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import AvatarCreator from "./AvatarCreator";
import axiosInstance from "services/axios";

export default function AvatarDropdown({ onLogout, userName, login, userId }) {
  const [isAvatarCreatorOpen, setIsAvatarCreatorOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const cachedAvatar = localStorage.getItem(`avatar_${userId}`);
    if (cachedAvatar) {
      setAvatarUrl(cachedAvatar);
    }
  }, [userId]);

  const openAvatarCreator = () => {
    setIsAvatarCreatorOpen(true);
  };

  const closeAvatarCreator = () => {
    setIsAvatarCreatorOpen(false);
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!userId) return;

      try {
        const response = await axiosInstance.get(`/users/${userId}/avatar`);
        setAvatarUrl(response.data.avatar);
        localStorage.setItem(`avatar_${userId}`, response.data.avatar);
      } catch (error) {
        console.error("Erro ao buscar avatar:", error);
      }
    };

    fetchAvatar();
  }, [userId]);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="link" className="relative rounded-full px-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl || ""} alt="@usuario" />
              {/* Avatar padrão */}
              <AvatarFallback className="bg-secondary">
                {userName ? userName.substring(0, 2).toUpperCase() : ""}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex select-none flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">{userName}</p>
                <p className="text-xs font-normal leading-none">{login}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem> */}

              <DropdownMenuItem onSelect={openAvatarCreator}>
                <User className="mr-2 h-4 w-4" />
                <span>Meu Avatar</span>
              </DropdownMenuItem>

              {/* <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Ajuda</span>
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>

      <AvatarCreator
        isOpen={isAvatarCreatorOpen}
        onClose={closeAvatarCreator}
        userId={userId}
        onSave={setAvatarUrl}
        currentAvatar={avatarUrl || "Felix"}
      />
    </>
  );
}

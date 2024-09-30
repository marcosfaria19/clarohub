import React, { useState } from "react";
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
import { User, Settings, HelpCircle, LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "modules/shared/components/ui/dialog";
import AvatarCreator from "./AvatarCreator";

export default function AvatarHeader({
  onLogout,
  userName,
  login,
  onSaveAvatar,
  initialAvatarUrl,
}) {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl || "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveAvatar = (newAvatarUrl) => {
    setAvatarUrl(newAvatarUrl);
    onSaveAvatar(newAvatarUrl);
    setIsDialogOpen(false);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="link" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt="@usuario" />
            <AvatarFallback className="bg-secondary">
              {userName ? userName.substring(0, 2).toUpperCase() : "MF"}
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
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Alterar Avatar</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Criar Avatar</DialogTitle>
                </DialogHeader>
                <AvatarCreator
                  onSave={handleSaveAvatar}
                  currentAvatar={avatarUrl}
                />
              </DialogContent>
            </Dialog>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Ajuda</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

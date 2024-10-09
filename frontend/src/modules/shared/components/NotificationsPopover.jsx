import React from "react";
import { Bell } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "modules/shared/components/ui/popover";

export default function NotificationsPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificações</span>
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notificações</h4>
            <p className="text-sm text-muted-foreground">
              Suas notificações recentes:
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <p className="text-sm">Nova atualização disponível</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p className="text-sm">Sua ideia foi aprovada!</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              <p className="text-sm">Sua ideia foi arquivada</p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

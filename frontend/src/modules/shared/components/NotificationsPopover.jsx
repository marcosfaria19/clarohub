import React, { useMemo, useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "modules/shared/components/ui/popover";
import { Separator } from "modules/shared/components/ui/separator";
import { Badge } from "modules/shared/components/ui/badge";
import { Skeleton } from "modules/shared/components/ui/skeleton";
import useNotifications from "../hooks/useNotifications";
import { getRandomNoNotificationMessage } from "../utils/noNotificationMessages";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

export default function NotificationsPopover() {
  const {
    notifications,
    clearReadNotifications,
    markAllAsRead,
    hideAllNotifications,
    isLoading,
  } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasNotifications = notifications.length > 0;

  const handleClearReadNotifications = async (notificationId) => {
    if (notificationId) {
      await clearReadNotifications(notificationId);
    }
  };

  const handleHideAllNotifications = async (e) => {
    e.stopPropagation();
    await hideAllNotifications();
  };

  const handlePopoverChange = async (isOpen) => {
    setOpen(isOpen);
    if (!isOpen && unreadCount > 0) {
      await markAllAsRead();
    }
  };

  const noNotificationMessage = useMemo(
    () => getRandomNoNotificationMessage(),
    [],
  );

  return (
    <Popover open={open} onOpenChange={handlePopoverChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-menu-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px] font-bold"
              variant="manager"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[360px] select-none rounded-xl p-0"
        align="end"
      >
        <div className="flex items-center justify-center p-4 pb-2">
          <div className="flex items-center gap-2">
            <h4 className="text-md font-medium">Notificações</h4>
          </div>
        </div>

        {hasNotifications && <Separator className="mb-1" />}

        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="mt-1 h-3 w-3 rounded-full" />
                  <div className="flex-grow space-y-2">
                    <Skeleton className="h-4 w-[90%]" />
                    <Skeleton className="h-3 w-[70%]" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="pb-4 text-center text-sm text-foreground">
                {noNotificationMessage}
              </p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {notifications.map((notification) => {
                const isClickable =
                  notification.type && notification.type !== "global";

                return (
                  <div
                    key={notification._id}
                    onClick={() => {
                      if (isClickable) {
                        navigate(`/${notification.type}`);
                      }
                    }}
                    className={cn(
                      "flex items-start gap-3 rounded-lg p-3 transition-all",
                      notification.read
                        ? "bg-popover hover:bg-muted/20"
                        : "bg-accent hover:bg-accent/80",
                      isClickable ? "cursor-pointer" : "cursor-default",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-2 h-2 w-2 flex-shrink-0 rounded-full",
                        notification.read
                          ? "bg-muted"
                          : "animate-pulse bg-info",
                      )}
                    />

                    <div className="flex-grow">
                      <p className="text-sm">{notification.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearReadNotifications(notification._id);
                      }}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      aria-label="Remover notificação"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {hasNotifications && (
          <div className="p-2 pt-1">
            <Separator />
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-muted-foreground hover:opacity-80"
              onClick={handleHideAllNotifications}
            >
              Limpar todas as notificações
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

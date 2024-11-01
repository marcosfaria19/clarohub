import React, { useState } from "react";
import { Bell, X, Check, Trash2 } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "modules/shared/components/ui/popover";
import useNotifications from "../hooks/useNotifications";

export default function NotificationsPopover() {
  const { notifications, markAsRead, clearReadNotifications } =
    useNotifications();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

  const handleClearReadNotifications = async () => {
    await clearReadNotifications();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-4">
          <h4 className="text-lg font-medium">Notifications</h4>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearReadNotifications}
              aria-label="Clear read notifications"
            >
              <Trash2 className="h-4 w-4" />
              <span className="ml-1">Limpar</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground">
              Sem novas notificações
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`flex items-start gap-3 border-b p-4 last:border-b-0 ${
                  notification.read ? "bg-background" : "bg-accent"
                }`}
              >
                <div
                  className={`mt-2 h-2 w-2 rounded-full ${notification.read ? "bg-muted" : "bg-blue-500"}`}
                />
                <div className="flex-grow">
                  <p className="text-sm">{notification.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(notification._id)}
                    aria-label="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

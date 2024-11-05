import React, { useMemo, useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "modules/shared/components/ui/popover";
import useNotifications from "../hooks/useNotifications";
import { getRandomNoNotificationMessage } from "../utils/noNotificationMessages";

export default function NotificationsPopover() {
  const { notifications, clearReadNotifications, markAllAsRead } =
    useNotifications();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClearReadNotifications = async () => {
    await clearReadNotifications();
  };

  const handlePopoverChange = async (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
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
            <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 select-none rounded-xl px-2" align="end">
        <div className="flex items-center justify-center p-4">
          <h4 className="text-md font-medium">Notificações</h4>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="pb-7 text-center text-sm text-foreground">
              {noNotificationMessage}
            </p>
          ) : (
            <>
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`mx-2 my-0.5 flex items-start gap-3 rounded-lg border-b border-secondary p-2 ${
                    notification.read ? "bg-popover" : "bg-accent"
                  }`}
                >
                  <div
                    className={`mt-2 h-2 w-2 rounded-full ${
                      notification.read ? "bg-muted" : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-grow">
                    <p className="text-sm">{notification.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              <div className="mb-2 mr-1 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearReadNotifications}
                  aria-label="Clear read notifications"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

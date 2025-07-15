import React, { useMemo, useState, useEffect } from "react";
import { Bell, X, BellRing, BellOff } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "modules/shared/components/ui/popover";
import { Separator } from "modules/shared/components/ui/separator";
import { Badge } from "modules/shared/components/ui/badge";
import { Switch } from "modules/shared/components/ui/switch";
import { Label } from "modules/shared/components/ui/label";
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
    refetchNotifications,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    checkPushSubscriptionStatus,
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const [pushStatus, setPushStatus] = useState({
    supported: false,
    subscribed: false,
    permission: "default",
  });
  const [isToggling, setIsToggling] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasNotifications = notifications.length > 0;

  // Check push notification status on component mount
  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkPushSubscriptionStatus();
      setPushStatus(status);
    };
    checkStatus();
  }, [checkPushSubscriptionStatus]);

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

    // Quando abrir o popover, fazer refresh manual das notificações
    // para garantir que estão atualizadas
    if (isOpen) {
      await refetchNotifications();
    }

    // Marcar como lidas quando fechar se houver não lidas
    if (!isOpen && unreadCount > 0) {
      await markAllAsRead();
    }
  };

  const handlePushToggle = async (enabled) => {
    if (isToggling) return;

    setIsToggling(true);
    try {
      if (enabled) {
        await subscribeToPushNotifications();
        setPushStatus((prev) => ({
          ...prev,
          subscribed: true,
          permission: "granted",
        }));
      } else {
        await unsubscribeFromPushNotifications();
        setPushStatus((prev) => ({ ...prev, subscribed: false }));
      }
    } catch (error) {
      console.error("Error toggling push notifications:", error);
      // Revert the status if there was an error
      const currentStatus = await checkPushSubscriptionStatus();
      setPushStatus(currentStatus);
    } finally {
      setIsToggling(false);
    }
  };

  const noNotificationMessage = useMemo(
    () => getRandomNoNotificationMessage(),
    [],
  );

  const getBellIcon = () => {
    if (pushStatus.subscribed) {
      return <BellRing className="h-5 w-5" />;
    } else if (pushStatus.permission === "denied") {
      return <BellOff className="h-5 w-5" />;
    }
    return <Bell className="h-5 w-5" />;
  };

  return (
    <Popover open={open} onOpenChange={handlePopoverChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-menu-foreground"
          aria-label="Notifications"
        >
          {getBellIcon()}
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
        className="w-[380px] select-none rounded-xl p-0"
        align="end"
      >
        <div className="flex items-center justify-center p-4 pb-2">
          <div className="flex items-center gap-2">
            <h4 className="text-md font-medium">Notificações</h4>
          </div>
        </div>

        {/* Push Notifications Settings */}
        {pushStatus.supported && (
          <>
            <div className="px-4 pb-2">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label
                    htmlFor="push-notifications"
                    className="text-sm font-medium"
                  >
                    Notificações do Navegador
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Receba notificações mesmo quando a aplicação estiver fechada
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={pushStatus.subscribed}
                  onCheckedChange={handlePushToggle}
                  disabled={isToggling || pushStatus.permission === "denied"}
                />
              </div>
              {pushStatus.permission === "denied" && (
                <p className="mt-1 text-xs text-destructive">
                  Permissão negada. Habilite nas configurações do navegador.
                </p>
              )}
            </div>
            <Separator className="mb-1" />
          </>
        )}

        {hasNotifications && <Separator className="mb-1" />}

        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
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

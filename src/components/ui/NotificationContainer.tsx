"use client";

import { Alert } from "./Alert";
import { useNotifications, type Notification } from "@/hooks/ui/useNotifications";

interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

function NotificationItem({ 
  notification, 
  onRemove 
}: { 
  notification: Notification; 
  onRemove: (id: string) => void;
}) {
  return (
    <div className="transform transition-all duration-300 ease-in-out">
      <Alert
        type={notification.type}
        title={notification.title}
        message={notification.message}
        dismissible={notification.dismissible}
        onDismiss={() => onRemove(notification.id)}
        className="shadow-lg"
      />
    </div>
  );
}

export function NotificationContainer({ notifications, onRemove }: NotificationContainerProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

// Provider component that can be used anywhere in the app
export function GlobalNotifications() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <NotificationContainer
      notifications={notifications}
      onRemove={removeNotification}
    />
  );
}

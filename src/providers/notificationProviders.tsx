import type { NotificationProvider } from "@refinedev/core";
import { toast } from "sonner";

export const notificationProvider: NotificationProvider = {
  open: ({ key, message, type, undoableTimeout, cancelMutation }) => {
    if (type === "progress") {
      toast(message, {
        id: key,
        duration: undoableTimeout,
        action: {
          label: "Undo",
          onClick: () => cancelMutation?.(),
        }
      });
    } else if (type === "success") {
      toast.success(message, {
        id: key,
        duration: 5000,
      });
    } else if (type === "error") {
      toast.error(message, {
        id: key,
        duration: 5000,
      });
    } else if (type === "warning") {
      toast(message, {
        id: key,
        duration: 5000,
        icon: "⚠️",
      });
    } else {
      toast(message, {
        id: key,
        duration: 5000,
      });
    }
  },
  close: (key) => toast.dismiss(key),
};
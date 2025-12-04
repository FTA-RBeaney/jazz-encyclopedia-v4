import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref([]);
  const notificationsArchive = ref([]);

  const notify = (messageOrError, type) => {
    let message = "";
    if (messageOrError instanceof Error) message = messageOrError.message;
    if (typeof messageOrError === "string") message = messageOrError;
    const notification = {
      message,
      type,
      notifyTime: Date.now(),
    };
    notifications.value.push(notification);

    if (type === "error") {
      useSonner.error("Error", {
        description: messageOrError,
        richColors: true,
        duration: 5000,
      });
    } else if (type === "success") {
      useSonner.success("Success", {
        description: messageOrError,
        richColors: true,
        duration: 5000,
      });
    } else if (type === "info") {
      useSonner.info("Info", {
        description: messageOrError,
        richColors: true,
        duration: 5000,
      });
    } else {
      useSonner("", {
        description: messageOrError,
        richColors: true,
        duration: 5000,
      });
    }

    // useSonner.success(messageOrError, {
    //   description: messageOrError,
    //   richColors: true,
    //   duration: 5000,
    // });

    // useToast().toast({
    //   title: getToastStatus(type),
    //   description: messageOrError,
    //   variant: type,
    //   icon: getToasticon(type),
    // });
    setTimeout(removeNotification.bind(this), 5000, notification);
  };

  const removeNotification = (notification) => {
    notifications.value = notifications.value.filter(
      (n) => n.notifyTime != notification.notifyTime
    );
  };

  const getToastStatus = (type) => {
    switch (type) {
      case "success":
        return "Success!";
      case "info":
        return "Info:";
      case "warning":
        return "Warning:";
      case "destructive":
        return "Error!";
      default:
        return "Note:";
    }
  };

  const getToasticon = (type) => {
    switch (type) {
      case "success":
        return "lucide:badge-check";
      case "info":
        return "lucide:badge-info";
      case "warning":
        return "lucide:badge-alert";
      case "destructive":
        return "lucide:badge-x";
      default:
        return "lucide:badge-check";
    }
  };

  return {
    notify,
  };
});

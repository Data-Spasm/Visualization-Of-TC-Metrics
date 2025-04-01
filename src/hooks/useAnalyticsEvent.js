// src/hooks/useAnalyticsEvent.js
import { useCallback } from "react";

const getSessionUserId = () => {
  let sessionUserId = sessionStorage.getItem("userId");
  if (!sessionUserId) {
    sessionUserId = `User_${Math.floor(Math.random() * 10000)}_${Date.now()}`;
    sessionStorage.setItem("userId", sessionUserId);
  }
  return sessionUserId;
};

const useAnalyticsEvent = (category = "Dashboard") => {
  return useCallback((action, label = "", value = null) => {
    const userId = getSessionUserId();
    if (window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        user_id: userId,
        ...(value !== null ? { value } : {}),
      });
    }
  }, [category]);
};

export default useAnalyticsEvent;

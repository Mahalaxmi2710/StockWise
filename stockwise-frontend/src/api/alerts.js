import api from "../utils/axios";

export const getAlerts = () => {
  return api.get("/alerts");
};

export const acknowledgeAlert = (alertId) => {
  return api.patch(`/alerts/${alertId}/acknowledge`);
};

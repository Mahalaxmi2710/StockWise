import api from "../utils/axios";

export const getHouseholdActivity = (
  householdId,
  { limit = 50, action, entityType } = {}
) => {
  const params = {};
  if (limit) params.limit = limit;
  if (action) params.action = action;
  if (entityType) params.entityType = entityType;

  return api.get(`/activity/${householdId}`, { params });
};

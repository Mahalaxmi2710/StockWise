import api from "../utils/axios";

export const createHousehold = (data) =>
  api.post("/households/create", data);

export const joinHousehold = (data) =>
  api.post("/households/join", data);

export const getHouseholdById = (householdId) => {
  return api.get(`/households/${householdId}`);
};
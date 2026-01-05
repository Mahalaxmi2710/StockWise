import api from "../utils/axios";

export const getInventoryItems = (householdId) =>
  api.get(`/inventory/${householdId}`);

export const addInventoryItem = (data) =>
  api.post("/inventory/add", data);

export const updateInventoryItem = (id, data) =>
  api.put(`/inventory/${id}`, data);

export const deleteItem = (id) =>
  api.delete(`/inventory/${id}`);

export const updateItemStatus=(id, data) =>
    api.patch(`/inventory/${id}/status`,data);
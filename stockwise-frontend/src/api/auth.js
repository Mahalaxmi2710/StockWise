import api from "../utils/axios";

export const signup = (data) => api.post("/auth/signup", data);
export const login = (data) => api.post("/auth/login", data);
export const getSessionUser = () => api.get("/users/session");

import API from "../../services/axios";

export const loginUser = async (data) => {
  const response = await API.post("/token/", data);
  return response.data;
};

export const getProfile = async () => {
  const response = await API.get("/users/me/");
  return response.data;
};
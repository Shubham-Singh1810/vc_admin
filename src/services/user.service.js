import axios from "axios";

import { BASE_URL } from "../../src/utils/api_base_url_configration";
import handleError from "../utils/handleError";
const getConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
    },
  };
};

export const createUserServ = async (formData) => {
  try {
    const response = await axios.post(
      BASE_URL + "user/create",
      formData,
      getConfig(),
    );
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const updateUserServ = async (formData) => {
  try {
    const response = await axios.put(
      BASE_URL + "user/update",
      formData,
      getConfig(),
    );
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const getUserListServ = async (formData) => {
  try {
    const response = await axios.post(
      BASE_URL + "user/list",
      formData,
      getConfig(),
    );
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const getUserStatsServ = async () => {
  try {
    const response = await axios.get(BASE_URL + "user/stats", getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const getUserDetailsServ = async (id) => {
  try {
    const response = await axios.get(
      BASE_URL + "user/details/" + id,
      getConfig(),
    );
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const deleteUserServ = async (id) => {
  try {
    const response = await axios.delete(
      BASE_URL + "user/delete/" + id,
      getConfig(),
    );
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const dashboardDetailsServ = async () => {
  try {
    const response = await axios.get(
      BASE_URL + "user/dashboard-details",
      getConfig(),
    );
    return response;
  } catch (error) {
    handleError(error);
  }
};

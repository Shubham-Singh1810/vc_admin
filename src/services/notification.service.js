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

export const createNotifyServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "notify/create", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const updateNotifyServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "notify/update", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const getNotifyServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "notify/list", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const deleteNotifynServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "notify/delete/"+id, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const getNotificationServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "notification/list", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const deleteNotificationServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "notification/delete/"+id, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const deleteNotifyServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "notify/delete/"+id, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
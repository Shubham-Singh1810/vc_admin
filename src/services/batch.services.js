import axios from "axios";

import { BASE_URL } from "../utils/api_base_url_configration";
import handleError from "../utils/handleError";

const getConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
    },
  };
};
export const getBatchServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "batch/list", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const getBatchDetailsServ = async (id) => {
  try {
    const response = await axios.get(BASE_URL + "batch/details/"+id, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const addBatchServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "batch/create", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const updateBatchServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "batch/update", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const deleteBatchServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "batch/delete/"+id,  getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const studentListServ = async (id) => {
  try {
    const response = await axios.get(BASE_URL + "batch/student-list/"+id,  getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
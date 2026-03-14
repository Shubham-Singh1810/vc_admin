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

export const getTopicListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "course-topic/list", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const updateTopicServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "course-topic/update", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const createTopicServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "course-topic/create", payload, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const deleteTopicServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "course-topic/delete/"+ id, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const getTopicDetailsServ = async (id) => {
  try {
    const response = await axios.get(BASE_URL + "course-topic/details/"+id, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};

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
export const getInstructorServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "instructor/list", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const getInstructorDetailsServ = async (id) => {
  try {
    const response = await axios.get(BASE_URL + "instructor/details/"+id);
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const addInstructorServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "instructor/create", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const updateInstructorServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "instructor/update", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const deleteInstructorServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "instructor/delete/"+id,  getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};

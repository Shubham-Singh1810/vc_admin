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
export const getCategoryServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "category/list", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const getCategoryDetailsServ = async (id) => {
  try {
    const response = await axios.get(BASE_URL + "category/details/"+id);
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const addCategoryServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "category/create", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const updateCategoryServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "category/update", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const deleteCategoryServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "category/delete/"+id,  getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};

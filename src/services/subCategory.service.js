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

export const getSubCategoryServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "sub-category/list", formData, getConfig());
    return response;
  } catch (error) {
    handleError()
  }
};

export const addSubCategoryServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "sub-category/create", formData, getConfig());
    return response;
  } catch (error) {
    handleError()
  }
};

export const updateSubCategoryServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "sub-category/update", formData, getConfig());
    return response;
  } catch (error) {
    handleError()
  }
};
export const deleteSubCategoryServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "sub-category/delete/"+id,  getConfig());
    return response;
  } catch (error) {
    handleError()
  }
};
export const updateBannerServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "sub-category/update-banner", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
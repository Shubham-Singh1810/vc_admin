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

export const getFaqListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "support/list-faq", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const addFaqServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "support/create-faq", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const updateFaqServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "support/update-faq", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const deleteFaqServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "support/delete-faq/"+id,  getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};

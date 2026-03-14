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
export const getDocumentSetServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "document/list", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const addDocumentServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "document/create", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const updateDocumentServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "document/update", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const deleteDocumentServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "document/delete/"+id, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};

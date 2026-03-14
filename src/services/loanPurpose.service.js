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

export const getLoanPurposeServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "loan-purpose/list", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const addLoanPurposeServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "loan-purpose/create", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const updateLoanPurposeServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "loan-purpose/update", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const deleteLoanPurposeServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "loan-purpose/delete/"+id, getConfig);
    return response;
  } catch (error) {
    handleError(error);
  }
};

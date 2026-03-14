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

export const loanTypeListServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "loan/list", payload, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const createLoanTypeServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "loan/create", payload, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const updateLoanTypeServ = async (payload) => {
  try {
    const response = await axios.put(BASE_URL + "loan/update", payload, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const deleteLoanTypeServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "loan/delete/"+id, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const loanTypeDetailsServ = async (id) => {
  try {
    const response = await axios.get(BASE_URL + "loan/details/"+id, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const createLoanApplicationServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "loan-application/create", payload, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};

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

export const loanApplicationListServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "loan-application/list", payload, getConfig());
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
export const deleteLoanApplicationServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "loan-application/delete/"+id, getConfig());
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
export const loanApplicationDetailsServ = async (id) => {
  try {
    const response = await axios.get(BASE_URL + "loan-application/details/"+id, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const updateLoanApplicationServ = async (payload) => {
  try {
    const response = await axios.put(BASE_URL + "loan-application/update", payload, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const getLoanStatsServ = async () => {
  try {
    const response = await axios.get(BASE_URL + "loan-application/stats", getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const getEmisListServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "loan-application/emi-list", payload, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const paydayLoanApplicationListServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "payday-loan-application/list", payload, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const paydayLoanStatsServ = async () => {
  try {
    const response = await axios.get(BASE_URL + "payday-loan-application/stats", getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const paydayDeleteLoanApplicationServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "payday-loan-application/delete/"+id, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const createPaydayLoanApplicationServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "payday-loan-application/create", payload, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const updatePaydayLoanApplicationServ = async (payload) => {
  try {
    const response = await axios.put(BASE_URL + "payday-loan-application/update", payload, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const getPaydayLoanApplicationServ = async (id) => {
  try {
    const response = await axios.get(BASE_URL + "payday-loan-application/details/"+id, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
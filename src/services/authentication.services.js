import axios from "axios";

import { BASE_URL } from "../../src/utils/api_base_url_configration";
import handleError from "../utils/handleError";
const token = localStorage.getItem("token");

const getConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
    },
  };
};

export const loginServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "admin/login", formData);
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const resetPasswordServ = async (token, formData) => {
  try {
    const response = await axios.post(BASE_URL + "admin/reset-password/"+token, formData);
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const forgetPasswordServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "admin/forgot-password", formData);
    return response;
  } catch (error) {
    handleError(error);
  }
};

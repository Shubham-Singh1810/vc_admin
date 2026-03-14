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
export const getBannerListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "banner/list", formData, getConfig());
    return response;
  } catch (error) {
     handleError(error);
  }
};
export const addBannerServ = async (formData) => {
    try {
      const response = await axios.post(BASE_URL + "banner/create", formData, getConfig());
      return response;
    } catch (error) {
       handleError(error);
    }
  };
  export const deleteBannerServ = async (id) => {
    try {
      const response = await axios.delete(BASE_URL + "banner/delete/"+id,  getConfig());
      return response;
    } catch (error) {
       handleError(error);
    }
  };
  export const updateBannerServ = async (formData) => {
    try {
      const response = await axios.put(BASE_URL + "banner/update", formData, getConfig());
      return response;
    } catch (error) {
       handleError(error);
    }
  };
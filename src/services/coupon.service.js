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

export const getCouponServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "coupon/list", formData, getConfig());
    return response;
  } catch (error) {
      handleError(error);
  }
};
export const checkCouponValidityServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "coupon/validity", formData, getConfig());
    return response;
  } catch (error) {
      handleError(error);
  }
};


export const addCouponServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "coupon/create", formData, getConfig());
    return response;
  } catch (error) {
      handleError(error);
  }
};

export const updateCouponServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "coupon/update", formData, getConfig());
    return response;
  } catch (error) {
      handleError(error);
  }
};
export const deleteCouponServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "coupon/delete/"+id,  getConfig());
    return response;
  } catch (error) {
      handleError(error);
  }
};

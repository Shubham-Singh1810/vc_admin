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
export const getBulkBooking = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "bulk-booking/list", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const addBulkBookingServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "bulk-booking/create", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const updateBulkBookingServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "bulk-booking/update", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const deleteBulkBookingServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "bulk-booking/delete/"+id,  getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};

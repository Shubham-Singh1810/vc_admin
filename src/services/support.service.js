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

export const getSupportDetailsServ = async () => {
  try {
    const response = await axios.get(BASE_URL + "support/details", getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const updateSupportDetailsServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "support/update-details", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const getEnquiryListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "enquiry/list",formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const updateEnquiryServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "enquiry/update", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const getFaqListServ = async () => {
  try {
    const response = await axios.get(BASE_URL + "support/list-faq", getConfig());
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
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
};
export const deleteFaqServ = async (id) => {
    try {
      const response = await axios.delete(BASE_URL + "support/delete-faq/"+id, getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
};

export const getContactListServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "support/list-contact-query", payload, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const updateContactListServ = async (payload) => {
  try {
    const response = await axios.put(BASE_URL + "support/update-contact-query", payload, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};



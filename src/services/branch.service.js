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
export const getBranchListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "branch/list", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const handleDeleteBranchServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "branch/delete/"+id, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const handleCreateBranchServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "branch/create", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const handleUpdateBranchServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "branch/update", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
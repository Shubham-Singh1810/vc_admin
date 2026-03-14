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
export const getCourseServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "course/list", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const getCourseDetailsServ = async (id) => {
  try {
    const response = await axios.get(BASE_URL + "course/details/"+id, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const addCourseServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "course/create", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const updateCourseServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "course/update", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const deleteCourseServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "course/delete/"+id,  getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
// export const studentListServ = async (id) => {
//   try {
//     const response = await axios.get(BASE_URL + "batch/student-list/"+id,  getConfig());
//     return response;
//   } catch (error) {
//     handleError(error);
//   }
// };
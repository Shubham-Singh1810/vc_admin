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

export const getNotificationConfigrationDetailsServ = async () => {
  try {
    const response = await axios.get(BASE_URL + "notification-configration/details", getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const updateNotificationConfigrationDetailsServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "notification-configration/update-details", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const notificationEventListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "notification-event/list", formData, getConfig());
    return response;
  } catch (error) {
    handleError(error);
  }
};



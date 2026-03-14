import { toast } from "react-toastify";
let isRedirecting = false;
const handleError = (error) => {
  if (error.response && error.response.status === 401) {
    if (isRedirecting) return;
    isRedirecting = true;
    toast.error("Session expired. Please login again.");
    localStorage.clear();

    setTimeout(() => {
      window.location.replace("/");
    }, 1500); 
  }
  
  throw error;
};

export default handleError;
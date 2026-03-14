import { useEffect } from "react";
import AuthenticatedRoutes from "./routes/AuthenticatedRoutes";
import UnAuthenticatedRoutes from "./routes/UnAuthenticatedRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalState } from "./GlobalProvider";

function App() {
  useEffect(() => {
    // ===== Theme Toggle =====
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = themeToggle?.querySelector("i");

    if (themeToggle && themeIcon) {
      const savedTheme =
        localStorage.getItem("theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light");

      if (savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        themeIcon.classList.replace("bi-moon", "bi-sun");
      }

      const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        if (currentTheme === "dark") {
          document.documentElement.removeAttribute("data-theme");
          themeIcon.classList.replace("bi-sun", "bi-moon");
          localStorage.setItem("theme", "light");
        } else {
          document.documentElement.setAttribute("data-theme", "dark");
          themeIcon.classList.replace("bi-moon", "bi-sun");
          localStorage.setItem("theme", "dark");
        }
      };

      themeToggle.addEventListener("click", toggleTheme);

      // ✅ cleanup
      return () => {
        themeToggle.removeEventListener("click", toggleTheme);
      };
    }
  }, []);
const { globalState } = useGlobalState();

  const renderLayout = () => {
    if (globalState?.user) {
      return <AuthenticatedRoutes />;
    } else {
      return <UnAuthenticatedRoutes />;
    }
  };
  return (
    <>
      {renderLayout()}
      <ToastContainer />
    </>
  );
}

export default App;



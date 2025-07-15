import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import axiosInstance from "./utils/axiosInstance";
import UploadDocument from "./pages/UploadForm";

import "./App.css";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Layout from "./components/Layout";
import Home from "./pages/home/Home";
import MyDrive from "./pages/MyDrive";
import Recent from "./pages/Recent";
import Shared from "./pages/Shared";
import Spam from "./pages/Spam";
import Trash from "./pages/Trash";

Modal.setAppElement("#root");

function App() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/user");
        setUserInfo(res.data.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        localStorage.clear();
      }
    };

    fetchUser();
  }, []);

  const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <SignUp /> },
    {
      path: "/",
      element: <Layout userInfo={userInfo} />,
      children: [
        { path: "home", element: <Home /> },
        { path: "drive", element: <MyDrive /> },
        { path: "recent", element: <Recent /> },
        { path: "shared", element: <Shared /> },
        { path: "spam", element: <Spam /> },
        { path: "trash", element: <Trash /> },

        { path: "upload", element: <UploadDocument /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

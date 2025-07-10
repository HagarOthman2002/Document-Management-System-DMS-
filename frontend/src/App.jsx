import Login from "./pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import SignUp from "./pages/SignUp";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import MyDrive from "./pages/MyDrive";
import Recent from "./pages/Recent";
import Shared from "./pages/Shared";
import Spam from "./pages/Spam";
import Trash from "./pages/Trash";
import Computers from "./pages/Computers";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "home", element: <Home /> },
      { path: "drive", element: <MyDrive /> },
      { path: "Recent", element: <Recent /> },
      { path: "shared", element: <Shared /> },
      { path: "spam", element: <Spam /> },
      { path: "trash", element: <Trash /> },
      { path: "computers", element: <Computers /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

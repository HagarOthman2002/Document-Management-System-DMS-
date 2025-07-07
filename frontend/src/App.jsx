

import Login from "./pages/Login"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './App.css'
import SignUp from "./pages/SignUp"

const router = createBrowserRouter([
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <Login /> },
]);


function App() {


  return (
    <>
     <RouterProvider router={router} />
    
    </>
  )
}

export default App

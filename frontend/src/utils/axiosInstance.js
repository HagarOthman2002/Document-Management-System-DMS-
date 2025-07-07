import axios from "axios";
import { BASE_URL } from "./constans";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
    (config) =>{
        const acessToken = localStorage.getItem("token")
        if(acessToken){
            config.headers.Authorization = `Bearer ${acessToken}`
        }
        return config

    },
    (error) => {return Promise.reject(error)}
)

export default axiosInstance

import axios from "axios"

const axiosInstance = axios.create({
    baseURL :"https://food-ordering-app-back.vercel.app"
})

axiosInstance.interceptors.request.use(function (config) {
    const accessToken = sessionStorage.getItem("token")
    if(accessToken){
        if(config){
           config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

export default axiosInstance
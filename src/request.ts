import axios from "axios";

// 是否是开发环境
export const isDev = process.env.NODE_ENV === "development";

// 创建 Axios 实例
const myAxios = axios.create({
  baseURL: isDev ? "http://localhost:8101" : "http://118.25.185.81",
  timeout: 60000,
  withCredentials: true,
});

// 全局请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    // 假设token存在localStorage中
    const token = localStorage.getItem("token");
    console.log("token:", token);
    if (token) {
      config.headers.Authorization = token;
    }
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 携带token方式登录
// axios.interceptors.request.use(
//   (config) => {
//     // 假设token存在localStorage中
//     const token = localStorage.getItem("token");
//     console.log("token:", token);
//     if (token) {
//       config.headers.Authorization = token;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// 全局响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    console.log(response);
    const { data } = response;

    // 未登录
    if (data.code === 40100) {
      // 不是获取用户信息的请求，并且用户目前不是已经在用户登录页面，则跳转到登录页面
      if (
        !response.request.responseURL.includes("user/get/login") &&
        !window.location.pathname.includes("/user/login")
      ) {
        // Message.warning("请先登录");
        window.location.href = `/user/login?redirect=${window.location.href}`;
      }
    }

    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default myAxios;

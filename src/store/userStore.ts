import { defineStore } from "pinia";
import { ref } from "vue";
import { getLoginUserUsingGet } from "@/api/userController";
import ACCESS_ENUM from "@/access/accessEnum";

/**
 * 登录用户信息全局状态
 */
export const useLoginUserStore = defineStore("counter", () => {
  const loginUser = ref<API.LoginUserVO>({
    userName: "未登录",
  });

  function setLoginUser(newLoginUser: API.LoginUserVO) {
    loginUser.value = newLoginUser; //改变登录用户状态值
  }

  async function fetchLoginUser() {
    const res = await getLoginUserUsingGet(); //异步获取用户的登录信息
    if (res.data.code === 0 && res.data.data) {
      //判断res.data.code是否为0和res.data.data是否存在
      loginUser.value = res.data.data; //改变登录用户状态值
    } else {
      setTimeout(() => {
        loginUser.value = {
          id: 1,
          userName: "未登录",
          userRole: ACCESS_ENUM.ADMIN,
        };
      }, 3000);
    }
  }

  return { loginUser, setLoginUser, fetchLoginUser };
});

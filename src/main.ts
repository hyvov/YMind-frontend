import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@/access";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { createPinia } from "pinia";

const pinia = createPinia();

createApp(App)
  .use(store)
  .use(router)
  .use(ArcoVue)
  .use(ElementPlus)
  .use(pinia)
  .mount("#app");

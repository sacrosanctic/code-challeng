import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import Notifications from "vue-notification";
import Vuescroll from "vuescroll";

Vue.use(Vuescroll);
Vue.use(Notifications);
Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

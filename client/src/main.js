import Vue from "vue";
import App from "./App.vue";
import router from "./router";
require('dotenv').config();
var tools = require('./tools');

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

console.log(`Key = ${process.env.COINMARKET_API_KEY}`);

tools.importCryptoData(process.env.COINMARKET_API_KEY);
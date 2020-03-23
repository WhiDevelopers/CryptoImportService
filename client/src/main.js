// var express = require('express')
// var cors = require('cors')
// var app = express()
// const port = 3000

// app.use(cors())

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(port, function () {
//   console.log('CORS-enabled web server listening on port 80')
// })


import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// require('dotenv').config();
var tools = require('./tools');

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

// console.log(`Key = ${process.env.COINMARKET_API_KEY}`);
tools.importCryptoData();

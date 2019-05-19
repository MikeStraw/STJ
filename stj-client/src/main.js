import './plugins/vuetify';

import Vue from 'vue';
import apiSvc from './services/api';
import App from './App.vue';
import router from './router';
import store from './store';
import tokenSvc from './services/token';

const API_URL = process.env.VUE_APP_BASE_URL || 'http://localhost:3000/api';

apiSvc.init(API_URL);
if (tokenSvc.getToken()) {
    console.log('main.js: getToken returns token: ', tokenSvc.getToken());
    apiSvc.addAuthHeader();
}

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

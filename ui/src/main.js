import Vue from 'vue';
import App from './App.vue';
import router from './router';

import { domain, clientId, audience } from '../auth_config.json';
import { Auth0Plugin } from './auth';

import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

// Install the authentication plugin here
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience,
  useRefreshTokens: true,
  cacheLocation: 'localstorage',
  onRedirectCallback: (appState) => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname,
    );
  },
});

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');

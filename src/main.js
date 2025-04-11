import { createApp } from 'vue';
import App from './App.vue';
import VueDatamaps from './index';

const app = createApp(App);
app.use(VueDatamaps);
app.mount('#app');

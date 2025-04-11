import VueDatamaps from './components/Datamaps.vue';

export { VueDatamaps };

export default {
  install: app => {
    app.component(VueDatamaps.name, VueDatamaps);
  }
};

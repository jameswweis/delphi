import Vue from "vue";
import VueMq from "vue-mq";

// https://bulma.io/documentation/modifiers/responsive-helpers/

Vue.use(VueMq, {
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1216,
    widescreen: 1408,
    fullhd: Infinity
  }
});

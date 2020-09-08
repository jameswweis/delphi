import Vue from "vue";
import InstantSearch from "vue-instantsearch";

import algoliasearch from "algoliasearch";

Vue.use(InstantSearch);

const client = algoliasearch("6YXVYBEVME", "a514500516c9baa99a64617a4e5a0e23");
export { client };

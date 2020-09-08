<template>
  <main class="main">
    <Navigation :sort-key="sort" :is-loading="isLoading" />
    <ResultSection
      :is-loading="isLoading"
      :data="papers"
      :has-error="hasError"
    />
    <v-tour name="myTour" :steps="steps" />
  </main>
</template>

<script>
import "@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css";
import debounce from "~/plugins/debounce.js";
// eslint-disable-next-line no-unused-vars
import { settings } from "~/plugins/settings.js";
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";
import Navigation from "~/components/Navigation.vue";
import ResultSection from "~/components/ResultSection.vue";

export default {
  name: "IndexPage",
  components: {
    Navigation,
    ResultSection
  },

  data() {
    return {
      papers: [],
      error: false,
      initialLoad: true,
      hasError: false,
      isLoading: true,
      steps: [
        {
          target: ".v-step-1",
          content:
            "Explore how various measures of research impact change over time."
        },
        {
          target: ".v-step-2",
          content:
            "Press play to advance the slider and see changes over time, or scrub on the slider to a specific point in time.",
          params: {
            placement: "top",
            enableScrolling: false
          }
        },
        {
          target: ".v-step-3",
          content: "Select the impact measure to plot on the x-axis...",
          params: {
            placement: "top",
            enableScrolling: false
          }
        },
        {
          target: ".v-step-4",
          content: "...y-axis...",
          params: {
            placement: "top",
            enableScrolling: false
          }
        },
        {
          target: ".v-step-5",
          content: "...and bubble radius.",
          params: {
            placement: "top",
            enableScrolling: false
          }
        },
        {
          target: ".v-step-6",
          content:
            "Explore metrics for papers, authors, venues, or institutions."
        }
      ]
    };
  },

  computed: {
    ...mapState("search", [
      "size_per_request",
      "sort",
      "group",
      "validSizes",
      "validSort",
      "validGroup"
    ]),
    ...mapGetters("search", [
      "getSortKey",
      "searchedKeywords",
      "filterQuery",
      "isPaperGroup",
      "isAuthorGroup",
      "isVenueGroup",
      "isAffiliationGroup",
      "authorIDsString",
      "affiliationIDsString",
      "venueIDsString"
    ]),

    authorIDs: function() {
      return this.$store.getters["search/authorIDs"];
    },

    venueIDs: function() {
      return this.$store.getters["search/venueIDs"];
    },

    affiliationIDs: function() {
      return this.$store.getters["search/affiliationIDs"];
    },

    routerQuery: function() {
      return {
        authors__in: this.authorIDsString,
        venue__in: this.venueIDsString,
        affiliations__in: this.affiliationIDsString,
        keyword: this.searchedKeywords,
        sort: this.sort,
        group: this.group,
        size_per_request: this.size_per_request
      };
    },

    fetchMethod: function() {
      if (this.isAuthorGroup) {
        return this.fetchAuthors;
      } else if (this.isVenueGroup) {
        return this.fetchVenues;
      } else if (this.isAffiliationGroup) {
        return this.fetchAffiliates;
      }
      return this.fetchPapers;
    }
  },

  watch: {
    "$route.query": {
      handler: function(newValue, oldValue) {
        if (
          Object.keys(newValue).length !=
            Object.keys(this.routerQuery).length &&
          oldValue === undefined
        ) {
          this.updateRoutes(true);
          return;
        }
        const {
          venue__in,
          authors__in,
          affiliations__in,
          group,
          size_per_request,
          sort,
          keyword
        } = newValue;
        if (
          !this.validSizes.includes(parseInt(size_per_request)) ||
          !this.validSort.includes(sort) ||
          !this.validGroup.includes(group)
        ) {
          this.updateRoutes(true);
          return;
        }

        const venues = venue__in;
        const authors = authors__in;
        const affiliations = affiliations__in;
        let hasChanges = false;
        if (venues != this.venueIDsString) {
          hasChanges = true;
          const venueIDs = this.parseAuthorAndVanue(venues);
          this.fetchInitialVenuesAndAuthors(
            venueIDs,
            this.venueIDs,
            this.removeVenue,
            this.addVenue,
            this.resetVenue,
            this.fetchVenuesById
          );
        }
        if (authors != this.authorIDsString) {
          hasChanges = true;
          const authorIDs = this.parseAuthorAndVanue(authors);
          this.fetchInitialVenuesAndAuthors(
            authorIDs,
            this.authorIDs,
            this.removeAuthor,
            this.addAuthor,
            this.resetAuthor,
            this.fetchAuthorsById
          );
        }
        if (affiliations != this.affiliationIDsString) {
          hasChanges = true;
          const affiliationIDs = this.parseAuthorAndVanue(affiliations);
          this.fetchInitialVenuesAndAuthors(
            affiliationIDs,
            this.affiliationIDs,
            this.removeAffiliation,
            this.addAffiliation,
            this.resetAffiliation,
            this.fetchAffiliationsById
          );
        }

        if (parseInt(size_per_request) != this.size_per_request) {
          hasChanges = true;
          this.updateSize(size_per_request);
        }

        if (sort != this.sort) {
          hasChanges = true;
          this.updateSort(sort);
        }

        if (group != this.group) {
          hasChanges = true;
          this.updateGroup(group);
        }

        if (keyword != this.searchedKeywords) {
          hasChanges = true;
          this.updateKeyword(keyword);
        }
        if (hasChanges) {
          // something
          return;
        } else {
          // something;
        }
      },
      immediate: true
    },

    authorIDsString: {
      handler: function(val) {
        this.triggerRouteChange(val, "authors__in");
      }
    },

    venueIDsString: {
      handler: function(val) {
        this.triggerRouteChange(val, "venue__in");
      }
    },

    affiliationIDsString: {
      handler: function(val) {
        this.triggerRouteChange(val, "affiliations__in");
      }
    },

    size_per_request: {
      handler: function(val) {
        this.triggerRouteChange(val, "size_per_request");
      }
    },

    sort: {
      handler: function(val) {
        this.triggerRouteChange(val, "sort");
      }
    },

    group: {
      handler: function(val) {
        this.triggerRouteChange(val, "group");
      }
    },

    searchedKeywords: {
      handler: function(val) {
        this.triggerRouteChange(val, "keyword");
      }
    },

    filterQuery: {
      handler: function() {
        this.triggerSearch();
      },
      immediate: true
    }
  },

  mounted: function() {
    this.$tours["myTour"].start();
  },

  methods: {
    ...mapActions("papers", [
      "fetchPapers",
      "fetchAuthors",
      "fetchVenues",
      "fetchAffiliates"
    ]),
    ...mapActions("search", [
      "fetchAuthorsById",
      "fetchVenuesById",
      "fetchAffiliationsById"
    ]),
    ...mapMutations("search", [
      "resetAuthor",
      "removeAuthor",
      "addAuthor",
      "resetVenue",
      "removeVenue",
      "addVenue",
      "updateSize",
      "updateSort",
      "updateKeyword",
      "removeAffiliation",
      "addAffiliation",
      "resetAffiliation",
      "updateGroup"
    ]),

    triggerRouteChange: function(value, key) {
      if (value == this.$route.query[key]) {
        return;
      }
      this.updateRoutes(false);
    },

    updateRoutes: function(replace = false) {
      if (replace) {
        this.$router.replace({
          path: this.$route.path,
          query: this.routerQuery
        });
      } else {
        this.$router.push({
          path: this.$route.path,
          query: this.routerQuery
        });
      }
      this.triggerSearch();
    },

    parseAuthorAndVanue: function(items) {
      if (items === "") {
        return [];
      }
      return items.split(",").reduce((acc, item) => {
        if (!isNaN(item)) {
          acc.push(parseInt(item));
        }
        return acc;
      }, []);
    },

    fetchInitialVenuesAndAuthors: async function(
      ids,
      store,
      removefn,
      addfn,
      resetfn,
      fetchfn
    ) {
      if (ids.length === 0) {
        resetfn();
        return;
      }

      const idsToRemove = store.filter(item => {
        return !ids.includes(item);
      });
      const idsToFetch = ids.filter(item => {
        return !store.includes(item);
      });

      if (idsToFetch.length === 0) {
        idsToRemove.forEach(removefn);
        return;
      }

      const payload = {
        id__in: idsToFetch
      };
      await fetchfn(payload)
        .then(response => {
          // this.tags = response.data;
          idsToRemove.forEach(removefn);
          response.forEach(addfn);
        })
        .catch(() => {
          resetfn();
        });
    },

    delayUnlock: function(data, hasError) {
      // add delay on result and lock update to consider
      // data transition
      setTimeout(() => {
        this.papers = data;
        this.hasError = hasError;
        this.isLoading = false;
      }, 500);
    },

    triggerSearch: debounce(function() {
      if (this.isLoading && !this.initialLoad) {
        return;
      }
      this.isLoading = true;
      this.initialLoad = false;
      this.hasError = false;
      this.fetchMethod(this.filterQuery)
        .then(response => {
          this.delayUnlock(response, false);
        })
        .catch(() => {
          this.delayUnlock([], true);
        });
    }, 500)
  }
};
</script>

<style lang="css">
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-enter {
  opacity: 0;
}
</style>

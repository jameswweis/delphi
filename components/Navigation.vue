<template>
  <nav>
    <div class="navbar is-info">
      <div class="navbar-brand">
        <a class="navbar-item" href="#">
          <h1 class="is-size-5 has-text-weight-bold v-step-1">
            Explore
            <strong class="heading">Scaling Science</strong>
          </h1>
        </a>

        <div class="navbar-item flex-shrink-1 is-hidden-tablet">
          <div class="control has-icons-left">
            <input
              v-model.trim.lazy="searchKeyWord"
              class="input is-rounded is-expanded"
              type="search"
              placeholder="Search for a topic"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-search" />
            </span>
          </div>
        </div>

        <a class="navbar-item is-hidden-tablet" @click="launchTour">
          <span class="icon is-medium">
            <i class="far fa-lg fa-question-circle" />
          </span>
        </a>

        <div class="navbar-item field has-addons is-hidden-mobile">
          <div class="control has-icons-left">
            <input
              v-model.trim.lazy="searchKeyWord"
              class="input is-rounded"
              type="search"
              placeholder="Search for a topic"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-search" />
            </span>
          </div>
          <div class="control">
            <div class="select is-rounded v-step-6">
              <select v-model="currentGroup">
                <option
                  v-for="option in groupOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  Explore {{ option.text }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="navbar-menu">
        <div class="navbar-end">
          <a class="navbar-item" @click="launchTour">
            <span class="icon is-medium">
              <i class="far fa-lg fa-question-circle" />
            </span>
          </a>
        </div>
      </div>
    </div>

    <div class="container padding-1">
      <div class="field is-grouped is-grouped-multiline centered-tablet">
        <div class="control is-hidden-tablet">
          <div class="select is-small is-rounded">
            <select v-model="currentGroup">
              <option
                v-for="option in groupOptions"
                :key="option.value"
                :value="option.value"
              >
                Explore {{ option.text }}
              </option>
            </select>
          </div>
        </div>
        <div class="control">
          <button
            class="button is-rounded is-small"
            :class="[isMobile ? 'is-light has-text-grey' : 'is-white']"
            :disabled="!isMobile"
            @click="toggleFilters"
          >
            <span class="filters-label">Filters</span>
            <span v-if="isMobile" class="icon">
              <i class="fas fa-angle-right" />
            </span>
          </button>
        </div>
        <div class="control filter">
          <button
            class="button is-rounded is-small"
            :class="[
              authors && authors.length > 0 ? 'is-info is-outlined' : ''
            ]"
            :disabled="group !== 'paper'"
            @click="toggleAuthorModal"
          >
            <span class="icon">
              <i class="fas fa-users" />
            </span>
            <p>
              Authors
            </p>
            <span v-if="authors.length > 0" class="icon has-text-weight-bold">
              {{ authors.length }}</span
            >
          </button>
        </div>

        <div class="control filter">
          <button
            class="button is-rounded is-small"
            :class="[venues && venues.length > 0 ? 'is-info is-outlined' : '']"
            :disabled="group !== 'paper'"
            @click="toggleVenueModal"
          >
            <span class="icon">
              <i class="fas fa-book" />
            </span>
            <p>
              Venues
            </p>
            <span v-if="venues.length > 0" class="icon has-text-weight-bold">
              {{ venues.length }}</span
            >
          </button>
        </div>

        <div class="control filter">
          <button
            class="button is-rounded is-small"
            :class="[
              affiliations && affiliations.length > 0
                ? 'is-info is-outlined'
                : ''
            ]"
            :disabled="group !== 'paper'"
            @click="toggleAffiliateModal"
          >
            <span class="icon">
              <i class="fas fa-building" />
            </span>
            <p>Institutions</p>
            <span
              v-if="affiliations.length > 0"
              class="icon has-text-weight-bold"
            >
              {{ affiliations.length }}</span
            >
          </button>
        </div>

        <div class="control filter">
          <div class="select is-rounded is-small">
            <select v-model="sortKey">
              <option
                v-for="option in sortOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>

        <div class="control filter">
          <div class="select is-rounded is-small">
            <select v-model="currentSize">
              <option
                v-for="(item, idx) in sizes"
                :key="'size-choice' + idx"
                :value="item"
              >
                Top {{ item }} results
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- start of modal section -->
    <div :class="['modal', affiliateModalActive ? 'is-active' : '']">
      <div class="modal-background" @click="toggleAffiliateModal" />
      <div class="modal-content">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              <span class="icon">
                <i class="fa fa-building" />
              </span>
              &nbsp; Filter by Author Institution
            </p>
          </header>
          <div class="card-content">
            <AffiliationFilter />
          </div>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="toggleAffiliateModal"
      />
    </div>
    <div :class="['modal', authorModalActive ? 'is-active' : '']">
      <div class="modal-background" @click="toggleAuthorModal" />
      <div class="modal-content">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              <span class="icon">
                <i class="fas fa-users" />
              </span>
              &nbsp; Filter by Author
            </p>
          </header>
          <div class="card-content">
            <AuthorFilter />
          </div>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="toggleAuthorModal"
      />
    </div>

    <div :class="['modal', venueModalActive ? 'is-active' : '']">
      <div class="modal-background" @click="toggleVenueModal" />
      <div class="modal-content">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              <span class="icon">
                <i class="fas fa-book" />
              </span>
              &nbsp; Filter by Venue
            </p>
          </header>
          <div class="card-content">
            <VenueFilter />
          </div>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="toggleVenueModal"
      />
    </div>
    <!-- end of modal sections -->
  </nav>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { settings } from "~/plugins/settings.js";

export default {
  name: "Navigation",

  components: {
    AuthorFilter: () => import("~/components/filters/AuthorFilter.vue"),
    VenueFilter: () => import("~/components/filters/VenueFilter.vue"),
    AffiliationFilter: () =>
      import("~/components/filters/AffiliationFilter.vue")
  },

  data() {
    return {
      sizes: [10, 50, 100],
      groupOptions: [
        { text: "Papers", value: "paper" },
        { text: "Authors", value: "author" },
        { text: "Venues", value: "venue" },
        { text: "Institutions", value: "affiliation" }
      ],
      authorModalActive: false,
      venueModalActive: false,
      affiliateModalActive: false
    };
  },

  computed: {
    ...mapState("search", [
      "keyword",
      "sort",
      "size_per_request",
      "authors",
      "venues",
      "group",
      "affiliations"
    ]),

    searchKeyWord: {
      get: function() {
        return this.keyword;
      },
      set: function(value) {
        this.updateKeyword(value);
      }
    },

    sortKey: {
      get: function() {
        return this.sort;
      },
      set: function(value) {
        this.updateSort(value);
      }
    },

    currentSize: {
      get: function() {
        return this.size_per_request;
      },
      set: function(value) {
        this.updateSize(value);
      }
    },

    currentGroup: {
      get: function() {
        return this.group;
      },
      set: function(value) {
        this.resetAuthor();
        this.resetVenue();
        this.resetAffiliation();
        this.updateGroup(value);
        // skip clearing keyword search on group change
        // this.clearSearch();
      }
    },

    isMobile: function() {
      return this.$mq === "mobile";
    },

    sortOptions: function() {
      return settings.fields.map(item => {
        return {
          text: `Rank by ${item.display}`,
          value: item.name
        };
      });
    }
  },

  methods: {
    ...mapMutations("search", [
      "updateKeyword",
      "updateSort",
      "updateSize",
      "updateGroup",
      "clearSearch",
      "resetAuthor",
      "resetVenue",
      "resetAffiliation"
    ]),
    submitForm: function() {
      // prevent default form submit event
      return;
    },

    toggleAuthorModal: function() {
      this.authorModalActive = !this.authorModalActive;
    },

    toggleVenueModal: function() {
      this.venueModalActive = !this.venueModalActive;
    },

    isactiveFilterClass: function(x) {
      return this.group === x ? "is-info is-selected" : "";
    },

    toggleAffiliateModal: function() {
      this.affiliateModalActive = !this.affiliateModalActive;
    },

    setGroup: function(val) {
      // TODO remove when we support group + filter
      this.resetAuthor();
      this.resetVenue();
      this.resetAffiliation();
      this.updateGroup(val);
      // skip clearing keyword search on group change
      // this.clearSearch();
    },

    toggleFilters: function() {
      const filters = this.$el.querySelectorAll(".filter");
      filters.forEach(filter => filter.classList.toggle("visible"));
    },

    launchTour: function() {
      this.$tours["myTour"].start();
    }
  }
};
</script>

<style lang="css" scoped>
.flex-shrink-1 {
  flex-shrink: 1;
}

.modal-content {
  min-height: 400px;
}

.filter {
  display: none;
}

.filter.visible {
  display: block;
}

@media screen and (min-width: 769px) {
  .filter {
    display: block;
  }

  .field.is-grouped.centered-tablet {
    justify-content: center;
  }
}
</style>

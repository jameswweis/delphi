<template>
  <article class="paper-item">
    <aside>
      <svg viewBox="0 0 20 20" width="20px" height="20px">
        <circle cx="10" cy="10" r="10" :fill="color" />
      </svg>
    </aside>

    <div>
      <h2 class="has-text-weight-semibold">
        <a v-if="hasDOI" :href="doi" target="_blank" rel="noreferrer">
          {{ titleCase(paper.title) }}
        </a>
        <template v-else>
          <a target="_blank" rel="noreferrer" @click.prevent="handleTitleClick">
            {{ titleCase(paper.title) }}
          </a>
        </template>
      </h2>

      <template v-if="group == 'author'">
        <p v-if="paper.affiliate">
          {{ paper.affiliate.name }}
        </p>
      </template>

      <StatsDisplay
        v-if="paper.stats"
        :stats="paper.stats"
        :year-from-store="fromModal"
      />

      <template v-if="isPaperGroup">
        <p class="is-italic">
          <a @click.prevent="handleVenueClick"> {{ venueName }}</a
          >, <span class="has-text-link">{{ paper.year }}</span>
        </p>

        <AuthorList :authors="authors" />

        <details v-if="paper.abstract != false">
          <summary class="is-size-7">
            Abstract
          </summary>
          <p>{{ paper.abstract }}</p>
        </details>

        <details v-if="keywords.length > 0">
          <summary class="is-size-7">
            Keywords
          </summary>
          <p>{{ keywords.join(", ").toLowerCase() }}</p>
        </details>

        <details v-if="paper.authors != null">
          <summary class="is-size-7">
            Author affiliations
          </summary>
          <div class="content">
            <ul class="institution-list">
              <li v-for="affiliation in authorAffiliations" :key="affiliation">
                {{ affiliation }}
              </li>
            </ul>
          </div>
        </details>
      </template>
    </div>
  </article>
</template>

<script>
require("@gouch/to-title-case");
import { mapMutations, mapState } from "vuex";
import AuthorList from "./AuthorList.vue";

export default {
  name: "PaperItem",

  components: {
    AuthorList,
    // lazy load optional component
    StatsDisplay: () => import("~/components/papers/StatsDisplay.vue")
  },

  props: {
    paper: {
      type: Object,
      required: true
    },

    color: {
      type: String,
      required: false,
      default: () => "black"
    },

    fromModal: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {};
  },

  computed: {
    ...mapState("search", ["group"]),

    doi: function() {
      if (!this.isPaperGroup) {
        return "#";
      }
      return `https://doi.org/${this.paper.doi}`;
    },

    hasDOI: function() {
      if (!this.isPaperGroup) {
        return false;
      }
      return this.paper.doi != "";
    },

    isPaperGroup() {
      return this.group == "paper";
    },

    authors: function() {
      return this.paper.authors || [];
    },

    authorsName: function() {
      return this.authors.map(item => item.name);
    },

    venueName: function() {
      if (this.paper.venue) {
        return this.paper.venue.name;
      }
      return "";
    },

    venueId: function() {
      if (this.paper.venue) {
        return this.paper.venue.id;
      }
      return "";
    },

    keywords: function() {
      return this.paper.keywords || [];
    },

    first5Authors: function() {
      return this.authorsName.slice(0, 5).join(", ");
    },

    authorsRest: function() {
      return this.authorsName.slice(5).join(", ");
    },

    authorsAll: function() {
      return this.authorsName.join(", ");
    },

    borderColor: function() {
      return `border-bottom-color: ${this.color}`;
    },

    authorAffiliations: function() {
      let affiliations = this.authors
        .map(author => (author.affiliate ? author.affiliate.name : ""))
        .filter(institution => institution !== "");

      // deduplicate
      affiliations = Array.from(new Set(affiliations));

      return affiliations;
    }
  },

  methods: {
    ...mapMutations("search", [
      "addVenue",
      "clearSearch",
      "addAuthor",
      "addAffiliation",
      "updateGroup"
    ]),

    titleCase: function(title) {
      if (!title) return;

      if (title.toUpperCase() === title) {
        title = title.toLowerCase();
      }

      return title.toTitleCase();
    },

    fixObjID: function(obj) {
      if (!obj.id && obj.pk) {
        obj.id = obj.pk;
      }
      return obj;
    },

    handleVenueClick: function() {
      const venue = this.fixObjID(this.paper.venue);
      this.clearSearch();
      this.addVenue(venue);
    },

    handleTitleClick: function() {
      if (this.isPaperGroup) {
        return;
      }
      const obj = this.fixObjID(this.paper);
      this.clearSearch();
      if (this.group == "author") {
        this.addAuthor(obj);
      } else if (this.group == "venue") {
        this.addVenue(obj);
      } else if (this.group == "affiliation") {
        this.addAffiliation(obj);
      }
      this.updateGroup("paper");
    }
  }
};
</script>

<style lang="css" scoped>
article {
  display: flex;
}

aside {
  margin-right: 1em;
  margin-top: 0.1em;
}

.institution-list {
  margin-top: 0.5rem;
}
</style>

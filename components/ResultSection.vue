<template>
  <div>
    <div v-if="isLoading" id="spinner" class="level-item has-text-centered">
      <span class="icon has-text-success">
        <i class="fas fa-spinner fa-pulse fa-3x" />
      </span>
    </div>
    <div v-else>
      <article
        v-show="data.length == 0 && !hasError"
        class="message is-warning"
      >
        <div class="message-body">
          <strong>No results matched your query</strong><br />
          Try fewer filters, or different keywords.
        </div>
      </article>
      <article v-show="hasError" class="message is-danger">
        <div class="message-body">
          <strong>Database timeout</strong><br />
          Please refresh the page, or try again later.
        </div>
      </article>
      <div id="results">
        <div class="padding-1">
          <div class="chart has-background-white list">
            <header class="card-header">
              <p class="card-header-title is-size-5">
                Research Impact Metrics Over Time
              </p>
              <DownloadButton class="card-header-icon" :results="data" />
            </header>
            <div class="card-content">
              <h2 class="subtitle is-6">
                How various measures of research impact change in the years
                following publication
              </h2>
              <ImpactScatterplot :papers="papers" />
            </div>
          </div>
          <div class="has-text-centered">
            <a href="#result-list" class="button is-small">
              <span class="icon">
                <i class="fas fa-list" />
              </span>
              <span>Result list</span>
            </a>
          </div>
        </div>
        <div class="padding-1">
          <PaperList id="result-list" class="result-list" :papers="papers" />
          <div class="sticky-bottom has-text-right">
            <a href="#" class="button is-info">
              ↑
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import { scaleOrdinal } from "d3-scale";
import { schemeTableau10 } from "d3-scale-chromatic";

const d3 = { scaleOrdinal, schemeTableau10 };

export default {
  name: "ResultSection",

  components: {
    PaperList: () => import("~/components/papers/PaperList.vue"),
    ImpactScatterplot: () =>
      import("~/components/impact_scatterplot/ImpactScatterplot.vue"),
    DownloadButton: () => import("~/components/DownloadButton.vue")
  },

  props: {
    data: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: true
    },
    hasError: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      columns: ["citations", "timescaledpagerank", "hindex"],
      years: 5,
      colors: d3.scaleOrdinal(d3.schemeTableau10)
    };
  },

  computed: {
    ...mapState("papers", { _search: "search" }),
    ...mapState("search", ["authors", "venues"]),
    ...mapGetters("search", ["affiliationIDs"]),

    searchAuthorNames: function() {
      return this.authors.map(author => author.name);
    },

    formattedData: function() {
      return this.formatData(this.papers, this.years, this.columns);
    },

    papers: function() {
      if (this.data.length === 0) return [];

      const result = Object.assign([], this.data);
      result.forEach((paper, i) => {
        paper.color = this.paperColor(paper, i);
      });
      return result;
    },

    papersAffiliations: function() {
      return this.data.map(paper =>
        paper.authors
          .map(author => (author.affiliate ? author.affiliate.id : -1))
          .filter(affiliateId => affiliateId > -1)
      );
    },

    firstAffiliations: function() {
      // which affiliation in the filter list comes first
      // in the list of authors for each paper?
      return this.affiliationIDs.length > 0
        ? this.papersAffiliations.map(
            affiliations =>
              affiliations.filter(id => this.affiliationIDs.includes(id))[0]
          )
        : [];
    }
  },

  methods: {
    paperColor: function(paper, i) {
      if (this.authors.length > 1) {
        // first author we find who is in the search list
        let firstAuthor = "";
        paper.authors
          .map(author => author.name)
          .some(name => {
            firstAuthor = name;
            return this.searchAuthorNames.includes(name);
          });

        return this.colors(firstAuthor);
      } else if (this.venues.length > 1) {
        return this.colors(paper.venue.name);
      } else if (this.affiliationIDs.length > 1) {
        return this.colors(this.firstAffiliations[i]);
      }

      return this.colors(i);
    },

    formatData: function(papers, maxYear, columns) {
      let result = [];
      papers.forEach((paper, i) => {
        for (let year = 0; year <= maxYear; year++) {
          let newRow = {
            id: paper.id,
            year: paper.year,
            yearFromPublication: year,
            rank: i + 1
          };

          columns.forEach(column => {
            newRow[column] = paper[`${column}_${year}`];
          });

          result.push(newRow);
        }
      });

      return result;
    }
  }
};
</script>

<style lang="css" scoped>
#spinner {
  margin-top: 5em;
}

.chart {
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
}

.result-list {
  max-width: 80ch;
  margin-left: auto;
  margin-right: auto;
}

.sticky-bottom {
  position: sticky;
  bottom: 2rem;
}

.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.no-data-text {
  margin-top: 21%;
}
</style>

<template>
  <div class="dropdown is-right is-hoverable">
    <div class="dropdown-trigger">
      <button
        class="button is-small"
        aria-haspopup="true"
        aria-controls="dropdown-menu6"
      >
        <span class="icon is-small">
          <i class="fas fa-file-download" aria-hidden="true" />
        </span>
        <span>Download CSV</span>
      </button>
    </div>
    <div id="dropdown-menu6" class="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <div class="dropdown-item">
          <div class="field has-addons">
            <p class="control">
              <span class="select is-small">
                <select
                  v-model="size_to_download"
                  :disabled="downloadLock || disabled"
                >
                  <option
                    v-for="x in allowed_sizes"
                    :key="`${x}-records`"
                    :value="x"
                  >
                    {{ abvDownloadLabel(x) }} records
                  </option>
                </select>
              </span>
            </p>
            <p class="control">
              <button
                class="button is-small is-link download-btn"
                :disabled="downloadLock || disabled"
                @click="triggerDownloadResult"
              >
                Download
                <i v-if="downloadLock" class="fas fa-spinner fa-pulse" />
              </button>
              <a
                ref="downloadCSVTemplate"
                :disabled="downloadLock || disabled"
                :href="csvLink"
                :download="downloadFilename"
                class="hidden"
                @click="downloadLock = false"
              />
            </p>
          </div>
        </div>
        <hr class="dropdown-divider" />
        <a
          href="mailto:scaling-science-explore@mit.edu"
          class="dropdown-item"
          target="_blank"
          rel="noopener noreferrer"
        >
          Request full data set
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { settings } from "~/plugins/settings.js";

export default {
  name: "DownloadButton",

  props: {
    results: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      local_results: [],
      downloadLock: false,
      size_to_download: 10,
      allowed_sizes: [10, 1000, 10000]
    };
  },

  computed: {
    ...mapState("search", ["group", "size_per_request"]),
    ...mapGetters("search", [
      "filterQuery",
      "isAuthorGroup",
      "isVenueGroup",
      "isAffiliationGroup"
    ]),

    disabled() {
      return this.cleanedResult.length == 0;
    },

    customCSVHeader() {
      return settings.fields.reduce((acc, cur) => {
        acc[cur["name"].toLowerCase()] = cur["display"];
        return acc;
      }, {});
    },

    csvLink() {
      if (this.disabled) {
        return;
      }
      const headers = this.csvRows;
      const rows = this.cleanedResult.reduce(
        (acc, item) => {
          const values = headers.map(key => {
            let value = item[key];
            if (key == "venue" || key == "affiliate") {
              if (value) {
                value = `"${value["name"]}"`;
              } else {
                value = "";
              }
            } else if (key == "authors" && value) {
              value = `"${value.map(x => x["name"]).join(", ")}"`;
            } else if (key == "title") {
              value = `"${value.replace(/,/g, " ")}"`;
            } else if (key == "keywords" && value) {
              value = `"${value.join(", ")}"`;
            } else if (key == "abstract") {
              value = `"${value.replace(/#/g, " ").replace(/ {2}/g, " ")}"`;
            } else {
              value = `"${value}"`;
            }
            return value;
          });
          acc.push(values);
          return acc;
        },
        [Object.assign([], headers).map(item => this.getHeaderDisplay(item))]
      );

      let csvContent = "data:text/csv;charset=utf-8,";
      rows.forEach(function(rowArray) {
        csvContent += rowArray.join(",") + "\r\n";
      });
      return encodeURI(csvContent);
    },

    csvRows() {
      if (this.disabled) {
        return;
      }
      const customKey = ["title"];
      const statsKeys = settings.STATS_FIELDS;

      if (this.group == "paper") {
        customKey.push("venue");
        customKey.push("authors");
        customKey.push("keywords");
        customKey.push("doi");
        customKey.push("abstract");
        customKey.push("year");
      } else if (this.group == "author") {
        customKey.push("affiliate");
      }
      return customKey.concat(statsKeys);
    },

    cleanedResult() {
      return this.local_results.reduce((acc, item) => {
        const copyItem = Object.assign({}, item);
        delete copyItem["uuid"];
        delete copyItem["color"];
        delete copyItem["stats"];
        acc.push(copyItem);
        return acc;
      }, []);
    },

    downloadFilename() {
      return `SSE_${this.group}_${this.abvDownloadLabel(
        this.size_to_download
      )}_result.csv`;
    },

    customFilterQuery: function() {
      const filters = this.filterQuery;
      delete filters["size_per_request"];
      filters["csv_size_per_request"] = this.size_to_download;
      return filters;
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
    size_to_download: {
      handler(value) {
        // enforce number of downloadable csv
        if (this.allowed_sizes.indexOf(value) < 0) {
          this.size_to_download = this.allowed_sizes[0];
        }
      }
    }
  },

  created() {
    this.local_results = this.results;
    this.allowed_sizes.splice(0, 1, this.size_per_request);
    this.size_to_download = this.size_per_request;
  },

  methods: {
    ...mapActions("papers", [
      "fetchPapers",
      "fetchAuthors",
      "fetchVenues",
      "fetchAffiliates"
    ]),

    abvDownloadLabel(num) {
      // handle number to abv thousands
      if (num >= 1000) {
        return `${num / 1000}k`;
      }
      return num;
    },

    async triggerDownloadResult() {
      if (this.downloadLock) {
        return;
      }
      this.downloadLock = true;
      if (this.size_per_request != this.size_to_download) {
        await this.fetchExpectedResult();
      }
      this.downloadLock = false;
      this.$refs.downloadCSVTemplate.click();
    },

    getHeaderDisplay(key) {
      // customize stats keys based on the config.json
      if (key.indexOf("_") >= 0) {
        let keyName = key.split("_")[0];
        const newHeader = this.customCSVHeader[keyName.toLowerCase()];
        if (newHeader) {
          return key.replace(keyName, newHeader);
        }
        return key;
      }
      return key.charAt(0).toUpperCase() + key.slice(1);
    },

    fetchExpectedResult() {
      return this.fetchMethod(this.customFilterQuery).then(response => {
        this.local_results = response;
      });
    }
  }
};
</script>

<style lang="css" scoped>
button.download-btn .fas {
  margin-left: 10px;
}
</style>

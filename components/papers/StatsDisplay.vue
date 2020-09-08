<template>
  <div class="stats-display tags">
    <span
      v-for="(tag, index) in tagsToDisplay"
      :key="`tag_${index}`"
      class="tag"
    >
      {{ tag["text"] }}: {{ getTotalFieldValue(tag["value"]) }}
    </span>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "StatsDisplay",
  props: {
    stats: {
      type: Object,
      required: true
    },
    yearFromStore: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {};
  },

  computed: {
    ...mapState("graph", ["fieldOptions", "yearRange", "currentScrollYear"]),
    ...mapGetters("graph", ["getXAxis", "getYAxis", "getRadius"]),

    tagsToDisplay: function() {
      return [...new Set([this.getXAxis, this.getYAxis, this.getRadius])]
        .sort()
        .map(item => {
          const fieldData = this.fieldOptions.find(x => x["value"] === item);
          if (fieldData) {
            return fieldData;
          }
          return;
        });
    },

    maxYear: function() {
      if (this.yearFromStore) {
        return this.currentScrollYear;
      }
      return this.yearRange.max;
    }
  },

  methods: {
    getTotalFieldValue: function(field) {
      return this.round(this.stats[`${field}_${this.maxYear}`] || 0);
    },

    round: function(n) {
      return Math.round(n * 100) / 100;
    }
  }
};
</script>

<style lang="css" scoped>
.stats-display {
  margin-top: 0.5rem;
  margin-bottom: 0;
}
</style>

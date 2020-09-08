<template>
  <div class="box" :style="position">
    <p class="has-text-weight-bold">
      {{ title }}
    </p>
    <p class="content is-italic has-text-grey">
      {{ content }}
    </p>
    <StatsDisplay v-if="paper.stats" :stats="paper.stats" year-from-store />
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ChartTooltip",

  components: {
    // lazy load optional component
    StatsDisplay: () => import("~/components/papers/StatsDisplay.vue")
  },

  props: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    paper: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapState("search", ["group"]),

    position: function() {
      return `position: absolute; top: ${this.y + 20}px; left: ${this.x +
        20}px`;
    },

    venue: function() {
      return this.paper.venue ? this.paper.venue.name : "";
    },

    title: function() {
      if (this.group == "paper") {
        return this.paper.title;
      }
      return this.paper.name;
    },

    content: function() {
      if (this.group == "paper") {
        const { venue, year } = this.paper;
        let result = "";
        if (venue) {
          result += `${venue.name}, `;
        }
        return `${result} ${year}`;
      }
      return "";
    }
  },

  methods: {}
};
</script>

<style scoped>
div.box {
  max-width: 35ch;
}
</style>

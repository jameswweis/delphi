<template>
  <transition appear name="fade">
    <div id="vis" />
  </transition>
</template>

<script>
import embed from "vega-embed";

export default {
  name: "LineCharts",

  props: {
    papers: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    }
  },

  data() {
    return {};
  },

  computed: {
    spec: function() {
      return {
        data: {
          values: this.papers
        },
        repeat: this.columns,
        columns: 1,
        spec: {
          width: 400,
          height: 300,
          mark: "line",
          encoding: {
            x: { field: "yearFromPublication", type: "ordinal" },
            y: {
              field: {
                repeat: "repeat"
              },
              type: "quantitative"
            },
            color: { field: "rank", type: "nominal", legend: null }
          }
        }
      };
    }
  },

  mounted() {
    embed("#vis", this.spec);
  }
};
</script>

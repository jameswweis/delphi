<template>
  <g :transform="position" />
</template>

<script>
import { select } from "d3-selection";
import { axisLeft } from "d3-axis";

const d3 = { select, axisLeft };

export default {
  name: "ImpactScatterplotYAxis",

  props: {
    scale: {
      type: Object,
      required: true
    },
    margin: {
      type: Object,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },

  computed: {
    position: function() {
      return `translate(${this.margin.left},0)`;
    }
  },

  watch: {
    scale: function() {
      this.updateScale();
    }
  },

  mounted: function() {
    this.updateScale();
  },

  methods: {
    updateScale: function() {
      d3.select(this.$el).call(d3.axisLeft(this.scale.y));
    }
  }
};
</script>

<style scoped></style>

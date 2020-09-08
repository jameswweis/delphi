<template>
  <g :transform="position" />
</template>

<script>
import { select } from "d3-selection";
import { axisBottom } from "d3-axis";

const d3 = { select, axisBottom };

export default {
  name: "ImpactScatterplotXAxis",

  props: {
    scale: {
      type: Object,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
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
      return `translate(0,${this.height - this.margin.bottom})`;
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
      d3.select(this.$el).call(d3.axisBottom(this.scale.x));
    }
  }
};
</script>

<style scoped></style>

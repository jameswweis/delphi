<template>
  <g>
    <circle
      v-for="paper in papers"
      :key="paper.id"
      stroke="white"
      :style="position(paper[fields.x], paper[fields.y])"
      :r="scale.radius(paper[fields.r])"
      :fill="paper.color"
      @mouseover="showTooltip(paper, $event)"
      @mouseleave="$emit('hide-tooltip')"
      @click="$emit('show-paper-detail', paper)"
    />
  </g>
</template>

<script>
export default {
  name: "PapersCircles",

  props: {
    papers: {
      type: Array,
      required: true
    },
    fields: {
      type: Object,
      required: true
    },
    scale: {
      type: Object,
      required: true
    }
  },

  methods: {
    position: function(x, y) {
      return `transform:translate(${this.scale.x(x)}px, ${this.scale.y(y)}px)`;
    },

    showTooltip: function(paper, event) {
      this.$emit("show-tooltip", {
        x: event.pageX,
        y: event.pageY,
        paper: paper
      });
    },

    paperLink: function(id) {
      let to = new URL(location);
      to.hash = encodeURIComponent(`p${id}`);
      return to.href;
    }
  }
};
</script>

<style scoped>
circle {
  -webkit-transition: transform 0.7s ease-in-out, r 0.7s ease-in-out;
  -moz-transition: transform 0.7s ease-in-out, r 0.7s ease-in-out;
  transition: transform 0.7s ease-in-out, r 0.7s ease-in-out;
}

circle:hover {
  fill: lightgray;
  cursor: pointer;
}
</style>

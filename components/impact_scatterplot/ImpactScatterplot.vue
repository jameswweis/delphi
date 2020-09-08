<template>
  <transition appear name="fade">
    <div id="chart">
      <div class="field is-grouped is-grouped-right">
        <ChartAttributeSelect v-model="radius" class="v-step-5" symbol="○" />
      </div>
      <div class="two-col">
        <div class="width-2rem">
          <ChartAttributeSelect
            v-model="yAxis"
            class="v-step-4"
            symbolpost="→"
            :rotate="true"
          />
        </div>
        <svg :viewBox="chartViewbox">
          <g class="legend">
            <circle fill="lightgray" r="12" :cx="width - 50" :cy="15" />
            <circle fill="lightgray" r="8.5" :cx="width - 73" :cy="15" />
            <circle fill="lightgray" r="5" :cx="width - 90" :cy="15" />
          </g>
          <ImpactScatterplotXAxis
            :scale="scale"
            :width="width"
            :height="height"
            :margin="margin"
            :label="fieldLabel(xAxis)"
          />
          <ImpactScatterplotYAxis
            :scale="scale"
            :margin="margin"
            :label="fieldLabel(yAxis)"
          />
          <PapersCircles
            :papers="dataThisYear"
            :scale="scale"
            :fields="fields"
            @show-paper-detail="showPaperDetail"
            @show-tooltip="showTooltip"
            @hide-tooltip="tooltipActive = false"
          />
        </svg>
      </div>
      <div class="field is-grouped is-grouped-centered">
        <ChartAttributeSelect v-model="xAxis" class="v-step-3" symbolpost="→" />
      </div>
      <YearScrubber v-model.number="year" :year-range="yearRange" />
      <PaperModal
        :paper="paperDetail"
        :active="modalActive"
        @close="modalActive = false"
      />
      <ChartTooltip
        v-show="tooltipActive"
        :x="tooltipX"
        :y="tooltipY"
        :paper="paperDetail"
      />
    </div>
  </transition>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

import YearScrubber from "./YearScrubber.vue";
import PapersCircles from "./PapersCircles.vue";
import ChartTooltip from "./ChartTooltip.vue";
import ChartAttributeSelect from "./ChartAttributeSelect.vue";
import ImpactScatterplotXAxis from "./ImpactScatterplotXAxis.vue";
import ImpactScatterplotYAxis from "./ImpactScatterplotYAxis.vue";
import PaperModal from "~/components/papers/PaperModal.vue";

import { descending, max, merge } from "d3-array";
import { scaleLinear, scaleSqrt } from "d3-scale";

const d3 = { descending, scaleLinear, scaleSqrt, max, merge };

export default {
  name: "ImpactScatterplot",

  components: {
    YearScrubber,
    PapersCircles,
    ImpactScatterplotXAxis,
    ImpactScatterplotYAxis,
    PaperModal,
    ChartTooltip,
    ChartAttributeSelect
  },

  props: {
    papers: {
      type: Array,
      required: true
    }
  },

  data: function() {
    return {
      width: 800,
      height: 400,
      margin: { top: 20, right: 20, bottom: 35, left: 40 },
      modalActive: false,
      paperDetail: {},
      tooltipActive: false,
      tooltipX: 400,
      tooltipY: 400
    };
  },

  computed: {
    ...mapState("graph", [
      "fieldOptions",
      "yearRange",
      "fieldNames",
      "currentScrollYear"
    ]),
    ...mapGetters("graph", ["getXAxis", "getYAxis", "getRadius"]),

    year: {
      get() {
        return this.currentScrollYear;
      },
      set(value) {
        this.setCurrentScrollYear(value);
      }
    },

    xAxis: {
      get() {
        return this.getXAxis;
      },
      set(value) {
        this.setXAxis(value);
      }
    },

    yAxis: {
      get() {
        return this.getYAxis;
      },
      set(value) {
        this.setYAxis(value);
      }
    },

    radius: {
      get() {
        return this.getRadius;
      },
      set(value) {
        this.setRadius(value);
      }
    },

    fields: function() {
      return {
        x: this.xAxis,
        y: this.yAxis,
        r: this.radius
      };
    },

    dataThisYear: function() {
      return this.dataAt(this.year);
    },

    chartViewbox: function() {
      return [0, 0, this.width, this.height];
    },

    scale: function() {
      const hasPapers = this.papers.length > 0;
      // update to support config json to dynamically setup max whatever field
      // specified in config
      const max = this.fieldNames.reduce((acc, cur) => {
        const _fieldName = cur;
        let defaultMax = 100;
        if (!hasPapers) {
          if (_fieldName === "timescaledpagerank") {
            defaultMax = 100;
          } else if (_fieldName === "citations") {
            defaultMax = 220;
          } else if (_fieldName === "hindex") {
            defaultMax = 90;
          }
        } else {
          defaultMax = this.max(_fieldName);
        }
        acc[_fieldName] = defaultMax;
        return acc;
      }, {});

      return {
        x: d3
          .scaleLinear(
            [0, max[this.xAxis]],
            [this.margin.left, this.width - this.margin.right]
          )
          .nice(),
        y: d3
          .scaleLinear(
            [0, max[this.yAxis]],
            [this.height - this.margin.bottom, this.margin.top]
          )
          .nice(),
        radius: d3.scaleSqrt([0, max[this.radius]], [3, this.width / 40]).nice()
      };
    },

    sortedPapers: function() {
      return this.papers
        .concat()
        .sort((a, b) => d3.descending(a.hindex_0, b.hindex_0));
    }
  },

  watch: {
    papers: function() {
      this.year = this.yearRange.min;
      this.modalActive = false;
    }
  },

  methods: {
    ...mapActions("graph", [
      "setXAxis",
      "setYAxis",
      "setRadius",
      "setCurrentScrollYear"
    ]),

    fieldLabel: function(fieldOption) {
      const label = this.fieldOptions.find(item => item.value === fieldOption);
      if (label) {
        return label.text;
      }
      return "";
    },

    dataAt: function(year) {
      return this.sortedPapers.map(paper => {
        return {
          ...paper,
          ...this.fieldNames.reduce((acc, cur) => {
            const _fieldName = cur;
            acc[_fieldName] = paper["stats"][`${_fieldName}_${year}`] || 0;
            return acc;
          }, {})
        };
      });
    },

    max: function(column) {
      // for every paper, make an array of values from [0..5]
      const allValues = this.papers.map(paper => {
        const values = [];
        for (
          let year = this.yearRange.min;
          year <= this.yearRange.max;
          year++
        ) {
          values.push(paper["stats"][`${column}_${year}`]);
        }
        return values;
      });
      // find the max in all those arrays
      return d3.max(d3.merge(allValues));
    },

    showPaperDetail: function(paper) {
      this.paperDetail = paper;
      this.modalActive = true;
    },

    showTooltip: function({ x, y, paper }) {
      this.tooltipX = x;
      this.tooltipY = y;
      this.paperDetail = paper;
      this.tooltipActive = true;
    }
  }
};
</script>

<style lang="css" scoped>
.two-col {
  display: flex;
  align-items: center;
}

.width-2rem {
  width: 2rem;
}

svg {
  width: 100%;
  height: 100%;
}

.legend text {
  font-size: 0.6em;
}

.field.is-grouped.is-spaced {
  justify-content: space-between;
}
</style>

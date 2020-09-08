<template>
  <form>
    <div class="controls">
      <button v-if="isPlaying" class="button" type="button" @click="togglePlay">
        <span class="icon">
          <i class="fas fa-pause" />
        </span>
      </button>
      <button v-else class="button v-step-2" type="button" @click="togglePlay">
        <span class="icon">
          <i class="fas fa-play" />
        </span>
      </button>
      <VueSlideBar
        v-model="inputYear"
        :data="slider.data"
        :range="slider.range"
        :line-height="slider.lineHeight"
        :process-style="{ backgroundColor: '#d8d8d8' }"
        :tooltip-styles="{
          backgroundColor: 'hsl(204, 86%, 53%)',
          borderColor: 'hsl(204, 86%, 53%)'
        }"
      />
    </div>
    <p class="content has-text-centered is-size-7">
      Years post-publication
    </p>
  </form>
</template>

<script>
import VueSlideBar from "vue-slide-bar";

const fps = 1;

export default {
  name: "YearScrubber",

  components: {
    VueSlideBar
  },

  props: {
    value: {
      type: Number,
      required: true
    },
    yearRange: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      inputYear: this.value,
      timer: null
    };
  },

  computed: {
    isPlaying: function() {
      return this.timer == null ? false : true;
    },

    slider: function() {
      // do a +1 of max years since year data starts in 0
      return [...Array(this.yearRange["max"] + 1).keys()].reduce(
        (acc, cur) => {
          acc["data"].push(cur);
          acc["range"].push({ label: `${cur}` });
          return acc;
        },
        {
          data: [],
          range: [],
          lineHeight: 10
        }
      );
    }
  },

  watch: {
    inputYear: function() {
      this.$emit("input", this.inputYear);
    }
  },

  methods: {
    reset: function() {
      if (this.inputYear === this.yearRange.max) {
        this.inputYear = this.yearRange.min;
      }
    },

    tick: function() {
      if (this.inputYear < this.yearRange.max) {
        this.inputYear++;
      } else {
        this.stop();
      }
    },

    stop: function() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    start: function() {
      if (!this.timer) {
        this.reset();
        this.timer = setInterval(this.tick, 1000 / fps);
      }
    },

    togglePlay: function() {
      if (this.timer) {
        this.stop();
      } else {
        this.start();
      }
    }
  }
};
</script>

<style scoped>
output {
  font-size: 0.75em;
  text-align: center;
}

datalist {
  display: block;
}

.controls {
  display: flex;
  align-items: center;
}

.controls > * {
  margin-right: 1em;
}

.controls > :last-child {
  flex-grow: 999;
}

input[type="range"] {
  height: 31px;
  -webkit-appearance: none;
  width: 100%;
}
input[type="range"]:focus {
  outline: none;
}
input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 9px;
  cursor: pointer;
  box-shadow: 0px 0px 0px #000000;
  background: #e3e3e3;
  border-radius: 25px;
  border: 0px solid #8a8a8a;
}
input[type="range"]::-webkit-slider-thumb {
  box-shadow: 0px 0px 1px #828282;
  border: 1px solid #8a8a8a;
  height: 24px;
  width: 10px;
  border-radius: 6px;
  background: #dadada;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -8px;
}
input[type="range"]:focus::-webkit-slider-runnable-track {
  background: #e3e3e3;
}
input[type="range"]::-moz-range-track {
  width: 100%;
  height: 9px;
  cursor: pointer;
  box-shadow: 0px 0px 0px #000000;
  background: #e3e3e3;
  border-radius: 25px;
  border: 0px solid #8a8a8a;
}
input[type="range"]::-moz-range-thumb {
  box-shadow: 0px 0px 1px #828282;
  border: 1px solid #8a8a8a;
  height: 24px;
  width: 10px;
  border-radius: 6px;
  background: #dadada;
  cursor: pointer;
}
input[type="range"]::-ms-track {
  width: 100%;
  height: 9px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type="range"]::-ms-fill-lower {
  background: #e3e3e3;
  border: 0px solid #8a8a8a;
  border-radius: 50px;
  box-shadow: 0px 0px 0px #000000;
}
input[type="range"]::-ms-fill-upper {
  background: #e3e3e3;
  border: 0px solid #8a8a8a;
  border-radius: 50px;
  box-shadow: 0px 0px 0px #000000;
}
input[type="range"]::-ms-thumb {
  margin-top: 1px;
  box-shadow: 0px 0px 1px #828282;
  border: 1px solid #8a8a8a;
  height: 24px;
  width: 10px;
  border-radius: 6px;
  background: #dadada;
  cursor: pointer;
}
input[type="range"]:focus::-ms-fill-lower {
  background: #e3e3e3;
}
input[type="range"]:focus::-ms-fill-upper {
  background: #e3e3e3;
}
</style>

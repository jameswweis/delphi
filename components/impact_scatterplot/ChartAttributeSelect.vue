<template>
  <div class="control" :class="{ 'rotate-ccw': rotate }">
    <div class="select is-small">
      <select :value="value" @input="$emit('input', $event.target.value)">
        <option
          v-for="option in fieldOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ symbol }} {{ option.text }} {{ symbolpost }}
        </option>
      </select>
    </div>
    <span
      :data-tooltip="info"
      class="icon has-text-grey-lighter has-tooltip-arrow has-tooltip-info has-tooltip-multiline"
      :class="{ 'has-tooltip-right rotate': rotate }"
    >
      <i class="fa fa-info-circle" />
    </span>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ChartAttributeSelect",

  props: {
    value: {
      type: String,
      required: true
    },
    symbol: {
      type: String,
      required: false,
      default: ""
    },
    symbolpost: {
      type: String,
      required: false,
      default: ""
    },
    rotate: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: function() {
    return {};
  },

  computed: {
    ...mapState("graph", ["fieldOptions"]),

    info: function() {
      const item = this.fieldOptions.find(
        option => option.value === this.value
      );
      if (item) {
        return item["info"];
      }
      // default to return an empty string for non-existing field
      return "";
    }
  }
};
</script>

<style scoped>
.rotate {
  transform: rotate(90deg);
}

.rotate-ccw {
  transform: translate(-50px, -50px) rotate(-90deg);
  width: 150px;
}
</style>

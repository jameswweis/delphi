<template>
  <Autocomplete
    :placeholder="placeholder"
    :aria-label="placeholder"
    :search="search"
    :debounce-time="500"
    @submit="handleSubmit"
  >
    <template
      #default="{
        loading,
        rootProps,
        inputProps,
        inputListeners,
        resultListProps,
        resultListListeners,
        results,
        resultProps,
      }"
    >
      <div class="control has-icons-left" v-bind="rootProps">
        <input
          v-model="value"
          v-bind="inputProps"
          :class="[
            'input',
            {
              'autocomplete-input-no-results':
                loading && value && results.length === 0
            },
            { 'autocomplete-input-focused': focused }
          ]"
          v-on="inputListeners"
          @focus="handleFocus"
          @blur="handleBlur"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-search" />
        </span>
        <ul
          v-if="!loading && value && results.length === 0"
          class="autocomplete-result-list"
          style="position: absolute; z-index: 1; width: 100%; top: 100%;"
        >
          <li class="autocomplete-result">
            No results found
          </li>
        </ul>
        <ul v-bind="resultListProps" v-on="resultListListeners">
          <li
            v-for="(result, index) in results"
            :key="resultProps[index].id"
            v-bind="resultProps[index]"
          >
            <div class="author-name author-result">
              {{ result.name }}
            </div>
          </li>
        </ul>
      </div>
    </template>
  </Autocomplete>
</template>

<script>
import "@trevoreyre/autocomplete-vue/dist/style.css";
import Autocomplete from "@trevoreyre/autocomplete-vue";
export default {
  name: "AutoCompleteCustom",

  components: {
    Autocomplete
  },
  props: {
    placeholder: {
      type: String,
      required: true
    },

    search: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      value: "",
      focused: false
    };
  },
  methods: {
    handleFocus: function() {
      this.focused = true;
    },

    handleBlur: function() {
      this.focused = false;
    },

    handleSubmit: function(data) {
      this.$emit("submit", data);
    }
  }
};
</script>

<style lang="css" scoped></style>

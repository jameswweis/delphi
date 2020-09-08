<template>
  <div class="venue-filter">
    <AutoCompleteCustom
      ref="VenueAutocompleteRefs"
      class="field"
      placeholder="Start typing a name..."
      :search="search"
      @submit="addTag"
    />
    <div class="field is-grouped is-grouped-multiline">
      <div
        v-for="(item, index) in venues"
        :id="index"
        :key="index"
        class="control"
      >
        <div class="tags has-addons">
          <span class="tag">
            {{ item.name }}
          </span>
          <a class="tag is-delete" @click.prevent="removeVenue(item.id)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  name: "VenueFilter",

  components: {
    AutoCompleteCustom: () =>
      import("~/components/filters/AutoCompleteCustom.vue")
  },

  data() {
    return {};
  },

  computed: {
    ...mapState("search", ["venues"])
  },

  methods: {
    ...mapActions("papers", ["fetchVenues"]),
    ...mapActions("search", ["fetchVenuesById"]),
    ...mapMutations("search", ["addVenue", "removeVenue", "resetVenue"]),

    search: function(input) {
      if (input.length < 1) {
        return [];
      }
      const payload = {
        size_per_request: 10,
        name__icontains: input.toLowerCase()
      };
      return this.fetchVenues(payload)
        .then(response => response)
        .catch(() => []);
    },

    addTag: function(newRecord) {
      this.$refs.VenueAutocompleteRefs.value = "";
      this.addVenue(newRecord);
    }
  }
};
</script>

<style lang="css" scoped></style>

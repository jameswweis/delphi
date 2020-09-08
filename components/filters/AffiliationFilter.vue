<template>
  <div class="affiliation-filter">
    <AutoCompleteCustom
      ref="AffiliationAutocompleteRefs"
      class="field"
      placeholder="Start typing a name..."
      :search="search"
      @submit="addTag"
    />
    <div class="field is-grouped is-grouped-multiline">
      <div
        v-for="(item, index) in affiliations"
        :id="index"
        :key="index"
        class="control"
      >
        <div class="tags has-addons">
          <span class="tag">
            {{ item.name }}
          </span>
          <a
            class="tag is-delete"
            @click.prevent="removeAffiliation(item.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  name: "AffiliationFilter",

  components: {
    AutoCompleteCustom: () =>
      import("~/components/filters/AutoCompleteCustom.vue")
  },

  data() {
    return {};
  },

  computed: {
    ...mapState("search", ["affiliations"])
  },

  methods: {
    ...mapActions("papers", ["fetchAffiliates"]),
    ...mapActions("search", ["fetchAffiliationsById"]),
    ...mapMutations("search", [
      "addAffiliation",
      "removeAffiliation",
      "resetAffiliation"
    ]),

    search: function(input) {
      if (input.length < 1) {
        return [];
      }
      const payload = {
        size_per_request: 10,
        name__icontains: input.toLowerCase()
      };
      return this.fetchAffiliates(payload)
        .then(response => response)
        .catch(() => []);
    },

    addTag: function(newRecord) {
      this.$refs.AffiliationAutocompleteRefs.value = "";
      this.addAffiliation(newRecord);
    }
  }
};
</script>

<style lang="css" scoped></style>

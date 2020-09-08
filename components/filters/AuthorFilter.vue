<template>
  <div class="author-filter">
    <AutoCompleteCustom
      ref="AuthorAutocompleteRefs"
      class="field"
      placeholder="Start typing a name..."
      :search="search"
      @submit="addTag"
    />
    <div class="field is-grouped is-grouped-multiline">
      <div
        v-for="(item, index) in authors"
        :id="index"
        :key="index"
        class="control"
      >
        <div class="tags has-addons">
          <span class="tag">
            {{ item.name }}
          </span>
          <a class="tag is-delete" @click.prevent="removeAuthor(item.id)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  name: "AuthorFilter",

  components: {
    AutoCompleteCustom: () =>
      import("~/components/filters/AutoCompleteCustom.vue")
  },

  data() {
    return {};
  },

  computed: {
    ...mapState("search", ["authors"])
  },

  methods: {
    ...mapActions("papers", ["fetchAuthors"]),
    ...mapActions("search", ["fetchAuthorsById"]),
    ...mapMutations("search", ["addAuthor", "removeAuthor", "resetAuthor"]),

    search: function(input) {
      if (input.length < 1) {
        return [];
      }
      const payload = {
        size_per_request: 10,
        name__icontains: input.toLowerCase()
      };
      return this.fetchAuthors(payload)
        .then(response => response)
        .catch(() => []);
    },

    addTag: function(newRecord) {
      this.$refs.AuthorAutocompleteRefs.value = "";
      this.addAuthor(newRecord);
    }
  }
};
</script>

<style lang="css" scoped></style>

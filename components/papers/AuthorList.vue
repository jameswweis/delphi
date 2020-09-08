<template>
  <div class="author-list">
    <p v-if="authors.length <= 5">
      <a
        v-for="author in authors"
        :key="author.id"
        @click.prevent="handleAuthorClick(author)"
      >
        {{ author.name }}</a
      >
    </p>
    <details v-else>
      <summary>
        <a
          v-for="author in first5Authors"
          :key="author.id"
          @click.prevent="handleAuthorClick(author)"
        >
          {{ author.name }}</a
        >
      </summary>
      <p>
        <a
          v-for="author in authorsRest"
          :key="author.id"
          @click.prevent="handleAuthorClick(author)"
        >
          {{ author.name }}</a
        >
      </p>
    </details>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "AuthorList",

  props: {
    authors: {
      type: Array,
      required: true
    }
  },

  computed: {
    authorsList: function() {
      return this.authors.join(", ");
    },

    first5Authors: function() {
      return this.authors.slice(0, 5);
    },

    authorsRest: function() {
      return this.authors.slice(5);
    }
  },

  methods: {
    ...mapMutations("search", ["addAuthor", "clearSearch"]),

    fixObjID: function(obj) {
      if (!obj.id && obj.pk) {
        obj.id = obj.pk;
      }
      return obj;
    },

    handleAuthorClick: function(author) {
      this.clearSearch();
      this.addAuthor(this.fixObjID(author));
    }
  }
};
</script>

<style lang="css" scoped>
.author-list a::after {
  content: ", ";
}

.author-list a:last-of-type::after {
  content: "";
}
</style>

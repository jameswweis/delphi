<template>
  <transition appear name="fade">
    <div class="paper-list list">
      <PaperItem
        v-for="(paper, index) in papers"
        :id="`p${paper.id}`"
        :key="index + paper.uuid"
        class="paper-item list-item"
        :paper="paper"
        :color="paper.color"
      />
    </div>
  </transition>
</template>

<script>
export default {
  name: "PaperList",

  components: {
    PaperItem: () => import("./PaperItem.vue")
  },

  props: {
    papers: {
      type: Array,
      required: true
    }
  }
};
</script>

<style lang="css" scoped>
.paper-item {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>

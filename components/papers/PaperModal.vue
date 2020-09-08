<template>
  <div :class="['modal', active ? 'is-active' : '']">
    <div class="modal-background" @click="$emit('close')" />
    <div class="modal-content">
      <div class="box">
        <PaperItem :paper="paper" :color="paper.color" from-modal />
      </div>
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      @click="$emit('close')"
    />
  </div>
</template>

<script>
import PaperItem from "./PaperItem.vue";

export default {
  name: "PaperModal",

  components: {
    PaperItem
  },

  props: {
    paper: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style lang="css" scoped></style>

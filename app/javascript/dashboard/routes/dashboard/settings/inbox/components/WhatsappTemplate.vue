<template>
  <div class="mt-2">
    <templates-picker
      :inbox-id="inbox.id"
      classes="max-h-full template__list-container"
      :filter-templates="false"
    />
  </div>
</template>

<script>
import TemplatesPicker from '../../../../../components/widgets/conversation/WhatsappTemplates/TemplatesPicker.vue'
export default {
  components: { TemplatesPicker },
  props: {
    inbox: {
      type: Object,
      default: {},
    },
  },
  computed: {},
};
</script>
<style lang="scss" scoped>
.template__list-container {
  background-color: var(--s-25);
  border-radius: var(--border-radius-medium);
  overflow-y: auto;
  padding: var(--space-one);
}
</style>

<template>
  <div class="mt-2">
    <templates-picker
      :inbox-id="inbox.id"
      classes="max-h-full template__list-container"
      :filter-templates="false"
      @onSelect="editTemplate"
    />
    <woot-modal
      :show.sync="showWhatsAppTemplatesBuilderModal"
      :on-close="onClose"
      size="modal-big"
    >
      <woot-modal-header
        :header-title="$t('WHATSAPP_TEMPLATES.MODAL.TITLE')"
        header-content="Edit your Template"
      />
      <div class="modal-content">
        <whatsapp-template-builder
          :inbox-id="inbox.id"
          :show="showWhatsAppTemplatesBuilderModal"
          :template="template"
        />
      </div>
      <div class="modal-footer">
        <div class="medium-12 row text-center">
          <woot-submit-button
            :button-text="$t('EMAIL_TRANSCRIPT.SUBMIT')"
            @click="submitForm"
          />
        </div>
      </div>
    </woot-modal>
  </div>
</template>

<script>
import TemplatesPicker from '../../../../../components/widgets/conversation/WhatsappTemplates/TemplatesPicker.vue';
import WhatsappTemplateBuilder from './WhatsappTemplateBuilder.vue';
import InboxesAPI from '../../../../../api/inboxes';
export default {
  components: { TemplatesPicker, WhatsappTemplateBuilder },
  props: {
    inbox: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      showWhatsAppTemplatesBuilderModal: false,
      template: null,
    };
  },
  computed: {},
  methods: {
    editTemplate(template) {
      this.showWhatsAppTemplatesBuilderModal = true;
      this.template = template;
    },
    onClose() {
      this.showWhatsAppTemplatesBuilderModal = false;
    },
    submitForm() {
      this.onClose();
    },
  },
};
</script>
<style lang="scss" scoped>
.template__list-container {
  background-color: var(--s-25);
  border-radius: var(--border-radius-medium);
  overflow-y: auto;
  padding: var(--space-one);
}
.modal-content {
  padding: 2.5rem 3.2rem;
}
</style>
